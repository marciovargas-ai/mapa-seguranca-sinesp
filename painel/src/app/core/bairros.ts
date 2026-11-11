import { CacheDisco } from './cache-disco';
import { Servidor } from './servidor';
import { CATEGORIA_POR_ID, CFG } from './dados';
import { Ocorrencia } from './modelos';
import { fetchComTimeout, idadeDias, normalizar } from './util';

/**
 * Bairros do município. Primeiro a malha oficial do IBGE (Censo 2022), publicada
 * pelo robô do GitHub um arquivo por município. Onde o IBGE não tem bairros,
 * o OpenStreetMap (Overpass), com o contorno quando o OSM tem o limite do bairro
 * e só o ponto central quando não tem. Guarda 90 dias no disco; o servidor manda
 * a lista de pontos que ele já tem como reserva.
 */
export interface Bairro { n: string; lat: number; lng: number; aneis?: [number, number][][]; fonte?: 'IBGE' | 'OSM' }

export interface BairroResumo {
  nome: string; lat: number; lng: number; aneis?: [number, number][][]; osm: boolean; fonte?: 'IBGE' | 'OSM';
  qtd: number; graves: number; recentes: number; cats: Record<string, number>; catTop: string;
  ocorrencias: Ocorrencia[];
}

const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const DIAS_CACHE = 90;
const LUGAR = '["place"~"^(suburb|neighbourhood|quarter)$"]';

/**
 * Carrega em duas etapas: primeiro só os pontos dos bairros (consulta leve, segundos),
 * depois os contornos (pesada em cidades grandes). Se o OSM não responder pelo
 * navegador, pede ao servidor. `parcial` recebe a lista de pontos assim que chega.
 */
export async function carregarBairros(ibge: string, parcial?: (lista: Bairro[]) => void): Promise<Bairro[]> {
  const oficiais = await bairrosIbge(ibge);
  if (oficiais.length) return oficiais;
  const chave = 'BAIRROS_OSM2_' + ibge;
  const guardado = await CacheDisco.obter<Bairro[]>(chave, DIAS_CACHE);
  if (guardado?.length) return guardado;
  const area = `area["IBGE:GEOCODIGO"="${ibge}"]["admin_level"="8"]->.m;`;
  const alvos = `(relation["boundary"="administrative"]["admin_level"~"^(9|10)$"](area.m);way${LUGAR}(area.m);relation${LUGAR}(area.m););`;
  const pontosQ = `[out:json][timeout:25];${area}(node${LUGAR}(area.m);${alvos.slice(1, -2)});out center tags;`;
  const contornosQ = `[out:json][timeout:90];${area}${alvos}out geom;node${LUGAR}(area.m);out;`;

  const chavePts = 'BAIRROS_PTS_' + ibge;
  let pontos = (await CacheDisco.obter<Bairro[]>(chavePts, DIAS_CACHE)) || [];
  if (!pontos.length) {
    const el = await overpass(pontosQ, 25000);
    pontos = el ? montar(el) : [];
    if (!pontos.length) pontos = await Servidor.bairros(ibge);
    if (pontos.length) CacheDisco.salvar(chavePts, pontos);
  }
  if (pontos.length) parcial?.(pontos);

  const el = await overpass(contornosQ, 95000);
  const completos = el ? montar(el) : [];
  if (completos.some((b) => b.aneis)) {
    // Junta os bairros que só existem como ponto
    const nomes = new Set(completos.map((b) => normalizar(b.n)));
    const lista = completos.concat(pontos.filter((p) => !nomes.has(normalizar(p.n))));
    CacheDisco.salvar(chave, lista);
    return lista;
  }
  return pontos;
}

/** Malha oficial do IBGE: [] quando o município não tem bairros cadastrados (ou a rede falhou). */
async function bairrosIbge(ibge: string): Promise<Bairro[]> {
  const chave = 'BAIRROS_IBGE_' + ibge;
  const guardado = await CacheDisco.obter<Bairro[]>(chave, DIAS_CACHE);
  if (guardado?.length) return guardado;
  // "Não tem no IBGE" vale só 7 dias, para pegar municípios que o robô publicar depois
  if (await CacheDisco.obter<boolean>('BAIRROS_IBGE_SEM_' + ibge, 7)) return [];
  for (const base of CFG.BASES_DADOS) {
    try {
      const r = await fetchComTimeout(base + 'bairros/' + ibge + '.json', 12000);
      if (r.status === 404) { CacheDisco.salvar('BAIRROS_IBGE_SEM_' + ibge, true); return []; }
      if (!r.ok) continue;
      const lista = ((await r.json()) as Bairro[]).filter((b) => b && b.n && b.aneis?.length).map((b) => ({ ...b, fonte: 'IBGE' as const }));
      CacheDisco.salvar(chave, lista);
      return lista;
    } catch { /* tenta o próximo endereço */ }
  }
  return [];
}

/** Consulta o Overpass nos dois servidores ao mesmo tempo e fica com o primeiro que responder. */
async function overpass(consulta: string, ms: number): Promise<any[] | null> {
  const pedir = (url: string) => fetchComTimeout(url + '?data=' + encodeURIComponent(consulta), ms)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((j) => (Array.isArray(j?.elements) ? j.elements : Promise.reject('vazio')));
  try {
    return await Promise.any(SERVIDORES.map(pedir));
  } catch {
    return null;
  }
}

const r5 = (v: number) => Math.round(v * 1e5) / 1e5;

function montar(elementos: any[]): Bairro[] {
  const porNome = new Map<string, Bairro>();
  for (const el of elementos) {
    const nome = el.tags?.name || el.tags?.['name:pt'];
    if (!nome) continue;
    const k = normalizar(nome);
    let aneis: [number, number][][] | undefined;
    if (el.type === 'relation') aneis = juntarAneis((el.members || []).filter((m: any) => m.type === 'way' && m.role !== 'inner' && m.geometry));
    else if (el.type === 'way' && el.geometry?.length > 3) aneis = [el.geometry.map((p: any) => [r5(p.lat), r5(p.lon)])];
    let lat = el.lat, lng = el.lon;
    if (aneis?.length) [lat, lng] = centro(aneis);
    else if (el.bounds) { lat = (el.bounds.minlat + el.bounds.maxlat) / 2; lng = (el.bounds.minlon + el.bounds.maxlon) / 2; }
    if (lat == null || lng == null) continue;
    const atual = porNome.get(k);
    // Contorno vale mais que ponto; o ponto do OSM (place=*) é o melhor lugar para o rótulo
    if (!atual) porNome.set(k, { n: nome, lat: r5(lat), lng: r5(lng), aneis, fonte: 'OSM' });
    else if (!atual.aneis && aneis) porNome.set(k, { ...atual, aneis });
    else if (el.type === 'node' && atual.aneis) porNome.set(k, { ...atual, lat: r5(lat), lng: r5(lng) });
  }
  return [...porNome.values()];
}

/** Junta os trechos (ways) de uma relação em anéis fechados. */
function juntarAneis(membros: any[]): [number, number][][] | undefined {
  const trechos: [number, number][][] = membros.map((m) => m.geometry.map((p: any) => [r5(p.lat), r5(p.lon)] as [number, number]));
  const igual = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1];
  const aneis: [number, number][][] = [];
  while (trechos.length) {
    let anel = trechos.shift()!;
    let mudou = true;
    while (!igual(anel[0], anel[anel.length - 1]) && mudou) {
      mudou = false;
      for (let i = 0; i < trechos.length; i++) {
        const t = trechos[i], fim = anel[anel.length - 1];
        if (igual(fim, t[0])) anel = anel.concat(t.slice(1));
        else if (igual(fim, t[t.length - 1])) anel = anel.concat(t.slice(0, -1).reverse());
        else if (igual(anel[0], t[t.length - 1])) anel = t.slice(0, -1).concat(anel);
        else if (igual(anel[0], t[0])) anel = t.slice(1).reverse().concat(anel);
        else continue;
        trechos.splice(i, 1);
        mudou = true;
        break;
      }
    }
    if (anel.length > 3 && igual(anel[0], anel[anel.length - 1])) aneis.push(anel);
  }
  return aneis.length ? aneis : undefined;
}

/** Centro de área do maior anel (fórmula do polígono). */
function centro(aneis: [number, number][][]): [number, number] {
  const maior = aneis.reduce((a, b) => (b.length > a.length ? b : a));
  let area = 0, cx = 0, cy = 0;
  for (let i = 0, j = maior.length - 1; i < maior.length; j = i++) {
    const f = maior[j][1] * maior[i][0] - maior[i][1] * maior[j][0];
    area += f; cx += (maior[j][1] + maior[i][1]) * f; cy += (maior[j][0] + maior[i][0]) * f;
  }
  if (Math.abs(area) < 1e-12) return [maior[0][0], maior[0][1]];
  return [cy / (3 * area), cx / (3 * area)];
}

function dentro(lat: number, lng: number, aneis: [number, number][][]): boolean {
  let d = false;
  for (const anel of aneis) {
    for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
      const [yi, xi] = anel[i], [yj, xj] = anel[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) d = !d;
    }
  }
  return d;
}

/**
 * Liga cada notícia a um bairro: pelo contorno (quando tem coordenada) ou pelo
 * nome citado. Devolve o resumo por bairro e as notícias que só entraram pelo
 * nome do bairro (contam na cor do bairro, sem ponto inventado no mapa).
 */
export interface PeloBairro { o: Ocorrencia; bairro: string }

export function resumirBairros(bairros: Bairro[], ocorrencias: Ocorrencia[]):
  { lista: BairroResumo[]; ligadas: number; peloBairro: PeloBairro[] } {
  const resumo = new Map<string, BairroResumo>();
  const porNome = new Map(bairros.map((b) => [normalizar(b.n), b]));
  const comContorno = bairros.filter((b) => b.aneis);
  const novo = (b: Bairro, osm: boolean): BairroResumo =>
    ({ nome: b.n, lat: b.lat, lng: b.lng, aneis: b.aneis, osm, fonte: b.fonte, qtd: 0, graves: 0, recentes: 0, cats: {}, catTop: '', ocorrencias: [] });
  bairros.forEach((b) => resumo.set(normalizar(b.n), novo(b, true)));

  const peloBairro: PeloBairro[] = [];
  let ligadas = 0;
  // Nomes de bairro para procurar no título (os mais longos primeiro: "Vila Nova Cachoeirinha" antes de "Vila Nova")
  const procurar = bairros.map((b) => ({ b, n: ' ' + normalizar(b.n) + ' ' })).filter((x) => x.n.length >= 6).sort((a, b) => b.n.length - a.n.length);
  for (const o of ocorrencias) {
    let alvo: Bairro | undefined;
    if (o.precisa && o.lat != null && o.lng != null) alvo = comContorno.find((b) => dentro(o.lat!, o.lng!, b.aneis!));
    const citado = o.bairro && o.bairro !== 'Local não informado' ? normalizar(o.bairro.split(',')[0]) : '';
    if (!alvo && citado) alvo = porNome.get(citado);
    if (!alvo && !o.precisa && procurar.length) {
      const titulo = ' ' + normalizar(o.titulo) + ' ';
      const cidade = ' ' + normalizar(o.cidade) + ' ';
      alvo = procurar.find((x) => x.n !== cidade && titulo.includes(x.n))?.b;
    }
    let chave = alvo ? normalizar(alvo.n) : '';
    // Bairro citado que o OSM não conhece, mas com coordenada: entra como bairro próprio
    if (!alvo && citado && o.precisa && citado !== normalizar(o.cidade)) {
      chave = citado;
      if (!resumo.has(chave)) resumo.set(chave, novo({ n: o.bairro.split(',')[0], lat: o.lat!, lng: o.lng! }, false));
    }
    const r = chave ? resumo.get(chave) : undefined;
    if (!r) continue;
    ligadas++;
    r.qtd++;
    r.cats[o.cat] = (r.cats[o.cat] || 0) + 1;
    if (o.cat === 'CVLI' || o.cat === 'CONFRONTO') r.graves++;
    if (idadeDias(o.ts) <= 30) r.recentes++;
    r.ocorrencias.push(o);
    // Sem rua/endereço: conta no bairro (a área é pintada), mas não vira ponto no mapa
    if (!o.precisa || o.precisao === 'BAIRRO') peloBairro.push({ o, bairro: r.nome });
  }
  const lista = [...resumo.values()];
  lista.forEach((r) => { r.catTop = Object.keys(r.cats).sort((a, b) => r.cats[b] - r.cats[a])[0] || ''; });
  lista.sort((a, b) => b.qtd - a.qtd || b.graves - a.graves || a.nome.localeCompare(b.nome));
  return { lista, ligadas, peloBairro };
}
