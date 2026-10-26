import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ESTADOS, ORGAO_POR_ID } from '../core/dados';
import { EventoOficial, Oficial } from '../core/modelos';
import { PainelStore } from '../core/painel.store';
import { fmt, fmt1, MESES, urlSegura } from '../core/util';
import { DeltaComponent, GraficoComponent, SparklineComponent } from './comuns';

const CORES_ANOS = ['#94a3b8', '#60a5fa', '#1d4ed8'];

/**
 * Aba Oficial: um cartão por indicador do Sinesp, com os três anos lado a lado
 * (o ano corrente comparado ao mesmo período do ano anterior), a taxa por 100 mil
 * habitantes e um gráfico mensal com uma linha por ano.
 */
@Component({
  selector: 'app-oficial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatTooltipModule, MatProgressBarModule, DeltaComponent, SparklineComponent, GraficoComponent],
  template: `
    @let o = oficial();
    @if (!o) {
      @if (store.carregando() || store.panoramaCarregando()) {
        <mat-progress-bar mode="indeterminate" />
        <p class="nota">Carregando indicadores do Sinesp…</p>
      } @else {
        <div class="vazio"><mat-icon>account_balance</mat-icon>Sem dados oficiais para este local.</div>
      }
    } @else if (!o.disponivel) {
      <div class="vazio">
        <mat-icon>account_balance</mat-icon>
        <p>{{ o.motivo || 'Estatística oficial indisponível.' }}</p>
        @if (o.urlPainel) { <a [href]="url(o.urlPainel)" target="_blank" rel="noopener">Abrir o painel oficial do Sinesp</a> }
      </div>
    } @else {
      <header class="cabecalho">
        <div>
          <h2>{{ titulo() }}</h2>
          <p>Registros oficiais do Sinesp · {{ o.periodoTresAnos }}</p>
        </div>
        <div class="fatos">
          @if (o.populacao) { <span><mat-icon>groups</mat-icon>{{ populacao(o.populacao) }} hab. <small>IBGE {{ o.anoPopulacao }}</small></span> }
          <span><mat-icon>event_available</mat-icon>dados até {{ o.ultimoMes }}/{{ o.anoUltimoDado }}</span>
        </div>
      </header>

      <section class="orgaos" aria-label="Registros por órgão de segurança">
        <h3>Órgãos de segurança <small>últimos 12 meses ({{ o.periodo }})</small></h3>
        <div class="orgaos-grade">
          @for (g of orgaos(); track g.id) {
            <div class="orgao" [class.sem-base]="!g.oficial" [style.--cor-orgao]="g.cor">
              <div class="orgao-topo"><i></i><b>{{ g.nome }}</b></div>
              @if (g.oficial) {
                <span class="orgao-num">{{ g.total }}</span>
                <span class="orgao-sub">{{ g.sub }}</span>
              } @else {
                <span class="orgao-num pequeno">Sem base pública</span>
                <span class="orgao-sub">{{ g.sub }}</span>
              }
            </div>
          }
        </div>
      </section>

      @if (selecionado(); as e) {
        <section class="cartao destaque">
          <div class="destaque-topo">
            <div>
              <h3>{{ e.nome }}</h3>
              <p class="nota">Mês a mês, uma linha por ano · clique num indicador abaixo para trocar</p>
            </div>
            <div class="legenda-anos">
              @for (a of o.anos; track a; let i = $index) { <span><i [style.background]="coresAnos[i]"></i>{{ a }}</span> }
            </div>
          </div>
          <app-grafico [config]="graficoAnos()" rotulo="Evolução mensal por ano" />
        </section>
      }

      <div class="grade">
        @for (e of o.eventos; track e.nome; let i = $index) {
          <button type="button" class="cartao indicador" [class.ativo]="indice() === i" (click)="indice.set(i)" [attr.aria-pressed]="indice() === i">
            <div class="ind-topo">
              <span class="ind-nome">{{ e.nome }}</span>
              @for (f of federais(e); track f.id) {
                <span class="tag" [style.color]="f.cor" [matTooltip]="'Registrado pela ' + f.nome + ' nos últimos 12 meses'">{{ f.id }} {{ f.qtd }}</span>
              }
            </div>
            <div class="ind-valor">
              <b>{{ n(e.porAno[2]) }}</b>
              <app-delta [atual]="e.porAno[2]" [anterior]="e.parcialAnterior" />
            </div>
            <div class="ind-sub">
              {{ parcial() ? 'jan–' + o.ultimoMes + '/' + o.anos![2] : o.anos![2] }}
              @if (e.parcialAnterior !== null) { · {{ n(e.parcialAnterior) }} no mesmo período de {{ o.anos![1] }} }
            </div>
            <div class="anos">
              @for (v of e.porAno; track $index; let j = $index) {
                <div class="ano">
                  <span class="ano-rotulo">{{ o.anos![j] }}{{ j === 2 && parcial() ? '*' : '' }}</span>
                  <span class="ano-barra"><span [style.width.%]="largura(e, v)" [style.background]="coresAnos[j]"></span></span>
                  <span class="ano-num">{{ n(v) }}</span>
                </div>
              }
            </div>
            <div class="ind-rodape">
              @if (e.taxa !== null) {
                <span [matTooltip]="'Últimos 12 meses publicados (' + o.periodo + ')'">
                  <b>{{ f1(e.taxa) }}</b> por 100 mil
                  @if (e.taxaEstado) { <small class="comparado" [class.acima]="e.taxa > e.taxaEstado * 1.1" [class.abaixo]="e.taxa < e.taxaEstado * 0.9">· estado {{ f1(e.taxaEstado) }}</small> }
                </span>
              } @else {
                <span>12 meses: <b>{{ n(e.total) }}</b></span>
              }
              <app-sparkline [valores]="e.serie36" [largura]="96" [altura]="24" />
            </div>
          </button>
        }
      </div>
      @if (parcial()) { <p class="nota">* {{ o.anos![2] }} vai de janeiro a {{ o.ultimoMes }}, último mês publicado. A variação compara com janeiro a {{ o.ultimoMes }} de {{ o.anos![1] }}.</p> }
      <p class="nota">Fonte: {{ o.fonte }} · importado em {{ o.importadoEm }}. PRF e PF mostram a parte registrada pelas polícias federais; o restante vem das polícias e secretarias do estado.
        @if (o.urlPainel) { <a [href]="url(o.urlPainel)" target="_blank" rel="noopener">Painel oficial</a> }</p>
    }
  `,
  styles: `
    :host { display: block; }
    .cabecalho { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
    h2 { font: var(--mat-sys-title-large); margin: 0; }
    .cabecalho p { margin: 2px 0 0; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-medium); }
    .fatos { display: flex; gap: 8px; flex-wrap: wrap; }
    .fatos span { display: inline-flex; align-items: center; gap: 4px; font: var(--mat-sys-label-large); background: var(--mat-sys-surface-container-high);
      border-radius: 8px; padding: 4px 10px; }
    .fatos mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--mat-sys-primary); }
    .fatos small { color: var(--mat-sys-on-surface-variant); font-weight: 400; }
    .orgaos { margin-bottom: 12px; }
    .orgaos h3 small { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); margin-left: 4px; }
    .orgaos-grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; margin-top: 8px; }
    .orgao { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--mat-sys-outline-variant);
      border-left: 4px solid var(--cor-orgao); background: var(--mat-sys-surface-container-low); }
    .orgao.sem-base { opacity: .75; border-left-style: dashed; }
    .orgao-topo { display: flex; align-items: center; gap: 6px; font: var(--mat-sys-label-large); }
    .orgao-topo i { display: none; }
    .orgao-num { font: var(--mat-sys-headline-small); font-weight: 600; font-variant-numeric: tabular-nums; }
    .orgao-num.pequeno { font: var(--mat-sys-title-small); }
    .orgao-sub { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .destaque { margin-bottom: 12px; }
    .destaque app-grafico { height: 220px; }
    .destaque-topo { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
    h3 { font: var(--mat-sys-title-medium); margin: 0; }
    .legenda-anos { display: flex; gap: 12px; font: var(--mat-sys-label-medium); align-items: center; }
    .legenda-anos i { display: inline-block; width: 14px; height: 3px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
    .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
    .indicador { text-align: left; font: inherit; color: inherit; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: border-color .15s, box-shadow .15s; }
    .indicador:hover { border-color: var(--mat-sys-outline); }
    .indicador.ativo { border-color: var(--mat-sys-primary); box-shadow: 0 0 0 1px var(--mat-sys-primary); }
    .indicador:focus-visible { outline: 2px solid var(--mat-sys-primary); outline-offset: 2px; }
    .ind-topo { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .ind-nome { font: var(--mat-sys-title-small); flex: 1; min-width: 0; }
    .ind-valor { display: flex; align-items: center; gap: 8px; }
    .ind-valor b { font: var(--mat-sys-headline-small); font-weight: 600; font-variant-numeric: tabular-nums; }
    .ind-sub { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); margin-top: -4px; }
    .anos { display: grid; gap: 3px; margin-top: 2px; }
    .ano { display: grid; grid-template-columns: 44px 1fr auto; gap: 8px; align-items: center; font: var(--mat-sys-body-small); }
    .ano-rotulo { color: var(--mat-sys-on-surface-variant); }
    .ano-barra { height: 8px; background: var(--mat-sys-surface-container-high); border-radius: 4px; overflow: hidden; }
    .ano-barra span { display: block; height: 100%; border-radius: 4px; }
    .ano-num { font-variant-numeric: tabular-nums; font-weight: 500; min-width: 48px; text-align: right; }
    .ind-rodape { display: flex; justify-content: space-between; align-items: center; gap: 8px; border-top: 1px solid var(--mat-sys-outline-variant);
      padding-top: 6px; font: var(--mat-sys-body-small); }
    .comparado { color: var(--mat-sys-on-surface-variant); }
    .comparado.acima { color: var(--cor-perigo); font-weight: 600; }
    .comparado.abaixo { color: var(--cor-sucesso); font-weight: 600; }
  `,
})
export class OficialComponent {
  protected readonly store = inject(PainelStore);
  protected readonly oficial = this.store.oficial;
  protected readonly indice = signal(0);
  protected readonly coresAnos = CORES_ANOS;
  protected readonly n = (v: number | null | undefined) => (v == null ? '—' : fmt(v));
  protected readonly f1 = fmt1;
  protected readonly url = urlSegura;

  protected readonly titulo = computed(() =>
    this.store.escopo() === 'ESTADO' ? 'Estado — ' + ESTADOS[this.store.uf()].nome : 'Município — ' + this.store.cidade());
  protected readonly parcial = computed(() => (this.oficial()?.ultimoMes || 'dez') !== 'dez');
  protected readonly selecionado = computed(() => {
    const o = this.oficial();
    return o?.eventos?.[this.indice()] || o?.eventos?.[0] || null;
  });

  protected readonly graficoAnos = computed(() => {
    const o = this.oficial() as Oficial;
    const e = this.selecionado()!;
    const anos = o.anos || [];
    const fim = o.fimMesIdx ?? 11;
    const datasets = anos.map((ano, i) => {
      const inicio = i * 12;
      const qtd = ano === o.anoUltimoDado ? fim + 1 : 12;
      const dados = ano > (o.anoUltimoDado || 0) ? [] : e.serie36.slice(inicio, inicio + qtd);
      return { label: String(ano), data: dados, borderColor: CORES_ANOS[i], backgroundColor: CORES_ANOS[i], borderWidth: i === 2 ? 2.6 : 1.8,
        pointRadius: i === 2 ? 3 : 0, cubicInterpolationMode: 'monotone' };
    });
    return {
      type: 'line',
      data: { labels: MESES, datasets },
      options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } } },
    };
  });

  /**
   * Registros por órgão: o Sinesp separa o que foi lançado pela PRF e pela PF
   * (coluna "abrangência"); o restante vem das polícias Civil e Militar via SSP.
   * Guarda Municipal e COPOM/190 não têm base pública nacional.
   */
  protected readonly orgaos = computed(() => {
    const o = this.oficial();
    if (!o?.disponivel) return [];
    const fed: Record<string, Record<string, number>> = {};
    for (const e of o.eventos) {
      for (const [id, v] of Object.entries(e.federais || {})) (fed[id] ||= {})[e.nome] = v;
    }
    const soma = (m: Record<string, number>) => Object.values(m).reduce((x, y) => x + y, 0);
    const principais = (m: Record<string, number>) =>
      Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([n, v]) => `${n}: ${fmt(v)}`).join(' · ');
    // Polícias do estado: o que sobra depois de tirar os lançamentos federais; manchete = mortes violentas intencionais
    const estadual: Record<string, number> = {};
    for (const e of o.eventos) {
      const resto = e.total - soma(e.federais || {});
      if (resto > 0) estadual[e.nome] = resto;
    }
    const letais = Object.entries(estadual).filter(([n]) => /^(homic[ií]dio doloso|feminic[ií]dio|latroc[ií]nio|roubo seguido de morte|les[aã]o corporal seguida)/i.test(n));
    const graves = o.eventos.filter((e) => estadual[e.nome]).slice(0, 2).map((e) => `${e.nome}: ${fmt(estadual[e.nome])}`).join(' · ');
    const noticias = this.store.filtrados().porOrgao;
    const lista = [
      { id: 'SSP', nome: 'Polícias Civil e Militar (SSP)', cor: ORGAO_POR_ID['PC'].cor, oficial: true,
        total: fmt(letais.reduce((a, [, v]) => a + v, 0)), sub: 'mortes violentas intencionais' + (graves ? ' · ' + graves : '') },
      ...['PRF', 'PF'].map((id) => ({ id, nome: ORGAO_POR_ID[id].nome, cor: ORGAO_POR_ID[id].cor, oficial: true,
        total: fmt(soma(fed[id] || {})), sub: fed[id] ? principais(fed[id]) : 'nenhum registro federal neste local' })),
      ...['GM', 'COPOM'].map((id) => ({ id, nome: ORGAO_POR_ID[id].nome, cor: ORGAO_POR_ID[id].cor, oficial: false, total: '',
        sub: `Sem estatística aberta nacional. Citado em ${fmt(noticias[id]?.qtd || 0)} notícias.` })),
    ];
    return lista;
  });

  protected federais(e: EventoOficial) {
    return e.federais ? Object.keys(e.federais).map((id) => ({ id, qtd: fmt(e.federais![id]), cor: ORGAO_POR_ID[id]?.cor || '#334155', nome: ORGAO_POR_ID[id]?.nome || id })) : [];
  }

  protected largura(e: EventoOficial, v: number | null): number {
    const max = Math.max(...e.porAno.map((x) => x || 0), 1);
    return v ? Math.max(2, (v / max) * 100) : 0;
  }

  protected populacao(p: number): string {
    return p >= 1e6 ? fmt1(p / 1e6) + ' mi' : fmt(p);
  }
}
