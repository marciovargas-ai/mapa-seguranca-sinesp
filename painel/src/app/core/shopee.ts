import { Injectable, computed, signal } from '@angular/core';
import { Servidor } from './servidor';
import { gravarLocal, lerLocal } from './util';

export interface NoticiaShopee {
  id: string; titulo: string; resumo: string; link: string; veiculo: string;
  ts: number; data: string; achadoEm: number; termo: string; tipo: string; seguranca: boolean; ufs: string[];
}

const CHAVE_VISTO = 'MAPA_SEG_SHOPEE_VISTO';
const CHAVE_LIDAS = 'MAPA_SEG_SHOPEE_LIDAS';
const MINUTOS_CONSULTA = 3;
/** Na primeira visita, só o que entrou nos últimos 3 dias conta como novidade. */
const DIAS_NOVIDADE_INICIAL = 3;

/** Monitor de notícias que citam a Shopee: lista, contador de não lidas e avisos (popup). */
@Injectable({ providedIn: 'root' })
export class MonitorShopee {
  readonly itens = signal<NoticiaShopee[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly atualizado = signal(0);
  readonly termos = signal<string[]>([]);
  readonly avisos = signal<{ chave: number; itens: NoticiaShopee[] }[]>([]);
  /** Tudo que entrou depois disso é "não lido" (exceto o que foi aberto um a um). */
  private readonly vistoAte = signal(Number(lerLocal(CHAVE_VISTO)) || Date.now() - DIAS_NOVIDADE_INICIAL * 86400000);
  private readonly lidas = signal<Set<string>>(new Set((lerLocal(CHAVE_LIDAS) || '').split(',').filter(Boolean)));
  private iniciado = false;
  private seq = 0;

  readonly naoLidas = computed(() => {
    const v = this.vistoAte(), l = this.lidas();
    return this.itens().filter((i) => i.achadoEm > v && !l.has(i.id));
  });

  iniciar(): void {
    if (this.iniciado) return;
    this.iniciado = true;
    this.consultar(true);
    setInterval(() => this.consultar(false), MINUTOS_CONSULTA * 60000);
  }

  ehNova(i: NoticiaShopee): boolean { return i.achadoEm > this.vistoAte() && !this.lidas().has(i.id); }

  marcarLida(i: NoticiaShopee): void {
    if (!this.ehNova(i)) return;
    const s = new Set(this.lidas()); s.add(i.id);
    this.lidas.set(s);
    // Guarda só os ids mais recentes (cabe no cookie de reserva do Google Sites)
    gravarLocal(CHAVE_LIDAS, [...s].slice(-40).join(','));
  }

  marcarTodasLidas(): void {
    const max = this.itens().reduce((m, i) => Math.max(m, i.achadoEm), Date.now());
    this.vistoAte.set(max);
    this.lidas.set(new Set());
    gravarLocal(CHAVE_VISTO, String(max));
    gravarLocal(CHAVE_LIDAS, '');
    this.avisos.set([]);
  }

  fecharAviso(chave: number): void { this.avisos.update((l) => l.filter((a) => a.chave !== chave)); }

  consultar(primeira: boolean): void {
    if (this.carregando()) return;
    this.carregando.set(true);
    const desde = this.itens().reduce((m, i) => Math.max(m, i.achadoEm), 0);
    Servidor.shopee(desde).then((r) => {
      if (!r?.ok) throw new Error(r?.erro || 'sem resposta');
      this.erro.set('');
      this.atualizado.set(r.atualizado || 0);
      if (r.termos) this.termos.set(r.termos);
      const conhecidos = new Set(this.itens().map((i) => i.id));
      const novos = ((r.itens || []) as NoticiaShopee[]).filter((i) => !conhecidos.has(i.id));
      if (!novos.length) return;
      this.itens.update((l) => [...novos, ...l].sort((a, b) => b.ts - a.ts).slice(0, 600));
      // Popup: na abertura, um resumo do que não foi lido; depois, cada lote novo
      const avisar = primeira ? this.naoLidas() : novos.filter((i) => this.ehNova(i));
      if (avisar.length) this.avisar(avisar);
    }).catch((e) => this.erro.set('Não foi possível buscar as notícias da Shopee: ' + (e?.message || e)))
      .finally(() => this.carregando.set(false));
  }

  private avisar(itens: NoticiaShopee[]): void {
    const chave = ++this.seq;
    const ordenados = itens.slice().sort((a, b) => Number(b.seguranca) - Number(a.seguranca) || b.ts - a.ts);
    this.avisos.update((l) => [...l.slice(-2), { chave, itens: ordenados }]);
    setTimeout(() => this.fecharAviso(chave), 12000);
    // Notificação do sistema operacional, quando o navegador já tiver permitido
    try {
      const N = (window as any).Notification;
      if (N && N.permission === 'granted') {
        const t = itens.length === 1 ? itens[0].titulo : `${itens.length} notícias novas citam a Shopee`;
        new N('Shopee nas notícias', { body: t, tag: 'mapa-shopee' });
      }
    } catch { /* bloqueado no iframe */ }
  }

  /** Para o agente de IA: as notícias mais recentes, compactas. */
  paraContexto(): unknown {
    const l = this.itens();
    if (!l.length) return null;
    return {
      descricao: 'Notícias do Brasil inteiro que citam a Shopee (monitor do portal: motoristas, entregadores, cargas, funcionários, roubos, furtos)',
      total: l.length,
      recentes: l.slice(0, 25).map((i) => ({ data: i.data, tipo: i.tipo, titulo: i.titulo, veiculo: i.veiculo, estados: i.ufs })),
    };
  }
}
