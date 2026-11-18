import { CacheDisco } from './cache-disco';
import { CFG } from './dados';
import { Oficial } from './modelos';
import { fetchComTimeout, normalizar } from './util';

/**
 * Estatística oficial (Sinesp) montada no navegador, direto dos arquivos que o robô publica
 * no GitHub (CDN do jsDelivr). Mesma conta do servidor (5_Conector_Sinesp_BI.gs,
 * extrairIndicadoresOficiais_), mas sem esperar o Apps Script: os cartões e o índice aparecem
 * antes das notícias. O servidor continua mandando a mesma estatística como reserva.
 */

interface ArquivoSinesp {
  ano: number; uf: string; importadoEm: number;
  estado: Record<string, number[]>;
  orgaos?: Record<string, Record<string, number[]>>;
  municipios: Record<string, { n: string; e: Record<string, number[]>; o?: Record<string, Record<string, number[]>> }>;
}
interface Manifesto { anos: Record<string, { publicadoAte: number; ufs: string[]; importadoEm: number }> }

const ORDEM = ['homicidio doloso', 'feminicidio', 'roubo seguido de morte', 'latrocinio', 'lesao corporal seguida de morte',
  'morte por intervencao', 'tentativa de homicidio', 'tentativa de feminicidio', 'estupro', 'roubo de veiculo', 'furto de veiculo',
  'roubo de carga', 'roubo a instituicao financeira', 'morte no transito', 'trafico de drogas', 'apreensao de cocaina',
  'apreensao de maconha', 'arma de fogo apreendida', 'mandado de prisao'];
const FORA = ['atendimento pre', 'busca e salvamento', 'combate a incend', 'emissao de alvar', 'realizacao de vistoria', 'pessoa localizada'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const posicao = (nome: string) => { const n = normalizar(nome); const i = ORDEM.findIndex((e) => n.indexOf(e) === 0); return i < 0 ? 999 : i; };
const criminal = (nome: string) => { const n = normalizar(nome); return !FORA.some((e) => n.indexOf(e) === 0); };
const soma = (l: number[]) => l.reduce((a, b) => a + (b || 0), 0);

let manifestoMem: Promise<Manifesto | null> | null = null;
const arquivosMem = new Map<string, Promise<ArquivoSinesp | null>>();

async function baixarJson<T>(nome: string): Promise<T | null> {
  for (const base of CFG.BASES_DADOS) {
    try {
      const r = await fetchComTimeout(base + nome, 15000);
      if (r.ok) return (await r.json()) as T;
    } catch { /* próximo endereço */ }
  }
  return null;
}

/** Manifesto do robô (quais anos e meses já foram publicados). Guardado no disco: abre na hora com o
 *  que está guardado e, se tiver mais de 6 h, confere a versão nova por trás (a próxima abertura já usa). */
function manifesto(): Promise<Manifesto | null> {
  if (!manifestoMem) {
    const baixar = () => baixarJson<Manifesto>('manifesto.json').then((n) => { if (n?.anos) CacheDisco.salvar('SINESP_MANIF1', n); return n; });
    manifestoMem = CacheDisco.obterComIdade<Manifesto>('SINESP_MANIF1').then((g) => {
      if (!g?.dado?.anos) return baixar();
      if (g.em < Date.now() - 6 * 3600000) baixar().then((n) => { if (n?.anos) manifestoMem = Promise.resolve(n); });
      return g.dado;
    });
  }
  return manifestoMem;
}

/** Para a página de saúde das fontes. */
export function manifestoSinesp(): Promise<Manifesto | null> { return manifesto(); }

/** Arquivo de um ano/estado. A chave leva a data de importação: arquivo novo do robô = baixa de novo. */
function arquivo(ano: number, uf: string, importadoEm: number): Promise<ArquivoSinesp | null> {
  const chave = `SINESP1_${ano}_${uf}_${importadoEm}`;
  let p = arquivosMem.get(chave);
  if (!p) {
    p = CacheDisco.obter<ArquivoSinesp>(chave, 40).then((a) => a || baixarJson<ArquivoSinesp>(`sinesp_${ano}_${uf}.json`).then((n) => {
      if (n) CacheDisco.salvar(chave, n); return n;
    }));
    arquivosMem.set(chave, p);
  }
  return p;
}

function municipio(a: ArquivoSinesp, nome: string) {
  const norm = normalizar(nome);
  if (a.municipios[norm]) return a.municipios[norm];
  const compacto = norm.replace(/\s+/g, '');
  const k = Object.keys(a.municipios).find((x) => x.replace(/\s+/g, '') === compacto);
  return k ? a.municipios[k] : null;
}

/** null = não deu para montar (sem rede, sem manifesto): o painel espera o servidor. */
export async function oficialPelaCdn(uf: string, cidade: string, ehEstado: boolean): Promise<Oficial | null> {
  const man = await manifesto();
  if (!man?.anos) return null;
  const anoCorrente = new Date().getFullYear();
  const janela = [anoCorrente - 2, anoCorrente - 1, anoCorrente];
  const publicados = janela.filter((a) => man.anos[String(a)]?.ufs?.includes(uf));
  const lidos = await Promise.all(publicados.map((a) => arquivo(a, uf, man.anos[String(a)].importadoEm)));
  const arquivos: Record<number, ArquivoSinesp> = {};
  publicados.forEach((a, i) => { if (lidos[i]) arquivos[a] = lidos[i]!; });
  const anos = Object.keys(arquivos).map(Number).sort();
  if (!anos.length) return null;
  const base = { fonte: 'Sinesp VDE — Ministério da Justiça e Segurança Pública', escopo: (ehEstado ? 'ESTADO' : 'MUNICIPIO') as 'ESTADO' | 'MUNICIPIO' };

  let fimAno = 0, fimMes = -1;
  anos.forEach((ano) => {
    const est = arquivos[ano].estado;
    Object.keys(est).forEach((ev) => est[ev].forEach((v, m) => { if (v > 0 && (ano > fimAno || (ano === fimAno && m > fimMes))) { fimAno = ano; fimMes = m; } }));
  });
  const dadosAno = (ano: number) => { const a = arquivos[ano]; if (!a) return null; return ehEstado ? a.estado : municipio(a, cidade)?.e || null; };
  const orgaosAno = (ano: number) => { const a = arquivos[ano]; if (!a) return null; return ehEstado ? a.orgaos || null : municipio(a, cidade)?.o || null; };
  if (!ehEstado && !anos.some((a) => dadosAno(a))) return { ...base, disponivel: false, motivo: 'O Sinesp não traz registros para este município no período importado.', eventos: [] };

  const meses: { ano: number; mes: number }[] = [];
  for (let k = 23; k >= 0; k--) { const d = new Date(fimAno, fimMes - k, 1); meses.push({ ano: d.getFullYear(), mes: d.getMonth() }); }
  const eventos: Record<string, number[]> = {};
  meses.forEach((pm, idx) => {
    const d = dadosAno(pm.ano); if (!d) return;
    Object.keys(d).forEach((ev) => { const s = eventos[ev] || (eventos[ev] = new Array(24).fill(0)); s[idx] += d[ev][pm.mes] || 0; });
  });
  const federais = (ev: string) => {
    const r: Record<string, number> = {};
    meses.slice(12).forEach((pm) => {
      const o = orgaosAno(pm.ano); if (!o) return;
      Object.keys(o).forEach((org) => { const v = o[org][ev] ? o[org][ev][pm.mes] || 0 : 0; if (v) r[org] = (r[org] || 0) + v; });
    });
    return Object.keys(r).length ? r : null;
  };
  const porAno = (ev: string) => janela.map((ano) => { const d = dadosAno(ano); if (!d) return null; return soma((d[ev] || []).slice(0, ano === fimAno ? fimMes + 1 : 12)); });
  const serie36 = (ev: string) => {
    const s: number[] = [];
    janela.forEach((ano) => {
      if (ano > fimAno) return;
      const d = dadosAno(ano); const lim = ano === fimAno ? fimMes + 1 : 12;
      for (let m = 0; m < lim; m++) s.push(d && d[ev] ? d[ev][m] || 0 : 0);
    });
    return s;
  };
  const parcialAnterior = (ev: string) => { const d = dadosAno(fimAno - 1); return d ? soma((d[ev] || []).slice(0, fimMes + 1)) : null; };
  const temAnterior = anos.includes(meses[0].ano);
  const lista = Object.keys(eventos).filter(criminal).map((ev) => {
    const s = eventos[ev]; const ult = s.slice(12);
    const e: any = { nome: ev, total: soma(ult), anterior: temAnterior ? soma(s.slice(0, 12)) : null, serie: ult,
      porAno: porAno(ev), parcialAnterior: parcialAnterior(ev), serie36: serie36(ev), federais: federais(ev), taxa: null };
    if (!ehEstado) {
      let tot = 0;
      meses.slice(12).forEach((pm) => { const a = arquivos[pm.ano]; if (a?.estado[ev]) tot += a.estado[ev][pm.mes] || 0; });
      e.totalEstado = tot;
    }
    return e;
  }).filter((e) => e.total > 0 || e.porAno.some((v: number | null) => (v || 0) > 0))
    .sort((a, b) => posicao(a.nome) - posicao(b.nome) || b.total - a.total);

  const ultimo = arquivos[anos[anos.length - 1]];
  const imp = new Date(ultimo.importadoEm);
  return {
    ...base,
    populacao: null, codigoIbge: null, anoPopulacao: null,
    fimMesIdx: fimMes,
    disponivel: lista.length > 0,
    motivo: lista.length ? '' : 'Sem registros nos últimos 3 anos.',
    periodo: MESES[meses[12].mes] + '/' + meses[12].ano + ' a ' + MESES[fimMes] + '/' + fimAno,
    meses: meses.slice(12).map((pm) => MESES[pm.mes] + '/' + String(pm.ano).slice(2)),
    anos: janela,
    ultimoMes: MESES[fimMes],
    periodoTresAnos: 'jan/' + janela[0] + ' a ' + MESES[fimMes] + '/' + fimAno,
    anoUltimoDado: fimAno,
    importadoEm: String(imp.getDate()).padStart(2, '0') + '/' + String(imp.getMonth() + 1).padStart(2, '0') + '/' + imp.getFullYear(),
    eventos: lista.slice(0, 24),
  };
}
