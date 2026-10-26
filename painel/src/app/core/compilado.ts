import { BairroResumo } from './bairros';
import { CATEGORIA_POR_ID } from './dados';
import { Filtrados, Oficial, Panorama } from './modelos';
import { municipiosUf } from './municipios';
import { PopulacaoUf } from './populacao';
import { fmt, fmt1, normalizar, pct, variacao } from './util';

/**
 * Compilado do Panorama: junta Sinesp (polícias do estado, PRF e PF), IBGE,
 * bairros do OpenStreetMap e notícias num só retrato do local.
 * Regras de leitura usadas aqui:
 * - taxas por 100 mil habitantes em 12 meses (comparáveis entre municípios);
 * - comparação com o estado e posição só entre municípios com 20 mil hab. ou mais
 *   (em cidades pequenas, 1 caso muda muito a taxa);
 * - variação do ano corrente sempre contra o mesmo período do ano anterior;
 * - com menos de 10 casos, a variação percentual é marcada como instável.
 */

/** Grupos de indicadores do Sinesp (nomes já encurtados pelo painel). */
const GRUPOS = {
  cvli: { nome: 'Mortes violentas intencionais', curto: 'MVI', re: /^(homic[ií]dio doloso|latroc[ií]nio|les[aã]o corporal seguida de morte)$/i },
  intervencao: { nome: 'Mortes por intervenção policial', curto: 'Intervenção', re: /^morte por interven/i },
  tentativas: { nome: 'Tentativas de homicídio', curto: 'Tentativas', re: /^tentativa de homic/i },
  mulher: { nome: 'Violência letal e sexual contra a mulher', curto: 'Mulher', re: /^(feminic[ií]dio|tentativa de feminic[ií]dio|estupro|estupro de vulner[aá]vel)$/i },
  feminicidio: { nome: 'Feminicídios', curto: 'Feminicídio', re: /^feminic[ií]dio$/i },
  veiculos: { nome: 'Roubos e furtos de veículos', curto: 'Veículos', re: /^(roubo|furto) de ve[ií]culo/i },
  carga: { nome: 'Roubos de carga e a bancos', curto: 'Carga/bancos', re: /^roubo (de carga|a institui)/i },
  transito: { nome: 'Mortes no trânsito', curto: 'Trânsito', re: /^mortes? no tr[aâ]nsito/i },
  trafico: { nome: 'Tráfico de drogas', curto: 'Tráfico', re: /^tr[aá]fico de drogas/i },
  armas: { nome: 'Armas de fogo apreendidas', curto: 'Armas', re: /^arma de fogo apreendida/i },
  prisoes: { nome: 'Mandados de prisão cumpridos', curto: 'Prisões', re: /^mandado de pris/i },
  desaparecidos: { nome: 'Pessoas desaparecidas', curto: 'Desaparecidos', re: /^pessoa desaparecida/i },
} as const;
type Grupo = keyof typeof GRUPOS;

export interface Agregado { ano: number | null; anterior: number | null; total12: number; serie36: number[]; federais: Record<string, number>; eventos: string[] }

export interface Indicador {
  id: string; titulo: string; valor: string; unidade?: string; sub: string; delta?: [number | null, number | null];
  instavel?: boolean; tom: 'alerta' | 'positivo' | 'neutro'; dica: string; fonte: string; destaque?: boolean;
}

export interface Componente { nome: string; peso: number; valor: number; texto: string }
export interface Risco { valor: number; nivel: string; cor: string; componentes: Componente[]; dica: string }
export interface Posicao { rank: number; total: number; taxa: number; mediana: number; taxaEstado: number | null }
export interface Fonte { nome: string; estado: 'ok' | 'parcial' | 'sem'; detalhe: string; dica: string }
export interface Municipal { nome: string; ibge: string | null; pop: number | null; total: number; anterior: number; taxa: number | null }

export interface Compilado {
  parecer: string[]; indicadores: Indicador[]; risco: Risco | null; posicao: Posicao | null; fontes: Fonte[];
  serie: { labels: string[]; mvi: number[]; noticias: (number | null)[] } | null;
  municipios: Municipal[];
}

const soma = (l: number[]) => l.reduce((a, b) => a + b, 0);
const somaNull = (l: (number | null)[]) => (l.some((v) => v != null) ? l.reduce<number>((a, b) => a + (b || 0), 0) : null);
const taxa = (n: number, pop: number | null | undefined) => (pop ? Math.round((n / pop) * 1e6) / 10 : null);
const MIN_POP = 20000;

export function agregar(o: Oficial, g: Grupo): Agregado | null {
  const evs = o.eventos.filter((e) => GRUPOS[g].re.test(e.nome));
  if (!evs.length) return null;
  const n = Math.max(...evs.map((e) => e.serie36.length));
  const serie36 = new Array(n).fill(0);
  evs.forEach((e) => e.serie36.forEach((v, i) => (serie36[i] += v || 0)));
  const federais: Record<string, number> = {};
  evs.forEach((e) => Object.entries(e.federais || {}).forEach(([k, v]) => (federais[k] = (federais[k] || 0) + v)));
  return {
    ano: somaNull(evs.map((e) => e.porAno[2])), anterior: somaNull(evs.map((e) => e.parcialAnterior)),
    total12: soma(evs.map((e) => e.total)), serie36, federais, eventos: evs.map((e) => e.nome),
  };
}

/** Linhas municipais de um grupo, somando os rankings do panorama (um por indicador). */
function municipiosDoGrupo(p: Panorama | null, g: Grupo, pop: PopulacaoUf | null): Municipal[] {
  if (!p?.uf) return [];
  const rks = (p?.rankings || []).filter((r) => GRUPOS[g].re.test(r.evento) && r.todas);
  if (!rks.length) return [];
  const porNome = new Map<string, { n: string; total: number; anterior: number }>();
  rks.forEach((r) => r.todas!.forEach(([n, t, a]) => {
    const x = porNome.get(n) || { n, total: 0, anterior: 0 };
    x.total += t; x.anterior += a; porNome.set(n, x);
  }));
  const codigos = new Map(municipiosUf(p.uf).map((m) => [m.norm, m.ibge]));
  return [...porNome.values()].map((x) => {
    const ibge = codigos.get(normalizar(x.n)) || null;
    const habitantes = ibge && pop ? pop.porCodigo[ibge] || null : null;
    return { nome: x.n, ibge, pop: habitantes, total: x.total, anterior: x.anterior, taxa: taxa(x.total, habitantes) };
  });
}

/** Posição do município (taxa, maior primeiro) entre os de 20 mil hab. ou mais, contando os sem registro como zero. */
function posicionar(linhas: Municipal[], pop: PopulacaoUf | null, ibgeCidade: string | null): { pos: Posicao | null; percentil: number | null } {
  if (!pop || !ibgeCidade) return { pos: null, percentil: null };
  const porIbge = new Map(linhas.filter((l) => l.ibge).map((l) => [l.ibge!, l]));
  const popCidade = pop.porCodigo[ibgeCidade];
  if (!popCidade) return { pos: null, percentil: null };
  const elegiveis = Object.entries(pop.porCodigo).filter(([c, h]) => h >= MIN_POP || c === ibgeCidade)
    .map(([c, h]) => ({ c, t: taxa(porIbge.get(c)?.total || 0, h) || 0 }));
  if (elegiveis.length < 5) return { pos: null, percentil: null };
  const minha = elegiveis.find((e) => e.c === ibgeCidade)!.t;
  const ordenadas = elegiveis.map((e) => e.t).sort((a, b) => a - b);
  const abaixo = ordenadas.filter((t) => t < minha).length;
  const iguais = ordenadas.filter((t) => t === minha).length;
  const rank = elegiveis.filter((e) => e.t > minha).length + 1;
  const mediana = ordenadas[Math.floor(ordenadas.length / 2)];
  const totEstado = soma(linhas.map((l) => l.total));
  return {
    pos: { rank, total: elegiveis.length, taxa: minha, mediana, taxaEstado: taxa(totEstado, pop.total) },
    percentil: Math.round(((abaixo + iguais / 2) / ordenadas.length) * 100),
  };
}

interface Entrada {
  ehEstado: boolean; nomeLocal: string; cidade: string; uf: string; ibge: string | null;
  oficial: Oficial | null; panorama: Panorama | null; pop: PopulacaoUf | null;
  f12: Filtrados; bairros: BairroResumo[]; bairrosOsm: number; bairrosCarregando: boolean; ultimaColeta: string;
}

export function compilar(c: Entrada): Compilado {
  const o = c.oficial?.disponivel && c.oficial.anos ? c.oficial : null;
  const estadoOf = c.panorama?.oficial?.disponivel ? c.panorama.oficial : null;
  const popLocal = o?.populacao || (c.ehEstado ? c.pop?.total : c.ibge ? c.pop?.porCodigo[c.ibge] : null) || null;
  const popEstado = c.pop?.total || null;
  const anos = o?.anos || [];
  const ult = o?.ultimoMes || 'dez';
  const periodoAno = anos.length ? (ult === 'dez' ? String(anos[2]) : `jan–${ult}/${anos[2]}`) : '';
  const ag = (g: Grupo) => (o ? agregar(o, g) : null);
  const agEstado = (g: Grupo) => (estadoOf ? agregar(estadoOf, g) : null);

  const indicadores: Indicador[] = [];
  const parecer: string[] = [];
  let risco: Risco | null = null;
  let posicao: Posicao | null = null;

  const mvi = ag('cvli');
  const linhasMvi = municipiosDoGrupo(c.panorama, 'cvli', c.pop);
  const posMvi = c.ehEstado ? { pos: null, percentil: null } : posicionar(linhasMvi, c.pop, c.ibge);
  posicao = posMvi.pos;

  const NOTA_ATUACAO = ' Alta pode indicar mais crime ou mais ação policial; por isso o cartão não fica vermelho.';
  const cartao = (g: Grupo, extra: Partial<Indicador> = {}, nota = ''): void => {
    const a = ag(g);
    if (!a || (!a.total12 && !a.ano)) return;
    const e = agEstado(g);
    const tx = taxa(a.total12, popLocal);
    const txE = e && popEstado ? taxa(e.total12, popEstado) : null;
    const v = variacao(a.ano, a.anterior);
    const instavel = Math.max(a.ano || 0, a.anterior || 0) < 10;
    const razao = !c.ehEstado && tx != null && txE ? tx / txE : null;
    const comparacao = razao == null ? '' : razao >= 1.1 ? ` · ${fmt1(razao)}× o estado` : razao <= 0.9 ? ` · ${fmt1(razao)}× o estado` : ' · na média do estado';
    indicadores.push({
      id: g, titulo: GRUPOS[g].nome, valor: fmt(a.ano), sub: `${periodoAno}` + (tx != null ? ` · ${fmt1(tx)}/100 mil em 12 meses` : '') + comparacao,
      delta: [a.ano, a.anterior], instavel, tom: v == null ? 'neutro' : v > 5 ? 'alerta' : v < -5 ? 'positivo' : 'neutro', fonte: 'Sinesp',
      dica: `Soma de: ${a.eventos.join(', ')}. ${periodoAno} comparado ao mesmo período de ${anos[1]}.` +
        (tx != null ? ` Taxa = registros dos últimos 12 meses ÷ população (IBGE) × 100 mil.` : '') +
        (txE != null ? ` Estado: ${fmt1(txE)} por 100 mil.` : '') + (instavel ? ' Poucos casos: a variação percentual oscila muito.' : '') + nota,
      ...extra,
    });
  };

  if (o) {
    cartao('cvli', { destaque: true });
    if (!c.ehEstado && posicao) {
      const acima = posicao.taxaEstado != null && posicao.taxa > posicao.taxaEstado;
      indicadores.push({
        id: 'posicao', titulo: 'Posição no estado (MVI por 100 mil)', valor: `${posicao.rank}º`, unidade: `de ${posicao.total}`,
        sub: `taxa ${fmt1(posicao.taxa)} · mediana ${fmt1(posicao.mediana)} · estado ${fmt1(posicao.taxaEstado)}`,
        tom: acima ? 'alerta' : 'positivo', fonte: 'Sinesp + IBGE',
        dica: `Ordem decrescente da taxa de mortes violentas intencionais (12 meses) entre os municípios do estado com ${fmt(MIN_POP)} habitantes ou mais. 1º = mais violento.`,
      });
    }
    cartao('tentativas');
    cartao('mulher');
    cartao('veiculos');
    // Atuação policial: alta pode ser mais crime ou mais repressão, então fica neutra
    cartao('trafico', { tom: 'neutro' }, NOTA_ATUACAO);
    cartao('armas', { tom: 'neutro' }, NOTA_ATUACAO);
    cartao('prisoes', { tom: 'neutro' }, NOTA_ATUACAO);
    cartao('intervencao');
    cartao('carga');
    cartao('transito');
    cartao('desaparecidos');

    // Registros federais (campo "abrangência" do Sinesp)
    const fed: Record<string, number> = {};
    o.eventos.forEach((e) => Object.entries(e.federais || {}).forEach(([k, v]) => (fed[k] = (fed[k] || 0) + v)));
    const totFed = soma(Object.values(fed));
    indicadores.push({
      id: 'federais', titulo: 'Registros da PRF e da PF', valor: fmt(totFed),
      sub: totFed ? Object.entries(fed).map(([k, v]) => `${k} ${fmt(v)}`).join(' · ') + ' · 12 meses' : 'nenhum registro federal neste local em 12 meses',
      tom: 'neutro', fonte: 'Sinesp',
      dica: 'O Sinesp separa o que foi lançado pela Polícia Rodoviária Federal e pela Polícia Federal. O restante vem das polícias Civil e Militar, pelas secretarias estaduais.',
    });
  }

  // Notícias (complemento)
  const f = c.f12;
  const graves = (f.porCat['CVLI'] || 0) + (f.porCat['CONFRONTO'] || 0);
  const comBairro = c.bairros.filter((b) => b.qtd > 0);
  indicadores.push({
    id: 'noticias', titulo: 'Ocorrências noticiadas (12 meses)', valor: fmt(f.todas.length),
    sub: `${fmt(graves)} homicídios ou tiroteios · ${fmt(f.porCat['TRAFICO'] || 0)} tráfico · ${pct(f.precisas.length, f.todas.length)}% com local preciso`, tom: 'neutro', fonte: 'Notícias',
    dica: 'Google Notícias e imprensa local, classificadas automaticamente. Complementam o Sinesp com o onde e o quando, mas não medem o total de crimes.',
  });
  if (!c.ehEstado) {
    const z = f.zonas;
    indicadores.push({
      id: 'bairros', titulo: 'Bairros com ocorrência', valor: fmt(comBairro.length), unidade: c.bairrosOsm ? `de ${fmt(c.bairrosOsm)}` : '',
      sub: (comBairro[0] ? `mais citado: ${comBairro[0].nome} (${fmt(comBairro[0].qtd)})` : 'nenhum bairro citado') + ` · ${fmt(z.length)} zonas vermelhas`,
      tom: z.some((x) => x.nivel === 'critica') ? 'alerta' : 'neutro', fonte: 'Notícias + OpenStreetMap',
      dica: 'Cada notícia é ligada ao bairro pelo contorno do OpenStreetMap (quando tem coordenada) ou pelo nome citado. Zonas vermelhas = concentrações de ocorrências graves e recentes.',
    });
  }

  // Índice de risco (só para município: compara com o próprio estado)
  if (!c.ehEstado && o) {
    const comps: Componente[] = [];
    if (posMvi.percentil != null) comps.push({ nome: 'Letalidade (MVI por 100 mil)', peso: 40, valor: posMvi.percentil, texto: `mais alta que ${posMvi.percentil}% dos municípios comparáveis` });
    const ten = posicionar(municipiosDoGrupo(c.panorama, 'tentativas', c.pop), c.pop, c.ibge);
    if (ten.percentil != null) comps.push({ nome: 'Tentativas de homicídio', peso: 15, valor: ten.percentil, texto: `acima de ${ten.percentil}% dos municípios comparáveis` });
    const fem = posicionar(municipiosDoGrupo(c.panorama, 'feminicidio', c.pop), c.pop, c.ibge);
    if (fem.percentil != null) comps.push({ nome: 'Feminicídio', peso: 15, valor: fem.percentil, texto: `acima de ${fem.percentil}% dos municípios comparáveis` });
    if (mvi && mvi.anterior != null && Math.max(mvi.ano || 0, mvi.anterior) >= 5) {
      const v = variacao(mvi.ano, mvi.anterior) || 0;
      comps.push({ nome: 'Tendência no ano', peso: 15, valor: Math.round(Math.max(0, Math.min(100, 50 + v))), texto: `${v > 0 ? '+' : ''}${v}% de MVI em ${periodoAno}` });
    }
    if (f.todas.length >= 10) {
      const p = pct(graves, f.todas.length);
      comps.push({ nome: 'Gravidade noticiada', peso: 15, valor: Math.round(Math.min(100, p * 1.5)), texto: `${p}% das notícias são homicídio ou tiroteio` });
    }
    const pesoTotal = soma(comps.map((x) => x.peso));
    if (pesoTotal >= 40) {
      const valor = Math.round(soma(comps.map((x) => x.valor * x.peso)) / pesoTotal);
      const [nivel, cor] = valor >= 75 ? ['Muito alto', '#b91c1c'] : valor >= 55 ? ['Alto', '#ea580c'] : valor >= 35 ? ['Moderado', '#ca8a04'] : ['Baixo', '#16a34a'];
      risco = {
        valor, nivel, cor, componentes: comps,
        dica: 'Índice de 0 a 100 que compara o município com os demais do estado (20 mil hab. ou mais). Média ponderada dos componentes: ' +
          comps.map((x) => `${x.nome} (${Math.round((x.peso / pesoTotal) * 100)}%)`).join(', ') + '. 50 = no meio do estado.',
      };
    }
  }

  // Parecer em texto corrido
  if (o && mvi) {
    const v = variacao(mvi.ano, mvi.anterior);
    const inst = Math.max(mvi.ano || 0, mvi.anterior || 0) < 10;
    parecer.push(`${c.nomeLocal} registrou ${fmt(mvi.ano)} mortes violentas intencionais em ${periodoAno}` +
      (v != null ? `, ${v > 0 ? 'alta de ' + v : v < 0 ? 'queda de ' + Math.abs(v) : 'mesmo número que'}${v ? '%' : ''} em relação ao mesmo período de ${anos[1]}` : '') +
      (inst ? ' (base pequena, a variação percentual oscila muito)' : '') + '.');
    const tx = taxa(mvi.total12, popLocal);
    if (posicao && tx != null) {
      const r = posicao.taxaEstado ? tx / posicao.taxaEstado : null;
      parecer.push(`Em 12 meses, a taxa é de ${fmt1(tx)} por 100 mil habitantes` +
        (r ? `, ${r >= 1.1 ? fmt1(r) + ' vezes a do estado' : r <= 0.9 ? 'abaixo da do estado' : 'próxima da do estado'} (${fmt1(posicao.taxaEstado)})` : '') +
        `, o que põe o município em ${posicao.rank}º entre ${posicao.total} municípios com mais de 20 mil habitantes.`);
    } else if (tx != null) parecer.push(`Em 12 meses, a taxa é de ${fmt1(tx)} por 100 mil habitantes.`);
    const mulher = ag('mulher'), veic = ag('veiculos'), ten = ag('tentativas'), traf = ag('trafico'), armas = ag('armas');
    const partes: string[] = [];
    if (ten?.ano) partes.push(`${fmt(ten.ano)} tentativas de homicídio`);
    if (mulher?.ano) partes.push(`${fmt(mulher.ano)} casos de violência letal ou sexual contra a mulher`);
    if (veic?.ano) partes.push(`${fmt(veic.ano)} roubos e furtos de veículos`);
    if (traf?.ano) partes.push(`${fmt(traf.ano)} ocorrências de tráfico de drogas`);
    if (armas?.ano) partes.push(`${fmt(armas.ano)} armas de fogo apreendidas`);
    if (partes.length) parecer.push(`No mesmo período, ${partes.join(', ')}.`);
  } else if (!o) {
    parecer.push(`Estatística oficial do Sinesp indisponível para ${c.nomeLocal}: ${c.oficial?.motivo || 'aguardando o servidor'}. O retrato abaixo usa só as notícias, que são complemento.`);
  }
  if (f.todas.length) {
    const top = comBairro.slice(0, 3);
    parecer.push(`Nas notícias dos últimos 12 meses (complemento), ${fmt(f.todas.length)} ocorrências` +
      (top.length ? `; os bairros mais citados são ${top.map((b) => `${b.nome} (${fmt(b.qtd)})`).join(', ')}` : '') +
      (f.zonas[0] ? ` e a principal zona vermelha fica em ${f.zonas[0].nome.split(',')[0]}` : '') + '.');
  }
  if (risco) parecer.push(`Índice de risco local: ${risco.valor} de 100 (${risco.nivel.toLowerCase()}) na comparação com o estado.`);

  // Série: MVI mês a mês (36 meses) com as notícias dos últimos 12 meses no mesmo eixo de tempo
  let serie: Compilado['serie'] = null;
  if (o && mvi && mvi.serie36.length) {
    const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const labels = mvi.serie36.map((_, i) => MES[i % 12] + '/' + String(anos[0] + Math.floor(i / 12)).slice(2));
    const porRotulo = new Map<string, number>();
    f.serie.labels.forEach((l, i) => porRotulo.set(l, soma(Object.values(f.serie.porCat).map((s) => s[i] || 0))));
    serie = { labels, mvi: mvi.serie36, noticias: labels.map((l) => (porRotulo.has(l) ? porRotulo.get(l)! : null)) };
  }

  // Fontes e atualização
  const fontes: Fonte[] = [
    { nome: 'Sinesp · polícias Civil e Militar (SSP)', estado: o ? 'ok' : 'sem', detalhe: o ? `até ${ult}/${o.anoUltimoDado} · importado em ${o.importadoEm}` : c.oficial?.motivo || 'aguardando',
      dica: 'Registros oficiais do Ministério da Justiça, enviados pelas secretarias estaduais. Um robô confere todo dia se há mês novo.' },
    { nome: 'Sinesp · PRF e PF', estado: o ? 'ok' : 'sem', detalhe: o ? 'separados pelo campo abrangência' : '—',
      dica: 'Ocorrências lançadas pelas polícias federais, dentro da mesma base do Sinesp.' },
    { nome: 'IBGE · população', estado: popLocal ? 'ok' : 'parcial', detalhe: popLocal ? `${fmt(popLocal)} hab. (${c.pop?.ano || o?.anoPopulacao || ''})` : 'carregando',
      dica: 'Estimativa populacional usada nas taxas por 100 mil habitantes.' },
    { nome: 'Notícias · Google Notícias e imprensa local', estado: f.todas.length ? 'ok' : 'parcial', detalhe: c.ultimaColeta ? `coletadas em ${c.ultimaColeta}` : 'em coleta',
      dica: 'Complemento: localizam e datam ocorrências, mas não medem o total.' },
  ];
  if (!c.ehEstado) fontes.push({ nome: 'OpenStreetMap · bairros', estado: c.bairrosOsm ? 'ok' : c.bairrosCarregando ? 'parcial' : 'sem',
    detalhe: c.bairrosOsm ? `${fmt(c.bairrosOsm)} bairros` : c.bairrosCarregando ? 'carregando' : 'sem bairros cadastrados', dica: 'Nomes e contornos dos bairros para ligar as notícias ao bairro.' });
  fontes.push({ nome: 'Guarda Municipal e COPOM/190', estado: 'sem', detalhe: 'sem estatística aberta nacional',
    dica: 'Não há base pública nacional. Aparecem só quando citados nas notícias.' });

  // No estado: municípios mais críticos (taxa de MVI, 20 mil hab. ou mais)
  const municipios = c.ehEstado ? linhasMvi.filter((l) => (l.pop || 0) >= MIN_POP && l.taxa != null).sort((a, b) => b.taxa! - a.taxa!).slice(0, 12) : [];

  return { parecer, indicadores, risco, posicao, fontes, serie, municipios };
}

export const corCategoria = (id: string) => CATEGORIA_POR_ID[id]?.cor || '#64748b';
export const nomeCategoria = (id: string) => CATEGORIA_POR_ID[id]?.curto || '';
