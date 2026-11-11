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
export interface AreaIsp { cisp: number; aisp: number; u12: Record<string, number>; a12: Record<string, number> }
export interface IspMunicipio { fonte: string; periodo: { de: string; ate: string }; campos: Record<string, string>; areas: AreaIsp[] }

export interface Tiroteio {
  id: string; d: string; lat: number; lng: number; bairro: string; endereco: string;
  mortos: number; feridos: number; policia: boolean; motivo: string;
}
export interface FogoCruzado { configurado: boolean; erro?: string; atualizadoEm?: string; itens: Tiroteio[] }

export const UFS_FOGO_CRUZADO = ['RJ', 'PE', 'BA', 'PA'];

let arquivoIsp: Promise<any | null> | null = null;

/** Áreas de delegacia do município (só RJ). null quando não há. */
export async function carregarIsp(uf: string, ibge: string): Promise<IspMunicipio | null> {
  if (uf !== 'RJ' || !ibge) return null;
  arquivoIsp ??= (async () => {
    const guardado = await CacheDisco.obter<any>('ISP_RJ_CISP', 3);
    if (guardado) return guardado;
    for (const base of CFG.BASES_DADOS) {
      try {
        const r = await fetchComTimeout(base + 'isp_rj_cisp.json', 15000);
        if (!r.ok) continue;
        const j = await r.json();
        CacheDisco.salvar('ISP_RJ_CISP', j);
        return j;
      } catch { /* próximo endereço */ }
    }
    return null;
  })();
  const j = await arquivoIsp;
  if (!j) { arquivoIsp = null; return null; }
  const areas: AreaIsp[] = j.municipios?.[ibge.slice(0, 6)] || [];
  return areas.length ? { fonte: j.fonte, periodo: j.periodo, campos: j.campos, areas } : null;
}

/** Tiroteios dos últimos 12 meses na cidade (Fogo Cruzado). */
export async function carregarFogoCruzado(uf: string, cidade: string): Promise<FogoCruzado | null> {
  if (!UFS_FOGO_CRUZADO.includes(uf) || !cidade) return null;
  const chave = 'FOGO_' + uf + '_' + cidade;
  const guardado = await CacheDisco.obter<FogoCruzado>(chave, 0.25);
  if (guardado) return guardado;
  const r = await Servidor.fogoCruzado(uf, cidade);
  if (r?.configurado && !r.erro) CacheDisco.salvar(chave, r);
  return r;
}
