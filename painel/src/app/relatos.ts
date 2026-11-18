import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { PainelStore, Relato } from './core/painel.store';
import { Servidor } from './core/servidor';
import { normalizar } from './core/util';

const hoje = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/** Relatos das equipes Shopee: registrar uma ocorrência vivida pela operação e ver as do local. */
@Component({
  selector: 'app-relatos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule],
  template: `
    <h2 mat-dialog-title class="titulo"><mat-icon>campaign</mat-icon> Relatos das equipes Shopee</h2>
    <mat-dialog-content class="conteudo">
      @let r = store.relatos();
      @if (!r || (r.carregando && !r.conta)) { <mat-progress-bar mode="indeterminate" /> }
      @else if (!r.conta) {
        <div class="aviso"><mat-icon>lock</mat-icon><div><b>Os relatos precisam da sua conta @shopee.com.</b>
          <p>Peça para quem administra o Mapa da Segurança deixar a implantação como "Qualquer pessoa em shopee.com".</p></div></div>
      } @else {
        <p class="dica">Registre o que a operação viveu em <b>{{ store.nomeLocal() }}</b>. Só contas @shopee.com veem os relatos; os outros usuários veem "equipe Shopee", não o seu e-mail. Não escreva nomes de pessoas.</p>
        <div class="form">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="largo">
            <mat-label>O que aconteceu</mat-label>
            <mat-select [value]="tipo()" (selectionChange)="tipo.set($event.value)">
              @for (t of tipos(); track t[0]) { <mat-option [value]="t[0]">{{ t[1] }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Data</mat-label><input matInput type="date" [max]="maxData" [value]="data()" (input)="data.set($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Hora (opcional)</mat-label><input matInput type="time" [value]="hora()" (input)="hora.set($any($event.target).value)" />
          </mat-form-field>
          @if (unidades().length) {
            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="largo">
              <mat-label>Unidade envolvida (opcional)</mat-label>
              <mat-select [value]="unidade()" (selectionChange)="unidade.set($event.value)">
                <mat-option value="">Nenhuma / fora de unidade</mat-option>
                @for (u of unidades(); track u.codigo) { <mat-option [value]="u.codigo">{{ u.codigo }} · {{ u.nome }}</mat-option> }
              </mat-select>
            </mat-form-field>
          }
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="largo">
            <mat-label>Bairro ou referência (opcional)</mat-label><input matInput maxlength="80" [value]="bairro()" (input)="bairro.set($any($event.target).value)" />
          </mat-form-field>
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="largo">
            <mat-label>Descrição</mat-label>
            <textarea matInput rows="3" maxlength="600" [value]="descricao()" (input)="descricao.set($any($event.target).value)" placeholder="Ex.: motorista abordado por dois homens armados na saída do hub, levaram 12 volumes"></textarea>
          </mat-form-field>
        </div>
        @if (mensagem()) { <p class="mensagem" [class.erro]="erro()">{{ mensagem() }}</p> }

        <h3>Relatos de {{ store.nomeLocal() }} <small>(últimos 180 dias)</small></h3>
        @for (x of r.lista; track x.id) {
          <div class="relato">
            <div class="topo"><b>{{ r.tipos[x.tipo] || x.tipo }}</b><span class="grau" title="Fonte própria, geralmente confiável; sem confirmação externa (escala Admiralty)">B2</span>
              <small>{{ dataBr(x.data) }}{{ x.hora ? ' ' + x.hora : '' }}{{ store.escopo() === 'ESTADO' ? ' · ' + x.cidade : '' }}</small></div>
            <div>{{ x.descricao }}</div>
            <small>{{ [x.unidade && 'Unidade ' + x.unidade, x.bairro && 'Bairro ' + x.bairro, x.meu ? 'registrado por você' : 'equipe Shopee'].filter(ok).join(' · ') }}</small>
            @if (x.meu) { <button mat-button class="apagar" (click)="apagar(x)" [disabled]="ocupado()"><mat-icon>delete</mat-icon> Apagar</button> }
          </div>
        } @empty { <p class="dica">Nenhum relato neste local ainda.</p> }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (store.relatos()?.conta) { <button mat-flat-button (click)="salvar()" [disabled]="ocupado() || descricao().trim().length < 10">Registrar relato</button> }
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .titulo { display: flex; align-items: center; gap: 8px; }
    .titulo mat-icon { color: #EE4D2D; }
    .conteudo { max-width: 640px; }
    .dica { font-size: 13px; color: var(--mat-sys-on-surface-variant); margin: 0 0 12px; }
    .form { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .largo { grid-column: 1 / -1; }
    h3 { font: var(--mat-sys-title-small); margin: 18px 0 8px; }
    h3 small { font-weight: 400; color: var(--mat-sys-on-surface-variant); }
    .relato { display: grid; gap: 4px; padding: 10px 12px; border-radius: 10px; background: var(--mat-sys-surface-container); margin-bottom: 6px; font-size: 13px; position: relative; }
    .relato .topo { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .relato .topo small { margin-left: auto; }
    .relato small { color: var(--mat-sys-on-surface-variant); }
    .grau { font: 700 10px/1 Roboto, sans-serif; padding: 2px 5px; border: 1px solid var(--borda-suave); border-radius: 5px; cursor: help; }
    .apagar { justify-self: end; }
    .aviso { display: flex; gap: 12px; padding: 12px; border-radius: 12px; background: var(--mat-sys-surface-container); }
    .aviso mat-icon { color: #EE4D2D; flex: none; }
    .aviso p { margin: 4px 0 0; font-size: 13px; }
    .mensagem { font-size: 13px; color: #1b7f3b; margin: 10px 0 0; }
    .mensagem.erro { color: var(--mat-sys-error); }
    @media (max-width: 520px) { .form { grid-template-columns: 1fr; } }
  `,
})
export class RelatosComponent {
  protected readonly store = inject(PainelStore);
  protected readonly maxData = hoje();
  protected readonly tipo = signal('ASSALTO_MOTORISTA');
  protected readonly data = signal(hoje());
  protected readonly hora = signal('');
  protected readonly unidade = signal('');
  protected readonly bairro = signal('');
  protected readonly descricao = signal('');
  protected readonly ocupado = signal(false);
  protected readonly mensagem = signal('');
  protected readonly erro = signal(false);
  protected readonly ok = Boolean;

  protected readonly tipos = computed(() => Object.entries(this.store.relatos()?.tipos || {}));
  /** Unidades do local com endereço exato (o relato herda o ponto da unidade no mapa). */
  protected readonly unidades = computed(() => {
    const l = this.store.unidades()?.lista || [];
    const uf = this.store.uf(), cid = normalizar(this.store.cidade()), estado = this.store.escopo() === 'ESTADO';
    return l.filter((u) => u.uf === uf && (estado || normalizar(u.cidade) === cid)).slice(0, 200);
  });

  constructor() {
    this.store.carregarRelatos(true);
    this.store.carregarUnidades();
  }

  protected dataBr(d: string): string { return d.split('-').reverse().join('/'); }

  protected salvar(): void {
    const u = this.unidades().find((x) => x.codigo === this.unidade());
    const ponto = u && u.origem === 'planilha' ? { lat: u.lat, lng: u.lng } : {};
    this.ocupado.set(true);
    Servidor.salvarRelato({ uf: this.store.uf(), cidade: this.store.escopo() === 'ESTADO' ? (u?.cidade || '') : this.store.cidade(), tipo: this.tipo(), data: this.data(),
      hora: this.hora(), unidade: this.unidade(), bairro: this.bairro(), descricao: this.descricao(), ...ponto }).then((r) => {
      this.erro.set(!r?.ok);
      this.mensagem.set(r?.ok ? 'Relato registrado. Obrigado.' : r?.erro || 'Não foi possível registrar.');
      if (r?.ok) { this.descricao.set(''); this.bairro.set(''); this.hora.set(''); this.store.carregarRelatos(true); }
    }).catch((e) => { this.erro.set(true); this.mensagem.set('Não foi possível registrar: ' + (e?.message || e)); })
      .finally(() => this.ocupado.set(false));
  }

  protected apagar(x: Relato): void {
    this.ocupado.set(true);
    Servidor.apagarRelato(x.id).then((r) => {
      this.erro.set(!r?.ok); this.mensagem.set(r?.ok ? 'Relato apagado.' : r?.erro || 'Não foi possível apagar.');
      if (r?.ok) this.store.carregarRelatos(true);
    }).catch((e) => { this.erro.set(true); this.mensagem.set(String(e?.message || e)); }).finally(() => this.ocupado.set(false));
  }
}
