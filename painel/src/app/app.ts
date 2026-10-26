import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AjudaComponent } from './ajuda';
import { CATEGORIAS, CFG, ESTADOS, ORGAO_POR_ID, PERIODOS, UFS } from './core/dados';
import { Sugestao, sugerir } from './core/municipios';
import { Aba, PainelStore } from './core/painel.store';
import { fmt, fmt1, gravarLocal, lerLocal } from './core/util';
import { MapaComponent } from './mapa/mapa';
import { DeltaComponent } from './painel/comuns';
import { EstadoComponent } from './painel/estado';
import { GeralComponent } from './painel/geral';
import { NoticiasComponent } from './painel/noticias';
import { OficialComponent } from './painel/oficial';
import { ZonasComponent } from './painel/zonas';

const ABAS: { id: Aba; rotulo: string; icone: string }[] = [
  { id: 'OFICIAL', rotulo: 'Dados oficiais', icone: 'account_balance' },
  { id: 'ESTADO', rotulo: 'Estado', icone: 'map' },
  { id: 'GERAL', rotulo: 'Análise', icone: 'insights' },
  { id: 'ZONAS', rotulo: 'Zonas', icone: 'crisis_alert' },
  { id: 'NOTICIAS', rotulo: 'Notícias (complemento)', icone: 'newspaper' },
];

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule,
    MatTooltipModule, MatTabsModule, MatButtonToggleModule, MatChipsModule, MatBadgeModule,
    MapaComponent, GeralComponent, OficialComponent, EstadoComponent, ZonasComponent, NoticiasComponent, DeltaComponent,
  ],
  host: { '[class.arrastando]': 'arrastando()' },
  template: `
    <mat-toolbar class="topo">
      <div class="marca">
        <span class="marca-icone"><mat-icon>shield</mat-icon></span>
        <div class="marca-texto"><b>Mapa da Segurança</b><small>{{ store.nomeLocal() }}</small></div>
      </div>

      <mat-form-field class="busca" appearance="outline" subscriptSizing="dynamic">
        <mat-icon matPrefix>search</mat-icon>
        <input #busca matInput placeholder="Buscar município ou CEP" [value]="textoBusca()" (input)="textoBusca.set($any($event.target).value)"
          (keydown.enter)="enter()" [matAutocomplete]="auto" aria-label="Buscar município ou CEP" autocomplete="off" spellcheck="false" />
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="escolher($event)" [autoActiveFirstOption]="true">
          @for (s of sugestoes(); track s.rotulo + s.detalhe) {
            <mat-option [value]="s"><span>{{ s.rotulo }}</span> <small class="detalhe">{{ s.detalhe }}</small></mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>

      <mat-form-field class="uf" appearance="outline" subscriptSizing="dynamic">
        <mat-select [value]="store.uf()" (selectionChange)="store.abrirLocal($event.value, 'ESTADO_INTEIRO')" aria-label="Estado" panelWidth="260px">
          <mat-select-trigger>{{ store.uf() }}<span class="nome-uf"> · {{ estados[store.uf()].nome }}</span></mat-select-trigger>
          @for (uf of ufs; track uf) { <mat-option [value]="uf">{{ uf }} · {{ estados[uf].nome }}</mat-option> }
        </mat-select>
      </mat-form-field>

      <div class="acoes">
        <button mat-icon-button matTooltip="Minha localização" aria-label="Minha localização" (click)="localizar()"><mat-icon>my_location</mat-icon></button>
        <button mat-icon-button matTooltip="Atualizar agora" aria-label="Atualizar agora" (click)="store.atualizarAgora()" [class.girando]="store.coletando()"><mat-icon>refresh</mat-icon></button>
        <button mat-icon-button [matTooltip]="store.escuro() ? 'Tema claro' : 'Tema escuro'" aria-label="Alternar tema" (click)="store.definirTema(!store.escuro())">
          <mat-icon>{{ store.escuro() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Como ler o painel" aria-label="Ajuda" (click)="ajuda()"><mat-icon>help_outline</mat-icon></button>
      </div>
    </mat-toolbar>

    <main class="corpo" #corpo [style.--largura-painel.px]="larguraPainel()">
      <section class="area-mapa"><app-mapa /></section>

      <div class="divisor" role="separator" aria-orientation="vertical" aria-label="Redimensionar painel" tabindex="0"
        (pointerdown)="iniciarArraste($event)" (keydown.arrowleft)="ajustar(40)" (keydown.arrowright)="ajustar(-40)" (dblclick)="larguraPadrao()">
        <span></span>
      </div>

      <section class="painel">
        <header class="painel-topo">
          <div class="linha-titulo">
            <h1>{{ store.nomeLocal() }}</h1>
            <span class="status" [class]="'status ' + store.status().tipo" [title]="store.status().texto">
              <mat-icon [class.girando]="store.status().icone === 'sync'">{{ store.status().icone }}</mat-icon>{{ store.status().texto }}
            </span>
          </div>

          @if (avisoOficial(); as aviso) {
            <div class="aviso-oficial" role="status">
              <mat-icon>{{ aviso.icone }}</mat-icon>
              <div><b>{{ aviso.titulo }}</b><span>{{ aviso.texto }}</span></div>
            </div>
          } @else {
            <div class="kpis">
              @for (k of kpis(); track k.rotulo) {
                <div class="kpi oficial">
                  <span class="kpi-rotulo" [title]="k.rotulo"><mat-icon>verified</mat-icon>{{ k.rotulo }}</span>
                  <b [style.color]="k.cor || null">{{ k.valor }}</b>
                  <span class="kpi-sub">
                    @if (k.delta) { <app-delta [atual]="k.delta[0]" [anterior]="k.delta[1]" /> }
                    {{ k.sub }}
                  </span>
                </div>
              }
            </div>
            <p class="fonte-kpis">Sinesp/MJSP (polícias do estado, PRF e PF) · {{ periodoOficial() }}. Notícias entram só como complemento.</p>
          }
          @if (filtrosNoticias()) {
            <div class="filtros">
              <mat-button-toggle-group [value]="store.periodoDias()" (change)="store.periodoDias.set($event.value)" aria-label="Período das notícias" hideSingleSelectionIndicator matTooltip="Filtra só as notícias (complemento)">
                @for (p of periodos; track p.dias) { <mat-button-toggle [value]="p.dias">{{ p.rotulo }}</mat-button-toggle> }
              </mat-button-toggle-group>
              <mat-chip-set class="categorias" aria-label="Tipos de crime">
                <mat-chip [highlighted]="!store.categorias().length" (click)="store.alternarCategoria('')">Todos</mat-chip>
                @for (c of categorias; track c.id) {
                  <mat-chip [highlighted]="store.categorias().includes(c.id)" (click)="store.alternarCategoria(c.id)" [matTooltip]="c.nome">
                    <i class="ponto" [style.background]="c.cor"></i>{{ c.curto }}
                  </mat-chip>
                }
                @if (orgaoAtivo(); as g) {
                  <mat-chip class="chip-orgao" highlighted (removed)="store.definirOrgao('')">
                    <i class="ponto" [style.background]="g.cor"></i>{{ g.curto }}
                    <button matChipRemove aria-label="Remover filtro de órgão"><mat-icon>cancel</mat-icon></button>
                  </mat-chip>
                }
              </mat-chip-set>
            </div>
          }
        </header>

        <mat-tab-group class="abas" [selectedIndex]="indiceAba()" (selectedIndexChange)="store.aba.set(abas[$event].id)"
          mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms" [disablePagination]="false">
          @for (a of abas; track a.id) {
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="icone-aba">{{ a.icone }}</mat-icon>{{ a.rotulo }}
                @if (a.id === 'ZONAS' && contagem().zonas) { <span class="contador">{{ contagem().zonas }}</span> }
                @if (a.id === 'NOTICIAS') { <span class="contador">{{ contagem().noticias }}</span> }
              </ng-template>
              <ng-template matTabContent>
                <div class="conteudo">
                  @switch (a.id) {
                    @case ('GERAL') { <app-geral /> }
                    @case ('OFICIAL') { <app-oficial /> }
                    @case ('ESTADO') { <app-estado /> }
                    @case ('ZONAS') { <app-zonas /> }
                    @case ('NOTICIAS') { <app-noticias /> }
                  }
                </div>
              </ng-template>
            </mat-tab>
          }
        </mat-tab-group>
      </section>
    </main>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100vh; height: 100dvh; overflow: hidden; }
    :host.arrastando { cursor: col-resize; user-select: none; }
    .topo { gap: 12px; height: auto; min-height: 60px; padding: 6px 12px; background: var(--mat-sys-surface-container); border-bottom: 1px solid var(--mat-sys-outline-variant);
      flex-wrap: nowrap; position: relative; z-index: 1000; }
    .marca { display: flex; align-items: center; gap: 10px; min-width: 0; flex: none; }
    .marca-icone { width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center; background: var(--mat-sys-primary); color: var(--mat-sys-on-primary); }
    .marca-texto { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
    .marca-texto b { font: var(--mat-sys-title-medium); }
    .marca-texto small { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
    .busca, .uf { --mat-form-field-container-height: 42px; --mat-form-field-container-vertical-padding: 9px; --mat-form-field-filled-with-label-container-padding-top: 9px; }
    .busca { flex: 1; max-width: 520px; min-width: 160px; margin-left: auto; }
    .uf { width: 210px; flex: none; }
    .detalhe { color: var(--mat-sys-on-surface-variant); margin-left: 6px; }
    .acoes { display: flex; flex: none; }
    .corpo { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(280px, 1fr) 10px var(--largura-painel, 760px); }
    .area-mapa { position: relative; min-height: 0; }
    .divisor { cursor: col-resize; display: grid; place-items: center; background: var(--mat-sys-surface-container); border-inline: 1px solid var(--mat-sys-outline-variant); touch-action: none; }
    .divisor span { width: 4px; height: 40px; border-radius: 2px; background: var(--mat-sys-outline); opacity: .6; }
    .divisor:hover span, .divisor:focus-visible span { background: var(--mat-sys-primary); opacity: 1; }
    .divisor:focus-visible { outline: none; }
    .painel { min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--mat-sys-surface); container: painel / inline-size; }
    .painel-topo { padding: 14px 16px 6px; display: grid; gap: 10px; border-bottom: 1px solid var(--mat-sys-outline-variant); }
    .linha-titulo { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: space-between; }
    h1 { font: var(--mat-sys-headline-small); margin: 0; }
    .status { display: inline-flex; align-items: center; gap: 4px; font: var(--mat-sys-label-medium); color: var(--mat-sys-on-surface-variant);
      max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .status mat-icon { font-size: 16px; width: 16px; height: 16px; flex: none; }
    .status.ok mat-icon { color: var(--cor-sucesso); }
    .status.erro { color: var(--cor-perigo); }
    .filtros { margin-top: 10px; display: flex; gap: 8px 12px; flex-wrap: wrap; align-items: center; }
    .filtros mat-button-toggle-group { --mat-button-toggle-height: 34px; flex: none; }
    .categorias { --mat-chip-container-height: 30px; }
    .ponto { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
    .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    @container painel (max-width: 560px) { .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .kpi { background: var(--mat-sys-surface-container-low); border: 1px solid var(--mat-sys-outline-variant); border-radius: 12px; padding: 8px 10px; min-width: 0;
      display: flex; flex-direction: column; gap: 1px; }
    .kpi.oficial { border-color: color-mix(in srgb, var(--mat-sys-primary) 45%, var(--mat-sys-outline-variant)); }
    .kpi-rotulo { font: var(--mat-sys-label-medium); color: var(--mat-sys-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 3px; }
    .kpi-rotulo mat-icon { font-size: 14px; width: 14px; height: 14px; color: var(--mat-sys-primary); flex: none; }
    .kpi b { font: var(--mat-sys-headline-small); font-weight: 600; font-variant-numeric: tabular-nums; }
    .kpi-sub { font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); display: flex; gap: 4px; align-items: center; flex-wrap: wrap; min-height: 20px; }
    .aviso-oficial { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: 12px; margin-top: 10px;
      background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); }
    .aviso-oficial div { display: flex; flex-direction: column; gap: 2px; font: var(--mat-sys-body-medium); }
    .fonte-kpis { margin: 6px 0 0; font: var(--mat-sys-body-small); color: var(--mat-sys-on-surface-variant); }
    .abas { flex: 1; min-height: 0; }
    .abas ::ng-deep .mat-mdc-tab-body-wrapper { flex: 1; min-height: 0; }
    .abas ::ng-deep .mat-mdc-tab-body-content { overflow: auto; }
    .conteudo { padding: 14px 16px 24px; }
    .icone-aba { font-size: 18px; width: 18px; height: 18px; margin-right: 6px; }
    .contador { margin-left: 6px; font: var(--mat-sys-label-small); background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container);
      border-radius: 999px; padding: 1px 7px; }
    .girando mat-icon, mat-icon.girando { animation: girar 1s linear infinite; }
    @keyframes girar { to { transform: rotate(360deg); } }

    @media (max-width: 1100px) { .marca-texto small, .nome-uf { display: none; } .uf { width: 92px; } }
    @media (max-width: 900px) {
      :host { height: auto; min-height: 100dvh; overflow: visible; }
      .topo { flex-wrap: wrap; position: sticky; top: 0; }
      .busca { order: 3; flex-basis: 100%; max-width: none; margin-left: 0; }
      .uf { margin-left: auto; }
      .corpo { display: flex; flex-direction: column; }
      .area-mapa { height: 46vh; min-height: 300px; }
      .divisor { display: none; }
      .abas ::ng-deep .mat-mdc-tab-body-content { overflow: visible; }
    }
    @media (max-width: 520px) {
      .marca-texto { display: none; }
      .painel-topo { padding: 12px 12px 6px; }
      .conteudo { padding: 12px 12px 24px; }
      h1 { font: var(--mat-sys-title-large); }
      .icone-aba { display: none; }
    }
  `,
})
export class App {
  protected readonly store = inject(PainelStore);
  private readonly dialog = inject(MatDialog);
  private readonly corpo = viewChild.required<ElementRef<HTMLElement>>('corpo');
  private readonly busca = viewChild.required<ElementRef<HTMLInputElement>>('busca');

  protected readonly abas = ABAS;
  protected readonly ufs = UFS;
  protected readonly estados = ESTADOS;
  protected readonly periodos = PERIODOS;
  protected readonly categorias = CATEGORIAS;
  protected readonly textoBusca = signal('');
  protected readonly sugestoes = computed(() => sugerir(this.textoBusca()));
  protected readonly arrastando = signal(false);
  protected readonly larguraPainel = signal(this.larguraInicial());

  protected readonly indiceAba = computed(() => ABAS.findIndex((a) => a.id === this.store.aba()));
  protected readonly filtrosNoticias = computed(() => ['GERAL', 'ZONAS', 'NOTICIAS'].includes(this.store.aba()));
  protected readonly orgaoAtivo = computed(() => ORGAO_POR_ID[this.store.orgao()] || null);
  protected readonly contagem = computed(() => {
    const f = this.store.filtrados();
    return { zonas: f.zonas.length, noticias: fmt(f.todas.length) };
  });

  /** Indicadores do topo: só estatística oficial (Sinesp). Notícias ficam nas abas de complemento. */
  protected readonly kpis = computed(() => {
    const o = this.store.oficial();
    if (!o?.disponivel || !o.anos) return [];
    const parcial = o.ultimoMes !== 'dez';
    const ano = o.anos[2];
    const sub = parcial ? `jan–${o.ultimoMes}/${ano} vs ${o.anos[1]}` : `${ano} vs ${o.anos[1]}`;
    const lista: { rotulo: string; valor: string; sub: string; delta?: [number | null, number | null]; cor?: string }[] = [];
    const [ev, ...resto] = o.eventos;
    if (!ev) return [];
    lista.push({ rotulo: ev.nome, valor: ev.porAno[2] == null ? '—' : fmt(ev.porAno[2]), delta: [ev.porAno[2], ev.parcialAnterior], sub, cor: 'var(--cor-perigo)' });
    if (ev.taxa != null) {
      lista.push({ rotulo: ev.nome + ' por 100 mil', valor: fmt1(ev.taxa),
        sub: ev.taxaEstado ? `estado: ${fmt1(ev.taxaEstado)} · 12 meses` : 'últimos 12 meses' });
    }
    for (const e of resto) {
      if (lista.length >= 4) break;
      lista.push({ rotulo: e.nome, valor: e.porAno[2] == null ? '—' : fmt(e.porAno[2]), delta: [e.porAno[2], e.parcialAnterior], sub });
    }
    return lista;
  });

  protected readonly periodoOficial = computed(() => {
    const o = this.store.oficial();
    return o?.periodoTresAnos ? `${o.periodoTresAnos} · importado em ${o.importadoEm}` : '';
  });

  /** Aviso no lugar dos indicadores quando o Sinesp ainda carrega ou não respondeu. */
  protected readonly avisoOficial = computed(() => {
    const o = this.store.oficial();
    if (o?.disponivel && o.eventos.length) return null;
    if (!o && (this.store.carregando() || !this.store.dados() || this.store.dados()!.vazio))
      return { icone: 'hourglass_top', titulo: 'Carregando estatística oficial', texto: 'Buscando os registros do Sinesp de ' + this.anosJanela() + '…' };
    return { icone: 'report', titulo: 'Estatística oficial indisponível para este local',
      texto: (o?.motivo || 'O servidor não devolveu os dados do Sinesp.') + ' As notícias continuam disponíveis como complemento.' };
  });

  private anosJanela(): string {
    const a = new Date().getFullYear();
    return `${a - 2} a ${a}`;
  }

  constructor() {
    queueMicrotask(() => {
      this.store.localizar(() => this.store.abrirLocal(CFG.UF_PADRAO, CFG.CIDADE_PADRAO));
      if (lerLocal(CFG.CHAVE_AJUDA_VISTA) !== '1') setTimeout(() => this.ajuda(), 900);
    });
  }

  protected escolher(ev: MatAutocompleteSelectedEvent): void {
    const s = ev.option.value as Sugestao;
    this.textoBusca.set('');
    this.busca().nativeElement.value = '';
    this.busca().nativeElement.blur();
    if (s.tipo === 'CEP') this.store.buscarCep(s.cep!);
    else if (s.tipo === 'UF') this.store.abrirLocal(s.uf!, 'ESTADO_INTEIRO');
    else this.store.abrirLocal(s.uf!, s.nome!);
  }

  protected enter(): void {
    const digitos = this.textoBusca().replace(/\D/g, '');
    if (digitos.length === 8 && !this.sugestoes().some((s) => s.tipo !== 'CEP')) {
      this.textoBusca.set('');
      this.store.buscarCep(digitos);
    }
  }

  protected localizar(): void {
    this.store.statusLocalizando();
    this.store.localizar(() => this.store.statusSemLocalizacao());
  }

  protected ajuda(): void {
    const anos = this.store.oficial()?.anos?.join(', ');
    this.dialog.open(AjudaComponent, { maxWidth: '640px', width: 'calc(100vw - 32px)', data: { anos } });
  }

  // --------------------------------------------------------------------------
  // Divisor: largura da área de dados (lembrada no navegador)
  // --------------------------------------------------------------------------
  private larguraInicial(): number {
    const salva = Number(lerLocal(CFG.CHAVE_LARGURA));
    return this.limitar(salva || Math.round(window.innerWidth * 0.56));
  }

  private limitar(px: number): number {
    const max = Math.max(420, window.innerWidth - 320);
    return Math.round(Math.min(max, Math.max(380, px)));
  }

  protected iniciarArraste(ev: PointerEvent): void {
    ev.preventDefault();
    const alvo = ev.target as HTMLElement;
    alvo.setPointerCapture?.(ev.pointerId);
    this.arrastando.set(true);
    const mover = (e: PointerEvent) => {
      const r = this.corpo().nativeElement.getBoundingClientRect();
      this.larguraPainel.set(this.limitar(r.right - e.clientX));
    };
    const soltar = () => {
      this.arrastando.set(false);
      gravarLocal(CFG.CHAVE_LARGURA, String(this.larguraPainel()));
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
    };
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
  }

  protected ajustar(delta: number): void {
    this.larguraPainel.update((l) => this.limitar(l + delta));
    gravarLocal(CFG.CHAVE_LARGURA, String(this.larguraPainel()));
  }

  protected larguraPadrao(): void {
    this.larguraPainel.set(this.limitar(Math.round(window.innerWidth * 0.56)));
    gravarLocal(CFG.CHAVE_LARGURA, String(this.larguraPainel()));
  }
}
