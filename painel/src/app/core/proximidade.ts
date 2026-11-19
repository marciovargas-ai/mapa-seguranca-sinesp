import { Ocorrencia } from './modelos';
import { distanciaKm } from './util';

/** Raio padrão em volta de cada unidade Shopee. */
export const RAIO_UNIDADE_KM = 3;
const DIA = 86400000;
const GRAVES = new Set(['CVLI', 'CONFRONTO', 'CARGA']);

export interface Perto {
  h24: number; d7: number; d30: number; graves30: number;
  ultimas: { titulo: string; link: string; data: string; cat: string; km: number }[];
}

/** Ocorrências com local preciso (endereço, bairro ou rodovia) a até `raio` km do ponto, em 24 h, 7 e 30 dias. */
export function ocorrenciasPerto(lat: number, lng: number, lista: Ocorrencia[], raio = RAIO_UNIDADE_KM, agora = Date.now()): Perto {
  const r: Perto = { h24: 0, d7: 0, d30: 0, graves30: 0, ultimas: [] };
  const perto: (Ocorrencia & { km: number })[] = [];
  for (const o of lista) {
    if (!o.precisa || o.lat == null || o.lng == null) continue;
    const idade = agora - o.ts;
    if (idade > 30 * DIA || idade < -DIA) continue;
    // Corte rápido por grau antes da distância exata (1 grau de latitude ~ 111 km)
    if (Math.abs(o.lat - lat) > raio / 100 || Math.abs(o.lng - lng) > raio / 90) continue;
    const km = distanciaKm(lat, lng, o.lat, o.lng);
    if (km > raio) continue;
    r.d30++;
    if (idade <= 7 * DIA) r.d7++;
    if (idade <= DIA) r.h24++;
    if (GRAVES.has(o.cat)) r.graves30++;
    perto.push({ ...o, km });
  }
  r.ultimas = perto.sort((a, b) => b.ts - a.ts).slice(0, 3).map((o) => ({ titulo: o.titulo, link: o.link, data: o.data, cat: o.cat, km: Math.round(o.km * 10) / 10 }));
  return r;
}

/** Raio da análise do CEP pesquisado (entorno de um endereço, a pé ou de carro em poucos minutos). */
export const RAIO_CEP_KM = 1;

export interface AnaliseLocal {
  total: number; d30: number; graves: number; porCat: { id: string; qtd: number }[];
  ultimas: { titulo: string; link: string; data: string; cat: string; km: number }[];
}

/** Ocorrências com local preciso a até `raio` km do ponto, em toda a janela carregada (12 meses), por tipo. */
export function analisarLocal(lat: number, lng: number, lista: Ocorrencia[], raio = RAIO_CEP_KM, agora = Date.now()): AnaliseLocal {
  const r: AnaliseLocal = { total: 0, d30: 0, graves: 0, porCat: [], ultimas: [] };
  const cats: Record<string, number> = {};
  const perto: (Ocorrencia & { km: number })[] = [];
  const vistos = new Set<string>();
  for (const o of lista) {
    if (!o.precisa || o.lat == null || o.lng == null || vistos.has(o.id)) continue;
    if (Math.abs(o.lat - lat) > raio / 100 || Math.abs(o.lng - lng) > raio / 90) continue;
    const km = distanciaKm(lat, lng, o.lat, o.lng);
    if (km > raio) continue;
    vistos.add(o.id);
    r.total++;
    if (agora - o.ts <= 30 * DIA) r.d30++;
    if (GRAVES.has(o.cat)) r.graves++;
    cats[o.cat] = (cats[o.cat] || 0) + 1;
    perto.push({ ...o, km });
  }
  r.porCat = Object.keys(cats).map((id) => ({ id, qtd: cats[id] })).sort((a, b) => b.qtd - a.qtd);
  r.ultimas = perto.sort((a, b) => b.ts - a.ts).slice(0, 4).map((o) => ({ titulo: o.titulo, link: o.link, data: o.data, cat: o.cat, km: Math.round(o.km * 10) / 10 }));
  return r;
}
