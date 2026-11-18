import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Favorito, Favoritos } from './core/favoritos';
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
      @for (f of fav.rotulos(); track f.uf + f.nome) {
        <div class="item">
          <button mat-menu-item (click)="abrir(f)"><mat-icon>{{ f.nome === 'ESTADO_INTEIRO' ? 'map' : 'location_city' }}</mat-icon>
            <span>{{ f.rotulo }} <small>{{ f.uf }}</small></span></button>
          <button mat-icon-button class="remover" [attr.aria-label]="'Remover ' + f.rotulo" (click)="$event.stopPropagation(); fav.remover(f)"><mat-icon>close</mat-icon></button>
        </div>
      } @empty {
        <p class="vazio">Nenhum favorito ainda. Use a estrela ao lado do nome do local para salvar.</p>
      }
    </mat-menu>
  `,
})
export class FavoritosComponent {
  protected readonly fav = inject(Favoritos);
  protected readonly store = inject(PainelStore);
  protected readonly atualFavorito = computed(() => this.fav.ehFavorito(this.store.uf(), this.nomeAtual()));

  private nomeAtual(): string { return this.store.escopo() === 'ESTADO' ? 'ESTADO_INTEIRO' : this.store.cidade(); }

  protected abrir(f: Favorito): void { this.store.abrirLocal(f.uf, f.nome); }

  protected alternarAtual(): void {
    this.fav.alternar(this.store.uf(), this.nomeAtual());
  }
}
