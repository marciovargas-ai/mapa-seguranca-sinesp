import { CacheDisco } from './cache-disco';
import { ESTADOS } from './dados';
import { LinhaRanking, Oficial, Panorama } from './modelos';
import { municipiosUf } from './municipios';
import { fetchComTimeout, normalizar } from './util';

/**
 * População dos municípios direto do IBGE, pelo navegador (o IBGE bloqueia
 * acessos de fora do Brasil, então o robô do GitHub nem sempre consegue).
 * Usada só quando o servidor não trouxe as taxas por 100 mil habitantes.
 */
export interface PopulacaoUf { uf: string; ano: string; porCodigo: Record<string, number>; total: number }

const FONTES = [
  // Estimativa anual (tabela 6579) e, de reserva, o Censo 2022 (tabela 4709)
  (cod: string) => `https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-1/variaveis/9324?localidades=N6[N3[${cod}]]`,
  (cod: string) => `https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/-1/variaveis/93?localidades=N6[N3[${cod}]]`,
];

export async function carregarPopulacao(uf: string): Promise<PopulacaoUf | null> {
  const chave = 'POPULACAO_' + uf;
  const guardada = await CacheDisco.obter<PopulacaoUf>(chave, 180);
  if (guardada) return guardada;
  for (const fonte of FONTES) {
    try {
      const r = await fetchComTimeout(fonte(ESTADOS[uf].ibge), 15000);
      if (!r.ok) continue;
      const dados = await r.json();
      const serie = dados?.[0]?.resultados?.[0]?.series || [];
      const porCodigo: Record<string, number> = {};
      let ano = '';
      for (const s of serie) {
        const [a, v] = Object.entries(s.serie || {})[0] || [];
        if (v && /^\d+$/.test(String(v))) { porCodigo[String(s.localidade.id)] = Number(v); ano = String(a); }
      }
      if (Object.keys(porCodigo).length < 10) continue;
      const pop = { uf, ano, porCodigo, total: Object.values(porCodigo).reduce((x, y) => x + y, 0) };
      CacheDisco.salvar(chave, pop);
      return pop;
    } catch { /* tenta a próxima fonte */ }
  }
  return null;
}

const taxa = (total: number, pop: number | null | undefined) => (pop && pop > 0 ? Math.round((total / pop) * 1000000) / 10 : null);

function codigoPorNome(uf: string): Map<string, string> {
  return new Map(municipiosUf(uf).map((m) => [m.norm, m.ibge]));
}

/** Completa taxas do município/estado quando o servidor não as calculou. */
export function enriquecerOficial(o: Oficial | null, uf: string, cidade: string, ehEstado: boolean, pop: PopulacaoUf | null, panorama: Panorama | null): Oficial | null {
  if (!o || !o.disponivel || !pop || pop.uf !== uf) return o;
  if (o.eventos.every((e) => e.taxa != null)) return o;
  const ibge = ehEstado ? null : codigoPorNome(uf).get(normalizar(cidade)) || null;
  const populacao = ehEstado ? pop.total : ibge ? pop.porCodigo[ibge] : null;
  if (!populacao) return o;
  const estadoPorEvento = new Map((panorama?.uf === uf ? panorama.oficial?.eventos || [] : []).map((e) => [e.nome, e.total]));
  return {
    ...o, populacao, anoPopulacao: Number(pop.ano) || o.anoPopulacao, codigoIbge: ibge || o.codigoIbge,
    eventos: o.eventos.map((e) => ({
      ...e,
      taxa: e.taxa ?? taxa(e.total, populacao),
      taxaEstado: ehEstado ? e.taxaEstado : e.taxaEstado ?? (estadoPorEvento.has(e.nome) ? taxa(estadoPorEvento.get(e.nome)!, pop.total) : null),
    })),
  };
}

/** Refaz o ranking por taxa e o mapa coroplético a partir de todos os municípios. */
export function enriquecerPanorama(p: Panorama | null, pop: PopulacaoUf | null): Panorama | null {
  if (!p?.disponivel || !p.rankings || !pop || pop.uf !== p.uf) return p;
  if (p.rankings.every((r) => r.porTaxa.length || !r.todas)) return p;
  const codigos = codigoPorNome(p.uf!);
  const completar = (n: string, total: number, anterior: number): LinhaRanking => {
    const ibge = codigos.get(normalizar(n)) || null;
    const habitantes = ibge ? pop.porCodigo[ibge] || null : null;
    return { n, ibge, pop: habitantes, total, anterior, taxa: taxa(total, habitantes) };
  };
  const rankings = p.rankings.map((r) => {
    if (!r.todas) return r;
    const linhas = r.todas.map(([n, total, anterior]) => completar(n, total, anterior));
    const valoresTaxa: Record<string, number> = {};
    linhas.forEach((l) => { if (l.ibge && l.taxa !== null) valoresTaxa[l.ibge] = l.taxa; });
    const porNome = new Map(linhas.map((l) => [l.n, l]));
    const refazer = (lista: LinhaRanking[]) => lista.map((l) => porNome.get(l.n) || l);
    return {
      ...r, valoresTaxa, porTotal: refazer(r.porTotal), altas: refazer(r.altas), quedas: refazer(r.quedas),
      porTaxa: linhas.filter((l) => (l.pop || 0) >= 20000 && l.taxa !== null).sort((a, b) => b.taxa! - a.taxa!).slice(0, 15),
    };
  });
  return { ...p, rankings, anoPopulacao: p.anoPopulacao || Number(pop.ano) || null };
}
