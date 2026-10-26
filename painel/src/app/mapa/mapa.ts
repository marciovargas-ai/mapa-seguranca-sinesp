import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnDestroy, signal, untracked, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CacheDisco } from '../core/cache-disco';
import { CATEGORIA_POR_ID, CATEGORIAS, CFG, COR_NIVEL, ESTADOS, NOME_NIVEL, ROTULOS_PRECISAO } from '../core/dados';
import { BairroResumo } from '../core/bairros';
import { Ocorrencia } from '../core/modelos';
import { municipioPorCodigo } from '../core/municipios';
import { Camadas, PainelStore } from '../core/painel.store';
import { Servidor } from '../core/servidor';
import { esc, fetchComTimeout, fmt, fmt1, urlSegura } from '../core/util';

declare const L: any;

/** Escala sequencial (claro → vermelho escuro) do mapa por taxa municipal. */
const ESCALA = ['#fde0c5', '#facba6', '#f59e74', '#e5604b', '#c42e3c', '#8a1538'];
/** Bairros: amarelo → vermelho escuro (quantidade de ocorrências). */
const ESCALA_BAIRRO = ['#fde047', '#facc15', '#fb923c', '#f97316', '#ef4444', '#b91c1c', '#7f1d1d'];

@Component({
  selector: 'app-mapa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatCheckboxModule, MatTooltipModule],
  template: `
    <div class="mapa" #alvo role="application" aria-label="Mapa de ocorrências"></div>

    <div class="controles">
      <button mat-mini-fab class="botao-mapa" [matMenuTriggerFor]="menuCamadas" matTooltip="Camadas do mapa" aria-label="Camadas do mapa">
        <mat-icon>layers</mat-icon>
      </button>
    </div>
    <mat-menu #menuCamadas="matMenu" class="menu-camadas">
      @for (c of listaCamadas; track c.id) {
        <div mat-menu-item (click)="$event.stopPropagation(); store.alternarCamada(c.id)" role="menuitemcheckbox" [attr.aria-checked]="camadas()[c.id]">
          <mat-checkbox [checked]="camadas()[c.id]" (click)="$event.preventDefault()" tabindex="-1"></mat-checkbox>
          <mat-icon>{{ c.icone }}</mat-icon><span>{{ c.nome }}</span>
        </div>
      }
    </mat-menu>

    @if (legendaCoropletico(); as leg) {
      <div class="legenda">
        <div class="legenda-titulo">{{ leg.titulo }}</div>
        <div class="legenda-sub">por 100 mil habitantes · 12 meses</div>
        <div class="escala">
          @for (f of leg.faixas; track $index) {
            <span><i [style.background]="f.cor"></i>{{ f.rotulo }}</span>
          }
          <span><i class="sem-dado"></i>sem registro</span>
        </div>
      </div>
    } @else if (legenda(); as leg) {
      <div class="legenda">
        <div class="legenda-titulo">{{ leg.noMapa }} de {{ leg.total }} no mapa</div>
        <div class="legenda-sub">{{ leg.semLocal ? leg.semLocal + ' sem local identificado' : 'Todas com local preciso' }}</div>
        <div class="cats">
          @for (c of leg.cats; track c.id) {
            <button type="button" class="cat" [class.ativa]="store.categorias().includes(c.id)" (click)="store.alternarCategoria(c.id)"
              [attr.aria-pressed]="store.categorias().includes(c.id)" [title]="'Filtrar: ' + c.nome"><i [style.background]="c.cor"></i>{{ c.curto }} {{ c.qtd }}</button>
          }
        </div>
        @if (camadas().calor) { <div class="gradiente"><span>menor</span><div></div><span>maior</span></div> }
        @if (camadas().zonas && leg.zonas) { <div class="legenda-zona"><i></i> Zona vermelha (concentração)</div> }
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: block; height: 100%; min-height: 0; }
    .mapa { position: absolute; inset: 0; background: var(--mat-sys-surface-container); }
    .controles { position: absolute; top: 12px; right: 12px; z-index: 900; display: flex; flex-direction: column; gap: 8px; }
    .botao-mapa { background: var(--mat-sys-surface-container-lowest); color: var(--mat-sys-on-surface); }
    .legenda {
      position: absolute; left: 12px; bottom: 12px; z-index: 800; max-width: min(300px, calc(100% - 80px));
      background: color-mix(in srgb, var(--mat-sys-surface-container-lowest) 94%, transparent); backdrop-filter: blur(6px);
      border: 1px solid var(--mat-sys-outline-variant); border-radius: 12px; padding: 10px 12px; font: var(--mat-sys-body-small);
      box-shadow: var(--mat-sys-level1);
    }
    .legenda-titulo { font: var(--mat-sys-label-large); color: var(--mat-sys-on-surface); }
    .legenda-sub { color: var(--mat-sys-on-surface-variant); margin-bottom: 6px; }
    .cats, .escala { display: flex; flex-wrap: wrap; gap: 4px 10px; }
    .escala span { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
    .cat { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; font: inherit; color: inherit; background: none; cursor: pointer;
      border: 1px solid transparent; border-radius: 999px; padding: 1px 6px; margin-left: -6px; }
    .cat:hover { border-color: var(--mat-sys-outline-variant); }
    .cat.ativa { border-color: var(--mat-sys-primary); background: var(--mat-sys-primary-container); }
    .cats i { width: 9px; height: 9px; border-radius: 50%; }
    .escala i { width: 14px; height: 10px; border-radius: 2px; }
    .escala i.sem-dado { background: transparent; border: 1px dashed var(--mat-sys-outline); }
    .gradiente { display: flex; align-items: center; gap: 6px; margin-top: 6px; color: var(--mat-sys-on-surface-variant); }
    .gradiente div { flex: 1; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #3b82f6, #22c55e, #eab308, #f97316, #dc2626); }
    .legenda-zona { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
    .legenda-zona i { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #dc2626; background: rgba(220, 38, 38, .2); }
    @media (max-width: 600px) { .legenda { font-size: 11px; padding: 6px 10px; max-width: 220px; } .cats, .legenda-zona { display: none; } }
  `,
})
export class MapaComponent implements OnDestroy {
  protected readonly store = inject(PainelStore);
  private readonly alvo = viewChild.required<ElementRef<HTMLDivElement>>('alvo');
  protected readonly camadas = this.store.camadas;

  protected readonly listaCamadas: { id: keyof Camadas; nome: string; icone: string }[] = [
    { id: 'zonas', nome: 'Zonas vermelhas', icone: 'crisis_alert' },
    { id: 'calor', nome: 'Mapa de calor', icone: 'local_fire_department' },
    { id: 'pinos', nome: 'Ocorrências', icone: 'location_on' },
    { id: 'bairros', nome: 'Nomes dos bairros', icone: 'label' },
    { id: 'fronteira', nome: 'Limite do município', icone: 'border_outer' },
    { id: 'vizinhos', nome: 'Municípios vizinhos (taxa oficial)', icone: 'grid_view' },
    { id: 'coropletico', nome: 'Taxa por município (aba Estado)', icone: 'map' },
    { id: 'satelite', nome: 'Satélite', icone: 'satellite_alt' },
    { id: 'mapaEscuro', nome: 'Mapa escuro', icone: 'dark_mode' },
  ];

  private map: any = null;
  private renderer: any;
  private tiles: Record<string, any> = {};
  private layerFronteira: any;
  private layerZonas: any;
  private layerSemLocal: any;
  private layerBairros: any;
  private layerCoropletico: any;
  private cluster: any;
  private calor: any = null;
  private pontosCalor: [number, number, number][] = [];
  private usuarioMoveu = false;
  private movimentoProgramatico = false;
  private tokenFronteira = 0;
  private tokenCoropletico = 0;
  private ufEnquadradaCoropletico = '';
  private ultimoEnquadramento = '';
  private observador?: ResizeObserver;
  private readonly malhaEstado = signal<{ uf: string; geo: any } | null>(null);

  /** O mapa por taxa aparece na aba Estado quando há panorama do Sinesp. */
  private readonly coropleticoAtivo = computed(() => {
    const p = this.store.panorama();
    return this.store.aba() === 'ESTADO' && this.camadas().coropletico && !!p?.disponivel && p.uf === this.store.uf() && !!p.rankings?.length;
  });
  /** Na cidade, os municípios em volta aparecem coloridos pela taxa oficial, bem claros, para dar contexto. */
  private readonly vizinhosAtivo = computed(() => {
    const p = this.store.panorama();
    return !this.coropleticoAtivo() && this.store.escopo() === 'CIDADE' && this.camadas().vizinhos && !!p?.disponivel && p.uf === this.store.uf() && !!p.rankings?.length;
  });

  protected readonly legendaCoropletico = computed(() => {
    if (!this.coropleticoAtivo() || !this.malhaEstado()) return null;
    const r = this.store.panorama()!.rankings![this.store.eventoPanorama()] || this.store.panorama()!.rankings![0];
    const limites = this.limites(Object.values(r.valoresTaxa));
    if (!limites.length) return null;
    const faixas = ESCALA.slice(0, limites.length + 1).map((cor, i) => ({
      cor, rotulo: i === 0 ? 'até ' + fmt1(limites[0]) : i === limites.length ? 'acima de ' + fmt1(limites[i - 1]) : fmt1(limites[i - 1]) + '–' + fmt1(limites[i]),
    }));
    return { titulo: r.evento, faixas };
  });

  protected readonly legenda = computed(() => {
    const f = this.store.filtrados();
    if (!f.todas.length) return null;
    return {
      total: fmt(f.todas.length), noMapa: fmt(f.precisas.length), semLocal: f.semLocal.length ? fmt(f.semLocal.length) : '',
      cats: CATEGORIAS.filter((c) => f.porCat[c.id]).map((c) => ({ ...c, qtd: fmt(f.porCat[c.id]) })), zonas: f.zonas.length,
    };
  });

  constructor() {
    effect(() => { if (this.map) return; this.iniciar(this.alvo().nativeElement); });
    effect(() => { const c = this.camadas(); c.satelite; c.mapaEscuro; untracked(() => this.aplicarBase()); });
    effect(() => {
      const f = this.store.filtrados(); const c = this.camadas(); const cor = this.coropleticoAtivo(); const b = this.store.bairrosMapa();
      untracked(() => this.renderizar(f, c, cor, b));
    });
    effect(() => {
      const d = this.store.dados(); const ver = this.camadas().fronteira; const esc = this.store.escopo();
      untracked(() => this.desenharFronteira(d?.codigoIbge || '', ver, esc === 'ESTADO'));
    });
    effect(() => {
      const d = this.store.dados();
      if (!d || d.vazio) return;
      untracked(() => this.enquadrar());
    });
    effect(() => {
      const ativo = this.coropleticoAtivo(); const viz = this.vizinhosAtivo(); const uf = this.store.uf(); const ev = this.store.eventoPanorama(); const malha = this.malhaEstado();
      this.store.populacao(); this.store.cidade();
      untracked(() => this.desenharCoropletico(ativo, uf, ev, malha, viz));
    });
    effect(() => {
      const f = this.store.foco();
      if (!f || !this.map) return;
      this.usuarioMoveu = true;
      if (f.raio) this.map.flyToBounds(L.latLng(f.lat, f.lng).toBounds(f.raio * 2.4), { duration: 0.5, maxZoom: 16 });
      else this.map.flyTo([f.lat, f.lng], f.zoom || 16, { duration: 0.5 });
      if (window.innerWidth <= 900) this.alvo().nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    // Mudou o local: volta a enquadrar automaticamente
    effect(() => { this.store.uf(); this.store.cidade(); this.usuarioMoveu = false; this.ultimoEnquadramento = ''; untracked(() => this.voarParaLocal()); });
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    this.map?.remove();
  }

  private iniciar(el: HTMLElement): void {
    if (typeof L === 'undefined') return;
    const map = (this.map = L.map(el, { zoomControl: true, preferCanvas: true, minZoom: 4, maxZoom: 19 }).setView([-14.5, -51.5], 4));
    map.zoomControl.setPosition('bottomright');
    this.renderer = L.canvas({ padding: 0.4 });
    const pC = map.createPane('paneCoropletico'); pC.style.zIndex = 340;
    const pF = map.createPane('paneFronteira'); pF.style.zIndex = 350; pF.style.pointerEvents = 'none';
    const pB = map.createPane('paneBairros'); pB.style.zIndex = 360;
    const pZ = map.createPane('paneZonas'); pZ.style.zIndex = 450;
    const pR = map.createPane('paneRotulos'); pR.style.zIndex = 640;

    // Mapas base da Esri: não exigem chave de API
    const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
    const atrib = '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap';
    // Ruas do OpenStreetMap (visual do painel antigo); se os blocos falharem, troca pelo mapa de ruas da Esri
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; colaboradores do OpenStreetMap', maxZoom: 19 });
    let falhas = 0;
    osm.on('tileerror', () => {
      if (++falhas !== 4) return;
      this.tiles['claro'] = L.tileLayer(esri + 'World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: atrib, maxZoom: 19 });
      this.map.removeLayer(osm);
      this.aplicarBase();
    });
    this.tiles['claro'] = osm;
    this.tiles['escuro'] = L.layerGroup([
      L.tileLayer(esri + 'Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: atrib, maxNativeZoom: 16, maxZoom: 19 }),
      L.tileLayer(esri + 'Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 16, maxZoom: 19 }),
    ]);
    this.tiles['satelite'] = L.tileLayer(esri + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri', maxZoom: 19 });

    this.layerCoropletico = L.layerGroup().addTo(map);
    this.layerFronteira = L.layerGroup().addTo(map);
    this.layerZonas = L.layerGroup().addTo(map);
    this.layerSemLocal = L.layerGroup().addTo(map);
    this.layerBairros = L.layerGroup().addTo(map);
    this.cluster = typeof L.markerClusterGroup === 'function'
      ? L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 40, disableClusteringAtZoom: 16, showCoverageOnHover: false, spiderfyOnMaxZoom: true })
      : L.layerGroup();
    this.cluster.addTo(map);

    map.on('zoomend', () => this.atualizarCalor());
    map.on('dragstart', () => (this.usuarioMoveu = true));
    map.on('zoomstart', () => { if (!this.movimentoProgramatico) this.usuarioMoveu = true; });
    map.on('moveend', () => (this.movimentoProgramatico = false));
    map.on('popupopen', (e: any) => {
      const botao = e.popup.getElement()?.querySelector('[data-abrir]');
      botao?.addEventListener('click', () => {
        const [uf, nome] = String(botao.getAttribute('data-abrir')).split('|');
        map.closePopup();
        this.store.abrirLocal(uf, nome);
      });
    });

    let timer: any;
    this.observador = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(() => { map.invalidateSize(); this.atualizarCalor(); }, 120); });
    this.observador.observe(el);
    this.aplicarBase();
  }

  private aplicarBase(): void {
    if (!this.map) return;
    const alvo = this.camadas().satelite ? this.tiles['satelite'] : this.camadas().mapaEscuro ? this.tiles['escuro'] : this.tiles['claro'];
    Object.values(this.tiles).forEach((t) => { if (t !== alvo && this.map.hasLayer(t)) this.map.removeLayer(t); });
    if (!this.map.hasLayer(alvo)) alvo.addTo(this.map);
  }

  private mover(fn: () => void): void { this.movimentoProgramatico = true; fn(); }

  private voarParaLocal(): void {
    const d = this.store.dados();
    if (!this.map || !d) return;
    const ehEstado = this.store.escopo() === 'ESTADO';
    this.mover(() => this.map.flyTo([d.centroLat, d.centroLng], ehEstado ? 6 : CFG.ZOOM_CIDADE, { duration: 0.6 }));
  }

  private enquadrar(): void {
    const d = this.store.dados();
    if (!this.map || this.usuarioMoveu || this.store.escopo() !== 'CIDADE' || !d) return;
    const chave = d.uf + '|' + d.cidade;
    if (this.ultimoEnquadramento === chave) return;
    const f = this.store.filtrados();
    if (f.precisas.length >= 3) {
      this.ultimoEnquadramento = chave;
      const b = L.latLngBounds(f.precisas.map((o) => [o.lat, o.lng]));
      this.mover(() => this.map.flyToBounds(b.pad(0.08), { padding: [30, 30], maxZoom: 15, duration: 0.6 }));
    }
  }

  private popup(o: Ocorrencia): string {
    const cat = CATEGORIA_POR_ID[o.cat], prec = ROTULOS_PRECISAO[o.precisao] || ROTULOS_PRECISAO['PENDENTE'];
    return `<div class="popup"><span class="popup-cat" style="color:${cat.cor}">${esc(cat.nome)}</span> · ${esc(o.data)}` +
      `<div class="popup-titulo">${esc(o.titulo)}</div><div class="popup-meta">${esc(o.bairro)} · ${esc(prec.nome)}</div>` +
      `<a href="${esc(urlSegura(o.link))}" target="_blank" rel="noopener"><b>Abrir notícia</b> (${esc(o.veiculo || 'fonte')})</a></div>`;
  }

  /** Resumo do bairro: quantidade por tipo, gravidade e as notícias mais recentes. */
  private popupBairro(b: BairroResumo): string {
    const lista = b.ocorrencias.slice().sort((x, y) => y.ts - x.ts);
    const tipos = Object.keys(b.cats).sort((x, y) => b.cats[y] - b.cats[x])
      .map((id) => `<span class="popup-tag" style="color:${CATEGORIA_POR_ID[id].cor}">${esc(CATEGORIA_POR_ID[id].curto)} ${fmt(b.cats[id])}</span>`).join(' ');
    const total = this.store.bairrosMapa().lista.reduce((a, x) => a + x.qtd, 0);
    const corpo = b.qtd
      ? `${fmt(b.qtd)} ocorrências noticiadas (${total ? Math.round((b.qtd / total) * 100) : 0}% da cidade) · ${fmt(b.graves)} graves · ${fmt(b.recentes)} nos últimos 30 dias` +
        `<div class="popup-tags">${tipos}</div><ul class="lista-sem-local">` +
        lista.slice(0, 6).map((o) => `<li><a href="${esc(urlSegura(o.link))}" target="_blank" rel="noopener">${esc(o.titulo)}</a> <small>(${esc(o.data)})</small></li>`).join('') + '</ul>'
      : 'Nenhuma ocorrência noticiada no período escolhido.';
    return `<div class="popup"><b>${esc(b.nome)}</b><br>${corpo}<small>Notícias (complemento) · bairros do OpenStreetMap</small></div>`;
  }

  /** Cor do bairro pela quantidade relativa (amarelo → vermelho escuro). */
  private corBairro(q: number, max: number): string {
    if (!q) return 'transparent';
    const i = Math.min(ESCALA_BAIRRO.length - 1, Math.floor((Math.sqrt(q) / Math.sqrt(max)) * ESCALA_BAIRRO.length));
    return ESCALA_BAIRRO[i];
  }

  /**
   * Bairros: com contorno do OSM, o bairro é pintado pela quantidade (mapa de calor por bairro);
   * sem contorno, vira um círculo proporcional. Bairros com ocorrência ganham rótulo "Nome (N)".
   */
  private desenharBairros(lista: BairroResumo[], f: ReturnType<PainelStore['filtrados']>): void {
    this.layerBairros.clearLayers();
    if (!lista.length) return;
    const max = Math.max(1, ...lista.map((b) => b.qtd));
    const escuro = this.camadas().mapaEscuro || this.camadas().satelite;
    lista.forEach((b) => {
      const cor = this.corBairro(b.qtd, max);
      let forma: any;
      if (b.aneis) {
        forma = L.polygon(b.aneis, { pane: 'paneBairros', renderer: this.renderer, color: b.qtd ? '#7c2d12' : escuro ? '#cbd5e1' : '#475569',
          weight: b.qtd ? 1.2 : 0.8, opacity: b.qtd ? 0.8 : 0.45, dashArray: b.qtd ? null : '3 3', fillColor: cor, fillOpacity: b.qtd ? 0.42 : 0 });
      } else if (b.qtd) {
        forma = L.circle([b.lat, b.lng], { pane: 'paneBairros', renderer: this.renderer, radius: 150 + 450 * Math.sqrt(b.qtd / max),
          color: '#7c2d12', weight: 1, fillColor: cor, fillOpacity: 0.4 });
      }
      if (forma) {
        forma.bindTooltip(`<b>${esc(b.nome)}</b> · ${b.qtd ? fmt(b.qtd) + ' ocorrências' : 'sem ocorrência no período'}`, { sticky: true });
        forma.bindPopup(() => this.popupBairro(b));
        forma.on('mouseover', () => forma.setStyle({ weight: 2.5 }));
        forma.on('mouseout', () => forma.setStyle({ weight: b.qtd ? 1.2 : 0.8 }));
        this.layerBairros.addLayer(forma);
      }
    });
    // Rótulos dos bairros com ocorrência (os 30 maiores)
    lista.filter((b) => b.qtd).slice(0, 30).forEach((b) => {
      const icone = L.divIcon({ className: 'rotulo-bairro', iconSize: null, iconAnchor: [-6, 12],
        html: `<div><i style="background:${CATEGORIA_POR_ID[b.catTop]?.cor || '#334155'}"></i>${esc(b.nome)} <b>(${fmt(b.qtd)})</b></div>` });
      const mk = L.marker([b.lat, b.lng], { icon: icone, riseOnHover: true, title: b.nome, pane: 'paneRotulos' });
      mk.bindPopup(() => this.popupBairro(b));
      this.layerBairros.addLayer(mk);
    });
    void f;
  }

  /** Resumo oficial do município ao clicar no contorno. */
  private popupFronteira(): string {
    const o = this.store.oficial();
    const nome = this.store.nomeLocal();
    let corpo = '<br><small>Estatística oficial indisponível para este local.</small>';
    if (o?.disponivel && o.anos) {
      corpo = '<ul class="lista-sem-local">' + o.eventos.slice(0, 5).map((e) =>
        `<li>${esc(e.nome)}: <b>${e.porAno[2] == null ? '—' : fmt(e.porAno[2])}</b> em ${o.anos![2]}${e.taxa != null ? ` · ${fmt1(e.taxa)} por 100 mil` : ''}</li>`).join('') +
        `</ul><small>Sinesp · ${esc(o.periodoTresAnos || '')}</small>`;
    }
    return `<div class="popup"><b>${esc(nome)}</b>${corpo}</div>`;
  }

  private renderizar(f: ReturnType<PainelStore['filtrados']>, c: Camadas, coropletico: boolean, bairros: ReturnType<PainelStore['bairrosMapa']>): void {
    if (!this.map) return;
    this.cluster.clearLayers();
    // Com o mapa por taxa ligado, as notícias saem da frente para a leitura do estado ficar limpa
    const mostrarNoticias = !coropletico;
    if (c.pinos && mostrarNoticias) {
      const pinos = f.precisas.map((o) => {
        const m = L.circleMarker([o.lat, o.lng], { renderer: this.renderer, radius: CFG.RAIO_PINO, fillColor: CATEGORIA_POR_ID[o.cat].cor, color: '#fff', weight: 1.5, fillOpacity: 0.95 });
        m.bindPopup(() => this.popup(o));
        return m;
      });
      if (this.cluster.addLayers) this.cluster.addLayers(pinos); else pinos.forEach((p) => this.cluster.addLayer(p));
    }

    this.layerSemLocal.clearLayers();
    const d = this.store.dados();
    if (this.store.escopo() === 'CIDADE' && c.pinos && mostrarNoticias && f.semLocal.length && d) {
      const icone = L.divIcon({ className: 'marcador-sem-local', html: `<div>${f.semLocal.length} sem local</div>`, iconSize: null });
      const mk = L.marker([d.centroLat, d.centroLng], { icon: icone, keyboard: false, zIndexOffset: -100 });
      mk.bindPopup(() => `<div class="popup"><b>${f.semLocal.length} notícias sem rua, bairro ou rodovia identificados</b><br><small>Aparecem aqui só como contador; ficam fora do calor e das zonas vermelhas.</small><ul class="lista-sem-local">` +
        f.semLocal.slice(0, 15).map((o) => `<li><a href="${esc(urlSegura(o.link))}" target="_blank" rel="noopener">${esc(o.titulo)}</a> <small>(${esc(o.data)})</small></li>`).join('') + '</ul></div>');
      this.layerSemLocal.addLayer(mk);
    }

    this.desenharBairros(c.bairros && mostrarNoticias && this.store.escopo() === 'CIDADE' ? bairros.lista : [], f);

    this.layerZonas.clearLayers();
    if (c.zonas && mostrarNoticias) {
      f.zonas.slice().reverse().forEach((z) => {
        const cor = COR_NIVEL[z.nivel];
        const txt = `<b>Zona vermelha ${z.rank} · ${NOME_NIVEL[z.nivel]}</b><br>${esc(z.nome)}<br>${fmt(z.qtd)} ocorrências${z.graves ? ', ' + fmt(z.graves) + ' homicídio/tiroteio' : ''} · índice ${z.indice}`;
        this.layerZonas.addLayer(L.circle([z.lat, z.lng], { pane: 'paneZonas', renderer: this.renderer, radius: z.raio, color: cor, weight: 2, fillColor: cor, fillOpacity: z.nivel === 'critica' ? 0.22 : 0.15 }).bindPopup(txt));
        this.layerZonas.addLayer(L.marker([z.lat, z.lng], { pane: 'paneZonas', icon: L.divIcon({ className: 'rotulo-zona', html: `<div style="background:${cor}">${z.rank}</div>`, iconSize: [24, 24] }), keyboard: false }).bindPopup(txt));
      });
    }

    // Calor: pontos com local preciso + notícias que só citam o bairro (no centro do bairro)
    this.pontosCalor = mostrarNoticias
      ? [...f.precisas.map((o) => [o.lat!, o.lng!, CATEGORIA_POR_ID[o.cat].peso] as [number, number, number]), ...(this.store.escopo() === 'CIDADE' ? bairros.calorExtra : [])]
      : [];
    this.atualizarCalor();
    this.enquadrar();
  }

  private raioCalorPx(): number {
    const metrosPorPx = (156543.03 * Math.cos((this.map.getCenter().lat * Math.PI) / 180)) / Math.pow(2, this.map.getZoom());
    return Math.max(CFG.RAIO_CALOR_MIN_PX, Math.min(CFG.RAIO_CALOR_MAX_PX, Math.round(CFG.RAIO_CALOR_METROS / metrosPorPx)));
  }

  /** "Máximo" do calor = célula mais densa no zoom atual: um ponto isolado não fica vermelho. */
  private maximoCalor(raio: number): number {
    const celula = Math.max(4, raio / 2), soma: Record<string, number> = {};
    let maior = 0;
    for (const p of this.pontosCalor) {
      const pt = this.map.project([p[0], p[1]]);
      const k = Math.floor(pt.x / celula) + ':' + Math.floor(pt.y / celula);
      soma[k] = (soma[k] || 0) + p[2];
      if (soma[k] > maior) maior = soma[k];
    }
    return Math.max(2, maior);
  }

  private atualizarCalor(): void {
    if (!this.map || typeof L.heatLayer !== 'function') return;
    if (!this.camadas().calor || !this.pontosCalor.length || this.map.getSize().x < 50) {
      if (this.calor && this.map.hasLayer(this.calor)) this.map.removeLayer(this.calor);
      return;
    }
    const raio = this.raioCalorPx();
    const opcoes = { radius: raio, blur: Math.round(raio * 0.85), maxZoom: this.map.getZoom(), max: this.maximoCalor(raio), minOpacity: 0.25,
      gradient: { 0.2: '#3b82f6', 0.45: '#22c55e', 0.65: '#eab308', 0.82: '#f97316', 1.0: '#dc2626' } };
    if (!this.calor) this.calor = L.heatLayer(this.pontosCalor, opcoes);
    if (this.map.hasLayer(this.calor)) {
      this.calor.setOptions(opcoes);
      this.calor.setLatLngs(this.pontosCalor);
    } else {
      // Fora do mapa o plugin não redesenha: guarda opções e pontos e desenha ao entrar
      L.setOptions(this.calor, opcoes);
      this.calor._latlngs = this.pontosCalor;
      this.calor.addTo(this.map);
    }
  }

  // --------------------------------------------------------------------------
  // CONTORNOS E MALHAS DO IBGE (direto do IBGE → servidor como reserva), com cache no navegador
  // --------------------------------------------------------------------------
  private async obterMalha(codigo: string, municipiosDoEstado = false): Promise<any> {
    const chave = 'MALHA_' + codigo + (municipiosDoEstado ? '_MUN' : '');
    const guardada = await CacheDisco.obter<any>(chave);
    if (guardada) return guardada;
    const base = 'https://servicodados.ibge.gov.br/api/v3/malhas/';
    const url = String(codigo).length === 2
      ? base + 'estados/' + codigo + '?formato=application/vnd.geo+json&qualidade=minima' + (municipiosDoEstado ? '&intrarregiao=municipio' : '')
      : base + 'municipios/' + codigo + '?formato=application/vnd.geo+json&qualidade=intermediaria';
    let geo = await fetchComTimeout(url, municipiosDoEstado ? 15000 : undefined).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    if (!(geo?.features?.length) && !municipiosDoEstado) geo = await Servidor.fronteira(codigo);
    if (geo?.features?.length) CacheDisco.salvar(chave, geo);
    return geo;
  }

  private async desenharFronteira(codigo: string, ver: boolean, ehEstado: boolean): Promise<void> {
    const token = ++this.tokenFronteira;
    this.layerFronteira?.clearLayers();
    if (!ver || !codigo || !this.map) return;
    const geo = await this.obterMalha(codigo);
    if (token !== this.tokenFronteira || !geo?.features) return;
    const cor = ehEstado ? CFG.COR_FRONTEIRA_ESTADO : CFG.COR_FRONTEIRA_CIDADE;
    const camada = L.geoJSON(geo, { pane: 'paneFronteira', interactive: false, style: { stroke: false, fillColor: cor, fillOpacity: ehEstado ? 0.03 : 0.08 } });
    // Só a linha do contorno recebe clique, para não cobrir os pinos e os bairros
    const linha = L.geoJSON(geo, { pane: 'paneZonas', style: { color: cor, weight: 3, fill: false, dashArray: ehEstado ? null : '6 4' } });
    linha.bindTooltip(() => this.store.nomeLocal() + ' · clique para o resumo oficial', { sticky: true });
    linha.bindPopup(() => this.popupFronteira());
    this.layerFronteira.clearLayers();
    this.layerFronteira.addLayer(camada);
    this.layerFronteira.addLayer(linha);
    const b = camada.getBounds();
    if (!this.usuarioMoveu && b.isValid() && (ehEstado || this.store.filtrados().precisas.length < 3)) {
      this.mover(() => this.map.flyToBounds(b, { padding: [24, 24], duration: 0.6 }));
    }
  }

  /** Quebras por quantis (até 6 faixas) dos valores positivos. */
  private limites(valores: number[]): number[] {
    const v = valores.filter((x) => x > 0).sort((a, b) => a - b);
    if (v.length < 2) return v.length ? [v[0]] : [];
    const n = Math.min(ESCALA.length, Math.max(2, Math.floor(v.length / 3)));
    const r: number[] = [];
    for (let i = 1; i < n; i++) {
      const q = v[Math.min(v.length - 1, Math.floor((i / n) * v.length))];
      if (!r.length || q > r[r.length - 1]) r.push(q);
    }
    return r;
  }

  private async desenharCoropletico(ativoEstado: boolean, uf: string, ev: number, malha: { uf: string; geo: any } | null, vizinhos: boolean): Promise<void> {
    const token = ++this.tokenCoropletico;
    this.layerCoropletico?.clearLayers();
    if (!this.map) return;
    const ativo = ativoEstado || vizinhos;
    if (!ativoEstado && this.ufEnquadradaCoropletico) {
      // Saiu da aba Estado: volta para a cidade aberta
      if (this.store.escopo() === 'CIDADE') {
        this.usuarioMoveu = false;
        this.ultimoEnquadramento = '';
        this.voarParaLocal();
        this.enquadrar();
      }
      this.ufEnquadradaCoropletico = '';
    }
    if (!ativo) return;
    if (!malha || malha.uf !== uf) {
      const geo = await this.obterMalha(ESTADOS[uf].ibge, true);
      if (token === this.tokenCoropletico && geo?.features) this.malhaEstado.set({ uf, geo });
      return; // o efeito roda de novo com a malha carregada
    }
    const p = this.store.panorama()!;
    const r = (vizinhos ? null : p.rankings![ev]) || p.rankings![0];
    const codCidade = this.store.ibgeCidade();
    const limites = this.limites(Object.values(r.valoresTaxa));
    const corDe = (v: number | undefined) => {
      if (!v) return null;
      let i = 0;
      while (i < limites.length && v > limites[i]) i++;
      return ESCALA[i];
    };
    const totais: Record<string, { total: number; anterior: number }> = {};
    [...r.porTotal, ...r.porTaxa, ...r.altas, ...r.quedas].forEach((l) => { if (l.ibge) totais[l.ibge] = l; });
    const camada = L.geoJSON(malha.geo, {
      pane: 'paneCoropletico',
      style: (feat: any) => {
        const cor = corDe(r.valoresTaxa[feat.properties.codarea]);
        if (vizinhos) {
          const propria = String(feat.properties.codarea) === codCidade;
          return { color: '#64748b', weight: 0.7, opacity: 0.6, fillColor: cor || 'transparent', fillOpacity: cor && !propria ? 0.22 : 0 };
        }
        return { color: this.store.escuro() ? '#334155' : '#ffffff', weight: 0.6, fillColor: cor || 'transparent', fillOpacity: cor ? 0.78 : 0 };
      },
      onEachFeature: (feat: any, layer: any) => {
        const cod = String(feat.properties.codarea);
        const mun = municipioPorCodigo(cod);
        const taxa = r.valoresTaxa[cod];
        const t = totais[cod];
        layer.bindTooltip(`<b>${esc(mun?.nome || cod)}</b><br>${taxa ? fmt1(taxa) + ' por 100 mil' : 'sem registro ou população'}`, { sticky: true, direction: 'top' });
        layer.bindPopup(`<div class="popup"><b>${esc(mun?.nome || cod)}</b><br>${esc(r.evento)}: ${taxa ? fmt1(taxa) + ' por 100 mil habitantes' : 'sem taxa calculada'}` +
          (t ? `<br>${fmt(t.total)} registros nos últimos 12 meses (antes: ${fmt(t.anterior)})` : '') +
          (mun ? `<br><button class="popup-botao" data-abrir="${esc(uf + '|' + mun.nome)}">Abrir município</button>` : '') + '</div>');
        if (vizinhos && cod === codCidade) { layer.options.interactive = false; return; }
        layer.on('mouseover', () => layer.setStyle({ weight: 2, color: '#0f172a' }));
        layer.on('mouseout', () => camada.resetStyle(layer));
      },
    });
    this.layerCoropletico.addLayer(camada);
    // Ao abrir a aba Estado, mostra o estado inteiro
    if (ativoEstado && this.ufEnquadradaCoropletico !== uf && camada.getBounds().isValid()) {
      this.ufEnquadradaCoropletico = uf;
      this.mover(() => this.map.flyToBounds(camada.getBounds(), { padding: [16, 16], duration: 0.6 }));
    }
  }
}
