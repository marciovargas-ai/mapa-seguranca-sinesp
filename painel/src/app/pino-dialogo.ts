import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PontoCep } from './core/cep';
import { dataCurta, Favoritos } from './core/favoritos';
import { PainelStore } from './core/painel.store';

/**
 * "Salvar e monitorar" no balão do pino: a pessoa dá um nome ao pino (ex.: "Imóvel Rua X"), que vai para os favoritos
 * com quem criou e a data, e pode ligar o alerta por e-mail das ocorrências num raio de 1 km por alguns dias.
 * Pensado para o time de expansão acompanhar imóveis novos.
 */
@Component({
  selector: 'app-pino-dialogo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonToggleModule],
  template: `
    <h2 mat-dialog-title class="titulo"><mat-icon>push_pin</mat-icon> Salvar e monitorar o pino</h2>
    <mat-dialog-content class="conteudo">
      <p class="local">{{ endereco }}</p>
      <mat-form-field appearance="outline" class="nome" subscriptSizing="dynamic">
        <mat-label>Nome do pino</mat-label>
        <input matInput [value]="nome()" (input)="nome.set($any($event.target).value)" maxlength="60" placeholder="Ex.: Imóvel Av. Brasil" cdkFocusInitial />
      </mat-form-field>
      <p class="autor"><mat-icon>person</mat-icon>
        @if (fav.conta()) { <span>{{ 'Adicionado por ' + fav.conta() + ' em ' + hoje }}</span> }
        @else { <span>{{ 'Salvo só neste navegador em ' + hoje + ' (sem conta @shopee.com identificada)' }}</span> }
      </p>

      <mat-checkbox [checked]="alertar()" [disabled]="!fav.conta()" (change)="alertar.set($event.checked)">
        Receber alerta por e-mail das ocorrências num raio de 1 km
      </mat-checkbox>
      @if (alertar() && fav.conta()) {
        <div class="prazo">
          <span>Monitorar por</span>
          <mat-button-toggle-group [value]="prazo()" (change)="prazo.set($event.value)" aria-label="Prazo do monitoramento">
            <mat-button-toggle [value]="7">7 dias</mat-button-toggle>
            <mat-button-toggle [value]="15">15 dias</mat-button-toggle>
            <mat-button-toggle [value]="30">30 dias</mat-button-toggle>
            <mat-button-toggle [value]="0">Sem prazo</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        <small class="dica">Os e-mails seguem os temas e a frequência de "Meus alertas". Depois do prazo, o pino continua nos favoritos, sem alerta.</small>
      }
      @if (mensagem()) { <p class="mensagem" [class.erro]="erro()">{{ mensagem() }}</p> }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="salvar()" [disabled]="ocupado() || !nome().trim()"><mat-icon>star</mat-icon> Salvar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .titulo { display: flex; align-items: center; gap: 8px; }
    .titulo mat-icon { color: #113366; }
    .conteudo { max-width: 460px; display: flex; flex-direction: column; gap: 10px; }
    .local { margin: 0; font-size: 13px; color: var(--mat-sys-on-surface-variant); }
    .nome { width: 100%; }
    .autor { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 12px; color: var(--mat-sys-on-surface-variant); overflow-wrap: anywhere; }
    .autor mat-icon { font-size: 18px; width: 18px; height: 18px; flex: none; }
    .prazo { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; margin-left: 8px; }
    mat-button-toggle-group { flex-wrap: wrap; font-size: 13px; }
    .dica { font-size: 12px; opacity: .75; margin-left: 8px; }
    .mensagem { margin: 4px 0 0; font-size: 13px; color: #1b7f3b; }
    .mensagem.erro { color: var(--mat-sys-error); }
  `,
})
export class PinoDialogoComponent {
  protected readonly fav = inject(Favoritos);
  private readonly store = inject(PainelStore);
  private readonly ref = inject(MatDialogRef<PinoDialogoComponent>);
  private readonly p = inject<PontoCep>(MAT_DIALOG_DATA);
  protected readonly hoje = dataCurta(Date.now());
  protected readonly endereco = [this.p.logradouro, this.p.bairro, this.p.cidade + '/' + this.p.uf].filter(Boolean).join(' · ');
  protected readonly nome = signal(this.p.nomePino || ('Pino ' + (this.p.logradouro || this.p.bairro || this.p.cidade)).slice(0, 60));
  protected readonly alertar = signal(true);
  protected readonly prazo = signal(30);
  protected readonly ocupado = signal(false);
  protected readonly mensagem = signal('');
  protected readonly erro = signal(false);

  protected async salvar(): Promise<void> {
    this.ocupado.set(true);
    this.mensagem.set('');
    try {
      const r = await this.fav.adicionarPino({
        tipo: 'pino', id: this.p.pinoId, nome: this.nome().trim(), uf: this.p.uf, cidade: this.p.cidade,
        endereco: [this.p.logradouro, this.p.bairro].filter(Boolean).join(' · '), lat: this.p.lat, lng: this.p.lng, raio: 1, em: this.p.criadoEm,
      }, this.alertar() && !!this.fav.conta(), this.prazo());
      if (!r.ok) { this.erro.set(true); this.mensagem.set(r.erro || 'Não foi possível salvar.'); return; }
      // O pino no mapa passa a mostrar o nome dado pela pessoa
      const atual = this.store.pontoCep();
      if (atual && atual.lat === this.p.lat && atual.lng === this.p.lng) {
        this.store.pontoCep.set({ ...atual, pinoId: r.pino.id, nomePino: r.pino.nome, por: r.pino.por, criadoEm: r.pino.em });
      }
      this.ref.close(r);
    } catch (e: any) {
      this.erro.set(true);
      this.mensagem.set('Não foi possível salvar: ' + (e?.message || e));
    } finally { this.ocupado.set(false); }
  }
}
