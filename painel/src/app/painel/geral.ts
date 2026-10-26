import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CATEGORIA_POR_ID, CATEGORIAS, ORGAOS } from '../core/dados';
import { Local } from '../core/modelos';
import { PainelStore } from '../core/painel.store';
import { DIAS_SEMANA, fmt, pct, rotuloPeriodo } from '../core/util';
import { DeltaComponent, GraficoComponent } from './comuns';
import { InsightsComponent } from './insights';

/** Visão geral: insights, situação, gráficos das notícias e cruzamento por fonte. */
@Component({
  selector: 'app-geral',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatProgressBarModule, DeltaComponent, GraficoComponent, InsightsComponent],
  template: `
    @let f = store.filtrados();
    <section class="bloco">
      <div class="titulo-bloco"><h3><span class="material-symbols-outlined">auto_awesome</span> Insights</h3><span class="nota">Sinesp primeiro, depois as notícias</span></div>
      @if (carregandoVazio()) { <mat-progress-bar mode="indeterminate" /> }
      @else { <app-insights [itens]="store.insights()" /> }
    </section>

    <div class="colunas">
      <section class="cartao">
        <div class="titulo-bloco"><h3>Situação</h3><span class="nota">{{ coleta() }}</span></div>
        @if (carregandoVazio()) {
          <div class="esqueleto"></div><div class="esqueleto curto"></div>
        } @else {
          <p class="texto">{{ situacao() }}</p>
          @if (f.comparavel) {
            <div class="comparacao">
              <div><small>Últimos {{ periodo() }}</small><b>{{ fmt(f.todas.length) }}</b></div>
              <div><small>{{ periodo() }} anteriores</small><b>{{ fmt(f.anteriores.length) }}</b></div>
              <div><small>Variação</small><b><app-delta [atual]="f.todas.length" [anterior]="f.anteriores.length" /></b></div>
            </div>
          } @else {
            <p class="nota">Para comparar com o período anterior, escolha 30 dias, 90 dias ou 6 meses (o histórico guardado é de 12 meses).</p>
          }
        }
      </section>

      <section class="cartao">
        <div class="titulo-bloco"><h3>Cruzamento por fonte</h3><span class="nota">clique para filtrar</span></div>
        @if (orgaos().length) {
          @for (g of orgaos(); track g.id) {
            <button type="button" class="linha-orgao" [class.ativo]="store.orgao() === g.id" (click)="store.definirOrgao(g.id)" [title]="g.nome">
              <span class="orgao-nome"><i [style.background]="g.cor"></i>{{ g.nome }}</span>
              <span class="orgao-barra"><span [style.width.%]="g.largura" [style.background]="g.cor"></span></span>
              <span class="orgao-num"><b>{{ fmt(g.qtd) }}</b>@if (g.graves) { · <span class="perigo">{{ fmt(g.graves) }} graves</span> }</span>
            </button>
          }
          <p class="nota">{{ fmt(f.semOrgao) }} de {{ fmt(f.totalCruzamento) }} notícias não citam órgão. Uma notícia pode citar mais de um.</p>
        } @else {
          <div class="vazio pequeno"><mat-icon>hub</mat-icon>Nenhuma notícia do período cita órgãos de segurança.</div>
        }
      </section>
    </div>

    <section class="cartao">
      <div class="titulo-bloco"><h3>Ocorrências noticiadas por mês</h3><span class="nota">últimos 12 meses</span></div>
      <app-grafico class="alto" [config]="graficoMensal()" rotulo="Ocorrências por mês" />
    </section>

    <div class="colunas">
      <section class="cartao">
        <div class="titulo-bloco"><h3>Por tipo de crime</h3><span class="nota">{{ periodo() }}</span></div>
        <app-grafico [config]="graficoTipo()" rotulo="Ocorrências por tipo" />
      </section>
      <section class="cartao">
        <div class="titulo-bloco"><h3>Dia da semana</h3><span class="nota">{{ periodo() }}</span></div>
        <app-grafico [config]="graficoSemana()" rotulo="Ocorrências por dia da semana" />
      </section>
    </div>

    <div class="colunas">
      <section class="cartao">
        <div class="titulo-bloco"><h3>Locais mais citados</h3><span class="nota">clique para ver no mapa</span></div>
        @for (b of locais(); track b.nome + b.cidade) {
          <button type="button" class="linha" [disabled]="!b.n" (click)="store.focar(b.lat, b.lng)">
            <span class="linha-nome"><span class="material-symbols-outlined" [style.color]="cor(b)">location_on</span>{{ store.escopo() === 'ESTADO' ? b.cidade + ' — ' + b.nome : b.nome }}</span>
            <span class="pilula">{{ fmt(b.qtd) }}</span>
          </button>
        } @empty {
          <div class="vazio pequeno"><mat-icon>signpost</mat-icon>As notícias do período não citam bairros ou ruas.</div>
        }
      </section>
      <section class="cartao">
        <div class="titulo-bloco"><h3>Veículos de imprensa</h3><span class="nota">{{ f.totalCruzamento ? pct(f.imprensaLocal, f.totalCruzamento) + '% imprensa local' : '' }}</span></div>
        <p class="nota google"><span class="material-symbols-outlined">travel_explore</span>Coletadas pela API do Google Notícias: busca geral, busca por órgãos e sites da imprensa local do estado.</p>
        @for (x of f.fontes.slice(0, 7); track x.nome) {
          <div class="linha"><span class="linha-nome">{{ x.nome }}</span><span class="pilula">{{ fmt(x.qtd) }}</span></div>
        } @empty {
          <div class="vazio pequeno"><mat-icon>newspaper</mat-icon>Sem notícias no período.</div>
        }
      </section>
    </div>
    <p class="nota">Notícias policiais classificadas automaticamente; não equivalem ao total de boletins de ocorrência. Os registros oficiais estão nas abas Oficial e Estado.</p>
  `,
  styles: `
    :host { display: grid; gap: 12px; }
    .bloco { display: grid; gap: 8px; }
    .colunas { display: grid; grid-template-columns: 1fr; gap: 12px; }
    @container painel (min-width: 720px) { .colunas { grid-template-columns: 1fr 1fr; } }
    .titulo-bloco { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
    h3 { font: var(--mat-sys-title-medium); margin: 0; display: flex; align-items: center; gap: 6px; }
    h3 .material-symbols-outlined { color: var(--mat-sys-primary); font-size: 20px; }
    .texto { font: var(--mat-sys-body-large); margin: 0 0 10px; line-height: 1.55; }
    .comparacao { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .comparacao div { background: var(--mat-sys-surface-container); border-radius: 10px; padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
    .comparacao small { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); }
    .comparacao b { font: var(--mat-sys-title-medium); }
    app-grafico.alto { height: 240px; }
    .linha, .linha-orgao { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 7px 4px; border: 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant); background: none; color: inherit; font: var(--mat-sys-body-medium); text-align: left; cursor: pointer; }
    .linha:disabled { cursor: default; }
    .linha:not(:disabled):hover, .linha-orgao:hover { background: var(--mat-sys-surface-container); }
    .linha-nome { display: flex; align-items: center; gap: 6px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .linha-nome .material-symbols-outlined { font-size: 18px; }
    .linha-orgao { display: grid; grid-template-columns: minmax(0, 1.3fr) 1fr auto; }
    .linha-orgao.ativo { background: color-mix(in srgb, var(--mat-sys-primary) 10%, transparent); }
    .orgao-nome { display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .orgao-nome i { width: 10px; height: 10px; border-radius: 3px; flex: none; }
    .orgao-barra { height: 6px; background: var(--mat-sys-surface-container-high); border-radius: 3px; overflow: hidden; }
    .orgao-barra span { display: block; height: 100%; }
    .orgao-num { font-variant-numeric: tabular-nums; white-space: nowrap; }
    .perigo { color: var(--cor-perigo); }
    .google { display: flex; gap: 6px; align-items: flex-start; margin: 0 0 6px; }
    .google .material-symbols-outlined { font-size: 18px; color: var(--mat-sys-primary); }
  `,
})
export class GeralComponent {
  protected readonly store = inject(PainelStore);
  protected readonly fmt = fmt;
  protected readonly pct = pct;
  protected readonly periodo = computed(() => rotuloPeriodo(this.store.periodoDias()));
  protected readonly carregandoVazio = computed(() => this.store.carregando() && (!this.store.dados() || !!this.store.dados()!.vazio));
  protected readonly coleta = computed(() => {
    const d = this.store.dados();
    return d?.ultimaColeta ? 'coletado em ' + d.ultimaColeta : '';
  });
  protected readonly locais = computed(() => this.store.filtrados().locais.slice(0, 10));
  protected readonly cor = (b: Local) => CATEGORIA_POR_ID[b.catTop]?.cor || '#64748b';

  protected readonly orgaos = computed(() => {
    const f = this.store.filtrados();
    return ORGAOS.filter((g) => f.porOrgao[g.id])
      .map((g) => ({ ...g, ...f.porOrgao[g.id], largura: pct(f.porOrgao[g.id].qtd, f.totalCruzamento) }))
      .sort((a, b) => b.qtd - a.qtd);
  });

  protected readonly situacao = computed(() => {
    const f = this.store.filtrados();
    const d = this.store.dados();
    const total = f.todas.length;
    const p = this.periodo();
    const ehEstado = this.store.escopo() === 'ESTADO';
    if (!total) {
      if (d?.totalNaBase) return `Nenhuma ocorrência nos últimos ${p} para os filtros escolhidos. Há ${fmt(d.totalNaBase)} registros em períodos mais longos.`;
      return ehEstado ? 'Ainda não há cidades deste estado com notícias coletadas. Abra um município pela busca para começar.'
        : 'Ainda não há notícias coletadas para este município. A busca roda em segundo plano ao abrir a cidade.';
    }
    const cats = Object.keys(f.porCat).sort((a, b) => f.porCat[b] - f.porCat[a]);
    const catTop = CATEGORIA_POR_ID[cats[0]];
    const graves = (f.porCat['CVLI'] || 0) + (f.porCat['CONFRONTO'] || 0);
    const z = f.zonas[0];
    let txt = `Nos últimos ${p}, ${this.store.nomeLocal()} teve ${fmt(total)} ocorrências noticiadas, com predomínio de ${catTop.nome.toLowerCase()} (${pct(f.porCat[catTop.id], total)}%)` +
      (graves ? ` e ${fmt(graves)} casos de homicídio ou tiroteio` : '') + '. ';
    txt += z ? `A principal zona vermelha fica em ${z.nome}, com ${fmt(z.qtd)} registros. `
      : f.precisas.length ? 'Os pontos estão dispersos, sem concentração que forme zona vermelha. ' : '';
    txt += `${pct(f.precisas.length, total)}% das notícias têm local preciso no mapa.`;
    if (ehEstado && d) txt += ` Visão formada pelas ${fmt(d.cidadesMonitoradas)} cidades já consultadas no painel.`;
    return txt;
  });

  protected readonly graficoMensal = computed(() => {
    const f = this.store.filtrados();
    const cats = CATEGORIAS.filter((c) => f.serie.porCat[c.id]);
    return {
      type: 'bar',
      data: { labels: f.serie.labels, datasets: cats.map((c) => ({ label: c.curto, data: f.serie.porCat[c.id], backgroundColor: c.cor, borderRadius: 2, maxBarThickness: 24 })) },
      options: { plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } } },
    };
  });

  protected readonly graficoTipo = computed(() => {
    const f = this.store.filtrados();
    const cats = CATEGORIAS.filter((c) => f.porCat[c.id]);
    return {
      type: 'bar',
      data: { labels: cats.map((c) => c.curto), datasets: [{ label: 'Ocorrências', data: cats.map((c) => f.porCat[c.id]), backgroundColor: cats.map((c) => c.cor), borderRadius: 4, maxBarThickness: 18 }] },
      options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } }, y: { grid: { display: false } } } },
    };
  });

  protected readonly graficoSemana = computed(() => {
    const f = this.store.filtrados();
    return {
      type: 'bar',
      data: { labels: DIAS_SEMANA, datasets: [{ label: 'Ocorrências', data: f.semana, backgroundColor: '#64748b', borderRadius: 4, maxBarThickness: 28 }] },
      options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } } },
    };
  });
}
