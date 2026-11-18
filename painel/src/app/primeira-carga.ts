import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PainelStore, PrimeiraCarga } from './core/painel.store';

type Estado = 'feito' | 'ativo' | 'espera';
const ORDEM: PrimeiraCarga['etapa'][] = ['recentes', 'historico', 'bairros', 'pronto'];

/**
 * Aviso da primeira consulta de uma cidade: explica a espera e mostra o andamento de cada etapa.
 * Não bloqueia a tela (os dados oficiais e o mapa já podem ser usados) e some sozinho no fim.
 */
@Component({
  selector: 'app-primeira-carga',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (p(); as p) {
      <section class="cartao-primeira" role="status" aria-live="polite">
        <header>
          <mat-icon>{{ p.etapa === 'pronto' ? 'check_circle' : p.etapa === 'erro' ? 'info' : 'travel_explore' }}</mat-icon>
          <h3>Primeira consulta de <span translate="no">{{ p.cidade }} ({{ p.uf }})</span></h3>
          <button mat-icon-button (click)="store.fecharPrimeiraCarga()" aria-label="Fechar aviso"><mat-icon>close</mat-icon></button>
        </header>
        @if (p.etapa === 'pronto') {
          <p>Pronto: {{ p.noticias }} notícias encontradas em {{ tempo() }}. Nas próximas vezes a cidade abre na hora.</p>
        } @else if (p.etapa === 'erro') {
          <p>A busca de notícias não terminou agora. Os dados oficiais continuam valendo, e o robô tenta de novo em segundo plano.</p>
        } @else {
          <p>Os dados oficiais já estão na tela. Agora o sistema busca 12 meses de notícias em várias fontes e localiza cada uma no mapa.
            Esta espera só acontece na primeira vez que a cidade é consultada: depois ela fica guardada e abre na hora.</p>
        }
        <ol>
          <li class="feito"><mat-icon>check</mat-icon>Estatística oficial (Sinesp) e mapa</li>
          @for (e of etapas(); track e.nome) {
            <li [class]="e.estado">
              @if (e.estado === 'ativo') { <span class="girando"></span> } @else { <mat-icon>{{ e.estado === 'feito' ? 'check' : 'radio_button_unchecked' }}</mat-icon> }
              {{ e.nome }}
            </li>
          }
        </ol>
        @if (p.etapa !== 'pronto' && p.etapa !== 'erro') { <small>Tempo: {{ tempo() }} · você pode usar o painel enquanto isso.</small> }
      </section>
    }
  `,
  styles: `
    :host { display: contents; }  /* não ocupa lugar na grade da página */
    .cartao-primeira { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 1100;
      width: min(440px, calc(100vw - 32px)); background: var(--mat-sys-surface-container-lowest, #fff); color: var(--mat-sys-on-surface, #1f2937);
      border: 1px solid var(--borda-suave, #e5e7eb); border-left: 4px solid #EE4D2D; border-radius: 12px;
      box-shadow: 0 8px 28px rgba(0, 0, 0, .18); padding: 12px 14px 12px 16px; font: var(--mat-sys-body-medium); }
    header { display: flex; align-items: center; gap: 8px; }
    header > mat-icon { color: #EE4D2D; }
    h3 { flex: 1; margin: 0; font: var(--mat-sys-title-small); }
    p { margin: 6px 0 8px; line-height: 1.45; }
    ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
    li { display: flex; align-items: center; gap: 8px; color: var(--mat-sys-on-surface-variant, #6b7280); }
    li mat-icon { font-size: 18px; width: 18px; height: 18px; }
    li.feito { color: var(--mat-sys-on-surface, #1f2937); }
    li.feito mat-icon { color: #16a34a; }
    li.ativo { color: var(--mat-sys-on-surface, #1f2937); font-weight: 600; }
    .girando { width: 14px; height: 14px; margin: 2px; border-radius: 50%; border: 2px solid #fbd0c5; border-top-color: #EE4D2D; animation: girar .8s linear infinite; }
    @keyframes girar { to { transform: rotate(360deg); } }
    small { display: block; margin-top: 8px; color: var(--mat-sys-on-surface-variant, #6b7280); }
    @media (max-width: 600px) { .cartao-primeira { bottom: 84px; } }
  `,
})
export class PrimeiraCargaComponent implements OnDestroy {
  protected readonly store = inject(PainelStore);
  protected readonly p = this.store.primeiraCarga;
  private readonly agora = signal(Date.now());
  private readonly relogio = setInterval(() => { if (this.p()) this.agora.set(Date.now()); }, 1000);
  private fechar: any;

  protected readonly tempo = computed(() => {
    const p = this.p(); if (!p) return '';
    const s = Math.max(0, Math.round((this.agora() - p.inicio) / 1000));
    return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
  });

  protected readonly etapas = computed(() => {
    const p = this.p(); if (!p) return [];
    const atual = p.etapa === 'erro' ? -1 : ORDEM.indexOf(p.etapa);
    const estado = (i: number): Estado => (p.etapa === 'erro' ? 'espera' : i < atual ? 'feito' : i === atual ? 'ativo' : 'espera');
    return [
      { nome: 'Notícias recentes e imprensa local', estado: estado(0) },
      { nome: 'Histórico de 12 meses, mês a mês', estado: estado(1) },
      { nome: 'Bairro de cada notícia (leitura das matérias)', estado: estado(2) },
    ];
  });

  constructor() {
    // No fim, o aviso some sozinho depois de alguns segundos
    effect(() => {
      const etapa = this.p()?.etapa;
      clearTimeout(this.fechar);
      if (etapa === 'pronto' || etapa === 'erro') this.fechar = setTimeout(() => this.store.fecharPrimeiraCarga(), etapa === 'pronto' ? 12000 : 20000);
    });
  }

  ngOnDestroy(): void { clearInterval(this.relogio); clearTimeout(this.fechar); }
}
