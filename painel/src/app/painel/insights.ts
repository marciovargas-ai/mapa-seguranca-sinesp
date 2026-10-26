import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Insight } from '../core/modelos';

@Component({
  selector: 'app-insights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (itens().length) {
      <div class="grade">
        @for (i of itens(); track i.titulo) {
          <article class="insight" [class]="'insight ' + i.tom">
            <mat-icon>{{ i.icone }}</mat-icon>
            <div>
              <h4>{{ i.titulo }}</h4>
              <p>{{ i.texto }}</p>
              <span class="fonte">{{ i.fonte }}</span>
            </div>
          </article>
        }
      </div>
    } @else {
      <p class="nota">{{ vazio() }}</p>
    }
  `,
  styles: `
    .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
    .insight { display: flex; gap: 10px; padding: 12px; border-radius: 12px; background: var(--mat-sys-surface-container-low);
      border: 1px solid var(--mat-sys-outline-variant); border-left: 4px solid var(--tom); --tom: var(--mat-sys-outline); }
    .insight.alerta { --tom: var(--cor-perigo); }
    .insight.positivo { --tom: var(--cor-sucesso); }
    .insight.neutro { --tom: var(--mat-sys-primary); }
    mat-icon { color: var(--tom); flex: none; }
    h4 { margin: 0 0 2px; font: var(--mat-sys-title-small); }
    p { margin: 0; font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .fonte { display: inline-block; margin-top: 6px; font: var(--mat-sys-label-small); color: var(--mat-sys-on-surface-variant);
      background: var(--mat-sys-surface-container-high); border-radius: 4px; padding: 1px 6px; }
  `,
})
export class InsightsComponent {
  readonly itens = input<Insight[]>([]);
  readonly vazio = input('Ainda não há dados suficientes para gerar insights.');
}
