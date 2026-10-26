import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filtrar } from '../core/analise';
import { ESTADOS } from '../core/dados';
import { gerarInsights } from '../core/insights';
import { LinhaRanking } from '../core/modelos';
import { municipioPorCodigo, municipiosUf } from '../core/municipios';
import { PainelStore } from '../core/painel.store';
import { fmt, fmt1 } from '../core/util';
import { DeltaComponent, SparklineComponent } from './comuns';
import { InsightsComponent } from './insights';

type Visao = 'total' | 'taxa' | 'altas' | 'quedas';

/** Panorama do estado: indicadores, insights e rankings dos municípios (Sinesp + IBGE). */
@Component({
  selector: 'app-estado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule, MatButtonToggleModule, MatIconModule, MatProgressBarModule, MatTooltipModule, DeltaComponent, SparklineComponent, InsightsComponent],
  template: `
    @let p = panorama();
    @if (!p) {
      <mat-progress-bar mode="indeterminate" />
      <p class="nota">Montando o panorama de {{ nomeEstado() }} a partir do Sinesp… na primeira vez pode levar alguns segundos.</p>
    } @else if (!p.disponivel) {
      <div class="vazio"><mat-icon>insights</mat-icon><p>{{ p.motivo || 'Panorama indisponível para este estado.' }}</p></div>
    } @else {
      @if (store.panoramaCarregando()) { <mat-progress-bar mode="indeterminate" class="fina" /> }
      <header class="cabecalho">
        <div>
          <h2>Panorama de {{ nomeEstado() }}</h2>
          <p>Sinesp · últimos 12 meses publicados ({{ p.oficial?.periodo }}) · {{ fmt(totalMunicipios()) }} municípios</p>
        </div>
      </header>

      <div class="kpis">
        @for (e of principais(); track e.nome) {
          <div class="kpi">
            <span class="kpi-rotulo">{{ e.nome }}</span>
            <b>{{ fmt(e.total) }}</b>
            <span class="kpi-sub"><app-delta [atual]="e.total" [anterior]="e.anterior" /> vs 12 meses anteriores</span>
            @if (e.taxa !== null) { <span class="kpi-sub">{{ fmt1(e.taxa) }} por 100 mil hab.</span> }
            <app-sparkline [valores]="e.serie" [largura]="140" [altura]="26" />
          </div>
        }
      </div>

      <section class="bloco">
        <h3>Insights do estado</h3>
        <app-insights [itens]="insightsEstado()" />
      </section>

      <section class="bloco">
        <div class="titulo-bloco">
          <h3>Municípios</h3>
          <span class="nota">Clique num município para abri-lo. O mapa colore cada município pela taxa.</span>
        </div>
        <mat-chip-listbox aria-label="Indicador" [value]="store.eventoPanorama()" (change)="$event.value !== undefined && store.eventoPanorama.set($event.value)">
          @for (r of p.rankings; track r.evento; let i = $index) { <mat-chip-option [value]="i">{{ r.evento }}</mat-chip-option> }
        </mat-chip-listbox>

        <mat-button-toggle-group class="visoes" [value]="visao()" (change)="visao.set($event.value)" aria-label="Ordenação" hideSingleSelectionIndicator>
          <mat-button-toggle value="total">Mais registros</mat-button-toggle>
          <mat-button-toggle value="taxa">Maior taxa</mat-button-toggle>
          <mat-button-toggle value="altas">Maiores altas</mat-button-toggle>
          <mat-button-toggle value="quedas">Maiores quedas</mat-button-toggle>
        </mat-button-toggle-group>

        @if (ranking(); as r) {
          <p class="nota">{{ explicacao() }} · {{ fmt(r.municipiosComRegistro) }} municípios com registro de {{ r.evento.toLowerCase() }}.</p>
          @if (linhas().length) {
            <div class="tabela-rolagem">
              <table class="tabela">
                <thead><tr><th>#</th><th>Município</th><th class="num">12 meses</th><th class="num">Anteriores</th><th class="num">Var.</th><th class="num">Por 100 mil</th></tr></thead>
                <tbody>
                  @for (l of linhas(); track l.n; let i = $index) {
                    <tr (click)="abrir(l)" (keydown.enter)="abrir(l)" tabindex="0" [class.atual]="ehAtual(l)">
                      <td class="pos">{{ i + 1 }}</td>
                      <td><span class="mun">{{ l.n }}</span>
                        <span class="barra"><span [style.width.%]="barra(l)"></span></span></td>
                      <td class="num"><b>{{ fmt(l.total) }}</b></td>
                      <td class="num">{{ fmt(l.anterior) }}</td>
                      <td class="num"><app-delta [atual]="l.total" [anterior]="l.anterior" semTexto="—" /></td>
                      <td class="num">{{ l.taxa === null ? '—' : fmt1(l.taxa) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="nota">Nenhum município nesta lista.</p>
          }
        }
      </section>
      <p class="nota">Taxas calculadas com a população do IBGE {{ p.anoPopulacao }}. O ranking por taxa considera só municípios com 20 mil habitantes ou mais, para evitar distorção de cidades muito pequenas.</p>
    }
  `,
  styles: `
    :host { display: block; }
    .fina { margin-bottom: 8px; }
    .cabecalho { margin-bottom: 12px; }
    h2 { font: var(--mat-sys-title-large); margin: 0; }
    .cabecalho p { margin: 2px 0 0; color: var(--mat-sys-on-surface-variant); }
    h3 { font: var(--mat-sys-title-medium); margin: 0 0 8px; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; margin-bottom: 14px; }
    .kpi { display: flex; flex-direction: column; gap: 3px; padding: 12px; border-radius: 12px; background: var(--mat-sys-surface-container-low);
      border: 1px solid var(--mat-sys-outline-variant); min-width: 0; }
    .kpi-rotulo { font: var(--mat-sys-label-medium); color: var(--mat-sys-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .kpi b { font: var(--mat-sys-headline-small); font-weight: 600; font-variant-numeric: tabular-nums; }
    .kpi-sub { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .bloco { margin-bottom: 16px; }
    .titulo-bloco { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
    mat-chip-listbox { display: block; margin: 4px 0 10px; }
    .visoes { margin-bottom: 6px; flex-wrap: wrap; }
    .tabela-rolagem { overflow-x: auto; }
    tr[tabindex] { cursor: pointer; }
    tr[tabindex]:hover td { background: var(--mat-sys-surface-container); }
    tr.atual td { background: color-mix(in srgb, var(--mat-sys-primary) 10%, transparent); }
    .pos { color: var(--mat-sys-on-surface-variant); width: 28px; }
    .mun { display: block; font-weight: 500; }
    .barra { display: block; height: 4px; margin-top: 3px; background: var(--mat-sys-surface-container-high); border-radius: 2px; max-width: 220px; }
    .barra span { display: block; height: 100%; background: var(--cor-perigo); border-radius: 2px; opacity: .75; }
    @media (max-width: 600px) { .visoes ::ng-deep .mat-button-toggle-label-content { padding: 0 8px; font-size: 12px; } }
  `,
})
export class EstadoComponent {
  protected readonly store = inject(PainelStore);
  protected readonly visao = signal<Visao>('total');
  protected readonly fmt = fmt;
  protected readonly fmt1 = fmt1;

  protected readonly panorama = computed(() => {
    const p = this.store.panorama();
    return p && p.uf === this.store.uf() ? p : null;
  });
  protected readonly totalMunicipios = computed(() => municipiosUf(this.store.uf()).length);
  protected readonly nomeEstado = computed(() => ESTADOS[this.store.uf()].nome);
  protected readonly principais = computed(() => (this.panorama()?.oficial?.eventos || []).slice(0, 4));
  protected readonly ranking = computed(() => {
    const r = this.panorama()?.rankings || [];
    return r[this.store.eventoPanorama()] || r[0] || null;
  });
  protected readonly linhas = computed<LinhaRanking[]>(() => {
    const r = this.ranking();
    if (!r) return [];
    return { total: r.porTotal, taxa: r.porTaxa, altas: r.altas, quedas: r.quedas }[this.visao()];
  });
  protected readonly explicacao = computed(() => ({
    total: 'Mais registros nos últimos 12 meses',
    taxa: 'Maior taxa por 100 mil habitantes (municípios com 20 mil hab. ou mais)',
    altas: 'Maior aumento em relação aos 12 meses anteriores',
    quedas: 'Maior redução em relação aos 12 meses anteriores',
  })[this.visao()]);

  protected readonly insightsEstado = computed(() => {
    const p = this.panorama();
    if (!p?.disponivel) return [];
    return gerarInsights({ ehEstado: true, nomeLocal: this.nomeEstado(), cidade: '', oficial: p.oficial || null, panorama: p,
      f: filtrar(null, 90, [], '', true), periodoDias: 90 }).filter((i) => i.fonte !== 'Notícias');
  });

  protected barra(l: LinhaRanking): number {
    const v = this.visao();
    const lista = this.linhas();
    const valor = (x: LinhaRanking) => (v === 'taxa' ? x.taxa || 0 : v === 'altas' ? x.total - x.anterior : v === 'quedas' ? x.anterior - x.total : x.total);
    const max = Math.max(...lista.map(valor), 1);
    return Math.max(2, (valor(l) / max) * 100);
  }

  protected ehAtual(l: LinhaRanking): boolean {
    return this.store.escopo() === 'CIDADE' && l.n.toLowerCase() === this.store.cidade().toLowerCase();
  }

  protected abrir(l: LinhaRanking): void {
    const mun = municipioPorCodigo(l.ibge);
    this.store.abrirLocal(this.store.uf(), mun ? mun.nome : l.n);
  }
}
