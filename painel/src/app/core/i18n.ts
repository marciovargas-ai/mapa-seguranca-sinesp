import { signal } from '@angular/core';
import { EN } from './i18n-en';
import { gravarLocal, lerLocal } from './util';

/**
 * Tradução do painel (português do Brasil ↔ inglês americano).
 * O código continua escrito em português; com o inglês ligado, um observador troca na tela
 * cada texto que está no dicionário (core/i18n-en.ts). Textos com valores ("120 ocorrências")
 * casam por modelo ("{0} ocorrências"), e os números passam para o formato americano.
 * Conteúdo de fora (manchetes, nomes de lugar, relatos) não está no dicionário e fica como veio.
 */
export type Idioma = 'pt' | 'en';
const CHAVE = 'MAPA_IDIOMA';

function idiomaInicial(): Idioma {
  const salvo = lerLocal(CHAVE);
  if (salvo === 'pt' || salvo === 'en') return salvo;
  return typeof navigator !== 'undefined' && /^en\b/i.test(navigator.language || '') ? 'en' : 'pt';
}

export const idioma = signal<Idioma>(idiomaInicial());

export function definirIdioma(i: Idioma): void {
  if (i === idioma()) return;
  idioma.set(i);
  gravarLocal(CHAVE, i);
  document.documentElement.lang = i === 'en' ? 'en-US' : 'pt-BR';
  if (i === 'en') traduzirArvore(document.body); else restaurarTudo();
}

// ---------- Dicionário: exato, por números e por modelo ----------
interface Modelo { re: RegExp; en: string; pista: string }
const modelos: Modelo[] = [];
const porNumeros = new Map<string, string>();
for (const [pt, en] of Object.entries(EN)) {
  if (!/\{\d+\}/.test(pt)) continue;
  porNumeros.set(pt, en);
  const partes = pt.split(/(\{\d+\})/);
  const literais = partes.filter((p) => p && !/^\{\d+\}$/.test(p));
  const pista = (literais.sort((a, b) => b.length - a.length)[0] || '').replace(/\.$/, '');  // sem o ponto final, que pode faltar
  if (pista.trim().length < 3) continue;  // modelo só com valores casaria qualquer coisa
  const corpo = partes.map((p) => (/^\{\d+\}$/.test(p) ? '(.+?)' : p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('');
  modelos.push({ re: new RegExp('^' + corpo + '$', 's'), en, pista });
}
// O modelo mais longo vence ("A em {2}, {3} em relação a {4}." antes de "A em {2}")
modelos.sort((a, b) => b.re.source.length - a.re.source.length);

const RE_NUMERO = /\d{1,2}\/\d{1,2}\/\d{4}|-?\d+(?:[.,]\d+)*/g;

/** "1.234,5" → "1,234.5"; "18/11/2026" → "11/18/2026"; "18/11" fica (pode ser mês/ano). */
function numeroEn(v: string): string {
  const d = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (d) return `${d[2]}/${d[1]}/${d[3]}`;
  if (/^-?\d+(?:[.,]\d+)*$/.test(v)) return v.replace(/[.,]/g, (c) => (c === '.' ? ',' : '.'));
  return v;
}

const MESES_EN: Record<string, string> = { jan: 'Jan', fev: 'Feb', mar: 'Mar', abr: 'Apr', mai: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug', set: 'Sep', out: 'Oct', nov: 'Nov', dez: 'Dec' };
/** "out/2025–set/2026" → "Oct/2025–Sep/2026"; "jan a set/2026" → "Jan to Sep/2026". */
function mesesEn(t: string): string {
  return t.replace(/\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)(?=\/\d{4}|\s+a\s+(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/\d{4})/gi, (m) => MESES_EN[m.toLowerCase()] || m)
    .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) a (?=(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\/)/g, '$1 to ')
    .replace(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\/\d{4}) a (?=(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\/\d{4})/g, '$1 to ')
    .replace(/\bem (?=(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\/\d{4})/g, 'in ');
}

/** Quantas palavras do texto original sobraram sem tradução: escolhe a melhor entre várias traduções possíveis. */
function palavras(s: string): string[] { return s.toLowerCase().match(/[a-zà-ú]{2,}/g) || []; }
function sobraPt(orig: Set<string>, s: string): number { let n = 0; for (const w of palavras(s)) if (orig.has(w)) n++; return n; }

const MAX_PROF = 6;
const RE_SO_NUMERO = /^[\d\s.,/:%+−-]+$/;

/** Valor numérico de um modelo: formato americano ("1.234,5" → "1,234.5"; "26/10" → "10/26"). */
function valorNumericoEn(v: string): string {
  return v.replace(/\b(\d{1,2})\/(\d{1,2})\b(?![\/\d])/g, (m, d, mes) => (+d <= 31 && +mes <= 12 ? `${mes}/${d}` : m))
    .replace(RE_NUMERO, numeroEn);
}

function preencher(en: string, valores: string[], prof: number): string {
  return en.replace(/\{(\d+)\}/g, (_, i) => {
    const v = valores[+i] ?? '';
    if (RE_SO_NUMERO.test(v)) return /\d{1,2}\/\d{1,2}\/\d{4}/.test(v) ? v.replace(RE_NUMERO, numeroEn) : valorNumericoEn(v);
    const limpo = v.trim();
    if (!limpo || prof >= MAX_PROF) return mesesEn(v);
    const r = traduzirLimpo(limpo, prof + 1);
    return r == null ? mesesEn(v) : v.replace(limpo, r);
  });
}

/**
 * Texto composto: separa primeiro por frase, depois por ";" e "·", depois por ":" e "—" e por fim pela
 * lista ("a, b e c"); cada parte é traduzida sozinha e pode ser cortada de novo no nível seguinte.
 */
const NIVEIS_CORTE = [
  /(\.\s+(?=[A-ZÀ-Ú0-9(]))/,
  /(;\s|\s·\s)/,
  /(:\s|\s—\s)/,
  /(,\s|\se\s)/,
];
function traduzirPartes(t: string, prof: number): string | null {
  let partes: string[] = [];
  for (const re of NIVEIS_CORTE) { partes = t.split(re); if (partes.length >= 3) break; }
  if (partes.length < 3) return null;
  let mudou = false;
  const saida = partes.map((p, i) => {
    if (i % 2 === 1) return p === ' e ' ? ' and ' : p;   // o "e" só conta se outra parte mudou
    const limpo = p.trim();
    if (!limpo) return p;
    const r = traduzirLimpo(limpo, prof + 1);
    if (r != null) { mudou = true; return p.replace(limpo, r); }
    const m = mesesEn(p);
    if (m !== p) mudou = true;
    return m;
  });
  return mudou ? saida.join('') : null;
}

const caches = Array.from({ length: MAX_PROF + 1 }, () => new Map<string, string | null>());

/**
 * Tradução de um texto já sem espaços nas pontas; null quando não há.
 * Ordem: frase exata, frase com números trocados, e por fim a melhor entre modelos com lacunas
 * e a tradução parte a parte (a que deixar menos português vence).
 */
function traduzirLimpo(t: string, prof = 0): string | null {
  const cache = caches[Math.min(prof, MAX_PROF)];
  if (cache.has(t)) return cache.get(t)!;
  let r: string | null = EN[t] ?? null;
  // Mesma frase com ou sem o ponto final (partes cortadas de um texto maior perdem o ponto)
  if (r == null && t.endsWith('.') && EN[t.slice(0, -1)]) r = EN[t.slice(0, -1)].replace(/\.?$/, '.');
  if (r == null && !t.endsWith('.') && EN[t + '.']) r = EN[t + '.'].replace(/\.$/, '');
  if (r == null && /\d/.test(t)) {
    // Só números trocando: "120 ocorrências" → "{0} ocorrências"
    const nums: string[] = [];
    const chave = t.replace(RE_NUMERO, (m) => '{' + (nums.push(m) - 1) + '}');
    const en = porNumeros.get(chave) ?? (chave.endsWith('.') ? porNumeros.get(chave.slice(0, -1))?.replace(/\.?$/, '.') : porNumeros.get(chave + '.')?.replace(/\.$/, ''));
    if (en) r = preencher(en, nums, prof);
    else if (RE_SO_NUMERO.test(t)) r = valorNumericoEn(t);
  }
  if (r == null) {
    // Pontuação de ligação no início (". Índice 100 = ...", "; em alta ...")
    const lig = t.match(/^([;,.·:—]\s*)(\S[\s\S]*)$/);
    if (lig) { const resto = traduzirLimpo(lig[2], prof); if (resto != null) r = lig[1] + resto; }
  }
  if (r == null) {
    const candidatos: string[] = [];
    if (t.length > 3) {
      let n = 0;
      const semPonto = !t.endsWith('.');
      for (const m of modelos) {
        if (!t.includes(m.pista)) continue;
        const g = m.re.exec(t) || (semPonto ? m.re.exec(t + '.') : null);
        if (g) {
          const c = preencher(m.en, g.slice(1), prof);
          candidatos.push(semPonto && !m.re.exec(t) ? c.replace(/\.$/, '') : c);
          if (++n >= 4) break;
        }
      }
    }
    if (prof < MAX_PROF) { const p = traduzirPartes(t, prof); if (p != null) candidatos.push(p); }
    const m = mesesEn(t); if (m !== t) candidatos.push(m);
    if (candidatos.length) {
      const orig = new Set(palavras(t));
      let nota = Infinity;
      for (const c of candidatos) { const s = sobraPt(orig, c); if (s < nota) { nota = s; r = c; } }
    }
  }
  if (cache.size > 5000) cache.clear();
  cache.set(t, r);
  return r;
}

/** Para textos montados no código (gráficos, títulos de janela): devolve o texto no idioma atual. */
export function t(pt: string, ...valores: (string | number)[]): string {
  const texto = valores.length ? pt.replace(/\{(\d+)\}/g, (_, i) => String(valores[+i] ?? '')) : pt;
  if (idioma() !== 'en') return texto;
  if (valores.length && EN[pt]) return preencher(EN[pt], valores.map(String), 0);
  return traduzirTexto(texto);
}

/** Rótulo de gráfico ("jan/25", "Seg", "Mortes violentas (Sinesp)") no idioma atual. */
export function rotuloGrafico(s: unknown): unknown {
  if (typeof s !== 'string' || idioma() !== 'en') return s;
  const m = s.match(/^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)(\/\d{2,4})?$/i);
  if (m) return (MESES_EN[m[1].toLowerCase()] || m[1]) + (m[2] || '');
  return traduzirTexto(s);
}

/** Cópia da configuração de um gráfico Chart.js com rótulos, legendas e títulos traduzidos. */
export function traduzirGrafico<T extends { data: any; options?: any }>(cfg: T): T {
  if (idioma() !== 'en') return cfg;
  const data = { ...cfg.data, labels: (cfg.data?.labels || []).map(rotuloGrafico),
    datasets: (cfg.data?.datasets || []).map((d: any) => ({ ...d, label: rotuloGrafico(d.label) })) };
  let options = cfg.options;
  if (options?.scales) {
    const scales: any = {};
    for (const [k, v] of Object.entries<any>(options.scales)) scales[k] = v?.title?.text ? { ...v, title: { ...v.title, text: rotuloGrafico(v.title.text) } } : v;
    options = { ...options, scales };
  }
  return { ...cfg, data, options };
}

/** Traduz mantendo os espaços das pontas. */
export function traduzirTexto(s: string): string {
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  if (!m[2] || !/[A-Za-zÀ-ú\d]/.test(m[2])) return s;
  const r = traduzirLimpo(m[2].replace(/\s+/g, ' '));
  return r == null ? s : m[1] + r + m[3];
}

// ---------- Tela: observador que traduz o que aparece ----------
const PULAR = 'script,style,textarea,input,mat-icon,.material-symbols-outlined,.material-icons,[translate="no"],.notranslate,code,pre';
const ATRIBUTOS = ['title', 'aria-label', 'placeholder', 'alt'];
/** Campos de texto não têm o conteúdo traduzido, mas o placeholder e a dica sim. */
const PULAR_ATRIBUTOS = PULAR.replace('textarea,input,', '');
const originais = new Map<Node, { pt: string; en: string }>();
const attrOriginais = new Map<Element, Record<string, { pt: string; en: string }>>();
let observador: MutationObserver | null = null;

function pular(el: Element | null): boolean {
  return !!el && !!el.closest(PULAR);
}

function traduzirNo(n: Text): void {
  const reg = originais.get(n);
  const atual = n.data;
  if (reg && atual === reg.en) return;            // já traduzido por nós
  if (pular(n.parentElement)) return;
  const en = traduzirTexto(atual);
  if (en !== atual) { originais.set(n, { pt: atual, en }); n.data = en; }
  else if (reg) originais.delete(n);
}

function traduzirAtributos(el: Element): void {
  if (el.closest(PULAR_ATRIBUTOS)) return;
  for (const a of ATRIBUTOS) {
    const v = el.getAttribute(a);
    if (!v) continue;
    const regs = attrOriginais.get(el) || {};
    if (regs[a] && regs[a].en === v) continue;
    const en = traduzirTexto(v);
    if (en !== v) { regs[a] = { pt: v, en }; attrOriginais.set(el, regs); el.setAttribute(a, en); }
  }
}

function traduzirArvore(raiz: Node): void {
  if (idioma() !== 'en' || !raiz) return;
  if (raiz.nodeType === Node.TEXT_NODE) { traduzirNo(raiz as Text); return; }
  if (raiz.nodeType !== Node.ELEMENT_NODE && raiz.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  if (raiz.nodeType === Node.ELEMENT_NODE) { traduzirAtributos(raiz as Element); if (pular(raiz as Element)) return; }
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n: Node | null;
  while ((n = w.nextNode())) {
    if (n.nodeType === Node.TEXT_NODE) traduzirNo(n as Text);
    else traduzirAtributos(n as Element);
  }
}

function restaurarTudo(): void {
  for (const [n, r] of originais) if ((n as Text).data === r.en) (n as Text).data = r.pt;
  originais.clear();
  for (const [el, regs] of attrOriginais) for (const a of Object.keys(regs)) if (el.getAttribute(a) === regs[a].en) el.setAttribute(a, regs[a].pt);
  attrOriginais.clear();
}

let pendentes: Node[] = [];
let agendado = false;
function processar(): void {
  agendado = false;
  const lista = pendentes; pendentes = [];
  for (const n of lista) if (n.isConnected) traduzirArvore(n);
  // Esquece nós que saíram da tela
  if (originais.size > 20000) for (const n of originais.keys()) if (!n.isConnected) originais.delete(n);
}

/** Liga o observador uma vez, no início do app. */
export function iniciarTraducao(): void {
  if (observador || typeof MutationObserver === 'undefined') return;
  document.documentElement.lang = idioma() === 'en' ? 'en-US' : 'pt-BR';
  observador = new MutationObserver((muts) => {
    if (idioma() !== 'en') return;
    for (const m of muts) {
      if (m.type === 'childList') m.addedNodes.forEach((n) => pendentes.push(n));
      else if (m.type === 'characterData') pendentes.push(m.target);
      else if (m.type === 'attributes') pendentes.push(m.target);
    }
    if (!agendado) { agendado = true; queueMicrotask(processar); }
  });
  observador.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
  if (idioma() === 'en') traduzirArvore(document.body);
}
