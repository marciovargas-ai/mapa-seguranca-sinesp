import { Oficial } from './modelos';
import { MESES } from './util';

/**
 * Filtro de período aplicado também à estatística oficial (Sinesp, mensal):
 * 30 dias = último mês publicado, 90 dias = 3 meses, 6 meses, 12 meses,
 * sempre contra os mesmos meses do ano anterior.
 */
export function mesesDoPeriodo(dias: number): number {
  return dias <= 31 ? 1 : dias <= 95 ? 3 : dias <= 190 ? 6 : 12;
}

function rotuloMes(anos: number[], idx: number): string {
  const a = anos[Math.floor(idx / 12)];
  return `${MESES[((idx % 12) + 12) % 12]}/${a}`;
}

export function aplicarPeriodo(o: Oficial | null, meses: number): Oficial | null {
  if (!o?.disponivel || !o.anos?.length || !o.eventos?.length) return o;
  const anoIdx = Math.max(0, o.anos.indexOf(o.anoUltimoDado ?? o.anos[o.anos.length - 1]));
  const fim = anoIdx * 12 + (o.fimMesIdx ?? 11);
  const ini = fim - meses + 1;
  if (ini - 12 < 0) return o; // série curta: mantém o acumulado do ano
  const soma = (s: number[], a: number, b: number) => { let t = 0; for (let i = a; i <= b; i++) t += s[i] || 0; return t; };
  const rotulo = (a: number, b: number) => (a === b ? rotuloMes(o.anos!, a) : `${rotuloMes(o.anos!, a)}–${rotuloMes(o.anos!, b)}`);
  return {
    ...o, mesesSel: meses, rotuloSel: rotulo(ini, fim), rotuloAnt: rotulo(ini - 12, fim - 12),
    eventos: o.eventos.map((e) => e.serie36?.length > fim
      ? { ...e, sel: soma(e.serie36, ini, fim), selAnterior: soma(e.serie36, ini - 12, fim - 12) }
      : { ...e, sel: e.porAno[2], selAnterior: e.parcialAnterior }),
  };
}
