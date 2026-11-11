import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgenteIA, MensagemIA } from './core/agente';
import { PainelStore } from './core/painel.store';

const SUGESTOES = [
  'Resuma a situação da segurança neste local',
  'Quais são os bairros mais críticos e por quê?',
  'Como chegaram ao índice de criminalidade?',
  'Os números estão subindo ou caindo?',
  'O que saiu nas notícias sobre a Shopee?',
];

/** Cartões que ganham o botão "Resumir com IA" (os botões de zona e as notícias ficam de fora). */
const SELETOR_CARTOES = '.conteudo .cartao:not(.zona):not(.noticia), .kpis .kpi';

/**
 * Agente de IA: botão flutuante, conversa lateral e o botão de resumo em cada cartão.
 * As respostas podem virar PDF ou planilha Google (gerados no Drive pelo servidor).
 */
@Component({
  selector: 'app-agente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    @if (!ia.aberto()) {
      <button type="button" class="fab" (click)="ia.abrir()" aria-label="Abrir o assistente de IA" matTooltip="Pergunte qualquer coisa sobre os dados do painel">
        <mat-icon>auto_awesome</mat-icon><span>Assistente IA</span>
      </button>
    } @else {
      <aside class="janela" role="dialog" aria-label="Assistente de IA">
        <header>
          <mat-icon class="logo">auto_awesome</mat-icon>
          <div class="tit"><b>Assistente IA</b><small>{{ store.nomeLocal() || 'Mapa da Segurança' }}</small></div>
          <button mat-icon-button (click)="ia.limpar()" matTooltip="Nova conversa" aria-label="Nova conversa"><mat-icon>add_comment</mat-icon></button>
          <button mat-icon-button (click)="ia.fechar()" aria-label="Fechar o assistente"><mat-icon>close</mat-icon></button>
        </header>
        <div class="mensagens" #lista>
          @if (ia.configurado() === false) {
            <div class="aviso">O assistente ainda não está ativo: falta gravar a chave <b>INSEA_API_KEY</b> nas propriedades do script do Apps Script.</div>
          }
          @if (!ia.mensagens().length) {
            <div class="boas-vindas">
              <p>Olá! Respondo com base nos dados que o painel está mostrando agora: estatísticas oficiais, índice, bairros, zonas e notícias.</p>
              <div class="sugestoes">
                @for (s of sugestoes; track s) { <button type="button" (click)="ia.perguntar(s)">{{ s }}</button> }
              </div>
            </div>
          }
          @for (m of ia.mensagens(); track m.id) {
            <div class="msg" [class.usuario]="m.papel === 'usuario'" [class.erro]="m.erro">
              @if (m.papel === 'usuario') { {{ m.texto }} }
              @else {
                <div class="md" [innerHTML]="html(m.texto)"></div>
                @if (!m.erro) {
                  <div class="acoes">
                    <button type="button" (click)="ia.exportar(m, 'pdf')" [disabled]="!!m.exportando">
                      <mat-icon>picture_as_pdf</mat-icon>{{ m.exportando === 'pdf' ? 'Gerando…' : m.links?.pdf ? 'PDF gerado' : 'PDF' }}</button>
                    <button type="button" (click)="ia.exportar(m, 'sheets')" [disabled]="!!m.exportando">
                      <mat-icon>table_chart</mat-icon>{{ m.exportando === 'sheets' ? 'Gerando…' : m.links?.sheets ? 'Planilha gerada' : 'Planilha Google' }}</button>
                    <button type="button" (click)="copiar(m)"><mat-icon>content_copy</mat-icon>{{ copiado() === m.id ? 'Copiado' : 'Copiar' }}</button>
                  </div>
                  @if (m.links?.pdf || m.links?.sheets) {
                    <div class="links">
                      @if (m.links?.pdf) { <a [href]="m.links!.pdf" target="_blank" rel="noopener">Abrir PDF</a> }
                      @if (m.links?.sheets) { <a [href]="m.links!.sheets" target="_blank" rel="noopener">Abrir planilha</a> }
                    </div>
                  }
                  @if (m.erroExportar) { <div class="erro-exp">{{ m.erroExportar }}</div> }
                }
              }
            </div>
          }
          @if (ia.pensando()) { <div class="msg pensando"><span></span><span></span><span></span></div> }
        </div>
        <form (submit)="enviar($event)">
          <textarea #campo rows="1" placeholder="Pergunte sobre os dados do painel…" aria-label="Pergunta para o assistente"
            (keydown.enter)="enter($event)" (input)="texto.set(campo.value)" [value]="texto()"></textarea>
          <button mat-icon-button type="submit" [disabled]="!texto().trim() || ia.pensando()" aria-label="Enviar"><mat-icon>send</mat-icon></button>
        </form>
        <small class="rodape">Resposta gerada por IA a partir dos dados do painel. Confira os números.</small>
      </aside>
    }
  `,
  styles: `
    :host { position: fixed; right: 18px; bottom: 18px; z-index: 1500; }
    .fab { display: inline-flex; align-items: center; gap: 8px; border: 0; cursor: pointer; padding: 12px 18px 12px 14px; border-radius: 999px;
      background: var(--shopee-laranja); color: #fff; font: 600 14px Roboto, sans-serif; box-shadow: 0 6px 20px rgba(238, 77, 45, .35); }
    .fab:hover { background: #d9411f; }
    .janela { width: min(420px, calc(100vw - 24px)); height: min(640px, calc(100dvh - 36px)); display: flex; flex-direction: column;
      background: var(--mat-sys-surface-container-lowest); color: var(--mat-sys-on-surface); border-radius: 22px; overflow: hidden;
      box-shadow: 0 18px 50px rgba(10, 22, 48, .35); border: 1px solid var(--borda-suave); }
    header { display: flex; align-items: center; gap: 8px; padding: 10px 8px 10px 16px; background: var(--shopee-azul); color: #fff; }
    header button { color: #fff; }
    .logo { color: var(--shopee-laranja); }
    .tit { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .tit small { opacity: .8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mensagens { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
    .boas-vindas p { margin: 0 0 10px; color: var(--mat-sys-on-surface-variant); }
    .sugestoes { display: flex; flex-wrap: wrap; gap: 6px; }
    .sugestoes button { border: 1px solid var(--borda-suave); background: var(--mat-sys-surface-container); color: inherit; border-radius: 999px;
      padding: 6px 12px; cursor: pointer; font: var(--mat-sys-body-small); text-align: left; }
    .sugestoes button:hover { border-color: var(--shopee-laranja); }
    .msg { max-width: 92%; padding: 10px 12px; border-radius: 16px; background: var(--mat-sys-surface-container); align-self: flex-start;
      font: var(--mat-sys-body-medium); overflow-wrap: anywhere; }
    .msg.usuario { align-self: flex-end; background: var(--shopee-laranja); color: #fff; border-bottom-right-radius: 6px; }
    .msg:not(.usuario) { border-bottom-left-radius: 6px; }
    .msg.erro { background: var(--mat-sys-error-container); color: var(--mat-sys-on-surface); }
    .aviso { padding: 10px 12px; border-radius: 14px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); font: var(--mat-sys-body-small); }
    .md :first-child { margin-top: 0; } .md :last-child { margin-bottom: 0; }
    .md table { border-collapse: collapse; width: 100%; margin: 6px 0; font: var(--mat-sys-body-small); display: block; overflow-x: auto; }
    .md th, .md td { border: 1px solid var(--borda-suave); padding: 4px 6px; text-align: left; }
    .md th { background: var(--mat-sys-surface-container-high); }
    .md h3, .md h4 { margin: 8px 0 4px; font: var(--mat-sys-title-small); }
    .md p { margin: 4px 0; } .md ul { margin: 4px 0; padding-left: 18px; }
    .acoes { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .acoes button { display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--borda-suave); background: var(--mat-sys-surface-container-lowest);
      color: inherit; border-radius: 999px; padding: 4px 10px; cursor: pointer; font: var(--mat-sys-label-medium); }
    .acoes button:hover:not(:disabled) { border-color: var(--shopee-laranja); color: var(--shopee-laranja); }
    .acoes mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .links { display: flex; gap: 12px; margin-top: 6px; font: var(--mat-sys-label-medium); }
    .erro-exp { margin-top: 6px; color: var(--cor-perigo); font: var(--mat-sys-body-small); }
    .pensando { display: flex; gap: 4px; }
    .pensando span { width: 7px; height: 7px; border-radius: 50%; background: var(--shopee-laranja); animation: pulo 1s infinite ease-in-out; }
    .pensando span:nth-child(2) { animation-delay: .15s; } .pensando span:nth-child(3) { animation-delay: .3s; }
    @keyframes pulo { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-4px); } }
    form { display: flex; align-items: flex-end; gap: 6px; padding: 8px 8px 4px 14px; border-top: 1px solid var(--borda-suave); }
    textarea { flex: 1; resize: none; border: 1px solid var(--borda-suave); border-radius: 16px; padding: 10px 12px; font: var(--mat-sys-body-medium);
      background: var(--mat-sys-surface-container); color: inherit; max-height: 120px; outline: none; }
    textarea:focus { border-color: var(--shopee-laranja); }
    form button:not(:disabled) { color: var(--shopee-laranja); }
    .rodape { padding: 0 14px 8px; color: var(--mat-sys-on-surface-variant); font-size: 11px; }
    @media (max-width: 600px) {
      :host { right: 12px; bottom: 12px; }
      .fab span { display: none; }
      .fab { padding: 14px; }
      .janela { position: fixed; inset: 0; width: 100vw; height: 100dvh; border-radius: 0; }
    }
  `,
})
export class AgenteComponent {
  protected readonly ia = inject(AgenteIA);
  protected readonly store = inject(PainelStore);
  protected readonly sugestoes = SUGESTOES;
  protected readonly texto = signal('');
  protected readonly copiado = signal(0);
  private readonly lista = viewChild<ElementRef<HTMLElement>>('lista');

  constructor() {
    // Rola a conversa para a última mensagem
    effect(() => {
      this.ia.mensagens(); this.ia.pensando();
      const el = this.lista()?.nativeElement;
      if (el) setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 30);
    });
    // Botão "Resumir com IA" em cada cartão (inclusive os que aparecem depois, ao trocar de aba)
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const marcar = () => document.querySelectorAll<HTMLElement>(SELETOR_CARTOES).forEach((c) => this.botaoNoCartao(c));
      let pendente = 0;
      const obs = new MutationObserver(() => { if (!pendente) pendente = window.setTimeout(() => { pendente = 0; marcar(); }, 250); });
      obs.observe(document.body, { childList: true, subtree: true });
      marcar();
      destroy.onDestroy(() => obs.disconnect());
    });
  }

  private botaoNoCartao(c: HTMLElement): void {
    if (c.querySelector(':scope > .ia-resumo')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ia-resumo';
    b.title = 'Resumir este cartão com IA';
    b.setAttribute('aria-label', 'Resumir este cartão com IA');
    b.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span>';
    b.addEventListener('click', (ev) => {
      ev.stopPropagation(); ev.preventDefault();
      // Título e texto sem os nomes dos ícones (que são texto no HTML)
      const semIcones = (el: Element | null) => {
        if (!el) return '';
        const copia = el.cloneNode(true) as HTMLElement;
        copia.querySelectorAll('.ia-resumo, mat-icon, .material-symbols-outlined, svg, canvas, script, style').forEach((x) => x.remove());
        copia.style.cssText = 'position:fixed;left:-99999px;top:0;width:600px;opacity:0;pointer-events:none';
        document.body.appendChild(copia);
        const t = copia.innerText || copia.textContent || '';
        copia.remove();
        return t;
      };
      const titulo = semIcones(c.querySelector('h3, h4, .kpi-rotulo, header')).replace(/\s+/g, ' ').trim().slice(0, 80);
      const texto = semIcones(c);
      this.ia.resumirCartao(titulo || 'Cartão', texto);
    });
    c.appendChild(b);
  }

  protected enter(ev: Event): void {
    const k = ev as KeyboardEvent;
    if (k.shiftKey) return;
    k.preventDefault();
    this.enviar(ev);
  }

  protected enviar(ev: Event): void {
    ev.preventDefault();
    const t = this.texto().trim();
    if (!t) return;
    this.ia.perguntar(t);
    this.texto.set('');
  }

  protected copiar(m: MensagemIA): void {
    navigator.clipboard?.writeText(m.texto).then(() => { this.copiado.set(m.id); setTimeout(() => this.copiado.set(0), 2000); }, () => undefined);
  }

  /** Markdown simples → HTML seguro (o texto é escapado antes). */
  protected html(md: string): string {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>')
      .replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    const out: string[] = [];
    let lista = false, tabela = false, cab = true;
    const fechar = () => { if (lista) { out.push('</ul>'); lista = false; } if (tabela) { out.push('</table>'); tabela = false; } };
    for (const l of md.split('\n')) {
      const t = l.trim();
      if (/^\|.*\|$/.test(t)) {
        if (/^\|?\s*:?-{2,}/.test(t)) continue;
        if (!tabela) { fechar(); out.push('<table>'); tabela = true; cab = true; }
        const tag = cab ? 'th' : 'td';
        out.push('<tr>' + t.slice(1, -1).split('|').map((x) => `<${tag}>${inline(x.trim())}</${tag}>`).join('') + '</tr>');
        cab = false;
        continue;
      }
      const li = t.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
      if (li) { if (!lista) { fechar(); out.push('<ul>'); lista = true; } out.push('<li>' + inline(li[1]) + '</li>'); continue; }
      fechar();
      const h = t.match(/^#{1,4}\s+(.*)$/);
      if (h) out.push('<h4>' + inline(h[1]) + '</h4>');
      else if (t) out.push('<p>' + inline(t) + '</p>');
    }
    fechar();
    return out.join('');
  }
}
