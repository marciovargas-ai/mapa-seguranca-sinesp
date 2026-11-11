/** Facções e grupos citados nas manchetes (texto já normalizado: minúsculas, sem acento). */
export const FACCOES: { nome: string; re: RegExp }[] = [
  { nome: 'PCC', re: /\bpcc\b|primeiro comando da capital/ },
  { nome: 'Comando Vermelho', re: /comando vermelho|\bcv\b/ },
  { nome: 'Terceiro Comando Puro', re: /terceiro comando|\btcp\b/ },
  { nome: 'Amigos dos Amigos', re: /amigos dos amigos/ },
  { nome: 'Milícia', re: /\bmilicia|\bmilicianos?\b/ },
  { nome: 'Os Manos', re: /\bos manos\b/ },
  { nome: 'Bala na Cara', re: /bala na cara/ },
  { nome: 'Guardiões do Estado (GDE)', re: /guardioes do estado|\bgde\b/ },
  { nome: 'Sindicato do Crime', re: /sindicato do crime/ },
  { nome: 'Família do Norte', re: /familia do norte|\bfdn\b/ },
  { nome: 'Bonde do Maluco', re: /bonde do maluco|\bbdm\b/ },
  { nome: 'PGC', re: /primeiro grupo catarinense|\bpgc\b/ },
  { nome: 'Comando Classe A', re: /comando classe a/ },
  { nome: 'Facção (sem nome)', re: /\bfac(c|ç)(ao|oes)\b/ },
];
