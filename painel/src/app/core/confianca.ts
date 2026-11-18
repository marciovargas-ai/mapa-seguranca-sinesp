import { Ocorrencia } from './modelos';
import { normalizar } from './util';

/**
 * Grau de confiança de cada notícia, na escala Admiralty (OTAN 6x6) usada por analistas de inteligência:
 * letra = confiabilidade da fonte (A a F); número = credibilidade da informação (1 a 6).
 * Estatística oficial (Sinesp, SSP, ISP) é A1 e não passa por aqui.
 */
export const LETRAS: Record<string, string> = {
  A: 'fonte oficial', B: 'fonte geralmente confiável (imprensa conhecida, imprensa local ou Instituto Fogo Cruzado)',
  C: 'fonte razoavelmente confiável (veículo pouco conhecido ou agregador)', F: 'fonte sem histórico para julgar',
};
export const NUMEROS: Record<string, string> = {
  '1': 'confirmada por mais de um veículo', '2': 'provavelmente verdadeira (uma fonte confiável, sem confirmação)',
  '3': 'possivelmente verdadeira (uma fonte só, ainda sem confirmação)', '6': 'sem base para julgar',
};

/** Veículos de alcance nacional ou regional com redação própria. */
const IMPRENSA_CONHECIDA = /\b(g1|globo|o globo|folha|estadao|estado de s paulo|uol|cnn|record|r7|band|sbt|metropoles|correio|zero hora|gzh|gaucha|o tempo|estado de minas|jc|jornal do commercio|diario de pernambuco|a tarde|correio 24 horas|o povo|diario do nordeste|gazeta|tribuna|bnews|g1 globo|agencia brasil|poder360|veja|exame|terra|ndmais|nsc|jovem pan|cbn|bandnews|extra|o dia|meia hora)\b/;

export function letraDaFonte(o: Pick<Ocorrencia, 'veiculo' | 'local' | 'id'>): string {
  if (/^fc/.test(o.id) || /fogo cruzado/i.test(o.veiculo || '')) return 'B';
  if (o.local) return 'B';
  const v = normalizar(o.veiculo);
  if (!v) return 'C';
  return IMPRENSA_CONHECIDA.test(v) ? 'B' : 'C';
}

export function grauDe(o: Ocorrencia): string {
  if (o.grau) return o.grau;
  const l = letraDaFonte(o);
  return l + (l === 'B' ? '2' : '3');
}

export function explicarGrau(g: string): string {
  return `Grau ${g}: ${LETRAS[g[0]] || ''}; informação ${NUMEROS[g[1]] || ''}. Escala Admiralty (OTAN), usada por analistas de inteligência.`;
}

const PALAVRAS_VAZIAS = new Set(['para', 'pela', 'pelo', 'como', 'apos', 'depois', 'entre', 'sobre', 'contra', 'durante', 'cidade', 'homem', 'mulher',
  'jovem', 'policia', 'policial', 'diz', 'sao', 'mais', 'menos', 'anos', 'ano', 'dois', 'duas', 'tres', 'onde', 'quando', 'esta', 'este', 'essa', 'esse',
  // Vocabulário comum a qualquer notícia de crime: sozinho não prova que é o mesmo fato
  'morto', 'morta', 'mortos', 'tiros', 'bairro', 'assalto', 'assaltado', 'assaltada', 'roubo', 'roubado', 'roubada', 'furto', 'preso', 'presa', 'presos',
  'suspeito', 'suspeitos', 'suspeita', 'baleado', 'baleada', 'crime', 'crimes', 'regiao', 'zona', 'norte', 'leste', 'oeste', 'centro', 'apos', 'vitima',
  'casa', 'carro', 'moto', 'tiroteio', 'operacao', 'drogas', 'trafico', 'homicidio', 'assassinado', 'assassinada', 'encontrado', 'encontrada', 'corpo']);

function palavras(t: string): Set<string> {
  return new Set(normalizar(t).split(' ').filter((p) => p.length >= 4 && !PALAVRAS_VAZIAS.has(p)));
}

function parecidas(a: Set<string>, b: Set<string>): boolean {
  if (!a.size || !b.size) return false;
  let comum = 0;
  for (const p of a) if (b.has(p)) comum++;
  // Jaccard >= 0,5, ou 3 palavras raras em comum cobrindo 70% do título mais curto
  return comum >= 2 && (comum / (a.size + b.size - comum) >= 0.5 || (comum >= 3 && comum / Math.min(a.size, b.size) >= 0.7));
}

const RANK_PRECISAO: Record<string, number> = { ENDERECO: 4, RODOVIA: 3, BAIRRO: 2, MUNICIPIO: 1 };
const JANELA_MS = 2 * 86400000;

/**
 * Junta as notícias do mesmo fato (mesmo tipo, mesma cidade, até 48 horas de distância, títulos parecidos)
 * num só item: fica a versão com o local mais preciso, com a lista de veículos em `fontes`.
 * Um caso muito noticiado passa a contar uma vez nas zonas e nos bairros, e a confirmação sobe o grau para 1.
 */
export function agruparOcorrencias(lista: Ocorrencia[]): Ocorrencia[] {
  type Grupo = { itens: Ocorrencia[]; pal: Set<string>; ts: number; bairro: string };
  const porChave = new Map<string, Grupo[]>();
  const ordenadas = lista.slice().sort((a, b) => a.ts - b.ts);
  const grupos: Grupo[] = [];
  for (const o of ordenadas) {
    const chave = o.cat + '|' + normalizar(o.cidade);
    const pal = palavras(o.titulo);
    const abertos = porChave.get(chave) || [];
    // Só grupos ainda dentro da janela de 48 horas
    while (abertos.length && o.ts - abertos[0].ts > JANELA_MS) abertos.shift();
    // Bairros diferentes e conhecidos = fatos diferentes, mesmo com título parecido
    const bairro = o.bairro && o.bairro !== 'Local não informado' ? normalizar(o.bairro) : '';
    const g = abertos.find((x) => (!bairro || !x.bairro || x.bairro === bairro) && parecidas(x.pal, pal));
    if (g) { g.itens.push(o); for (const p of pal) g.pal.add(p); g.ts = o.ts; if (!g.bairro) g.bairro = bairro; }
    else { const n = { itens: [o], pal, ts: o.ts, bairro }; abertos.push(n); grupos.push(n); }
    porChave.set(chave, abertos);
  }
  return grupos.map(({ itens }) => {
    const base = itens.slice().sort((a, b) => (RANK_PRECISAO[b.precisao] || 0) - (RANK_PRECISAO[a.precisao] || 0) || b.ts - a.ts)[0];
    const veiculos = new Map<string, Ocorrencia>();
    for (const i of itens) { const v = normalizar(i.veiculo) || i.link; if (!veiculos.has(v)) veiculos.set(v, i); }
    const letra = itens.map(letraDaFonte).sort()[0];
    const numero = veiculos.size >= 2 ? '1' : letra === 'B' ? '2' : '3';
    const maisRecente = itens.reduce((a, b) => (b.ts > a.ts ? b : a));
    return {
      ...base,
      ts: maisRecente.ts, data: maisRecente.data,
      orgaos: [...new Set(itens.flatMap((i) => i.orgaos))],
      local: itens.some((i) => i.local),
      grau: letra + numero,
      fontes: veiculos.size >= 2 ? [...veiculos.values()].map((i) => ({ veiculo: i.veiculo || 'Fonte', link: i.link, titulo: i.titulo })) : undefined,
    };
  }).sort((a, b) => b.ts - a.ts);
}
