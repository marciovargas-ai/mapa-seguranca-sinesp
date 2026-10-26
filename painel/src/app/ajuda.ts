import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CFG } from './core/dados';
import { gravarLocal } from './core/util';

@Component({
  selector: 'app-ajuda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatCheckboxModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Como ler o painel</h2>
    <mat-dialog-content>
      <h4>Indicadores oficiais (prioridade)</h4>
      <p>Os números do topo e as abas <b>Dados oficiais</b> e <b>Estado</b> vêm do <b>Sinesp</b> (Ministério da Justiça), de {{ anos }}: cada ano lado a lado, o ano corrente comparado ao mesmo período do ano anterior e a taxa por 100 mil habitantes (população do IBGE). Um robô confere todo dia se o Ministério publicou mês novo, e a janela de anos avança sozinha na virada do ano.</p>
      <h4>Órgãos de segurança</h4>
      <p>O Sinesp reúne o que as polícias Civil e Militar lançam pelas secretarias estaduais (SSP) e separa os registros da <b>PRF</b> e da <b>PF</b>. Guarda Municipal e COPOM/190 não têm estatística aberta nacional; aparecem só pelas notícias.</p>
      <h4>Panorama do estado</h4>
      <p>Na aba <b>Estado</b>, os municípios aparecem em rankings (mais registros, maior taxa, maiores altas e quedas) e o mapa colore cada município pela taxa. Clique num município para abri-lo.</p>
      <h4>Insights</h4>
      <p>Comparações automáticas: variação no ano, posição no estado, taxa acima ou abaixo da média estadual, mês fora do padrão, zonas críticas e fontes mais citadas.</p>
      <h4>Notícias (complemento)</h4>
      <p>As ocorrências noticiadas vêm do Google Notícias e da imprensa local de cada estado, dos últimos 12 meses. Cada uma é marcada com os órgãos citados (PM, COPOM/190, Polícia Civil, PRF, Guarda Municipal, SSP, PF). Clique num órgão para filtrar o painel.</p>
      <h4>Zonas vermelhas</h4>
      <p>São os pontos da cidade onde as ocorrências se concentram: grade de {{ celula }} m, peso maior para crimes graves e fatos recentes, mínimo de {{ minimo }} registros por zona.</p>
      <p class="nota">Notícias não equivalem ao total de boletins de ocorrência: servem para localizar e acompanhar tendências. A medida oficial é a do Sinesp.</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <mat-checkbox [(ngModel)]="naoMostrar">Não mostrar de novo</mat-checkbox>
      <span style="flex:1"></span>
      <button mat-flat-button (click)="fechar()">Entendi</button>
    </mat-dialog-actions>
  `,
  styles: `h4 { margin: 14px 0 4px; font: var(--mat-sys-title-small); } p { margin: 0 0 6px; }`,
})
export class AjudaComponent {
  private readonly ref = inject(MatDialogRef<AjudaComponent>);
  protected readonly anos: string = inject(MAT_DIALOG_DATA, { optional: true })?.anos || 'três anos';
  protected readonly celula = CFG.ZONA_CELULA_METROS;
  protected readonly minimo = CFG.ZONA_MIN_OCORRENCIAS;
  protected naoMostrar = true;
  fechar(): void {
    if (this.naoMostrar) gravarLocal(CFG.CHAVE_AJUDA_VISTA, '1');
    this.ref.close();
  }
}
