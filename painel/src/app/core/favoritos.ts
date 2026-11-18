import { computed, Injectable, signal } from '@angular/core';
import { ESTADOS } from './dados';
import { Servidor } from './servidor';
import { gravarLocal, lerLocal, normalizar } from './util';

/** Cidade ou estado salvo (nome = 'ESTADO_INTEIRO' para o estado). */
export interface Favorito { uf: string; nome: string }

const CHAVE = 'MAPA_SEG_FAVORITOS';
const MAX = 30;
const igual = (a: Favorito, b: Favorito) => a.uf === b.uf && normalizar(a.nome) === normalizar(b.nome);

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
    this.lista.update((l) => l.filter((g) => !igual(g, f)));
    this.guardar();
    this.enviar();
  }

  readonly rotulos = computed(() => this.lista().map((f) => ({
    ...f, rotulo: f.nome === 'ESTADO_INTEIRO' ? 'Estado: ' + (ESTADOS[f.uf]?.nome || f.uf) : f.nome,
  })));

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
    return Array.isArray(l) ? l.filter((f) => f && ESTADOS[f.uf] && f.nome).slice(0, MAX) : [];
  } catch { return []; }
}
