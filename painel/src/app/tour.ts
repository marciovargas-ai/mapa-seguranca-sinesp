import { ChangeDetectionStrategy, Component, computed, HostListener, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Aba, PainelStore } from './core/painel.store';

interface Passo { alvo: string; titulo: string; texto: string; aba?: Aba }

/** Passos do tour: cada um destaca uma parte do painel e explica como ler. */
const PASSOS: Passo[] = [
  { alvo: '.busca', titulo: 'Escolha o local', texto: 'Digite qualquer município do Brasil (ou um CEP) ou escolha um estado na lista ao lado. Tudo no painel muda para o local escolhido: mapa, números, abas e notícias.' },
  { alvo: '.kpis', titulo: 'Números oficiais', texto: 'Os cartões do topo vêm do Sinesp (Ministério da Justiça). "Mortes violentas" soma homicídio doloso, latrocínio e lesão corporal seguida de morte. A seta compara o período escolhido com os mesmos meses do ano anterior.' },
  { alvo: '.filtros', titulo: 'Filtros', texto: 'O período (30 dias a 12 meses) e o tipo de crime valem para todas as abas, para o mapa e para os cartões. No Sinesp, que é mensal, o período vira os últimos meses publicados.' },
  { alvo: '.area-mapa', titulo: 'Mapa', texto: 'Cada bairro é pintado pela quantidade de ocorrências noticiadas (contorno do IBGE ou do OpenStreetMap). Pontos são locais exatos; círculos vermelhos numerados são zonas vermelhas. Clique em qualquer coisa para ver o detalhe.' },
  { alvo: '.botao-mapa', titulo: 'Camadas', texto: 'Liga e desliga camadas: bairros, calor, zonas vermelhas, tiroteios do Fogo Cruzado e, no RJ, as áreas de delegacia com dados oficiais do ISP.' },
  { alvo: '.legenda', titulo: 'Legenda', texto: 'Mostra quantas notícias há no período, quantas têm local exato, as cores dos tiroteios por gravidade e a lista das notícias sem bairro identificado.' },
  { alvo: '.abas', titulo: 'Abas', texto: 'Panorama junta todas as fontes; Dados oficiais detalha o Sinesp ano a ano; Estado compara os municípios; Zonas lista as áreas mais violentas; Notícias traz cada ocorrência com link.' },
  { alvo: '.cartao.parecer', aba: 'PANORAMA', titulo: 'Parecer', texto: 'Resumo em texto escrito automaticamente a partir dos dados: quantas mortes, a tendência, a taxa por 100 mil comparada ao estado e os bairros mais citados.' },
  { alvo: '.cartao.risco', aba: 'PANORAMA', titulo: 'Índice de criminalidade', texto: 'De 0 a 100, comparando a cidade com os municípios do Brasil: mortes violentas, roubos (onde o estado publica), tentativas de homicídio e tendência, por 100 mil habitantes. Em cidades pequenas, o selo avisa quando há poucos casos. Abra "Ver os números de cada parte" para conferir.' },
  { alvo: '.cartao.trafico', aba: 'PANORAMA', titulo: 'Tráfico e facções', texto: 'Notícias de tráfico e de facções ou milícias citadas, o tráfico no estado (o Sinesp não publica por cidade), apreensões do ISP no RJ e disputas entre grupos armados do Fogo Cruzado.' },
  { alvo: '.abas', aba: 'ZONAS', titulo: 'Zonas vermelhas', texto: 'As áreas onde as ocorrências graves e recentes se concentram, com índice (100 = a mais intensa), tendência dos últimos 30 dias e botão para ver no mapa.' },
  { alvo: '.abas', aba: 'NOTICIAS', titulo: 'Notícias', texto: 'Cada notícia com veículo, data, bairro e órgãos citados. Notícias são complemento: servem para localizar e acompanhar, não substituem a estatística oficial.' },
];

@Component({
  selector: 'app-tour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    @let c = caixa();
    <div class="foco" [style.top.px]="c.top" [style.left.px]="c.left" [style.width.px]="c.width" [style.height.px]="c.height"></div>
    <div class="balao" role="dialog" aria-live="polite" [style.top.px]="balao().top" [style.left.px]="balao().left">
      <div class="contador">{{ i() + 1 }} de {{ total }}</div>
      <h3>{{ passo().titulo }}</h3>
      <p>{{ passo().texto }}</p>
      <div class="acoes">
        <button mat-button (click)="fechar.emit()">Sair</button>
        <span class="esp"></span>
        @if (i() > 0) { <button mat-stroked-button (click)="ir(i() - 1)">Anterior</button> }
        <button mat-flat-button (click)="i() + 1 < total ? ir(i() + 1) : fechar.emit()">{{ i() + 1 < total ? 'Próximo' : 'Concluir' }}</button>
      </div>
    </div>
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 2000; }
    .foco { position: fixed; border-radius: var(--raio-m); box-shadow: 0 0 0 9999px rgba(10, 20, 40, .6); outline: 3px solid var(--mat-sys-primary);
      transition: all .25s ease; pointer-events: none; }
    .balao { position: fixed; width: min(360px, calc(100vw - 32px)); background: var(--mat-sys-surface-container-lowest); color: var(--mat-sys-on-surface);
      border-radius: var(--raio); padding: 16px 18px 12px; box-shadow: 0 10px 30px rgba(0,0,0,.3); transition: top .25s ease, left .25s ease; }
    .contador { font: var(--mat-sys-label-small); color: var(--mat-sys-primary); font-weight: 700; letter-spacing: .04em; }
    h3 { margin: 4px 0 6px; font: var(--mat-sys-title-medium); }
    p { margin: 0 0 12px; font: var(--mat-sys-body-medium); color: var(--mat-sys-on-surface-variant); }
    .acoes { display: flex; gap: 8px; align-items: center; }
    .esp { flex: 1; }
  `,
})
export class TourComponent {
  private readonly store = inject(PainelStore);
  readonly fechar = output<void>();
  protected readonly total = PASSOS.length;
  protected readonly i = signal(0);
  protected readonly passo = computed(() => PASSOS[this.i()]);
  private readonly tick = signal(0);

  protected readonly caixa = computed(() => {
    this.tick();
    const el = document.querySelector(this.passo().alvo) as HTMLElement | null;
    if (!el) return { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 };
    const r = el.getBoundingClientRect();
    const m = 6;
    const top = Math.max(4, r.top - m), left = Math.max(4, r.left - m);
    return { top, left, width: Math.min(window.innerWidth - left - 4, r.width + 2 * m), height: Math.min(window.innerHeight - top - 4, r.height + 2 * m) };
  });

  protected readonly balao = computed(() => {
    const c = this.caixa();
    const w = Math.min(360, window.innerWidth - 32), h = 230;
    let top = c.top + c.height + 12;
    if (top + h > window.innerHeight) top = Math.max(12, c.top - h - 12);
    if (top < 12 || c.height > window.innerHeight * 0.6) top = Math.min(window.innerHeight - h - 12, Math.max(12, c.top + 16));
    const left = Math.min(window.innerWidth - w - 16, Math.max(16, c.left + (c.width > w ? 16 : 0)));
    return { top, left };
  });

  constructor() {
    this.ir(0);
  }

  protected ir(n: number, passo = n >= this.i() ? 1 : -1): void {
    const p = PASSOS[n];
    if (p.aba && this.store.aba() !== p.aba) this.store.aba.set(p.aba);
    this.i.set(n);
    // Espera a aba renderizar, rola até o alvo e recalcula a posição
    setTimeout(() => {
      const el = document.querySelector(p.alvo) as HTMLElement | null;
      // Parte que não existe neste local (ex.: índice de risco sem dado oficial): pula
      if (!el) { const prox = n + passo; if (prox >= 0 && prox < PASSOS.length) this.ir(prox, passo); return; }
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => this.tick.update((v) => v + 1), 350);
    }, 120);
    this.tick.update((v) => v + 1);
  }

  @HostListener('window:resize') protected redimensionar(): void { this.tick.update((v) => v + 1); }
  @HostListener('document:keydown', ['$event']) protected tecla(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.fechar.emit();
    else if (e.key === 'ArrowRight' && this.i() + 1 < this.total) this.ir(this.i() + 1);
    else if (e.key === 'ArrowLeft' && this.i() > 0) this.ir(this.i() - 1);
  }
}
