import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PainelStore } from '../core/painel.store';

declare const Chart: any;

/** Selo de variação: ↑ vermelho (piora), ↓ verde (melhora). */
@Component({
  selector: 'app-delta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @switch (estado().tipo) {
      @case ('sem') { <span class="delta igual">{{ semTexto() }}</span> }
      @case ('novo') { <span class="delta sobe"><mat-icon>arrow_upward</mat-icon>novo</span> }
      @case ('igual') { <span class="delta igual">= estável</span> }
      @case ('sobe') { <span class="delta sobe"><mat-icon>arrow_upward</mat-icon>{{ estado().v }}%</span> }
      @case ('desce') { <span class="delta desce"><mat-icon>arrow_downward</mat-icon>{{ estado().v }}%</span> }
    }
  `,
  styles: `
    .delta { display: inline-flex; align-items: center; gap: 1px; font: var(--mat-sys-label-medium); font-weight: 600; padding: 1px 7px 1px 4px;
      border-radius: 999px; white-space: nowrap; line-height: 18px; }
    .delta mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .sobe { color: var(--cor-perigo); background: color-mix(in srgb, var(--cor-perigo) 12%, transparent); }
    .desce { color: var(--cor-sucesso); background: color-mix(in srgb, var(--cor-sucesso) 12%, transparent); }
    .igual { color: var(--mat-sys-on-surface-variant); background: var(--mat-sys-surface-container-high); padding-left: 7px; }
  `,
})
export class DeltaComponent {
  readonly atual = input<number | null>(null);
  readonly anterior = input<number | null | undefined>(null);
  readonly semTexto = input('sem comparação');
  protected readonly estado = computed(() => {
    const a = this.atual(), b = this.anterior();
    if (a == null || b == null) return { tipo: 'sem', v: 0 };
    if (!a && !b) return { tipo: 'igual', v: 0 };
    if (!b) return { tipo: 'novo', v: 0 };
    const v = Math.round(((a - b) / b) * 100);
    return v === 0 ? { tipo: 'igual', v } : { tipo: v > 0 ? 'sobe' : 'desce', v: Math.abs(v) };
  });
}

/** Minigráfico de linha em SVG. */
@Component({
  selector: 'app-sparkline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + largura() + ' ' + altura()" [attr.width]="largura()" [attr.height]="altura()" aria-hidden="true">
      <polyline [attr.points]="area()" fill="currentColor" fill-opacity=".1" stroke="none" />
      <polyline [attr.points]="pontos()" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
    </svg>
  `,
  styles: `:host { display: inline-flex; color: var(--mat-sys-primary); } svg { display: block; max-width: 100%; }`,
})
export class SparklineComponent {
  readonly valores = input<number[]>([]);
  readonly largura = input(120);
  readonly altura = input(28);
  protected readonly pontos = computed(() => {
    const v = this.valores();
    if (!v.length) return '';
    const max = Math.max(...v, 1), h = this.altura(), passo = this.largura() / (v.length - 1 || 1);
    return v.map((x, i) => (i * passo).toFixed(1) + ',' + (h - 2 - (x / max) * (h - 4)).toFixed(1)).join(' ');
  });
  protected readonly area = computed(() => {
    const p = this.pontos();
    return p ? `0,${this.altura()} ${p} ${this.largura()},${this.altura()}` : '';
  });
}

/** Gráfico Chart.js que se atualiza sem ser recriado e segue o tema claro/escuro. */
@Component({
  selector: 'app-grafico',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #tela [attr.aria-label]="rotulo()" role="img"></canvas>`,
  styles: `:host { display: block; position: relative; height: 200px; } canvas { position: absolute; inset: 0; }`,
})
export class GraficoComponent implements OnDestroy {
  private readonly store = inject(PainelStore);
  readonly config = input.required<{ type: string; data: any; options?: any }>();
  readonly rotulo = input('Gráfico');
  private readonly tela = viewChild.required<ElementRef<HTMLCanvasElement>>('tela');
  private grafico: any = null;
  private tipo = '';
  private escuro: boolean | null = null;

  constructor() {
    effect(() => {
      const cfg = this.config();
      const escuro = this.store.escuro();
      if (typeof Chart === 'undefined') return;
      const texto = escuro ? '#c4c7cf' : '#44474e';
      const grade = escuro ? 'rgba(148,163,184,.16)' : 'rgba(100,116,139,.16)';
      if (this.grafico && this.tipo === cfg.type && this.escuro === escuro) {
        this.grafico.data = cfg.data;
        this.grafico.update('none');
        return;
      }
      this.grafico?.destroy();
      Chart.defaults.font.family = 'Roboto, system-ui, sans-serif';
      Chart.defaults.color = texto;
      const eixo = (extra: any = {}) => ({ ticks: { color: texto, font: { size: 11 } }, grid: { color: grade }, border: { display: false }, ...extra });
      const opcoes = cfg.options || {};
      const escalas: any = {};
      for (const k of Object.keys(opcoes.scales || {})) escalas[k] = eixo(opcoes.scales[k]);
      this.grafico = new Chart(this.tela().nativeElement, {
        type: cfg.type,
        data: cfg.data,
        options: {
          responsive: true, maintainAspectRatio: false, animation: false,
          interaction: { mode: 'index', intersect: false },
          ...opcoes,
          plugins: { legend: { labels: { color: texto, boxWidth: 10, boxHeight: 10, font: { size: 11 } } }, ...(opcoes.plugins || {}) },
          scales: escalas,
        },
      });
      this.tipo = cfg.type;
      this.escuro = escuro;
    });
  }

  ngOnDestroy(): void { this.grafico?.destroy(); }
}
