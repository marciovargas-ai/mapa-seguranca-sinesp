import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { dataCurta, Favorito, Favoritos } from './core/favoritos';
import { PainelStore } from './core/painel.store';

/** Botão da barra com a lista de favoritos (abre o local com um clique). */
@Component({
  selector: 'app-favoritos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <button mat-icon-button matTooltip="Favoritos" aria-label="Favoritos" [matMenuTriggerFor]="menu" class="botao-favoritos">
      <mat-icon>{{ fav.lista().length ? 'star' : 'star_outline' }}</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="menu-favoritos" xPosition="before">
      <div class="cab" (click)="$event.stopPropagation()">
        <b>Favoritos</b>
        <small>{{ fav.conta() ? 'Salvos na sua conta ' + fav.conta() : 'Salvos neste navegador' }}</small>
      </div>
      <button mat-menu-item (click)="alternarAtual()">
        <mat-icon>{{ atualFavorito() ? 'star' : 'star_outline' }}</mat-icon>
        <span>{{ atualFavorito() ? 'Remover ' : 'Salvar ' }}{{ store.nomeLocal() }}</span>
      </button>
      @for (f of fav.rotulos(); track (f.id || '') + f.uf + f.nome) {
        <div class="item" [class.pino]="f.tipo === 'pino'">
          @if (f.tipo === 'pino') {
            <button mat-menu-item (click)="abrir(f)" class="item-pino"><mat-icon class="icone-pino">push_pin</mat-icon>
              <span class="texto-pino"><span translate="no">{{ f.nome }}</span> <small>{{ f.cidade }}/{{ f.uf }}</small>
                <small class="autor">{{ f.por ? 'Por ' + f.por + ' em ' + data(f.em) : 'Salvo em ' + data(f.em) }}</small>
                @if (f.alerta) {
                  <small class="alerta" [class.vencido]="f.ate && f.ate < agora">
                    <mat-icon>{{ f.ate && f.ate < agora ? 'notifications_off' : 'notifications_active' }}</mat-icon>
                    {{ f.ate ? (f.ate < agora ? 'Alerta encerrado em ' : 'Alerta por e-mail até ') + data(f.ate) : 'Alerta por e-mail sem prazo' }}
                  </small>
                }
              </span></button>
          } @else {
            <button mat-menu-item (click)="abrir(f)"><mat-icon>{{ f.nome === 'ESTADO_INTEIRO' ? 'map' : 'location_city' }}</mat-icon>
              <span>{{ f.rotulo }} <small>{{ f.uf }}</small></span></button>
          }
          <button mat-icon-button class="remover" [attr.aria-label]="'Remover ' + f.rotulo" (click)="$event.stopPropagation(); fav.remover(f)"><mat-icon>close</mat-icon></button>
        </div>
      } @empty {
        <p class="vazio">Nenhum favorito ainda. Use a estrela ao lado do nome do local para salvar, ou "Salvar e monitorar" no balão de um pino.</p>
      }
    </mat-menu>
  `,
})
export class FavoritosComponent {
  protected readonly fav = inject(Favoritos);
  protected readonly store = inject(PainelStore);
  protected readonly atualFavorito = computed(() => this.fav.ehFavorito(this.store.uf(), this.nomeAtual()));

  private nomeAtual(): string { return this.store.escopo() === 'ESTADO' ? 'ESTADO_INTEIRO' : this.store.cidade(); }

  protected readonly agora = Date.now();
  protected data(ms?: number): string { return dataCurta(ms); }
  protected abrir(f: Favorito): void { if (f.tipo === 'pino') this.store.abrirPino(f); else this.store.abrirLocal(f.uf, f.nome); }

  protected alternarAtual(): void {
    this.fav.alternar(this.store.uf(), this.nomeAtual());
  }
}
