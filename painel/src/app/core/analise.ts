import { CATEGORIA_POR_ID, CFG, ORGAO_POR_ID, PRECISOES_NO_MAPA } from './dados';
import { Filtrados, Local, Ocorrencia, Oficial, Pacote, Panorama, ResumoOrgao, Zona } from './modelos';
import { distanciaKm, idadeDias, MESES, normalizar, tsDiasAtras, tsParaData } from './util';

function idCategoria(valor: string): string {
  if (CATEGORIA_POR_ID[valor]) return valor;
  const s = normalizar(valor); // compatibilidade com textos antigos
  if (s.includes('cvli') || s.includes('homic') || s.includes('latroc')) return 'CVLI';
  if (s.includes('confronto') || s.includes('arma')) return 'CONFRONTO';
  if (s.includes('carga')) return 'CARGA';
  if (s.includes('trafico') || s.includes('operac')) return 'TRAFICO';
  if (s.includes('bloqueio') || s.includes('disturb')) return 'BLOQUEIO';
  return 'PATRIMONIO';
}

export function normalizarPacote(res: any): Pacote {
  const ocorrencias: Ocorrencia[] = (res.ocorrencias || []).map((o: any) => {
    const lat = Number(o.lat) || null;
    const lng = Number(o.lng) || null;
    return {
      id: o.id, data: o.data, ts: Number(o.ts) || 0, cidade: o.cidade, bairro: o.bairro || 'Local não informado',
      cat: idCategoria(o.categoria), titulo: o.titulo, veiculo: o.veiculo, link: o.link, lat, lng,
      precisao: o.precisao || 'PENDENTE', precisa: !!(PRECISOES_NO_MAPA[o.precisao] && lat && lng),
      orgaos: (o.orgaos || []).filter((id: string) => ORGAO_POR_ID[id]), local: !!o.local,
    };
  });
  return {
    uf: res.uf, cidade: res.cidade, codigoIbge: res.codigoIbge || '', centroLat: Number(res.centroLat), centroLng: Number(res.centroLng),
    ocorrencias, totalNaBase: Number(res.totalNaBase) || ocorrencias.length, cidadesMonitoradas: res.cidadesMonitoradas || 0,
    oficial: res.oficial || { disponivel: false, eventos: [] }, atualizadoEm: res.atualizadoEm || '', ultimaColeta: res.ultimaColeta || '',
    versaoLocal: Date.now(),
  };
}

export function pacoteVazio(uf: string, cidade: string, lat: number, lng: number, ibge: string): Pacote {
  return { uf, cidade, codigoIbge: ibge, centroLat: lat, centroLng: lng, ocorrencias: [], totalNaBase: 0, cidadesMonitoradas: 0,
    oficial: null, atualizadoEm: '', ultimaColeta: '', versaoLocal: Date.now(), vazio: true };
}

/** Recorta as ocorrências pelo período, tipos e órgão escolhidos e calcula tudo o que as abas exibem. */
export function filtrar(d: Pacote | null, periodoDias: number, categorias: string[], orgao: string, ehEstado: boolean): Filtrados {
  const ativa = (id: string) => !categorias.length || categorias.includes(id);
  const limiteAtual = tsDiasAtras(periodoDias);
  const limiteAnterior = tsDiasAtras(periodoDias * 2);
  const porCatPeriodo = d ? d.ocorrencias.filter((o) => ativa(o.cat)) : [];

  // Cruzamento por órgão: contado antes do filtro de órgão, para a tabela continuar completa
  const porOrgao: Record<string, ResumoOrgao> = {};
  let imprensaLocal = 0, totalCruzamento = 0, semOrgao = 0;
  for (const o of porCatPeriodo) {
    if (o.ts < limiteAtual) continue;
    totalCruzamento++;
    if (o.local) imprensaLocal++;
    if (!o.orgaos.length) semOrgao++;
    for (const id of o.orgaos) {
      const g = porOrgao[id] || (porOrgao[id] = { qtd: 0, graves: 0, precisas: 0 });
      g.qtd++;
      if (o.cat === 'CVLI' || o.cat === 'CONFRONTO') g.graves++;
      if (o.precisa) g.precisas++;
    }
  }
  const todasCat = orgao ? porCatPeriodo.filter((o) => o.orgaos.includes(orgao)) : porCatPeriodo;
  const todas: Ocorrencia[] = [];
  const anteriores: Ocorrencia[] = [];
  for (const o of todasCat) {
    if (o.ts >= limiteAtual) todas.push(o);
    else if (o.ts >= limiteAnterior) anteriores.push(o);
  }
  const precisas = todas.filter((o) => o.precisa);
  const porCat: Record<string, number> = {};
  const porCatAnt: Record<string, number> = {};
  todas.forEach((o) => (porCat[o.cat] = (porCat[o.cat] || 0) + 1));
  anteriores.forEach((o) => (porCatAnt[o.cat] = (porCatAnt[o.cat] || 0) + 1));
  const semana = [0, 0, 0, 0, 0, 0, 0];
  todas.forEach((o) => { if (o.ts) semana[tsParaData(o.ts).getDay()]++; });
  const fontes: Record<string, number> = {};
  todas.forEach((o) => { const v = o.veiculo || 'Imprensa'; fontes[v] = (fontes[v] || 0) + 1; });

  return {
    todas, anteriores, comparavel: periodoDias * 2 <= CFG.DIAS_HISTORICO_SERVIDOR, precisas, semLocal: todas.filter((o) => !o.precisa),
    porCat, porCatAnt, locais: agregarLocais(todas, ehEstado), serie: serieMensal(todasCat), semana,
    fontes: Object.keys(fontes).map((nome) => ({ nome, qtd: fontes[nome] })).sort((a, b) => b.qtd - a.qtd),
    zonas: calcularZonas(precisas), porOrgao, imprensaLocal, totalCruzamento, semOrgao,
  };
}

function agregarLocais(lista: Ocorrencia[], ehEstado: boolean): Local[] {
  const mapa: Record<string, any> = {};
  for (const o of lista) {
    if (!o.bairro || o.bairro === 'Local não informado') continue;
    const k = (ehEstado ? normalizar(o.cidade) + '|' : '') + normalizar(o.bairro);
    const b = mapa[k] || (mapa[k] = { nome: o.bairro, cidade: o.cidade, qtd: 0, n: 0, sLat: 0, sLng: 0, cats: {} });
    b.qtd++;
    b.cats[o.cat] = (b.cats[o.cat] || 0) + 1;
    if (o.precisa) { b.n++; b.sLat += o.lat; b.sLng += o.lng; }
  }
  return Object.values(mapa).map((b: any) => ({
    nome: b.nome, cidade: b.cidade, qtd: b.qtd, n: b.n,
    lat: b.n ? b.sLat / b.n : undefined, lng: b.n ? b.sLng / b.n : undefined,
    catTop: Object.keys(b.cats).sort((x, y) => b.cats[y] - b.cats[x])[0],
  })).sort((a, b) => b.qtd - a.qtd);
}

function serieMensal(lista: Ocorrencia[]) {
  const hoje = new Date();
  const labels: string[] = [];
  const idx: Record<number, number> = {};
  for (let i = 11; i >= 0; i--) {
    const dt = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    idx[dt.getFullYear() * 100 + dt.getMonth() + 1] = labels.length;
    labels.push(MESES[dt.getMonth()] + '/' + String(dt.getFullYear()).slice(2));
  }
  const porCat: Record<string, number[]> = {};
  for (const o of lista) {
    const i = idx[Math.floor(o.ts / 100)];
    if (i === undefined) continue;
    (porCat[o.cat] || (porCat[o.cat] = new Array(12).fill(0)))[i]++;
  }
  return { labels, porCat };
}

/**
 * Zonas vermelhas: os pontos mais violentos dentro da cidade.
 * 1. Grade de ~400 m; cada ocorrência soma peso = gravidade × recência.
 * 2. Suavização 3×3 para não depender do corte exato da grade.
 * 3. Células acima do limiar viram "quentes"; quentes vizinhas formam uma zona.
 * 4. Cada zona recebe nome pelos bairros citados, nível e tendência.
 */
export function calcularZonas(precisas: Ocorrencia[]): Zona[] {
  if (precisas.length < CFG.ZONA_MIN_OCORRENCIAS) return [];
  const latRef = precisas[0].lat!;
  const dLat = CFG.ZONA_CELULA_METROS / 111320;
  const dLng = CFG.ZONA_CELULA_METROS / (111320 * Math.cos((latRef * Math.PI) / 180));
  interface Celula { i: number; j: number; peso: number; pontos: Ocorrencia[]; suave: number; vizinhanca: number }
  const celulas: Record<string, Celula> = {};
  for (const o of precisas) {
    const i = Math.floor(o.lat! / dLat), j = Math.floor(o.lng! / dLng), k = i + ':' + j;
    const peso = CATEGORIA_POR_ID[o.cat].peso * (0.4 + 0.6 * Math.pow(0.5, idadeDias(o.ts) / CFG.ZONA_MEIA_VIDA_DIAS));
    const c = celulas[k] || (celulas[k] = { i, j, peso: 0, pontos: [], suave: 0, vizinhanca: 0 });
    c.peso += peso;
    c.pontos.push(o);
  }
  const chaves = Object.keys(celulas);
  for (const k of chaves) {
    const c = celulas[k];
    let s = 0, n = 0;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      const v = celulas[c.i + di + ':' + (c.j + dj)];
      if (v) { s += v.peso * (di === 0 && dj === 0 ? 1 : 0.5); n += v.pontos.length; }
    }
    c.suave = s;
    c.vizinhanca = n;
  }
  const valores = chaves.map((k) => celulas[k].suave);
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const desvio = Math.sqrt(valores.reduce((a, b) => a + (b - media) ** 2, 0) / valores.length);
  // Limiar relativo, limitado a 30% da célula mais intensa para focos secundários também aparecerem
  const limiar = Math.max(CFG.ZONA_PESO_MINIMO, Math.min(media + desvio, Math.max(...valores) * 0.3));
  const quentes: Record<string, Celula> = {};
  for (const k of chaves) if (celulas[k].suave >= limiar && celulas[k].vizinhanca >= 2) quentes[k] = celulas[k];

  const visitado: Record<string, boolean> = {};
  const grupos: Celula[][] = [];
  for (const k of Object.keys(quentes)) {
    if (visitado[k]) continue;
    const fila = [k];
    const grupo: Celula[] = [];
    visitado[k] = true;
    while (fila.length) {
      const atual = quentes[fila.pop()!];
      grupo.push(atual);
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        const kk = atual.i + di + ':' + (atual.j + dj);
        if (quentes[kk] && !visitado[kk]) { visitado[kk] = true; fila.push(kk); }
      }
    }
    grupos.push(grupo);
  }

  const limite30 = tsDiasAtras(30), limite60 = tsDiasAtras(60);
  const zonas = grupos.map((grupo) => {
    const pontos = grupo.flatMap((c) => c.pontos);
    const peso = grupo.reduce((a, c) => a + c.peso, 0);
    if (pontos.length < CFG.ZONA_MIN_OCORRENCIAS) return null;
    let sLat = 0, sLng = 0, sP = 0, rec = 0, ant = 0;
    const nomes: Record<string, number> = {}, cats: Record<string, number> = {}, cidades = new Set<string>();
    for (const o of pontos) {
      const p = CATEGORIA_POR_ID[o.cat].peso;
      sLat += o.lat! * p; sLng += o.lng! * p; sP += p;
      if (o.bairro && o.bairro !== 'Local não informado') nomes[o.bairro] = (nomes[o.bairro] || 0) + 1;
      cats[o.cat] = (cats[o.cat] || 0) + 1;
      cidades.add(o.cidade);
      if (o.ts >= limite30) rec++; else if (o.ts >= limite60) ant++;
    }
    const lat = sLat / sP, lng = sLng / sP;
    const raio = Math.max(...pontos.map((o) => distanciaKm(lat, lng, o.lat!, o.lng!) * 1000));
    return {
      lat, lng, qtd: pontos.length, peso,
      raio: Math.max(CFG.ZONA_RAIO_MIN_METROS, Math.min(CFG.ZONA_RAIO_MAX_METROS, raio + 120)),
      nome: Object.keys(nomes).sort((a, b) => nomes[b] - nomes[a]).slice(0, 3).join(', ') || 'Área sem bairro citado',
      cidade: [...cidades].join(', '),
      cats: Object.keys(cats).sort((a, b) => cats[b] - cats[a]).map((id) => ({ id, qtd: cats[id] })),
      graves: (cats['CVLI'] || 0) + (cats['CONFRONTO'] || 0), recentes: rec, anteriores30: ant,
      rank: 0, indice: 0, nivel: 'moderada' as Zona['nivel'],
    };
  }).filter((z): z is Zona => !!z).sort((a, b) => b.peso - a.peso).slice(0, CFG.ZONA_MAX_EXIBIDAS);

  const maior = zonas.length ? zonas[0].peso : 1;
  zonas.forEach((z, i) => {
    z.rank = i + 1;
    z.indice = Math.round((z.peso / maior) * 100);
    z.nivel = z.indice >= 70 ? 'critica' : z.indice >= 40 ? 'alta' : 'moderada';
  });
  return zonas;
}

/** Nomes do Sinesp mais curtos para cartões e insights ("Roubo seguido de morte (latrocínio)" → "Latrocínio"). */
export function nomeEvento(nome: string): string {
  if (/latroc/i.test(nome)) return 'Latrocínio';
  return nome.replace(/\s*\([^)]*\)/g, '').replace(/ ou em decorrência dele/i, '').replace(/\s+/g, ' ').trim();
}

export function encurtarOficial(o: Oficial | null | undefined): Oficial | null {
  if (!o?.eventos?.length) return o || null;
  return { ...o, eventos: o.eventos.map((e) => ({ ...e, nome: nomeEvento(e.nome) })) };
}

export function encurtarPanorama(p: Panorama | null): Panorama | null {
  if (!p?.disponivel) return p;
  return { ...p, oficial: encurtarOficial(p.oficial) || undefined, rankings: p.rankings?.map((r) => ({ ...r, evento: nomeEvento(r.evento) })) };
}
