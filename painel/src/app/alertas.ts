import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { dataCurta, Favorito, Favoritos, igualFavorito } from './core/favoritos';
import { ESTADOS } from './core/dados';
import { PainelStore } from './core/painel.store';
import { Servidor } from './core/servidor';

interface PrefsAlerta {
  ativo: boolean; locais: Favorito[]; temas: string[]; shopee: boolean; shopeeEscopo: 'locais' | 'brasil';
  shopeeSoSeguranca: boolean; inmet: boolean; frequencia: 'imediato' | 'diario' | 'semanal'; hora: number;
}
const TEMAS_PADRAO = [
  { id: 'CVLI', nome: 'Homicídio e latrocínio' }, { id: 'CONFRONTO', nome: 'Tiroteio e arma de fogo' },
  { id: 'CARGA', nome: 'Roubo de carga' }, { id: 'PATRIMONIO', nome: 'Roubo e furto' },
  { id: 'TRAFICO', nome: 'Tráfico e operação policial' }, { id: 'BLOQUEIO', nome: 'Distúrbio e bloqueio de via' },
];
const igual = igualFavorito;

/** "Meus alertas": a pessoa escolhe locais, temas e frequência dos e-mails (security.br@shopee.com). */
@Component({
  selector: 'app-alertas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSlideToggleModule, MatButtonToggleModule, MatProgressBarModule],
  template: `
    <h2 mat-dialog-title class="titulo"><mat-icon>mark_email_unread</mat-icon> Meus alertas por e-mail</h2>
    <mat-dialog-content class="conteudo">
      @if (carregando()) { <mat-progress-bar mode="indeterminate" /> }
      @else if (!conta()) {
        <div class="aviso">
          <mat-icon>lock</mat-icon>
          <div><b>Os alertas precisam da sua conta @shopee.com.</b>
            <p>O painel ainda não sabe quem está usando. Peça para quem administra o Mapa da Segurança deixar a implantação como "Qualquer pessoa em shopee.com". Depois disso, é só abrir esta tela de novo.</p></div>
        </div>
      } @else {
        <p class="conta">Os e-mails chegam em <b>{{ conta() }}</b>, enviados por <b>{{ remetente() }}</b>.</p>
        <mat-slide-toggle [checked]="p().ativo" (change)="mudar({ ativo: $event.checked })">Receber alertas</mat-slide-toggle>

        <section [class.apagado]="!p().ativo">
          <h3>Locais</h3>
          <div class="chips">
            @for (l of p().locais; track (l.id || '') + l.uf + l.nome) {
              @if (l.tipo !== 'pino') {
                <span class="chip">{{ rotulo(l) }}<button mat-icon-button [attr.aria-label]="'Tirar ' + rotulo(l)" (click)="tirar(l)"><mat-icon>close</mat-icon></button></span>
              }
            } @empty { <span class="dica">Nenhum local escolhido.</span> }
          </div>
          @if (pinos().length) {
            <h3>Pinos monitorados (raio de 1 km)</h3>
            <ul class="pinos">
              @for (l of pinos(); track l.id) {
                <li [class.vencido]="vencido(l)">
                  <mat-icon>push_pin</mat-icon>
                  <div><b translate="no">{{ l.nome }}</b> <span class="cidade">{{ l.cidade }}/{{ l.uf }}</span>
                    <small>{{ l.por ? 'Adicionado por ' + l.por + ' em ' + data(l.em) : 'Adicionado em ' + data(l.em) }} ·
                      {{ l.ate ? (vencido(l) ? 'monitoramento encerrado em ' : 'monitorado até ') + data(l.ate) : 'sem prazo' }}</small></div>
                  <button mat-icon-button [attr.aria-label]="'Tirar ' + l.nome" (click)="tirar(l)"><mat-icon>close</mat-icon></button>
                </li>
              }
            </ul>
          }
          <div class="botoes-locais">
            @if (!temAtual()) { <button mat-stroked-button (click)="incluir(atual())"><mat-icon>add_location_alt</mat-icon> {{ rotulo(atual()) }}</button> }
            @for (f of favoritosFora(); track (f.id || '') + f.uf + f.nome) {
              <button mat-stroked-button (click)="incluir(f)"><mat-icon>{{ f.tipo === 'pino' ? 'push_pin' : 'star' }}</mat-icon> {{ rotulo(f) }}</button>
            }
          </div>

          <h3>Ocorrências que entram no alerta</h3>
          <div class="temas">
            @for (t of temas(); track t.id) {
              <mat-checkbox [checked]="p().temas.includes(t.id)" (change)="alternarTema(t.id, $event.checked)">{{ t.nome }}</mat-checkbox>
            }
          </div>

          <h3>Shopee nas notícias</h3>
          <mat-checkbox [checked]="p().shopee" (change)="mudar({ shopee: $event.checked })">Avisar quando sair notícia que cita a Shopee</mat-checkbox>
          @if (p().shopee) {
            <div class="sub">
              <mat-button-toggle-group [value]="p().shopeeEscopo" (change)="mudar({ shopeeEscopo: $event.value })" aria-label="Abrangência">
                <mat-button-toggle value="locais">Só dos estados dos meus locais</mat-button-toggle>
                <mat-button-toggle value="brasil">Brasil inteiro</mat-button-toggle>
              </mat-button-toggle-group>
              <mat-checkbox [checked]="p().shopeeSoSeguranca" (change)="mudar({ shopeeSoSeguranca: $event.checked })">Só notícias de segurança (roubo, furto, golpe, ação policial)</mat-checkbox>
            </div>
          }

          <h3>Clima</h3>
          <mat-checkbox [checked]="p().inmet" (change)="mudar({ inmet: $event.checked })">Avisos do INMET de perigo (laranja) e grande perigo (vermelho) nos meus locais</mat-checkbox>

          <h3>Frequência</h3>
          <mat-button-toggle-group [value]="p().frequencia" (change)="mudar({ frequencia: $event.value })" aria-label="Frequência">
            <mat-button-toggle value="imediato">Assim que sair (a cada 15 min)</mat-button-toggle>
            <mat-button-toggle value="diario">Resumo diário às {{ p().hora }}h</mat-button-toggle>
            <mat-button-toggle value="semanal">Resumo semanal (segunda às {{ p().hora }}h)</mat-button-toggle>
          </mat-button-toggle-group>
        </section>
        @if (mensagem()) { <p class="mensagem" [class.erro]="erro()">{{ mensagem() }}</p> }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (conta()) {
        <button mat-button (click)="testar()" [disabled]="ocupado() || !prontoParaTeste()"><mat-icon>send</mat-icon> Enviar e-mail de teste</button>
        <button mat-flat-button (click)="salvar()" [disabled]="ocupado()">Salvar</button>
      }
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .titulo { display: flex; align-items: center; gap: 8px; }
    .titulo mat-icon { color: #EE4D2D; }
    .conteudo { max-width: 620px; }
    .conta { margin: 0 0 12px; font-size: 13px; overflow-wrap: anywhere; }
    h3 { font: var(--mat-sys-title-small); margin: 18px 0 8px; }
    section.apagado { opacity: .5; pointer-events: none; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { display: inline-flex; align-items: center; gap: 2px; padding-left: 12px; border-radius: 999px; background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font-size: 13px; }
    .chip button { transform: scale(.75); }
    .dica { font-size: 13px; opacity: .7; }
    .pinos { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
    .pinos li { display: flex; align-items: center; gap: 8px; padding: 6px 4px 6px 10px; border-radius: 12px; background: var(--mat-sys-surface-container); }
    .pinos li > mat-icon { color: #113366; flex: none; }
    .pinos li > div { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 13px; }
    .pinos li small { font-size: 12px; opacity: .75; overflow-wrap: anywhere; }
    .pinos li .cidade { font-size: 12px; opacity: .75; }
    .pinos li.vencido { opacity: .6; }
    .botoes-locais { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .botoes-locais button { font-size: 12px; }
    .temas { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }
    .sub { display: flex; flex-direction: column; gap: 6px; margin: 6px 0 0 8px; }
    mat-button-toggle-group { flex-wrap: wrap; font-size: 13px; }
    .aviso { display: flex; gap: 12px; align-items: flex-start; padding: 12px; border-radius: 12px; background: var(--mat-sys-surface-container); }
    .aviso mat-icon { color: #EE4D2D; flex: none; }
    .aviso p { margin: 4px 0 0; font-size: 13px; }
    .mensagem { margin: 14px 0 0; font-size: 13px; color: #1b7f3b; }
    .mensagem.erro { color: var(--mat-sys-error); }
  `,
})
export class AlertasComponent {
  private readonly store = inject(PainelStore);
  private readonly favoritos = inject(Favoritos);
  protected readonly carregando = signal(true);
  protected readonly ocupado = signal(false);
  protected readonly conta = signal('');
  protected readonly remetente = signal('security.br@shopee.com');
  protected readonly temas = signal(TEMAS_PADRAO);
  protected readonly mensagem = signal('');
  protected readonly erro = signal(false);
  protected readonly p = signal<PrefsAlerta>({
    ativo: true, locais: [], temas: ['CVLI', 'CONFRONTO', 'CARGA'], shopee: true, shopeeEscopo: 'locais',
    shopeeSoSeguranca: true, inmet: true, frequencia: 'imediato', hora: 7,
  });

  protected readonly atual = computed<Favorito>(() => ({ uf: this.store.uf(), nome: this.store.escopo() === 'ESTADO' ? 'ESTADO_INTEIRO' : this.store.cidade() }));
  protected readonly temAtual = computed(() => this.p().locais.some((l) => igual(l, this.atual())));
  protected readonly favoritosFora = computed(() => this.favoritos.lista().filter((f) => !this.p().locais.some((l) => igual(l, f)) && !igual(f, this.atual())).slice(0, 8));
  protected readonly prontoParaTeste = computed(() => this.p().locais.length > 0 || this.p().shopee);

  constructor() {
    Servidor.alertas().then((r) => {
      this.conta.set(r?.conta || '');
      if (r?.remetente) this.remetente.set(r.remetente);
      if (r?.temas?.length) this.temas.set(r.temas);
      if (r?.prefs) this.p.set({ ...this.p(), ...r.prefs });
      else if (r?.conta) this.p.update((p) => ({ ...p, locais: [this.atual(), ...this.favoritos.lista().filter((f) => !igual(f, this.atual()))].slice(0, 5) }));
    }).catch((e) => { this.erro.set(true); this.mensagem.set('Não foi possível abrir os alertas: ' + (e?.message || e)); })
      .finally(() => this.carregando.set(false));
  }

  protected rotulo(l: Favorito): string {
    if (l.tipo === 'pino') return l.nome + ' (' + (l.cidade || l.uf) + ')';
    return l.nome === 'ESTADO_INTEIRO' ? 'Estado: ' + (ESTADOS[l.uf]?.nome || l.uf) : l.nome + ' (' + l.uf + ')';
  }
  protected readonly pinos = computed(() => this.p().locais.filter((l) => l.tipo === 'pino'));
  protected readonly agora = Date.now();
  protected vencido(l: Favorito): boolean { return !!l.ate && l.ate < this.agora; }
  protected data(ms?: number): string { return dataCurta(ms); }
  protected mudar(m: Partial<PrefsAlerta>): void { this.p.update((p) => ({ ...p, ...m })); this.mensagem.set(''); }
  protected incluir(l: Favorito): void { if (this.p().locais.length < 25) this.mudar({ locais: [...this.p().locais, l] }); }
  protected tirar(l: Favorito): void { this.mudar({ locais: this.p().locais.filter((x) => !igual(x, l)) }); }
  protected alternarTema(id: string, marcado: boolean): void {
    const t = this.p().temas.filter((x) => x !== id);
    this.mudar({ temas: marcado ? [...t, id] : t });
  }

  protected salvar(): void {
    this.ocupado.set(true);
    Servidor.salvarAlertas(this.p()).then((r) => {
      this.erro.set(!r?.ok);
      this.mensagem.set(r?.ok ? (this.p().ativo ? 'Alertas salvos. O próximo e-mail sai quando houver novidade.' : 'Alertas desligados.') : r?.erro || 'Não foi possível salvar.');
    }).catch((e) => { this.erro.set(true); this.mensagem.set('Não foi possível salvar: ' + (e?.message || e)); })
      .finally(() => this.ocupado.set(false));
  }

  protected testar(): void {
    this.ocupado.set(true);
    Servidor.testarAlertas(this.p()).then((r) => {
      this.erro.set(!r?.ok);
      this.mensagem.set(r?.ok ? `E-mail de teste enviado para ${r.para} com ${r.itens} ${r.itens === 1 ? 'notícia' : 'notícias'} dos últimos 7 dias.` + (r.via === 'reserva' ? ' O remetente security.br@shopee.com ainda não está liberado na conta do script; o teste saiu pela conta do script.' : '') : r?.erro || 'Não foi possível enviar.');
    }).catch((e) => { this.erro.set(true); this.mensagem.set('Não foi possível enviar: ' + (e?.message || e)); })
      .finally(() => this.ocupado.set(false));
  }
}
