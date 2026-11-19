import { computed, Injectable, signal } from '@angular/core';
import { ESTADOS } from './dados';
import { Servidor } from './servidor';
import { gravarLocal, lerLocal, normalizar } from './util';

/**
 * Cidade ou estado salvo (nome = 'ESTADO_INTEIRO' para o estado), ou pino (tipo 'pino'): nome dado pela pessoa,
 * cidade, endereço, coordenada, raio da análise, quem criou (por), quando (em) e se está nos alertas por e-mail (até 'ate').
 */
export interface Favorito {
  uf: string; nome: string;
  tipo?: 'pino'; id?: string; cidade?: string; endereco?: string; lat?: number; lng?: number; raio?: number;
  por?: string; em?: number; alerta?: boolean; ate?: number;
}

const CHAVE = 'MAPA_SEG_FAVORITOS';
const MAX = 60;
export const igualFavorito = (a: Favorito, b: Favorito) => (a.tipo === 'pino' || b.tipo === 'pino')
  ? a.tipo === b.tipo && a.id === b.id
  : a.uf === b.uf && normalizar(a.nome) === normalizar(b.nome);
const igual = igualFavorito;

/** "Pino Imóvel Centro · Campinas/SP · por ana@shopee.com em 19/11/2026" */
export function dataCurta(ms?: number): string {
  if (!ms) return '';
  const d = new Date(ms);
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

/**
 * Favoritos do usuário. Com a conta @shopee.com identificada pelo Apps Script, ficam no servidor
 * (acompanham a pessoa em qualquer aparelho); sem conta, ficam no navegador. Na primeira vez com
 * conta, o que estava no navegador é somado ao que está na conta.
 */
@Injectable({ providedIn: 'root' })
export class Favoritos {
  readonly lista = signal<Favorito[]>(lerGuardados());
  readonly conta = signal('');
  readonly sincronizando = signal(false);

  constructor() {
    Servidor.favoritos().then((r) => {
      if (!r?.conta || !Array.isArray(r.favoritos)) return;
      this.conta.set(r.conta);
      const local = this.lista();
      const juntos = [...r.favoritos];
      for (const f of local) if (!juntos.some((g) => igual(f, g))) juntos.push(f);
      this.lista.set(juntos.slice(0, MAX));
      this.guardar();
      if (juntos.length !== r.favoritos.length) this.enviar();
    }).catch(() => undefined);
  }

  ehFavorito(uf: string, nome: string): boolean {
    return this.lista().some((f) => igual(f, { uf, nome }));
  }

  alternar(uf: string, nome: string): boolean {
    const alvo = { uf, nome };
    const tinha = this.ehFavorito(uf, nome);
    this.lista.update((l) => (tinha ? l.filter((f) => !igual(f, alvo)) : [alvo, ...l].slice(0, MAX)));
    this.guardar();
    this.enviar();
    return !tinha;
  }

  remover(f: Favorito): void {
    if (f.tipo === 'pino') { this.removerPino(f); return; }
    this.lista.update((l) => l.filter((g) => !igual(g, f)));
    this.guardar();
    this.enviar();
  }

  readonly rotulos = computed(() => this.lista().map((f) => ({
    ...f, rotulo: f.nome === 'ESTADO_INTEIRO' ? 'Estado: ' + (ESTADOS[f.uf]?.nome || f.uf) : f.nome,
  })));

  /**
   * Salva um pino com o nome dado pela pessoa. Com a conta @shopee.com, grava no servidor (com quem criou e a data)
   * e, se pedido, liga o alerta por e-mail; sem conta, fica só neste navegador e sem alerta.
   */
  async adicionarPino(pino: Favorito, alertar: boolean, prazoDias: number): Promise<{ ok: boolean; alerta: boolean; erro?: string; pino: Favorito }> {
    const local: Favorito = { ...pino, tipo: 'pino', id: pino.id || 'p' + Date.now().toString(36), em: pino.em || Date.now(), por: this.conta() || pino.por || '' };
    if (!this.conta()) {
      this.lista.update((l) => [{ ...local, alerta: false }, ...l.filter((f) => !igual(f, local))].slice(0, MAX));
      this.guardar();
      return { ok: true, alerta: false, pino: local };
    }
    this.sincronizando.set(true);
    try {
      const r = await Servidor.adicionarPino(local, alertar, prazoDias);
      if (r?.ok && Array.isArray(r.favoritos)) { this.lista.set(r.favoritos.slice(0, MAX)); this.guardar(); }
      return { ok: !!r?.ok, alerta: !!r?.alerta, erro: r?.erro, pino: r?.pino || local };
    } finally { this.sincronizando.set(false); }
  }

  removerPino(f: Favorito): void {
    this.lista.update((l) => l.filter((g) => !igual(g, f)));
    this.guardar();
    if (this.conta() && f.id) Servidor.removerPino(f.id).catch(() => undefined);
  }

  private guardar(): void { gravarLocal(CHAVE, JSON.stringify(this.lista())); }

  private enviar(): void {
    if (!this.conta()) return;
    this.sincronizando.set(true);
    Servidor.salvarFavoritos(this.lista()).catch(() => undefined).finally(() => this.sincronizando.set(false));
  }
}

function lerGuardados(): Favorito[] {
  try {
    const l = JSON.parse(lerLocal(CHAVE) || '[]');
    return Array.isArray(l) ? l.filter((f) => f && ESTADOS[f.uf] && f.nome && (f.tipo !== 'pino' || (f.id && f.lat != null))).slice(0, MAX) : [];
  } catch { return []; }
}
