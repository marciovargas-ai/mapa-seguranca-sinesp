import { CFG } from './dados';

export const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function normalizar(s: unknown): string {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const fmt = (n: number | null | undefined) => Number(n || 0).toLocaleString('pt-BR');
export const fmt1 = (n: number | null | undefined) =>
  n == null ? '—' : Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const pct = (parte: number, total: number) => (total > 0 ? Math.round((parte / total) * 100) : 0);

/** Variação percentual inteira; null quando não há base de comparação. */
export function variacao(atual: number | null, anterior: number | null | undefined): number | null {
  if (atual == null || anterior == null || anterior === 0) return null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

export function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

export function fetchComTimeout(url: string, ms = CFG.TIMEOUT_REDE_EXTERNA_MS): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

/** Data AAAAMMDD de "hoje menos n dias" (comparável com o campo ts das ocorrências). */
export function tsDiasAtras(n: number): number {
  const d = new Date(Date.now() - n * 86400000);
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export const tsParaData = (ts: number) => new Date(Math.floor(ts / 10000), (Math.floor(ts / 100) % 100) - 1, ts % 100);
export const idadeDias = (ts: number) => Math.max(0, (Date.now() - tsParaData(ts).getTime()) / 86400000);

export function rotuloPeriodo(dias: number): string {
  return ({ 30: '30 dias', 90: '90 dias', 180: '6 meses', 365: '12 meses' } as Record<number, string>)[dias] || dias + ' dias';
}

export function urlSegura(u: unknown): string {
  return /^https?:\/\//i.test(String(u || '')) ? String(u) : '#';
}

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function lerLocal(chave: string): string | null {
  try { return localStorage.getItem(chave); } catch { return null; }
}
export function gravarLocal(chave: string, valor: string): void {
  try { localStorage.setItem(chave, valor); } catch { /* armazenamento indisponível */ }
}
