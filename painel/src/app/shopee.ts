import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgenteIA } from './core/agente';
import { MonitorShopee, NoticiaShopee } from './core/shopee';

/** Sino de notificações da Shopee (contador, lista) e popups de notícia nova. */
@Component({
  selector: 'app-shopee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, MatTooltipModule],
  template: `
    <button mat-icon-button class="sino" [class.ativo]="aberto()" matTooltip="Shopee nas notícias" aria-label="Notificações da Shopee"
      [matBadge]="m.naoLidas().length > 99 ? '99+' : m.naoLidas().length" [matBadgeHidden]="!m.naoLidas().length" matBadgeSize="medium"
      (click)="alternar()">
      <mat-icon>{{ m.naoLidas().length ? 'notifications_active' : 'notifications' }}</mat-icon>
    </button>

    @if (aberto()) {
      <div class="fundo" (click)="aberto.set(false)"></div>
      <section class="lista" role="dialog" aria-label="Notícias da Shopee">
        <header>
          <div><b>Shopee nas notícias</b><small>{{ m.naoLidas().length }} novas · {{ m.itens().length }} no total</small></div>
          <button mat-icon-button aria-label="Fechar" (click)="aberto.set(false)"><mat-icon>close</mat-icon></button>
        </header>
        <div class="filtros">
          <button type="button" [class.sel]="filtro() === 'novas'" (click)="filtro.set('novas')">Novas</button>
          <button type="button" [class.sel]="filtro() === 'seguranca'" (click)="filtro.set('seguranca')">Segurança</button>
          <button type="button" [class.sel]="filtro() === 'todas'" (click)="filtro.set('todas')">Todas</button>
          <span class="espaco"></span>
          @if (m.naoLidas().length) { <button type="button" class="link" (click)="m.marcarTodasLidas()">Marcar todas como lidas</button> }
        </div>
        <div class="itens">
          @for (i of visiveis(); track i.id) {
            <article [class.nova]="m.ehNova(i)">
              <div class="linha1"><span class="tipo" [class.seg]="i.seguranca">{{ i.tipo }}</span><small>{{ i.data }} · {{ i.veiculo }}@if (i.ufs.length) { · {{ i.ufs.join(', ') }} }</small></div>
              <a [href]="i.link" target="_blank" rel="noopener" (click)="m.marcarLida(i)">{{ i.titulo }}</a>
              <div class="acoes">
                <button type="button" (click)="resumir(i)"><mat-icon>auto_awesome</mat-icon>Perguntar ao agente</button>
                @if (m.ehNova(i)) { <button type="button" (click)="m.marcarLida(i)"><mat-icon>done</mat-icon>Lida</button> }
              </div>
            </article>
          } @empty {
            <p class="vazio">
              @if (m.carregando()) { Buscando notícias… }
              @else if (m.erro()) { {{ m.erro() }} }
              @else if (filtro() === 'novas') { Nenhuma notícia nova. Veja a aba "Todas". }
              @else { Nenhuma notícia citando a Shopee por enquanto. }
            </p>
          }
        </div>
        <footer>
          Busca no Google Notícias e nos jornais de cada estado, de 15 em 15 minutos. Termos: {{ m.termos().join(', ') }}.
          @if (podeAtivarNavegador()) { <button type="button" class="link" (click)="ativarNavegador()">Avisar também pelo navegador</button> }
        </footer>
      </section>
    }

    <div class="avisos" aria-live="polite">
      @for (a of m.avisos(); track a.chave) {
        <div class="aviso" role="status">
          <span class="icone"><mat-icon>campaign</mat-icon></span>
          <div class="texto">
            @if (a.itens.length === 1) {
              <b>Notícia nova sobre a Shopee</b>
              <span>{{ a.itens[0].titulo }}</span>
              <small>{{ a.itens[0].tipo }} · {{ a.itens[0].veiculo }}</small>
            } @else {
              <b>{{ a.itens.length }} notícias novas sobre a Shopee</b>
              <span>{{ a.itens[0].titulo }}</span>
              <small>e mais {{ a.itens.length - 1 }}</small>
            }
            <div class="botoes">
              <button type="button" (click)="verAviso(a.chave)">Ver</button>
              @if (a.itens.length === 1) { <a [href]="a.itens[0].link" target="_blank" rel="noopener" (click)="m.marcarLida(a.itens[0]); m.fecharAviso(a.chave)">Abrir notícia</a> }
            </div>
          </div>
          <button class="x" type="button" aria-label="Fechar aviso" (click)="m.fecharAviso(a.chave)"><mat-icon>close</mat-icon></button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .sino.ativo { color: var(--shopee-laranja); }
    .fundo { position: fixed; inset: 0; z-index: 1090; }
    .lista { position: fixed; top: 64px; right: 12px; width: min(420px, calc(100vw - 24px)); max-height: min(640px, calc(100dvh - 80px)); z-index: 1100;
      display: flex; flex-direction: column; background: var(--mat-sys-surface-container-lowest); color: var(--mat-sys-on-surface);
      border: 1px solid var(--borda-suave); border-radius: 20px; box-shadow: 0 18px 48px rgba(10, 22, 48, .28); overflow: hidden; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 8px 12px 16px; background: #113366; color: #fff; }
    header div { display: grid; } header small { opacity: .8; font-size: 12px; }
    header button { color: #fff; }
    .filtros { display: flex; gap: 6px; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--borda-suave); flex-wrap: wrap; }
    .filtros button { border: 1px solid var(--borda-suave); background: transparent; color: inherit; border-radius: 999px; padding: 4px 12px; font: inherit; font-size: 13px; cursor: pointer; }
    .filtros button.sel { background: var(--shopee-laranja); border-color: var(--shopee-laranja); color: #fff; }
    .filtros .espaco { flex: 1; }
    .link { border: 0 !important; background: none; color: var(--shopee-laranja) !important; font: inherit; font-size: 13px; cursor: pointer; padding: 4px; }
    .itens { min-width: 0; overflow-y: auto; overflow-x: hidden; padding: 6px 0; }
    article { min-width: 0; padding: 10px 16px; border-bottom: 1px solid var(--borda-suave); display: grid; gap: 4px; }
    article.nova { background: color-mix(in srgb, var(--shopee-laranja) 8%, transparent); box-shadow: inset 3px 0 0 var(--shopee-laranja); }
    .linha1 { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .linha1 small { opacity: .7; font-size: 12px; }
    .tipo { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--mat-sys-surface-container-high); }
    .tipo.seg { background: #D0011B; color: #fff; }
    article a { display: block; white-space: normal; overflow-wrap: anywhere; color: inherit; text-decoration: none; font-weight: 500; line-height: 1.35; }
    article a:hover { color: var(--shopee-laranja); text-decoration: underline; }
    .acoes { display: flex; gap: 10px; }
    .acoes button { display: inline-flex; align-items: center; gap: 4px; border: 0; background: none; color: var(--shopee-laranja); font: inherit; font-size: 12px; cursor: pointer; padding: 2px 0; }
    .acoes mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .vazio { padding: 20px 16px; opacity: .75; margin: 0; }
    footer { padding: 10px 16px; font-size: 11.5px; opacity: .75; border-top: 1px solid var(--borda-suave); line-height: 1.4; }
    .avisos { position: fixed; top: 72px; right: 16px; z-index: 1200; display: grid; gap: 10px; width: min(380px, calc(100vw - 32px)); pointer-events: none; }
    .aviso { pointer-events: auto; display: flex; gap: 12px; align-items: flex-start; padding: 12px 12px 12px 14px; border-radius: 18px;
      background: var(--mat-sys-surface-container-lowest); color: var(--mat-sys-on-surface); border: 1px solid var(--borda-suave);
      border-left: 4px solid var(--shopee-laranja); box-shadow: 0 14px 36px rgba(10, 22, 48, .28); animation: entrar .25s ease-out; }
    @keyframes entrar { from { transform: translateX(24px); opacity: 0; } to { transform: none; opacity: 1; } }
    .aviso .icone { width: 34px; height: 34px; flex: none; border-radius: 50%; display: grid; place-items: center; background: var(--shopee-laranja); color: #fff; }
    .aviso .icone mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .aviso .texto { display: grid; gap: 3px; min-width: 0; flex: 1; }
    .aviso .texto span { white-space: normal; font-size: 13px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .aviso .texto small { font-size: 12px; opacity: .7; }
    .botoes { display: flex; gap: 12px; margin-top: 4px; }
    .botoes button, .botoes a { border: 0; background: none; padding: 0; color: var(--shopee-laranja); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; }
    .aviso .x { border: 0; background: none; color: inherit; opacity: .6; cursor: pointer; padding: 0; display: grid; }
    .aviso .x mat-icon { font-size: 18px; width: 18px; height: 18px; }
    @media (max-width: 600px) {
      .lista { top: 0; right: 0; width: 100vw; max-height: 100dvh; height: 100dvh; border-radius: 0; }
      .avisos { top: auto; bottom: 88px; right: 16px; }
    }
  `],
})
export class ShopeeComponent {
  protected readonly m = inject(MonitorShopee);
  private readonly ia = inject(AgenteIA);
  protected readonly aberto = signal(false);
  protected readonly filtro = signal<'novas' | 'seguranca' | 'todas'>('novas');
  protected readonly visiveis = computed(() => {
    const f = this.filtro(), l = this.m.itens();
    if (f === 'novas') return this.m.naoLidas();
    if (f === 'seguranca') return l.filter((i) => i.seguranca).slice(0, 150);
    return l.slice(0, 150);
  });

  constructor() { this.m.iniciar(); }

  protected alternar(): void {
    const abrir = !this.aberto();
    if (abrir) this.filtro.set(this.m.naoLidas().length ? 'novas' : 'seguranca');
    this.aberto.set(abrir);
  }

  protected verAviso(chave: number): void {
    this.m.fecharAviso(chave);
    this.filtro.set('novas');
    this.aberto.set(true);
  }

  protected resumir(i: NoticiaShopee): void {
    this.m.marcarLida(i);
    this.aberto.set(false);
    this.ia.perguntar(`Explique de forma curta esta notícia que cita a Shopee e o que ela significa para a segurança da operação (motoristas, entregadores, cargas, funcionários). ` +
      `Notícia: """${i.titulo}. ${i.resumo}""" (${i.veiculo}, ${i.data}). Se houver outras notícias parecidas no contexto, compare.`,
      'Shopee: ' + i.titulo.slice(0, 60), `Explicar a notícia "${i.titulo}"`);
  }

  protected podeAtivarNavegador(): boolean {
    try { const N = (window as any).Notification; return !!N && N.permission === 'default'; } catch { return false; }
  }
  protected ativarNavegador(): void {
    try { (window as any).Notification.requestPermission(); } catch { /* bloqueado */ }
  }
}
