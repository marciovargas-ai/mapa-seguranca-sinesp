import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, HostListener, inject, output, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Aba, PainelStore } from './core/painel.store';

/**
 * alvo: seletor do que fica em destaque. aba: abre esta aba antes. topoAbas: rola a caixa do painel até a barra das
 * abas (usado nos passos que apresentam uma aba inteira).
 */
interface Passo { alvo: string; titulo: string; texto: string; aba?: Aba; topoAbas?: boolean }

/** Passos do tour, na ordem em que as partes aparecem na tela: topo, cartões, filtros, mapa, abas e ferramentas. */
const PASSOS: Passo[] = [
  { alvo: '.busca', titulo: 'Escolha o local', texto: 'Digite qualquer município do Brasil (ou um CEP) ou escolha um estado na lista ao lado. Tudo no painel muda para o local escolhido: mapa, números, abas e notícias.' },
  { alvo: '.kpis', titulo: 'Números oficiais', texto: 'Os cartões do topo vêm do Sinesp (Ministério da Justiça). "Mortes violentas" soma homicídio doloso, feminicídio, latrocínio e lesão corporal seguida de morte. A seta compara o período escolhido com os mesmos meses do ano anterior.' },
  { alvo: '.faixa-inmet', titulo: 'Avisos do INMET', texto: 'Quando há aviso meteorológico para o local (tempestade, chuva forte, ventania), ele aparece nesta faixa com o grau de perigo e a validade. Clique para abrir o aviso no site do INMET.' },
  { alvo: '.filtros', titulo: 'Período e tipo de crime', texto: 'O período (30 dias a 12 meses) e o tipo de crime valem para todas as abas, para o mapa e para os cartões. No Sinesp, que é mensal, o período vira os últimos meses publicados. Daqui para baixo, o painel rola e os cartões do topo ficam fixos.' },
  { alvo: '.area-mapa', titulo: 'Mapa', texto: 'Cada bairro é pintado pela quantidade de ocorrências noticiadas (contorno do IBGE ou do OpenStreetMap). Pontos são locais exatos; círculos vermelhos numerados são zonas vermelhas. Clique em qualquer coisa para ver o detalhe.' },
  { alvo: '.botao-mapa', titulo: 'Camadas do mapa', texto: 'Liga e desliga camadas: bairros, calor, zonas vermelhas, tiroteios do Instituto Fogo Cruzado, trechos de rodovia com mais acidentes (PRF, com BR e km), Unidades Shopee e, no RJ, as áreas de delegacia com dados oficiais do ISP.' },
  { alvo: '.legenda', titulo: 'Legenda', texto: 'Mostra quantas notícias há no período, quantas têm local exato, as cores de cada tipo de crime e a lista das notícias sem bairro identificado.' },
  { alvo: '.abas .mat-mdc-tab-header', topoAbas: true, titulo: 'Abas', texto: 'Panorama junta todas as fontes; Dados oficiais detalha o Sinesp ano a ano; Estado compara os municípios; Zonas lista as áreas mais violentas; Facções mostra disputas entre grupos; Notícias traz cada ocorrência com link.' },
  { alvo: '.cartao.parecer', aba: 'PANORAMA', titulo: 'Parecer', texto: 'Resumo em texto escrito automaticamente a partir dos dados: quantas mortes, a tendência, a taxa por 100 mil comparada ao estado e os bairros mais citados.' },
  { alvo: '.cartao.risco', aba: 'PANORAMA', titulo: 'Índice de criminalidade', texto: 'De 0 a 100, comparando a cidade com os municípios do Brasil: mortes violentas, roubos (onde o estado publica), tentativas de homicídio e tendência, por 100 mil habitantes. Com menos de 10 mortes no período, não há nota (poucos casos) e o cartão explica o porquê; de 10 a 19, a nota vem com a faixa provável. Abra "Ver os números de cada parte" para conferir.' },
  { alvo: '.cartao.mes-a-mes', aba: 'PANORAMA', titulo: 'Mês a mês', texto: 'Barras: mortes violentas por mês no Sinesp (as vermelhas são os meses do período escolhido). Linha: notícias do mesmo mês, como complemento. Ajuda a ver se a cidade está melhorando ou piorando.' },
  { alvo: '.cartao.trafico', aba: 'PANORAMA', titulo: 'Tráfico e facções', texto: 'Notícias de tráfico e de facções ou milícias citadas, o tráfico no estado (o Sinesp não publica por cidade), apreensões do ISP no RJ e disputas entre grupos armados do Instituto Fogo Cruzado.' },
  { alvo: '.cartao.por-bairro', aba: 'PANORAMA', titulo: 'Ocorrências por bairro', texto: 'Os bairros com mais ocorrências noticiadas no período, quantas são graves, quantas foram nos últimos 30 dias e o tipo de crime mais comum. Clique num bairro para vê-lo no mapa.' },
  { alvo: '.abas', aba: 'OFICIAL', topoAbas: true, titulo: 'Dados oficiais', texto: 'Cada indicador do Sinesp ano a ano (2024 em diante), com o gráfico mês a mês e o que cada órgão de segurança registrou nos últimos 12 meses.' },
  { alvo: '.abas', aba: 'ESTADO', topoAbas: true, titulo: 'Estado', texto: 'Panorama do estado inteiro: totais, tendência, insights e a lista de municípios ordenada pela taxa de mortes violentas, para comparar a cidade com as vizinhas.' },
  { alvo: '.abas', aba: 'ZONAS', topoAbas: true, titulo: 'Zonas vermelhas', texto: 'As áreas onde as ocorrências graves e recentes se concentram, com índice (100 = a mais intensa), tendência dos últimos 30 dias e botão para ver no mapa. Com a camada de Unidades Shopee ligada, mostra também as ocorrências num raio de 3 km de cada unidade.' },
  { alvo: '.abas', aba: 'FACCOES', topoAbas: true, titulo: 'Facções e disputas', texto: 'Bairros com mais sinais de atuação de facções: tiroteios em disputa entre grupos armados (Instituto Fogo Cruzado, em Rio, Recife, Salvador e Belém), notícias que citam facção ou tráfico e registros oficiais de tráfico. Só entra o que foi registrado, com a fonte.' },
  { alvo: '.abas', aba: 'NOTICIAS', topoAbas: true, titulo: 'Notícias', texto: 'Análise das notícias (por mês, tipo, dia da semana, locais e veículos) e cada notícia com veículo, data, bairro e órgãos citados. Notícias são complemento: servem para localizar e acompanhar, não substituem a estatística oficial.' },
  { alvo: '.botao-favoritos', titulo: 'Favoritos', texto: 'A estrela ao lado do nome da cidade salva o local; este botão lista os favoritos para abrir com um clique.' },
  { alvo: '.bt-alertas', titulo: 'Alertas por e-mail', texto: 'Escolha cidades e temas para receber um e-mail quando surgirem ocorrências novas ou avisos do INMET.' },
  { alvo: '.bt-relatos', titulo: 'Relatos das equipes', texto: 'As equipes da Shopee registram aqui o que a operação viveu no local (assalto, roubo de carga, área de risco). Só contas @shopee.com veem os relatos.' },
  { alvo: '.sino', titulo: 'Shopee nas notícias', texto: 'O sino avisa quando sai notícia envolvendo a Shopee (motoristas, cargas, unidades). O número mostra quantas ainda não foram lidas.' },
  { alvo: '.bt-fontes', titulo: 'Saúde das fontes', texto: 'Até quando vale cada número do painel: verde está atualizado no prazo, amarelo está atrasado. Mostra também o grau de confiança de cada fonte.' },
  { alvo: 'app-agente .fab', titulo: 'Assistente IA', texto: 'Pergunte qualquer coisa sobre os dados na tela. Cada resposta pode ser exportada em PDF ou Google Sheets.' },
  { alvo: '.bt-ajuda', titulo: 'Rever o tour', texto: 'Este botão abre o tour de novo quando quiser. Ao lado ficam o tema claro ou escuro e o idioma (português ou inglês).' },
];

@Component({
  selector: 'app-tour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    @let c = caixa();
    <div class="fundo" (click)="fechar.emit(false)"></div>
    <div class="foco" [style.top.px]="c.top" [style.left.px]="c.left" [style.width.px]="c.width" [style.height.px]="c.height"></div>
    <div #caixaBalao class="balao" role="dialog" aria-live="polite" [style.top.px]="balao().top" [style.left.px]="balao().left">
      <button type="button" class="x" aria-label="Fechar o tour" (click)="fechar.emit(false)"><span class="material-symbols-outlined">close</span></button>
      <div class="contador">{{ numero() }} de {{ total() }}</div>
      <h3>{{ passo().titulo }}</h3>
      <p>{{ passo().texto }}</p>
      <div class="acoes">
        <button mat-button (click)="fechar.emit(true)">Não mostrar novamente</button>
        <span class="esp"></span>
        @if (numero() > 1) { <button mat-stroked-button (click)="anterior()">Anterior</button> }
        <button mat-flat-button (click)="numero() < total() ? proximo() : fechar.emit(false)">{{ numero() < total() ? 'Próximo' : 'Concluir' }}</button>
      </div>
    </div>
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 2000; }
    .fundo { position: fixed; inset: 0; cursor: pointer; }
    .x { position: absolute; top: 4px; right: 4px; width: 40px; height: 40px; border: 0; background: none; color: inherit; cursor: pointer; border-radius: 50%; display: grid; place-items: center; z-index: 1; }
    .x:hover { background: var(--mat-sys-surface-container-high); }
    .foco { position: fixed; border-radius: var(--raio-m); box-shadow: 0 0 0 9999px rgba(10, 20, 40, .6); outline: 3px solid var(--mat-sys-primary);
      transition: all .2s ease; pointer-events: none; }
    .balao { position: fixed; width: min(360px, calc(100vw - 32px)); background: var(--mat-sys-surface-container-lowest); color: var(--mat-sys-on-surface);
      border-radius: var(--raio); padding: 16px 18px 12px; box-shadow: 0 10px 30px rgba(0,0,0,.3); transition: top .2s ease, left .2s ease; }
    .contador { font: var(--mat-sys-label-small); color: var(--mat-sys-primary); font-weight: 700; letter-spacing: .04em; }
    h3 { margin: 4px 40px 6px 0; font: var(--mat-sys-title-medium); }
    p { margin: 0 0 12px; font: var(--mat-sys-body-medium); color: var(--mat-sys-on-surface-variant); }
    .acoes { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .esp { flex: 1; }
  `,
})
export class TourComponent {
  private readonly store = inject(PainelStore);
  /** true = "Não mostrar novamente" */
  readonly fechar = output<boolean>();
  protected readonly i = signal(0);
  protected readonly passo = computed(() => PASSOS[this.i()]);
  private readonly tick = signal(0);
  private readonly elBalao = viewChild<ElementRef<HTMLElement>>('caixaBalao');
  private timers: ReturnType<typeof setTimeout>[] = [];
  private observador?: ResizeObserver;

  /** Passos que existem neste local (ex.: sem aviso do INMET, o passo some), para o contador não pular números. */
  private readonly existentes = computed(() => { this.tick(); return PASSOS.map((p, n) => n === this.i() || !!p.aba || !!visivel(p.alvo)); });
  protected readonly total = computed(() => this.existentes().filter(Boolean).length);
  protected readonly numero = computed(() => this.existentes().slice(0, this.i() + 1).filter(Boolean).length);

  protected readonly caixa = computed(() => {
    this.tick();
    const el = visivel(this.passo().alvo);
    if (!el) return { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 };
    const m = 6, r = recorteVisivel(el);
    const top = Math.max(4, r.top - m), left = Math.max(4, r.left - m);
    const bottom = Math.min(window.innerHeight - 4, r.bottom + m), right = Math.min(window.innerWidth - 4, r.right + m);
    return { top, left, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
  });

  /** Balão abaixo, acima ou ao lado do destaque; se nada couber, dentro dele, no canto que atrapalha menos. */
  protected readonly balao = computed(() => {
    const c = this.caixa(), W = window.innerWidth, H = window.innerHeight;
    const w = Math.min(360, W - 32), h = this.elBalao()?.nativeElement.offsetHeight || 240, g = 12;
    const centroX = Math.min(W - w - 16, Math.max(16, c.left + c.width / 2 - w / 2));
    const meioY = Math.min(H - h - 16, Math.max(16, c.top + c.height / 2 - h / 2));
    if (c.top + c.height + g + h <= H - 8) return { top: c.top + c.height + g, left: centroX };
    if (c.top - g - h >= 8) return { top: c.top - g - h, left: centroX };
    if (c.left - g - w >= 8) return { top: meioY, left: c.left - g - w };
    if (c.left + c.width + g + w <= W - 8) return { top: meioY, left: c.left + c.width + g };
    return { top: Math.max(16, H - h - 16), left: Math.min(W - w - 16, Math.max(16, c.left + 16)) };
  });

  constructor() {
    // Acompanha o alvo enquanto algo rola, muda de tamanho ou termina de carregar (gráficos, notícias)
    const atualizar = () => this.tick.update((v) => v + 1);
    document.addEventListener('scroll', atualizar, { capture: true, passive: true });
    this.observador = new ResizeObserver(atualizar);
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('scroll', atualizar, { capture: true });
      this.observador?.disconnect(); this.timers.forEach(clearTimeout);
    });
    afterNextRender(() => this.ir(0, 1));
  }

  protected proximo(): void { this.ir(this.i() + 1, 1); }
  protected anterior(): void { this.ir(this.i() - 1, -1); }

  private ir(n: number, sentido: 1 | -1): void {
    if (n < 0 || n >= PASSOS.length) return;
    const p = PASSOS[n];
    this.timers.forEach(clearTimeout); this.timers = [];
    if (p.aba && this.store.aba() !== p.aba) this.store.aba.set(p.aba);
    this.i.set(n);
    // Espera a aba desenhar; se a parte não existe neste local (ex.: sem aviso do INMET), pula para a seguinte
    this.timers.push(setTimeout(() => {
      const el = visivel(p.alvo);
      if (!el) { if (n + sentido >= 0 && n + sentido < PASSOS.length) this.ir(n + sentido, sentido); return; }
      if (p.topoAbas) rolarParaAbas(); else rolarAte(el);
      this.observador?.disconnect(); this.observador?.observe(el);
      // Recalcula algumas vezes enquanto gráficos e listas terminam de aparecer
      for (const t of [0, 150, 400, 800, 1500]) this.timers.push(setTimeout(() => this.tick.update((v) => v + 1), t));
    }, 150));
    this.tick.update((v) => v + 1);
  }

  @HostListener('window:resize') protected redimensionar(): void { this.tick.update((v) => v + 1); }
  @HostListener('document:keydown', ['$event']) protected tecla(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.fechar.emit(false);
    else if (e.key === 'ArrowRight' && this.numero() < this.total()) this.proximo();
    else if (e.key === 'ArrowLeft' && this.numero() > 1) this.anterior();
  }
}

/** Primeiro elemento do seletor que está de fato na tela (tem tamanho). */
function visivel(sel: string): HTMLElement | null {
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

/** Caixa que rola o elemento (no computador, a coluna do painel; no celular, nenhuma: a página rola). */
function caixaDeRolagem(el: HTMLElement): HTMLElement | null {
  let p = el.parentElement;
  while (p && p !== document.body) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight + 1) return p;
    p = p.parentElement;
  }
  return null;
}

/** Altura da barra de abas quando ela está grudada no topo e cobre o conteúdo das abas. */
function barraGrudada(el: HTMLElement): number {
  if (!el.closest('.mat-mdc-tab-body')) return 0;
  const h = el.closest('.abas')?.querySelector<HTMLElement>('.mat-mdc-tab-header');
  return h && getComputedStyle(h).position === 'sticky' ? h.offsetHeight : 0;
}

/** Parte do elemento que aparece de fato: recortada pela caixa que rola e pela barra de abas grudada. */
function recorteVisivel(el: HTMLElement): { top: number; left: number; bottom: number; right: number } {
  const r = el.getBoundingClientRect();
  let top = r.top, bottom = r.bottom, left = r.left, right = r.right;
  const caixa = caixaDeRolagem(el);
  if (caixa) {
    const c = caixa.getBoundingClientRect();
    top = Math.max(top, c.top + barraGrudada(el)); bottom = Math.min(bottom, c.bottom);
    left = Math.max(left, c.left); right = Math.min(right, c.right);
  }
  return { top, left, bottom: Math.max(top, bottom), right: Math.max(left, right) };
}

/**
 * Rola só a caixa do painel que contém o alvo, na hora (sem animação, para o destaque não ficar para trás).
 * Alvo alto fica alinhado em cima, logo abaixo da barra de abas; alvo baixo fica com folga para o balão.
 * scrollIntoView não é usado porque também rolava a página inteira dentro do Google Sites.
 */
function rolarAte(el: HTMLElement): void {
  const caixa = caixaDeRolagem(el);
  const r = el.getBoundingClientRect();
  if (caixa) {
    const c = caixa.getBoundingClientRect(), topo = c.top + barraGrudada(el) + 8, altura = c.bottom - topo;
    if (r.top >= topo && r.bottom <= c.bottom - 8) return;
    caixa.scrollTop += r.height > altura * 0.55 ? r.top - topo : r.top - topo - Math.min(120, (altura - r.height) / 3);
    return;
  }
  // Celular: a própria página rola
  if (getComputedStyle(document.body).overflowY === 'hidden') return;
  const topoTela = (document.querySelector<HTMLElement>('.topo')?.getBoundingClientRect().bottom ?? 0) + 8;
  if (r.top < topoTela || r.bottom > window.innerHeight - 8) window.scrollBy({ top: r.top - topoTela - 12 });
}

/** Coloca a barra das abas no alto da coluna do painel, para a aba aberta aparecer inteira. */
function rolarParaAbas(): void {
  const abas = document.querySelector<HTMLElement>('.abas');
  if (!abas) return;
  const caixa = caixaDeRolagem(abas);
  const r = abas.getBoundingClientRect();
  if (caixa) caixa.scrollTop += r.top - caixa.getBoundingClientRect().top;
  else if (getComputedStyle(document.body).overflowY !== 'hidden') window.scrollBy({ top: r.top - (document.querySelector<HTMLElement>('.topo')?.getBoundingClientRect().bottom ?? 0) });
}
