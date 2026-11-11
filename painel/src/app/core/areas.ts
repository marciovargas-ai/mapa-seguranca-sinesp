import { CacheDisco } from './cache-disco';
import { CFG } from './dados';
import { Servidor } from './servidor';
import { fetchComTimeout } from './util';

/**
 * Dados oficiais e verificados abaixo do município:
 *  - ISP-RJ: ocorrências por área de delegacia (CISP), publicado pelo robô do GitHub;
 *  - Fogo Cruzado: tiroteios com coordenada exata (Grande Rio, Recife, Salvador, Belém),
 *    buscado pelo servidor com a conta gravada nas propriedades do script.
 */
export interface AreaIsp { cisp: number; aisp: number; u12: Record<string, number>; a12: Record<string, number>; aneis?: [number, number][][]; lat?: number; lng?: number }
export interface IspMunicipio { fonte: string; periodo: { de: string; ate: string }; campos: Record<string, string>; areas: AreaIsp[] }

export interface Tiroteio {
  id: string; d: string; lat: number; lng: number; bairro: string; endereco: string;
  mortos: number; feridos: number; policia: boolean; motivo: string;
  /** Detalhes do Fogo Cruzado (servidor v5.3+): disputa entre grupos armados, motivos, recortes, chacina, agentes, jovens, bala perdida, transporte, animais. */
  gp?: number; mc?: string[]; rc?: string[]; ch?: number; ag?: { m: number; f: number } | null; cr?: number; bp?: number;
  tr?: string[]; an?: number; un?: string; tipoAcao?: string;
}
export interface FogoCruzado { configurado: boolean; erro?: string; atualizadoEm?: string; itens: Tiroteio[] }

export const UFS_FOGO_CRUZADO = ['RJ', 'PE', 'BA', 'PA'];

let arquivoIsp: Promise<any | null> | null = null;
let arquivoContornos: Promise<any | null> | null = null;

/** Arquivo do repositório de dados (CDN com reserva no GitHub), guardado no disco por alguns dias. */
export function baixarDadosPublicos(nome: string, chave: string, dias: number): Promise<any | null> { return baixarDados(nome, chave, dias); }

async function baixarDados(nome: string, chave: string, dias: number): Promise<any | null> {
  const guardado = await CacheDisco.obter<any>(chave, dias);
  if (guardado) return guardado;
  for (const base of CFG.BASES_DADOS) {
    try {
      const r = await fetchComTimeout(base + nome, 20000);
      if (!r.ok) continue;
      const j = await r.json();
      CacheDisco.salvar(chave, j);
      return j;
    } catch { /* próximo endereço */ }
  }
  return null;
}

/** Áreas de delegacia do município (só RJ). null quando não há. */
export async function carregarIsp(uf: string, ibge: string): Promise<IspMunicipio | null> {
  if (uf !== 'RJ' || !ibge) return null;
  arquivoIsp ??= baixarDados('isp_rj_cisp.json', 'ISP_RJ_CISP', 3);
  arquivoContornos ??= baixarDados('cisp_rj_contornos.json', 'ISP_RJ_CONTORNOS', 30);
  const j = await arquivoIsp;
  if (!j) { arquivoIsp = null; return null; }
  const contornos = (await arquivoContornos)?.cisps || {};
  if (!contornos || !Object.keys(contornos).length) arquivoContornos = null;
  const areas: AreaIsp[] = (j.municipios?.[ibge.slice(0, 6)] || []).map((a: AreaIsp) => {
    const c = contornos[String(a.cisp)];
    return c ? { ...a, aneis: c.aneis, lat: c.lat, lng: c.lng } : a;
  });
  return areas.length ? { fonte: j.fonte, periodo: j.periodo, campos: j.campos, areas } : null;
}

/** Tiroteios dos últimos 12 meses na cidade (Fogo Cruzado). */
export async function carregarFogoCruzado(uf: string, cidade: string, ignorarCache = false): Promise<FogoCruzado | null> {
  if (!UFS_FOGO_CRUZADO.includes(uf) || !cidade) return null;
  const chave = 'FOGO_' + uf + '_' + cidade;
  const guardado = ignorarCache ? null : await CacheDisco.obter<FogoCruzado>(chave, 1 / 24);
  if (guardado) return guardado;
  const r = await Servidor.fogoCruzado(uf, cidade);
  if (r?.configurado && !r.erro) CacheDisco.salvar(chave, r);
  return r;
}

/** Referência nacional (robô): mortes violentas (CVLI) de 12 meses de cada município, por estado. */
export interface ReferenciaBruta { periodo: string; ufs: Record<string, { cvli: number; municipios: Record<string, number>; detalhe?: Record<string, [number, number, number, number, number]> }> }
/** Montada no painel com a população do IBGE: taxas de todos os municípios com 20 mil hab. ou mais. */
export interface ReferenciaNacional {
  periodo: string; brasil: { cvli: number; pop: number; taxa: number };
  /** ibge → [mortes usadas, habitantes, taxa por 100 mil, CVLI Sinesp 12 meses, mortes SIM no ano,
   *  tentativas por 100 mil, CVLI 12 meses anteriores, média de 3 anos usada (1) ou não (0)] */
  taxas: number[]; totais: number[]; taxasTent: number[]; municipios: Record<string, number[]>;
  sim: { ano: number; preliminar: boolean } | null;
}
/** SIM/DATASUS: ibge6 → [agressão, intervenção legal, intenção indeterminada]; população do IBGE junto. */
export interface SimBruto { ano: number; preliminar: boolean; municipios: Record<string, [number, number, number]>; populacao?: { ano: number; municipios: Record<string, number> } }
let sim: Promise<SimBruto | null> | null = null;
export function carregarSim(): Promise<SimBruto | null> {
  return sim || (sim = baixarDados('sim_homicidios.json', 'SIM_HOMICIDIOS', 7));
}
let referencia: Promise<ReferenciaBruta | null> | null = null;
export function carregarReferencia(): Promise<ReferenciaBruta | null> {
  return referencia || (referencia = baixarDados('referencia_nacional.json', 'REF_NACIONAL3', 3));
}
