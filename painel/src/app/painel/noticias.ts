import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CATEGORIA_POR_ID, CFG, ORGAO_POR_ID, ROTULOS_PRECISAO } from '../core/dados';
import { Ocorrencia } from '../core/modelos';
import { PainelStore } from '../core/painel.store';
import { fmt, normalizar, urlSegura } from '../core/util';
import { explicarGrau, grauDe } from '../core/confianca';

/** Lista das notícias do período, com filtro por texto. */
@Component({
  selector: 'app-noticias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  template: `
    <p class="nota google"><span class="material-symbols-outlined">travel_explore</span>Fonte: Google Notícias e imprensa local{{ coleta() }}</p>
    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="filtro">
      <mat-icon matPrefix>filter_list</mat-icon>
      <input matInput placeholder="Filtrar por palavra, bairro ou veículo" [value]="filtro()" (input)="digitar($any($event.target).value)" />
      @if (filtro()) {
        <button matSuffix mat-icon-button aria-label="Limpar o texto do filtro" (click)="digitar('')"><mat-icon>close</mat-icon></button>
      }
    </mat-form-field>
    <p class="nota">{{ fmt(lista().length) }} notícias</p>
    @for (o of visiveis(); track o.id) {
      <article class="cartao noticia">
        <div class="topo">
          <span class="tag" [style.color]="cat(o).cor">{{ cat(o).curto }}</span>
          @for (g of o.orgaos; track g) { <span class="tag" [style.color]="orgao(g).cor" [title]="orgao(g).nome">{{ orgao(g).curto }}</span> }
          @if (o.local) { <span class="pilula">imprensa local</span> }
          <span class="grau" [class.g1]="grau(o).endsWith('1')" [title]="explicar(o)">{{ grau(o) }}</span>
          <small>{{ o.data }}</small>
        </div>
        <a class="titulo" [href]="url(o.link)" target="_blank" rel="noopener">{{ o.titulo }}</a>
        <div class="meta">
          <button type="button" class="pilula" [disabled]="!o.precisa" (click)="store.focar(o.lat!, o.lng!)">
            <span class="material-symbols-outlined">location_on</span>{{ store.escopo() === 'ESTADO' ? o.cidade + ' — ' + o.bairro : o.bairro }}
          </button>
          <span [style.color]="precisao(o).cor">{{ precisao(o).nome }}</span>
          <span class="veiculo">{{ o.veiculo || 'Fonte' }}</span>
          @if (o.fontes) {
            <button type="button" class="pilula fontes" (click)="alternar(o.id)" [attr.aria-expanded]="aberto() === o.id">
              <span class="material-symbols-outlined">library_books</span>{{ o.fontes.length }} fontes
            </button>
          }
        </div>
        @if (o.fontes && aberto() === o.id) {
          <ul class="outras">
            @for (f of o.fontes; track f.link) { <li><a [href]="url(f.link)" target="_blank" rel="noopener">{{ f.veiculo }}</a>: {{ f.titulo }}</li> }
          </ul>
        }
      </article>
    } @empty {
      <div class="vazio"><mat-icon>newspaper</mat-icon>{{ store.carregando() ? 'Carregando notícias…' : 'Nenhuma notícia para os filtros escolhidos.' }}</div>
    }
    @if (lista().length > visiveis().length) {
      <button mat-stroked-button (click)="pagina.set(pagina() + 1)">Mostrar mais ({{ fmt(lista().length - visiveis().length) }})</button>
    }
  `,
  styles: `
    :host { display: grid; gap: 8px; }
    .google { display: flex; gap: 6px; align-items: center; margin: 0; }
    .google .material-symbols-outlined { font-size: 18px; color: var(--mat-sys-primary); }
    .filtro { width: 100%; }
    .noticia { display: grid; gap: 6px; padding: 12px; }
    .topo { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .topo small { margin-left: auto; color: var(--mat-sys-on-surface-variant); }
    .grau { font: 700 11px/1 var(--mat-sys-body-small-font, Roboto); padding: 3px 6px; border-radius: 6px; border: 1px solid var(--borda-suave); color: var(--mat-sys-on-surface-variant); cursor: help; }
    .grau.g1 { border-color: #16a34a; color: #16a34a; }
    .fontes { cursor: pointer; }
    .outras { margin: 0; padding-left: 18px; font: var(--mat-sys-body-small); display: grid; gap: 4px; }
    .outras a { color: var(--mat-sys-primary); }
    .titulo { font: var(--mat-sys-title-small); color: var(--mat-sys-on-surface); text-decoration: none; }
    .titulo:hover { text-decoration: underline; color: var(--mat-sys-primary); }
    .meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; font: var(--mat-sys-body-small); }
    .meta .pilula { border: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; }
    .meta .pilula:disabled { cursor: default; }
    .meta .material-symbols-outlined { font-size: 15px; }
    .veiculo { margin-left: auto; color: var(--mat-sys-on-surface-variant); }
  `,
})
export class NoticiasComponent {
  protected readonly store = inject(PainelStore);
  protected readonly fmt = fmt;
  protected readonly url = urlSegura;
  protected readonly filtro = signal('');
  private readonly filtroAplicado = signal('');
  protected readonly pagina = signal(1);
  private timer: any;

  protected readonly coleta = computed(() => {
    const d = this.store.dados();
    return d?.ultimaColeta ? ' · última coleta ' + d.ultimaColeta : '';
  });
  protected readonly lista = computed(() => {
    const alvo = normalizar(this.filtroAplicado());
    const todas = this.store.filtrados().todas;
    return alvo ? todas.filter((o) => normalizar(o.titulo + ' ' + o.bairro + ' ' + o.veiculo).includes(alvo)) : todas;
  });
  protected readonly visiveis = computed(() => this.lista().slice(0, this.pagina() * CFG.MAX_NOTICIAS_POR_PAGINA));

  constructor() {
    // Nova cidade ou novos filtros: volta para a primeira página
    this.store.textoNoticias.set('');
    effect(() => { this.store.filtrados(); this.pagina.set(1); });
    // "Limpar filtros" na barra do topo apaga também o texto
    effect(() => { if (this.store.limpezaFiltros()) untracked(() => this.digitar('')); });
  }

  protected digitar(v: string): void {
    this.filtro.set(v);
    this.store.textoNoticias.set(v);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.filtroAplicado.set(v); this.pagina.set(1); }, 180);
  }

  protected readonly aberto = signal('');
  protected alternar(id: string): void { this.aberto.set(this.aberto() === id ? '' : id); }
  protected grau = (o: Ocorrencia) => grauDe(o);
  protected explicar = (o: Ocorrencia) => explicarGrau(grauDe(o)) + (o.fontes ? ' Veículos: ' + o.fontes.map((f) => f.veiculo).join(', ') + '.' : '');
  protected cat = (o: Ocorrencia) => CATEGORIA_POR_ID[o.cat];
  protected orgao = (id: string) => ORGAO_POR_ID[id];
  protected precisao = (o: Ocorrencia) => ROTULOS_PRECISAO[o.precisao] || ROTULOS_PRECISAO['PENDENTE'];
}
