import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { corCategoria, nomeCategoria } from '../core/compilado';
import { Tiroteio, UFS_FOGO_CRUZADO } from '../core/areas';
import { aplicarPeriodo, mesesDoPeriodo } from '../core/periodo';
import { PainelStore } from '../core/painel.store';
import { fmt, fmt1, normalizar, pct, variacao } from '../core/util';
import { DeltaComponent, GraficoComponent } from './comuns';
import { InsightsComponent } from './insights';

const CORES_ANOS = ['#9aa7bb', '#5b7bb0', '#ee4d2d'];

/**
 * Panorama: retrato compilado do local com todas as fontes. Sinesp (polícias do
 * estado, PRF e PF), ISP-RJ, Fogo Cruzado e IBGE na frente; notícias como complemento.
 */
@Component({
  selector: 'app-panorama',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatTooltipModule, MatProgressBarModule, DeltaComponent, GraficoComponent, InsightsComponent],
  template: `
    @let c = store.compilado();
    @if (carregando()) { <mat-progress-bar mode="indeterminate" /> }

    <section class="topo">
      <article class="cartao parecer">
        <header><mat-icon>summarize</mat-icon><h3>Parecer</h3>
          <span class="selo" matTooltip="Texto gerado por regras a partir do Sinesp, ISP-RJ, Fogo Cruzado, IBGE e notícias. Atualiza a cada consulta.">automático</span>
        </header>
        @for (p of c.parecer; track $index) { <p>{{ p }}</p> }
      </article>

      @if (c.risco; as r) {
        <article class="cartao risco" [matTooltip]="r.dica" matTooltipClass="dica-larga">
          <header><mat-icon>speed</mat-icon><h3>Índice de risco</h3><mat-icon class="info">info</mat-icon></header>
          <div class="medidor">
            <svg viewBox="0 0 120 68" aria-hidden="true">
              <path d="M10 62 A50 50 0 0 1 110 62" class="trilho" />
              <path d="M10 62 A50 50 0 0 1 110 62" class="arco" [style.stroke]="r.cor" [attr.stroke-dasharray]="arco(r.valor)" />
            </svg>
            <div class="valor"><b [style.color]="r.cor">{{ r.valor }}</b><span>de 100 · {{ r.nivel }}</span></div>
          </div>
          <ul class="componentes">
            @for (k of r.componentes; track k.nome) {
              <li [matTooltip]="k.texto">
                <span class="k-nome">{{ k.nome }}</span>
                <span class="k-barra"><span [style.width.%]="k.valor" [style.background]="corValor(k.valor)"></span></span>
                <span class="k-num">{{ k.valor }}</span>
              </li>
            }
          </ul>
          <details class="metodo">
            <summary>De onde vêm os números e como chegamos ao índice</summary>
            <ol>@for (l of r.metodo; track $index) { <li>{{ l }}</li> }</ol>
          </details>
        </article>
      }
    </section>

    <section class="grade">
      @for (i of c.indicadores; track i.id) {
        <article class="cartao ind" [class]="'cartao ind ' + i.tom + (i.destaque ? ' destaque' : '')" [matTooltip]="i.dica" matTooltipClass="dica-larga" tabindex="0">
          <div class="ind-topo"><span class="ind-titulo">{{ i.titulo }}</span><span class="fonte" [class.complemento]="i.fonte.startsWith('Notícias')">{{ i.fonte }}</span></div>
          <div class="ind-valor">
            <b>{{ i.valor }}</b>@if (i.unidade) { <small>{{ i.unidade }}</small> }
            @if (i.delta) { <app-delta [atual]="i.delta[0]" [anterior]="i.delta[1]" /> }
            @if (i.instavel) { <mat-icon class="instavel" matTooltip="Poucos casos: a variação percentual oscila muito">error_outline</mat-icon> }
          </div>
          <div class="ind-sub">{{ i.sub }}</div>
        </article>
      }
    </section>

    @if (c.serie; as s) {
      <section class="cartao">
        <div class="titulo-bloco">
          <h3 matTooltip="Barras: mortes violentas intencionais por mês no Sinesp (homicídio doloso, latrocínio e lesão corporal seguida de morte). Linha: ocorrências noticiadas no mesmo mês (eixo da direita).">
            Mortes violentas mês a mês × notícias <mat-icon class="info">info</mat-icon></h3>
          <span class="nota">Sinesp {{ s.labels[0] }}–{{ s.labels[s.labels.length - 1] }} · notícias 12 meses</span>
        </div>
        <app-grafico class="alto" [config]="grafico()" rotulo="Mortes violentas intencionais por mês e notícias" />
      </section>
    }

    @if (store.escopo() === 'CIDADE') {
      @if (isp(); as i) {
        <section class="cartao">
          <div class="titulo-bloco">
            <h3 [matTooltip]="'Dado oficial do ' + i.fonte + '. Cada linha é a área de uma delegacia (CISP). Compara os 12 meses mais recentes publicados com os 12 anteriores.'">
              <mat-icon>local_police</mat-icon> Por área de delegacia <span class="fonte">Oficial</span> <mat-icon class="info">info</mat-icon></h3>
            <span class="nota">ISP-RJ · {{ i.periodo.de }} a {{ i.periodo.ate }}</span>
          </div>
          <div class="tabela" role="table" aria-label="Ocorrências por área de delegacia">
            <div class="linha cabeca d" role="row"><span>Área</span><span>Letalidade violenta</span><span>Antes</span><span>Roubos de rua</span><span>Apreensão de drogas</span></div>
            @for (a of i.linhas; track a.cisp) {
              <div class="linha d" role="row">
                <span class="b-nome">{{ a.cisp }}ª DP</span>
                <span class="b-qtd"><span class="barra"><span [style.width.%]="a.largura"></span></span>{{ fmt(a.letal) }}</span>
                <span [class.perigo]="a.letal > a.letalAntes">{{ fmt(a.letalAntes) }}</span>
                <span>{{ fmt(a.roubos) }}</span>
                <span>{{ fmt(a.drogas) }}</span>
              </div>
            }
          </div>
        </section>
      }
      <section class="cartao trafico">
        <div class="titulo-bloco">
          <h3 matTooltip="Junta tudo o que existe sobre drogas e grupos criminosos para o local escolhido: notícias (todas as cidades), Sinesp (só por estado), ISP (RJ, por delegacia) e Fogo Cruzado (Rio, Recife, Salvador e Belém).">
            <mat-icon>local_police</mat-icon> Tráfico de drogas e facções <mat-icon class="info">info</mat-icon></h3>
          <span class="nota">{{ tf().periodo }}</span>
        </div>
        <div class="fc">
          <div><b>{{ fmt(tf().noticiasTrafico) }}</b><span>notícias de tráfico</span></div>
          <div><b class="perigo">{{ fmt(tf().noticiasFaccao) }}</b><span>notícias que citam facção ou milícia</span></div>
          @if (tf().sinespUf; as sx) {
            <div><b>{{ fmt(sx.valor) }}</b><span>ocorrências de tráfico no estado (Sinesp, {{ sx.rotulo }})@if (sx.delta !== null) { · {{ sx.delta > 0 ? '+' : '' }}{{ sx.delta }}% }</span></div>
          }
          @if (tf().isp; as ix) {
            <div><b>{{ fmt(ix.apreensoes) }}</b><span>apreensões de drogas na cidade (ISP-RJ, 12 meses)</span></div>
          }
          @if (tf().disputas !== null) {
            <div><b class="perigo">{{ fmt(tf().disputas) }}</b><span>tiroteios em disputa entre grupos armados (Fogo Cruzado)</span></div>
          }
        </div>
        @if (tf().faccoes) { <div class="nota">Grupos citados nas notícias: {{ tf().faccoes }}</div> }
        @if (tf().bairros) { <div class="nota">Bairros com mais notícias de tráfico: {{ tf().bairros }}</div> }
        <div class="nota">{{ tf().aviso }}</div>
      </section>
      @if (fogo(); as f) {
        <section class="cartao">
          <div class="titulo-bloco">
            <h3 matTooltip="Tiroteios registrados e checados pelo Instituto Fogo Cruzado, com local exato, nos últimos 12 meses. Aparecem no mapa como pontos vermelhos com borda preta.">
              <mat-icon>my_location</mat-icon> Tiroteios verificados <span class="fonte">Fogo Cruzado</span> <mat-icon class="info">info</mat-icon></h3>
            <span class="nota">12 meses</span>
          </div>
          @if (f.texto) {
            <div class="vazio pequeno"><mat-icon>info</mat-icon>{{ f.texto }}</div>
          } @else {
            <div class="fc">
              <div><b>{{ fmt(f.total) }}</b><span>tiroteios</span></div>
              <div><b class="perigo">{{ fmt(f.mortos) }}</b><span>mortos</span></div>
              <div><b>{{ fmt(f.feridos) }}</b><span>feridos</span></div>
              <div><b>{{ fmt(f.policia) }}</b><span>com ação policial</span></div>
            </div>
            @if (f.bairros.length) {
              <div class="nota">Bairros com mais tiroteios: {{ f.bairros }}</div>
            }
            @if (f.detalhado) {
              <h4 class="sub-bloco" matTooltip="Tiroteios que o Fogo Cruzado classificou como disputa entre facções e/ou milícia (sem agentes de segurança em serviço), ou com motivo complementar ligado a facção, milícia ou tráfico.">
                <mat-icon>groups</mat-icon> Facções e milícias</h4>
              <div class="fc">
                <div><b class="perigo">{{ fmt(f.disputas) }}</b><span>tiroteios em disputa entre grupos armados</span></div>
                <div><b>{{ fmt(f.mortosDisputa) }}</b><span>mortos nessas disputas</span></div>
                <div><b>{{ pctTexto(f.disputas, f.total) }}</b><span>dos tiroteios da cidade</span></div>
              </div>
              @if (f.bairrosDisputa) { <div class="nota">Onde as disputas mais acontecem: {{ f.bairrosDisputa }}</div> }
              <div class="fc">
                <div><b>{{ fmt(f.chacinas) }}</b><span>chacinas (3+ mortos)</span></div>
                <div><b>{{ fmt(f.agentesM) }} / {{ fmt(f.agentesF) }}</b><span>agentes mortos / feridos</span></div>
                <div><b>{{ fmt(f.jovens) }}</b><span>crianças e adolescentes atingidos</span></div>
                <div><b>{{ fmt(f.balas) }}</b><span>bala perdida</span></div>
                <div><b>{{ fmt(f.transporte) }}</b><span>com transporte interrompido</span></div>
                <div><b>{{ fmt(f.animais) }}</b><span>animais atingidos</span></div>
              </div>
              @if (f.motivos) { <div class="nota">Motivos registrados: {{ f.motivos }}</div> }
              <div class="nota">No mapa, tiroteios em disputa entre grupos armados têm borda roxa. O território de cada facção não vem na API do Fogo Cruzado.</div>
            }
          }
        </section>
      }
      <section class="cartao">
        <div class="titulo-bloco">
          <h3 matTooltip="Ocorrências noticiadas nos últimos 12 meses ligadas a cada bairro (pelo contorno do bairro ou pelo nome citado). Contornos oficiais do IBGE (Censo 2022); onde o IBGE não tem, OpenStreetMap. Clique para ver no mapa.">
            Ocorrências por bairro <mat-icon class="info">info</mat-icon></h3>
          <span class="nota">{{ resumoBairros() }}</span>
        </div>
        @if (bairros().length) {
          <div class="tabela" role="table" aria-label="Ocorrências por bairro">
            <div class="linha cabeca" role="row"><span>Bairro</span><span>Notícias</span><span>Graves</span><span>Últimos 30 dias</span><span>Tipo principal</span></div>
            @for (b of bairros(); track b.nome) {
              <button type="button" class="linha" role="row" (click)="store.focar(b.lat, b.lng, 15)" [matTooltip]="'Ver ' + b.nome + ' no mapa'">
                <span class="b-nome">{{ b.nome }}</span>
                <span class="b-qtd"><span class="barra"><span [style.width.%]="largura(b.qtd)"></span></span>{{ fmt(b.qtd) }}</span>
                <span [class.perigo]="b.graves">{{ fmt(b.graves) }}</span>
                <span>{{ fmt(b.recentes) }}</span>
                <span class="tipo"><i [style.background]="cor(b.catTop)"></i>{{ nomeCat(b.catTop) }}</span>
              </button>
            }
          </div>
        } @else {
          <div class="vazio pequeno"><mat-icon>signpost</mat-icon>{{ store.bairrosOsm()?.carregando ? 'Carregando bairros…' : 'Nenhuma notícia dos últimos 12 meses cita bairro ou tem local preciso.' }}</div>
        }
      </section>
    } @else if (c.municipios.length) {
      <section class="cartao">
        <div class="titulo-bloco">
          <h3 matTooltip="Taxa de mortes violentas intencionais por 100 mil habitantes nos últimos 12 meses, só municípios com 20 mil habitantes ou mais.">
            Municípios mais violentos <mat-icon class="info">info</mat-icon></h3>
          <span class="nota">MVI por 100 mil · 12 meses</span>
        </div>
        <div class="tabela" role="table">
          <div class="linha cabeca m" role="row"><span>Município</span><span>Taxa</span><span>Casos</span><span>Antes</span></div>
          @for (m of c.municipios; track m.nome; let i = $index) {
            <button type="button" class="linha m" role="row" (click)="store.abrirLocal(store.uf(), m.nome)">
              <span class="b-nome">{{ i + 1 }}. {{ m.nome }}</span><b>{{ f1(m.taxa) }}</b><span>{{ fmt(m.total) }}</span><span>{{ fmt(m.anterior) }}</span>
            </button>
          }
        </div>
      </section>
    }

    <section class="cartao">
      <div class="titulo-bloco"><h3><mat-icon>auto_awesome</mat-icon> Insights</h3><span class="nota">oficiais primeiro</span></div>
      <app-insights [itens]="store.insights()" />
    </section>

    <section class="cartao">
      <div class="titulo-bloco"><h3><mat-icon>dataset</mat-icon> Fontes e atualização</h3></div>
      <ul class="fontes">
        @for (x of c.fontes; track x.nome) {
          <li [matTooltip]="x.dica"><i [class]="'farol ' + x.estado"></i><b>{{ x.nome }}</b><span>{{ x.detalhe }}</span></li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host { display: grid; gap: 12px; }
    .topo { display: grid; gap: 12px; grid-template-columns: 1fr; }
    @container painel (min-width: 760px) { .topo { grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr); } }
    header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    header mat-icon { color: var(--mat-sys-primary); }
    h3 { font: var(--mat-sys-title-medium); margin: 0; display: inline-flex; align-items: center; gap: 6px; }
    .info { font-size: 16px; width: 16px; height: 16px; color: var(--mat-sys-on-surface-variant); cursor: help; }
    .selo { margin-left: auto; font: var(--mat-sys-label-small); background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container);
      border-radius: 6px; padding: 2px 8px; cursor: help; }
    .parecer p { margin: 0 0 6px; font: var(--mat-sys-body-medium); line-height: 1.55; }
    .risco { cursor: help; }
    .metodo { margin-top: 10px; font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); cursor: auto; }
    .metodo summary { cursor: pointer; color: var(--mat-sys-primary); font-weight: 600; }
    .metodo ol { margin: 6px 0 0; padding-left: 18px; display: grid; gap: 4px; }
    .medidor { display: flex; align-items: center; gap: 12px; }
    .medidor svg { width: 130px; flex: none; }
    .trilho, .arco { fill: none; stroke-width: 11; stroke-linecap: round; }
    .trilho { stroke: var(--mat-sys-surface-container-highest); }
    .valor { display: flex; flex-direction: column; }
    .valor b { font: var(--mat-sys-display-small); font-weight: 700; line-height: 1; }
    .valor span { font: var(--mat-sys-label-large); color: var(--mat-sys-on-surface-variant); }
    .componentes { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 5px; }
    .componentes li { display: grid; grid-template-columns: minmax(0, 1.4fr) 1fr 28px; gap: 8px; align-items: center; font: var(--mat-sys-body-small); }
    .k-nome { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .k-barra { height: 7px; border-radius: 4px; background: var(--mat-sys-surface-container-highest); overflow: hidden; }
    .k-barra span { display: block; height: 100%; border-radius: 4px; }
    .k-num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
    .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; }
    .ind { display: flex; flex-direction: column; gap: 4px; cursor: help; border-top: 3px solid var(--mat-sys-outline-variant); }
    .ind.alerta { border-top-color: var(--cor-perigo); }
    .ind.positivo { border-top-color: var(--cor-sucesso); }
    .ind.destaque { background: color-mix(in srgb, var(--cor-perigo) 6%, var(--mat-sys-surface-container-low)); }
    .ind:focus-visible { outline: 2px solid var(--mat-sys-primary); outline-offset: 2px; }
    .ind-topo { display: flex; justify-content: space-between; gap: 6px; align-items: flex-start; }
    .ind-titulo { font: var(--mat-sys-title-small); }
    .fonte { flex: none; font: var(--mat-sys-label-small); background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); border-radius: 4px; padding: 1px 6px; }
    .fonte.complemento { background: var(--mat-sys-surface-container-highest); color: var(--mat-sys-on-surface-variant); }
    .ind-valor { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .ind-valor b { font: var(--mat-sys-headline-medium); font-weight: 600; font-variant-numeric: tabular-nums; }
    .ind-valor small { font: var(--mat-sys-label-large); color: var(--mat-sys-on-surface-variant); }
    .instavel { font-size: 18px; width: 18px; height: 18px; color: var(--mat-sys-on-surface-variant); }
    .ind-sub { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .titulo-bloco { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
    .titulo-bloco h3 mat-icon:not(.info) { color: var(--mat-sys-primary); font-size: 20px; width: 20px; height: 20px; }
    app-grafico.alto { height: 260px; }
    .tabela { display: grid; }
    .linha { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(90px, 1.2fr) 60px 70px minmax(0, 1fr); gap: 8px; align-items: center;
      padding: 7px 6px; border: 0; border-bottom: 1px solid var(--mat-sys-outline-variant); background: none; color: inherit; font: var(--mat-sys-body-medium);
      text-align: left; cursor: pointer; font-variant-numeric: tabular-nums; }
    .linha.m { grid-template-columns: minmax(0, 2fr) 70px 60px 60px; }
    .linha.d { grid-template-columns: minmax(0, 1fr) minmax(90px, 1.4fr) 60px 80px 90px; cursor: default; }
    .fc { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin-bottom: 6px; }
    .fc span { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .sub-bloco { display: flex; align-items: center; gap: 6px; margin: 12px 0 6px; font: var(--mat-sys-title-small); }
    .sub-bloco mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .fc div { display: flex; flex-direction: column; }
    .fc b { font: var(--mat-sys-headline-small); font-weight: 600; font-variant-numeric: tabular-nums; }
    .fc span { font: var(--mat-sys-label-medium); color: var(--mat-sys-on-surface-variant); }
    h3 .fonte { margin-left: 4px; vertical-align: middle; }
    .linha:hover { background: var(--mat-sys-surface-container); }
    .linha.cabeca { cursor: default; font: var(--mat-sys-label-medium); color: var(--mat-sys-on-surface-variant); }
    .linha.cabeca:hover { background: none; }
    .b-nome { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
    .b-qtd { display: flex; align-items: center; gap: 6px; }
    .barra { flex: 1; height: 8px; border-radius: 4px; background: var(--mat-sys-surface-container-high); overflow: hidden; }
    .barra span { display: block; height: 100%; background: linear-gradient(90deg, #f59e0b, #dc2626); border-radius: 4px; }
    .perigo { color: var(--cor-perigo); font-weight: 600; }
    .tipo { display: flex; align-items: center; gap: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    .tipo i { width: 9px; height: 9px; border-radius: 50%; flex: none; }
    @container painel (max-width: 560px) { .linha { grid-template-columns: minmax(0, 1.4fr) minmax(80px, 1fr) 50px; } .linha > :nth-child(n+4) { display: none; } }
    .fontes { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
    .fontes li { display: grid; grid-template-columns: 12px minmax(0, 1fr) auto; gap: 8px; align-items: center; font: var(--mat-sys-body-small); cursor: help; }
    .fontes li span { color: var(--mat-sys-on-surface-variant); text-align: right; }
    .farol { width: 10px; height: 10px; border-radius: 50%; }
    .farol.ok { background: var(--cor-sucesso); }
    .farol.parcial { background: #eab308; }
    .farol.sem { background: var(--mat-sys-outline); }
  `,
})
export class PanoramaComponent {
  protected readonly store = inject(PainelStore);
  protected readonly fmt = fmt;
  protected readonly f1 = fmt1;
  protected readonly cor = corCategoria;
  protected readonly nomeCat = nomeCategoria;
  protected readonly carregando = computed(() => this.store.carregando() && (!this.store.dados() || !!this.store.dados()!.vazio));

  protected readonly bairros = computed(() => this.store.bairros12().lista.filter((b) => b.qtd > 0).slice(0, 15));
  protected readonly resumoBairros = computed(() => {
    const r = this.store.bairros12();
    const total = this.store.filtrados12().todas.length;
    return total ? `${pct(r.ligadas, total)}% das notícias ligadas a um bairro · 12 meses` : '12 meses';
  });

  protected readonly isp = computed(() => {
    const i = this.store.ispCidade();
    if (!i) return null;
    const linhas = i.areas.map((a) => ({
      cisp: a.cisp, letal: a.u12['letalidade_violenta'] || 0, letalAntes: a.a12['letalidade_violenta'] || 0,
      roubos: a.u12['roubo_rua'] ?? a.u12['roubo_transeunte'] ?? 0, drogas: a.u12['apreensao_drogas'] || 0, largura: 0,
    })).sort((x, y) => y.letal - x.letal).slice(0, 15);
    const max = linhas[0]?.letal || 1;
    linhas.forEach((l) => { l.largura = Math.max(4, (l.letal / max) * 100); });
    return { fonte: i.fonte, periodo: i.periodo, linhas };
  });

  /** Tráfico e facções: notícias (todas as cidades), Sinesp por estado, ISP-RJ e Fogo Cruzado, respeitando os filtros. */
  protected readonly tf = computed(() => {
    const f = this.store.filtrados();
    const dias = this.store.periodoDias();
    const traf = f.todas.filter((o) => o.cat === 'TRAFICO');
    const contagem: Record<string, number> = {};
    let comFaccao = 0;
    for (const o of f.todas) {
      const t = normalizar(o.titulo);
      const achados = FACCOES.filter((x) => x.re.test(t)).map((x) => x.nome);
      if (achados.length) { comFaccao++; achados.forEach((n) => (contagem[n] = (contagem[n] || 0) + 1)); }
    }
    const porBairro: Record<string, number> = {};
    traf.forEach((o) => { if (o.bairro && o.bairro !== 'Local não informado') porBairro[o.bairro] = (porBairro[o.bairro] || 0) + 1; });
    const top = (m: Record<string, number>, n: number) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, q]) => `${k} (${q})`).join(', ');
    const pan = this.store.panorama();
    const ofUf = pan?.uf === this.store.uf() ? aplicarPeriodo(pan.oficial || null, mesesDoPeriodo(dias)) : null;
    const evT = ofUf?.eventos.find((e) => /^tr[aá]fico de drogas/i.test(e.nome));
    const valT = evT ? (evT.sel ?? evT.porAno[2]) : null;
    const antT = evT ? (evT.selAnterior ?? evT.parcialAnterior) : null;
    const isp = this.store.ispCidade();
    const fogo = this.store.fogoCidade()?.dado;
    const temDetalhe = !!fogo?.itens.some((t) => t.gp !== undefined);
    const ufFogo = UFS_FOGO_CRUZADO.includes(this.store.uf());
    return {
      periodo: dias >= 365 ? '12 meses' : dias >= 180 ? '6 meses' : dias + ' dias',
      noticiasTrafico: traf.length, noticiasFaccao: comFaccao, faccoes: top(contagem, 8), bairros: top(porBairro, 6),
      sinespUf: evT && valT != null ? { valor: valT, rotulo: ofUf?.rotuloSel || 'ano', delta: variacao(valT, antT) } : null,
      isp: isp?.areas?.length ? { apreensoes: isp.areas.reduce((a, x) => a + (x.u12['apreensao_drogas'] || 0), 0) } : null,
      disputas: temDetalhe ? fogo!.itens.filter((t) => t.gp).length : null,
      aviso: 'O Sinesp não publica tráfico por município, só por estado. ' +
        (isp ? 'No RJ, o ISP publica apreensões de drogas por delegacia. ' : '') +
        (temDetalhe ? 'Disputas entre facções/milícia vêm do Fogo Cruzado (motivo "Disputa"). ' :
          ufFogo ? 'Disputas entre facções aparecem aqui depois de recopiar 7_Fontes_Area no Apps Script. ' : 'O Fogo Cruzado cobre só Rio, Recife, Salvador e Belém (regiões metropolitanas). ') +
        'Os grupos citados vêm das manchetes das notícias.',
    };
  });

  protected readonly fogo = computed(() => {
    const v = this.store.fogoCidade();
    if (!v) return null;
    const vazio = { total: 0, mortos: 0, feridos: 0, policia: 0, bairros: '', detalhado: false } as any;
    if (v.carregando) return { ...vazio, texto: 'Carregando tiroteios do Fogo Cruzado…' };
    const d = v.dado;
    if (!d) return null;
    if (!d.configurado) return { ...vazio, texto: 'Fonte disponível para esta cidade. Falta gravar a conta do Fogo Cruzado nas propriedades do script (FOGO_CRUZADO_EMAIL e FOGO_CRUZADO_SENHA).' };
    if (d.erro) return { ...vazio, texto: 'Fogo Cruzado não respondeu agora: ' + d.erro };
    const porBairro: Record<string, number> = {};
    d.itens.forEach((t) => { if (t.bairro) porBairro[t.bairro] = (porBairro[t.bairro] || 0) + 1; });
    const top = Object.entries(porBairro).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, q]) => `${n} (${q})`).join(', ');
    return {
      texto: d.itens.length ? '' : 'Nenhum tiroteio registrado nos últimos 12 meses.',
      total: d.itens.length, mortos: d.itens.reduce((a, t) => a + t.mortos, 0), feridos: d.itens.reduce((a, t) => a + t.feridos, 0),
      policia: d.itens.filter((t) => t.policia).length, bairros: top,
      ...resumoFaccoes(d.itens),
    };
  });

  protected pctTexto(n: number, total: number): string {
    return total ? Math.round((n / total) * 100) + '%' : '—';
  }

  protected arco(v: number): string {
    const comp = Math.PI * 50;
    return `${(comp * v) / 100} ${comp}`;
  }

  protected corValor(v: number): string {
    return v >= 75 ? '#b91c1c' : v >= 55 ? '#ea580c' : v >= 35 ? '#ca8a04' : '#16a34a';
  }

  protected largura(q: number): number {
    const max = this.bairros()[0]?.qtd || 1;
    return Math.max(4, (q / max) * 100);
  }

  protected readonly grafico = computed(() => {
    const s = this.store.compilado().serie!;
    const anoIni = Number('20' + s.labels[0].split('/')[1]);
    return {
      type: 'bar',
      data: {
        labels: s.labels,
        datasets: [
          { type: 'bar', label: 'Mortes violentas (Sinesp)', data: s.mvi, yAxisID: 'y', borderRadius: 2, maxBarThickness: 18,
            backgroundColor: s.labels.map((l) => CORES_ANOS[Math.min(2, Number('20' + l.split('/')[1]) - anoIni)]) },
          { type: 'line', label: 'Notícias (complemento)', data: s.noticias, yAxisID: 'y1', borderColor: '#f59e0b', backgroundColor: '#f59e0b',
            borderWidth: 2, pointRadius: 2, spanGaps: false, tension: 0.3 },
        ],
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
          y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Sinesp' } },
          y1: { position: 'right', beginAtZero: true, ticks: { precision: 0 }, grid: { display: false }, title: { display: true, text: 'Notícias' } },
        },
      },
    };
  });
}

/** Resumo de facções/milícias e do contexto dos tiroteios (campos detalhados do Fogo Cruzado). */
function resumoFaccoes(itens: Tiroteio[]) {
  const detalhado = itens.some((t) => t.gp !== undefined);
  const disputa = itens.filter((t) => t.gp);
  const contar = (l: string[]) => {
    const c: Record<string, number> = {};
    l.forEach((x) => { if (x) c[x] = (c[x] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  };
  return {
    detalhado,
    disputas: disputa.length,
    mortosDisputa: disputa.reduce((a, t) => a + t.mortos, 0),
    bairrosDisputa: contar(disputa.map((t) => t.bairro)).slice(0, 6).map(([n, q]) => `${n} (${q})`).join(', '),
    chacinas: itens.filter((t) => t.ch).length,
    agentesM: itens.reduce((a, t) => a + (t.ag?.m || 0), 0),
    agentesF: itens.reduce((a, t) => a + (t.ag?.f || 0), 0),
    jovens: itens.reduce((a, t) => a + (t.cr || 0), 0),
    balas: itens.filter((t) => t.bp).length,
    transporte: itens.filter((t) => t.tr?.length).length,
    animais: itens.reduce((a, t) => a + (t.an || 0), 0),
    motivos: contar(itens.map((t) => t.motivo)).slice(0, 6).map(([n, q]) => `${n} (${q})`).join(', '),
  };
}

/** Facções e grupos citados nas manchetes (texto já normalizado: minúsculas, sem acento). */
const FACCOES: { nome: string; re: RegExp }[] = [
  { nome: 'PCC', re: /\bpcc\b|primeiro comando da capital/ },
  { nome: 'Comando Vermelho', re: /comando vermelho|\bcv\b/ },
  { nome: 'Terceiro Comando Puro', re: /terceiro comando|\btcp\b/ },
  { nome: 'Amigos dos Amigos', re: /amigos dos amigos/ },
  { nome: 'Milícia', re: /\bmilicia|\bmilicianos?\b/ },
  { nome: 'Os Manos', re: /\bos manos\b/ },
  { nome: 'Bala na Cara', re: /bala na cara/ },
  { nome: 'Guardiões do Estado (GDE)', re: /guardioes do estado|\bgde\b/ },
  { nome: 'Sindicato do Crime', re: /sindicato do crime/ },
  { nome: 'Família do Norte', re: /familia do norte|\bfdn\b/ },
  { nome: 'Bonde do Maluco', re: /bonde do maluco|\bbdm\b/ },
  { nome: 'PGC', re: /primeiro grupo catarinense|\bpgc\b/ },
  { nome: 'Comando Classe A', re: /comando classe a/ },
  { nome: 'Facção (sem nome)', re: /\bfac(c|ç)(ao|oes)\b/ },
];
