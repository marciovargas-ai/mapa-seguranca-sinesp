import { Bairro, dentro } from './bairros';
import { normalizar } from './util';
import { baixarDadosPublicos } from './areas';

/** Dados oficiais abaixo do município, publicados pelas secretarias estaduais (robô oficiais.yml). */
export interface OficialArea {
  fonte: string; orgao: string; periodo: string; atualizado: string;
  cats: Record<string, number>;
  bairros: Record<string, Record<string, number>>;
  /** [lat, lng, cat, yyyymmdd, rubrica] */
  pontos: [number, number, string, number, string][];
  /** cat → [lat, lng, n] em células de ~200 m */
  grade: Record<string, [number, number, number][]>;
}

export const NOME_CAT_OFICIAL: Record<string, string> = {
  cvli: 'Homicídio, feminicídio e latrocínio', tentativa: 'Tentativa de homicídio', estupro: 'Estupro',
  roubo: 'Roubo', furto: 'Furto', veiculo: 'Roubo/furto de veículo', carga: 'Roubo de carga', trafico: 'Tráfico de drogas',
};
/** Categoria das notícias (filtro do painel) → categorias oficiais equivalentes. */
const POR_FILTRO: Record<string, string[]> = {
  CVLI: ['cvli'], CONFRONTO: ['cvli', 'tentativa'], CARGA: ['carga'], PATRIMONIO: ['roubo', 'furto', 'veiculo'], TRAFICO: ['trafico'], BLOQUEIO: [],
};
export function catsOficiais(filtro: string[]): string[] {
  if (!filtro.length) return Object.keys(NOME_CAT_OFICIAL);
  return [...new Set(filtro.flatMap((f) => POR_FILTRO[f] || []))];
}

let indice: Promise<Record<string, { uf: string; orgao: string; periodo: string; total: number }> | null> | null = null;
export async function carregarOficial(ibge: string): Promise<OficialArea | null> {
  if (!ibge) return null;
  indice ??= baixarDadosPublicos('oficial/indice.json', 'OFICIAL_INDICE', 2);
  const idx = await indice;
  if (!idx) { indice = null; return null; }
  if (!idx[ibge]) return null;
  return baixarDadosPublicos(`oficial/${ibge}.json`, 'OFICIAL_' + ibge + '_' + idx[ibge].periodo, 7);
}

export interface BairroOficial { total: number; cats: Record<string, number> }
/**
 * Soma os registros oficiais de cada bairro do mapa: pelo ponto (dentro do contorno) quando o registro
 * tem coordenada; pelo nome do bairro informado no boletim quando o bairro do mapa não tem contorno.
 */
export function oficialPorBairro(o: OficialArea, bairros: Bairro[], cats: string[]): { porBairro: Map<string, BairroOficial>; total: number } {
  const porBairro = new Map<string, BairroOficial>();
  const somar = (nome: string, cat: string, n: number) => {
    const b = porBairro.get(nome) || { total: 0, cats: {} };
    b.total += n; b.cats[cat] = (b.cats[cat] || 0) + n; porBairro.set(nome, b);
  };
  const quer = new Set(cats);
  const comContorno = bairros.filter((b) => b.aneis?.length).map((b) => {
    let s = 90, w = 180, n = -90, e = -180;
    for (const anel of b.aneis!) for (const [la, ln] of anel) { if (la < s) s = la; if (la > n) n = la; if (ln < w) w = ln; if (ln > e) e = ln; }
    return { b, s, w, n, e };
  });
  const achar = (lat: number, lng: number) => comContorno.find((x) => lat >= x.s && lat <= x.n && lng >= x.w && lng <= x.e && dentro(lat, lng, x.b.aneis!));
  let total = 0;
  if (comContorno.length) {
    for (const p of o.pontos) if (quer.has(p[2])) { total++; const x = achar(p[0], p[1]); if (x) somar(x.b.n, p[2], 1); }
    for (const [cat, cel] of Object.entries(o.grade || {})) if (quer.has(cat)) for (const [la, ln, n] of cel) { total += n; const x = achar(la, ln); if (x) somar(x.b.n, cat, n); }
  }
  // Bairros sem contorno: pelo nome escrito no boletim
  const semContorno = new Map(bairros.filter((b) => !b.aneis?.length).map((b) => [normalizar(b.n), b.n]));
  if (semContorno.size || !comContorno.length) {
    for (const [nome, c] of Object.entries(o.bairros)) {
      const alvo = semContorno.get(normalizar(nome)) || (!comContorno.length ? nome : null);
      if (!alvo) continue;
      for (const [cat, n] of Object.entries(c)) if (quer.has(cat)) somar(alvo, cat, n);
    }
    if (!comContorno.length) total = Object.entries(o.cats).filter(([c]) => quer.has(c)).reduce((a, [, n]) => a + n, 0);
  }
  return { porBairro, total };
}
