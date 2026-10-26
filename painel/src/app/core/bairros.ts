import { CacheDisco } from './cache-disco';
import { CATEGORIA_POR_ID } from './dados';
import { Ocorrencia } from './modelos';
import { fetchComTimeout, idadeDias, normalizar } from './util';

/**
 * Bairros do município pelo OpenStreetMap (Overpass), com o contorno quando o
 * OSM tem o limite do bairro (admin_level 9/10) e só o ponto central quando não tem.
 * Busca pelo navegador, guarda 90 dias no disco; o servidor manda a lista de
 * pontos que ele já tem como reserva.
 */
export interface Bairro { n: string; lat: number; lng: number; aneis?: [number, number][][] }

export interface BairroResumo {
  nome: string; lat: number; lng: number; aneis?: [number, number][][]; osm: boolean;
  qtd: number; graves: number; recentes: number; cats: Record<string, number>; catTop: string;
  ocorrencias: Ocorrencia[];
}

const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const DIAS_CACHE = 90;
const LUGAR = '["place"~"^(suburb|neighbourhood|quarter)$"]';

export async function carregarBairros(ibge: string, reserva: Bairro[] = []): Promise<Bairro[]> {
  const chave = 'BAIRROS_OSM_' + ibge;
  const guardado = await CacheDisco.obter<Bairro[]>(chave, DIAS_CACHE);
  if (guardado?.length) return guardado;
  const consulta = `[out:json][timeout:40];area["IBGE:GEOCODIGO"="${ibge}"]["admin_level"="8"]->.m;` +
    `(relation["boundary"="administrative"]["admin_level"~"^(9|10)$"](area.m);way${LUGAR}(area.m);relation${LUGAR}(area.m););out geom;` +
    `node${LUGAR}(area.m);out;`;
  for (const url of SERVIDORES) {
    try {
      const r = await fetchComTimeout(url + '?data=' + encodeURIComponent(consulta), 30000);
      if (!r.ok) continue;
      const lista = montar((await r.json()).elements || []);
      if (lista.length) { CacheDisco.salvar(chave, lista); return lista; }
      break; // respondeu sem bairros: o OSM não tem bairros cadastrados para a cidade
    } catch { /* tenta o próximo servidor */ }
  }
  return reserva;
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
    if (!atual) porNome.set(k, { n: nome, lat: r5(lat), lng: r5(lng), aneis });
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
 * nome citado. Devolve o resumo por bairro e os pontos extras do mapa de calor
 * (notícias que só citam o bairro entram no centro dele).
 */
export function resumirBairros(bairros: Bairro[], ocorrencias: Ocorrencia[]): { lista: BairroResumo[]; calorExtra: [number, number, number][]; ligadas: number } {
  const resumo = new Map<string, BairroResumo>();
  const porNome = new Map(bairros.map((b) => [normalizar(b.n), b]));
  const comContorno = bairros.filter((b) => b.aneis);
  const novo = (b: Bairro, osm: boolean): BairroResumo =>
    ({ nome: b.n, lat: b.lat, lng: b.lng, aneis: b.aneis, osm, qtd: 0, graves: 0, recentes: 0, cats: {}, catTop: '', ocorrencias: [] });
  bairros.forEach((b) => resumo.set(normalizar(b.n), novo(b, true)));

  const calorExtra: [number, number, number][] = [];
  let ligadas = 0;
  for (const o of ocorrencias) {
    let alvo: Bairro | undefined;
    if (o.precisa && o.lat != null && o.lng != null) alvo = comContorno.find((b) => dentro(o.lat!, o.lng!, b.aneis!));
    const citado = o.bairro && o.bairro !== 'Local não informado' ? normalizar(o.bairro.split(',')[0]) : '';
    if (!alvo && citado) alvo = porNome.get(citado);
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
    if (!o.precisa) calorExtra.push([r.lat, r.lng, CATEGORIA_POR_ID[o.cat]?.peso || 0.5]);
  }
  const lista = [...resumo.values()];
  lista.forEach((r) => { r.catTop = Object.keys(r.cats).sort((a, b) => r.cats[b] - r.cats[a])[0] || ''; });
  lista.sort((a, b) => b.qtd - a.qtd || b.graves - a.graves || a.nome.localeCompare(b.nome));
  return { lista, calorExtra, ligadas };
}
