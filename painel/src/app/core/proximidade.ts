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
