import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UFS_FOGO_CRUZADO } from '../core/areas';
import { Bairro, dentro } from '../core/bairros';
import { FACCOES } from '../core/faccoes';
import { Ocorrencia } from '../core/modelos';
import { PainelStore } from '../core/painel.store';
import { fmt, normalizar, rotuloPeriodo } from '../core/util';

interface Area {
  nome: string; lat: number; lng: number;
  disputas: number; tiroteios: number; mortos: number; chacinas: number; policia: number;
  faccao: number; trafico: number; oficialTrafico: number;
  grupos: [string, number][]; noticias: Ocorrencia[]; pontos: number; indice: number;
}

/** Pesos do índice da aba (explicados na tela). */
const PESO = { disputa: 3, morto: 2, tiroteio: 1, faccao: 2, trafico: 1, oficial: 0.5 };

/**
 * Facções e disputas: só dados reais e verificáveis.
 * Fogo Cruzado (tiroteios checados, com motivo "disputa entre grupos armados"), notícias que citam facção
 * ou tráfico, ligadas ao bairro pelo contorno oficial, e tráfico registrado pela secretaria (SSP-SP).
 */
@Component({
  selector: 'app-faccoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    @let r = resumo();
    @if (store.escopo() !== 'CIDADE') {
      <div class="vazio"><mat-icon>location_city</mat-icon>Escolha um município para ver facções e áreas de disputa.</div>
    } @else {
      <section class="cartao topo">
        <div class="titulo-bloco">
          <h3><mat-icon>groups</mat-icon> Facções e grupos armados em {{ store.cidade() }}</h3>
          <span class="nota">{{ periodo() }}</span>
        </div>
        <div class="fc">
          <div><b class="perigo">{{ fmt(r.noticiasFaccao) }}</b><span>notícias que citam facção ou milícia</span></div>
          <div><b>{{ fmt(r.noticiasTrafico) }}</b><span>notícias de tráfico de drogas</span></div>
          @if (r.fogo) {
            <div><b class="perigo">{{ fmt(r.fogo.disputas) }}</b><span>tiroteios em disputa entre grupos armados (Fogo Cruzado)</span></div>
            <div><b>{{ fmt(r.fogo.mortos) }}</b><span>mortos nessas disputas</span></div>
            <div><b>{{ fmt(r.fogo.policia) }}</b><span>tiroteios com ação policial</span></div>
            <div><b>{{ fmt(r.fogo.chacinas) }}</b><span>chacinas (3 ou mais mortos)</span></div>
          }
          @if (r.oficialTrafico !== null) {
            <div><b>{{ fmt(r.oficialTrafico) }}</b><span>registros de tráfico de drogas ({{ r.orgao }})</span></div>
          }
        </div>
        @if (r.grupos.length) {
          <div class="grupos">
            @for (g of r.grupos; track g[0]) { <span class="grupo">{{ g[0] }} <b>{{ g[1] }}</b></span> }
          </div>
        } @else {
          <div class="nota">Nenhuma notícia do período cita facção ou milícia pelo nome.</div>
        }
        <div class="nota">{{ r.fontes }}</div>
      </section>

      <div class="nota explica"><mat-icon>info</mat-icon>
        <span>Bairros com mais sinais de atuação de facções, do maior para o menor. Pontos: disputa entre grupos armados ×{{ peso.disputa }},
        morto em tiroteio ×{{ peso.morto }}, outro tiroteio ×{{ peso.tiroteio }}, notícia que cita facção ×{{ peso.faccao }}, notícia de tráfico ×{{ peso.trafico }}@if (r.oficialTrafico !== null) {, registro oficial de tráfico ×0,5}.
        Índice 100 = bairro com mais pontos na cidade. Nenhum órgão publica o território de cada facção; aqui só entra o que foi registrado.</span></div>

      @for (a of areas(); track a.nome; let i = $index) {
        <article class="cartao area">
          <div class="cab">
            <span class="numero" [style.background]="cor(a.indice)">{{ i + 1 }}</span>
            <b class="nome">{{ a.nome }}</b>
            <span class="selo" [style.color]="cor(a.indice)" [style.border-color]="cor(a.indice)">Índice {{ a.indice }} de 100</span>
          </div>
          <div class="barra"><span [style.width.%]="a.indice" [style.background]="cor(a.indice)"></span></div>
          <div class="meta">
            @if (a.disputas) { <span class="perigo"><b>{{ a.disputas }}</b> disputa{{ a.disputas > 1 ? 's' : '' }} entre grupos armados</span> }
            @if (a.tiroteios) { <span><b>{{ a.tiroteios }}</b> tiroteio{{ a.tiroteios > 1 ? 's' : '' }}</span> }
            @if (a.mortos) { <span class="perigo"><b>{{ a.mortos }}</b> morto{{ a.mortos > 1 ? 's' : '' }}</span> }
            @if (a.policia) { <span><b>{{ a.policia }}</b> com ação policial</span> }
            @if (a.chacinas) { <span class="perigo"><b>{{ a.chacinas }}</b> chacina{{ a.chacinas > 1 ? 's' : '' }}</span> }
            @if (a.faccao) { <span><b>{{ a.faccao }}</b> notícia{{ a.faccao > 1 ? 's' : '' }} citando facção</span> }
            @if (a.trafico) { <span><b>{{ a.trafico }}</b> de tráfico</span> }
            @if (a.oficialTrafico) { <span><b>{{ fmt(a.oficialTrafico) }}</b> registros de tráfico ({{ r.orgao }})</span> }
          </div>
          @if (a.grupos.length) {
            <div class="meta">Grupos citados: @for (g of a.grupos; track g[0]) { <span class="grupo">{{ g[0] }} {{ g[1] }}</span> }</div>
          }
          @if (a.noticias.length) {
            <ul class="exemplos">
              @for (o of a.noticias; track o.id) { <li><a [href]="o.link" target="_blank" rel="noopener">{{ o.titulo }}</a> <small>{{ o.data }} · {{ o.veiculo }}</small></li> }
            </ul>
          }
          <button type="button" class="ver" (click)="store.focar(a.lat, a.lng, 15)">Ver no mapa <mat-icon>arrow_forward</mat-icon></button>
        </article>
      } @empty {
        <div class="vazio"><mat-icon>verified_user</mat-icon>Nenhum bairro com notícia de facção, tráfico ou tiroteio verificado no período. Amplie o período para 12 meses.</div>
      }
    }
  `,
  styles: `
    :host { display: grid; gap: 10px; }
    .titulo-bloco { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
    h3 { display: flex; align-items: center; gap: 6px; margin: 0; font: var(--mat-sys-title-medium); }
    .fc { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin: 10px 0; }
    .fc div { display: flex; flex-direction: column; }
    .fc b { font: var(--mat-sys-headline-small); font-weight: 700; }
    .fc span { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .perigo { color: var(--cor-perigo); }
    .nota { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .explica { display: flex; gap: 6px; align-items: flex-start; }
    .explica mat-icon { font-size: 18px; width: 18px; height: 18px; flex: none; }
    .grupos { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
    .grupo { font: var(--mat-sys-label-medium); border: 1px solid var(--mat-sys-outline-variant); border-radius: 999px; padding: 2px 8px; }
    .area { display: grid; gap: 8px; }
    .cab { display: flex; align-items: center; gap: 10px; }
    .numero { width: 28px; height: 28px; border-radius: 50%; color: #fff; display: grid; place-items: center; font-weight: 700; flex: none; }
    .nome { flex: 1; min-width: 0; }
    .selo { font: var(--mat-sys-label-medium); border: 1px solid; border-radius: 999px; padding: 1px 8px; white-space: nowrap; }
    .barra { height: 6px; background: var(--mat-sys-surface-container-high); border-radius: 3px; overflow: hidden; }
    .barra span { display: block; height: 100%; }
    .meta { display: flex; flex-wrap: wrap; gap: 6px 14px; font: var(--mat-sys-body-small); align-items: center; }
    .exemplos { margin: 0; padding-left: 18px; font: var(--mat-sys-body-small); display: grid; gap: 2px; }
    .exemplos a { color: inherit; }
    .exemplos small { color: var(--mat-sys-on-surface-variant); }
    .ver { justify-self: end; background: none; border: 0; color: var(--mat-sys-primary); font: var(--mat-sys-label-large); font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; }
    .ver mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .vazio { display: flex; gap: 8px; align-items: center; padding: 16px; color: var(--mat-sys-on-surface-variant); }
  `,
})
export class FaccoesComponent {
  protected readonly store = inject(PainelStore);
  protected readonly fmt = fmt;
  protected readonly peso = PESO;
  protected readonly periodo = computed(() => 'últimos ' + rotuloPeriodo(this.store.periodoDias()));

  /** Tiroteios do Fogo Cruzado dentro do período escolhido. */
  private readonly tiroteios = computed(() => {
    const itens = this.store.fogoCidade()?.dado?.itens || [];
    const limite = new Date(Date.now() - this.store.periodoDias() * 86400000).toISOString().slice(0, 10);
    return itens.filter((t) => (t.d || '').slice(0, 10) >= limite);
  });

  protected readonly resumo = computed(() => {
    const todas = this.store.filtrados().todas;
    const cont: Record<string, number> = {};
    let faccao = 0, trafico = 0;
    for (const o of todas) {
      const g = gruposDe(o.titulo);
      if (g.length) { faccao++; g.forEach((n) => (cont[n] = (cont[n] || 0) + 1)); }
      if (o.cat === 'TRAFICO') trafico++;
    }
    const uf = this.store.uf();
    const temFogo = !!this.store.fogoCidade()?.dado?.configurado && UFS_FOGO_CRUZADO.includes(uf);
    const t = this.tiroteios();
    const disputa = t.filter((x) => x.gp);
    const of = this.store.oficialCidade();
    const ofTraf = of ? this.oficialTraficoPorBairro().total : null;
    return {
      noticiasFaccao: faccao, noticiasTrafico: trafico,
      grupos: Object.entries(cont).sort((a, b) => b[1] - a[1]),
      fogo: temFogo ? { disputas: disputa.length, mortos: disputa.reduce((a, x) => a + x.mortos, 0), policia: t.filter((x) => x.policia).length, chacinas: t.filter((x) => x.ch).length } : null,
      oficialTrafico: ofTraf, orgao: of?.orgao || '',
      fontes: 'Fontes: notícias do Google Notícias e da imprensa local (grupos citados pelo nome na manchete)' +
        (temFogo ? '; Instituto Fogo Cruzado (tiroteios checados, com o motivo registrado)' : '; o Fogo Cruzado só cobre as regiões de Rio, Recife, Salvador e Belém') +
        (of ? `; ${of.orgao} (boletins de ocorrência de tráfico de drogas)` : '') + '.',
    };
  });

  /** Tráfico registrado pela secretaria, por bairro (pontos dos boletins dentro de cada contorno). */
  private readonly oficialTraficoPorBairro = computed(() => {
    const o = this.store.oficialCidade();
    const porBairro = new Map<string, number>();
    let total = 0;
    if (!o) return { porBairro, total };
    total = o.cats?.['trafico'] || 0;
    const bairros = (this.store.listaBairros() as Bairro[]).filter((b) => b.aneis?.length);
    const limite = Number(new Date(Date.now() - this.store.periodoDias() * 86400000).toISOString().slice(0, 10).replace(/-/g, ''));
    for (const p of o.pontos || []) {
      if (p[2] !== 'trafico' || Number(p[3]) < limite) continue;
      const b = bairros.find((x) => dentro(p[0], p[1], x.aneis!));
      if (b) porBairro.set(b.n, (porBairro.get(b.n) || 0) + 1);
    }
    return { porBairro, total };
  });

  protected readonly areas = computed<Area[]>(() => {
    const mapa = new Map<string, Area>();
    const nova = (nome: string, lat: number, lng: number): Area => ({ nome, lat, lng, disputas: 0, tiroteios: 0, mortos: 0, chacinas: 0, policia: 0,
      faccao: 0, trafico: 0, oficialTrafico: 0, grupos: [], noticias: [], pontos: 0, indice: 0 });
    const grupos = new Map<string, Record<string, number>>();
    // Notícias, já ligadas ao bairro pelo contorno ou pelo nome
    for (const b of this.store.bairrosMapa().lista) {
      for (const o of b.ocorrencias) {
        const g = gruposDe(o.titulo);
        const traf = o.cat === 'TRAFICO';
        if (!g.length && !traf) continue;
        const a = mapa.get(b.nome) || nova(b.nome, b.lat, b.lng);
        if (g.length) {
          a.faccao++;
          const c = grupos.get(b.nome) || {};
          g.forEach((n) => (c[n] = (c[n] || 0) + 1));
          grupos.set(b.nome, c);
        }
        if (traf) a.trafico++;
        if (a.noticias.length < 3) a.noticias.push(o);
        mapa.set(b.nome, a);
      }
    }
    // Tiroteios do Fogo Cruzado: pelo contorno do bairro; sem contorno, pelo nome que o Fogo Cruzado registra
    const bairros = (this.store.listaBairros() as Bairro[]).filter((b) => b.aneis?.length);
    for (const t of this.tiroteios()) {
      const b = bairros.find((x) => dentro(t.lat, t.lng, x.aneis!));
      const nome = b?.n || t.bairro;
      if (!nome) continue;
      const a = mapa.get(nome) || nova(nome, b?.lat ?? t.lat, b?.lng ?? t.lng);
      a.tiroteios++;
      a.mortos += t.mortos;
      if (t.gp) a.disputas++;
      if (t.ch) a.chacinas++;
      if (t.policia) a.policia++;
      mapa.set(nome, a);
    }
    // Tráfico oficial por bairro: mostrado junto, fora dos pontos (são registros policiais, outra escala)
    const traf = this.oficialTraficoPorBairro().porBairro;
    for (const [nome, n] of traf) {
      const a = mapa.get(nome);
      if (a) a.oficialTrafico = n;
      else {
        const b = this.store.listaBairros().find((x) => x.n === nome);
        if (b) mapa.set(nome, { ...nova(nome, b.lat, b.lng), oficialTrafico: n });
      }
    }
    const lista = [...mapa.values()];
    for (const a of lista) {
      a.grupos = Object.entries(grupos.get(a.nome) || {}).sort((x, y) => y[1] - x[1]);
      a.pontos = a.disputas * PESO.disputa + a.mortos * PESO.morto + (a.tiroteios - a.disputas) * PESO.tiroteio + a.faccao * PESO.faccao + a.trafico * PESO.trafico + a.oficialTrafico * PESO.oficial;
    }
    lista.sort((x, y) => y.pontos - x.pontos);
    const max = lista[0]?.pontos || 1;
    for (const a of lista) a.indice = Math.max(1, Math.round((a.pontos / max) * 100));
    return lista.slice(0, 15);
  });

  protected cor(v: number): string {
    return v >= 75 ? '#b91c1c' : v >= 50 ? '#ea580c' : v >= 25 ? '#ca8a04' : '#64748b';
  }
}

function gruposDe(titulo: string): string[] {
  const t = normalizar(titulo);
  const achados = FACCOES.filter((x) => x.re.test(t)).map((x) => x.nome);
  // "Facção (sem nome)" só conta quando nenhuma facção foi citada pelo nome
  return achados.length > 1 ? achados.filter((n) => n !== 'Facção (sem nome)') : achados;
}
