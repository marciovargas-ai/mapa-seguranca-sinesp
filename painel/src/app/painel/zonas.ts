import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CATEGORIA_POR_ID, CFG, COR_NIVEL, NOME_NIVEL } from '../core/dados';
import { Zona } from '../core/modelos';
import { PainelStore } from '../core/painel.store';
import { fmt, rotuloPeriodo } from '../core/util';

/** Zonas vermelhas: as áreas mais violentas dentro da cidade. */
@Component({
  selector: 'app-zonas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @let f = store.filtrados();
    <p class="nota"><span class="material-symbols-outlined">info</span> Áreas com maior concentração de ocorrências nos últimos {{ periodo() }}, ponderadas pela gravidade e pela data. Índice 100 = zona mais intensa do local.</p>
    @for (z of f.zonas; track z.rank) {
      <button type="button" class="cartao zona" (click)="store.focar(z.lat, z.lng, 16, z.raio)">
        <div class="topo">
          <span class="numero" [style.background]="cor(z)">{{ z.rank }}</span>
          <div class="nome"><b>{{ z.nome }}</b>@if (store.escopo() === 'ESTADO') { <small>{{ z.cidade }}</small> }</div>
          <span class="nivel" [style.color]="cor(z)" [style.border-color]="cor(z)">{{ nomeNivel(z) }}</span>
        </div>
        <div class="barra"><span [style.width.%]="z.indice" [style.background]="cor(z)"></span></div>
        <div class="meta">
          <span><b>{{ fmt(z.qtd) }}</b> ocorrências</span>
          @if (z.graves) { <span class="perigo"><b>{{ fmt(z.graves) }}</b> homicídio/tiroteio</span> }
          <span>Índice {{ z.indice }}</span>
          <span>30 dias: {{ z.recentes > z.anteriores30 ? '↑ em alta' : z.recentes < z.anteriores30 ? '↓ em queda' : 'estável' }}</span>
        </div>
        <div class="meta">
          @for (c of z.cats.slice(0, 3); track c.id) { <span class="tag" [style.color]="corCat(c.id)">{{ curtoCat(c.id) }} {{ c.qtd }}</span> }
          <span class="ver">Ver no mapa <span class="material-symbols-outlined">arrow_forward</span></span>
        </div>
      </button>
    } @empty {
      <div class="vazio">
        <mat-icon>verified_user</mat-icon>
        {{ f.precisas.length < minimo ? 'Poucas ocorrências com local preciso no período (' + f.precisas.length + '). Amplie o período para 6 ou 12 meses.'
          : 'As ocorrências estão dispersas: nenhuma área concentra registros suficientes.' }}
      </div>
    }
  `,
  styles: `
    :host { display: grid; gap: 10px; }
    .nota { display: flex; gap: 6px; align-items: flex-start; margin: 0; }
    .nota .material-symbols-outlined { font-size: 18px; }
    .zona { text-align: left; font: inherit; color: inherit; cursor: pointer; display: grid; gap: 8px; }
    .zona:hover { border-color: var(--mat-sys-outline); }
    .topo { display: flex; align-items: center; gap: 10px; }
    .numero { width: 28px; height: 28px; border-radius: 50%; color: #fff; display: grid; place-items: center; font-weight: 700; flex: none; }
    .nome { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .nome small { color: var(--mat-sys-on-surface-variant); }
    .nivel { font: var(--mat-sys-label-medium); border: 1px solid; border-radius: 999px; padding: 1px 8px; }
    .barra { height: 6px; background: var(--mat-sys-surface-container-high); border-radius: 3px; overflow: hidden; }
    .barra span { display: block; height: 100%; }
    .meta { display: flex; flex-wrap: wrap; gap: 6px 14px; font: var(--mat-sys-body-small); align-items: center; }
    .perigo { color: var(--cor-perigo); }
    .ver { margin-left: auto; color: var(--mat-sys-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 2px; }
    .ver .material-symbols-outlined { font-size: 16px; }
  `,
})
export class ZonasComponent {
  protected readonly store = inject(PainelStore);
  protected readonly fmt = fmt;
  protected readonly minimo = CFG.ZONA_MIN_OCORRENCIAS;
  protected readonly periodo = () => rotuloPeriodo(this.store.periodoDias());
  protected readonly cor = (z: Zona) => COR_NIVEL[z.nivel];
  protected readonly nomeNivel = (z: Zona) => NOME_NIVEL[z.nivel];
  protected readonly corCat = (id: string) => CATEGORIA_POR_ID[id].cor;
  protected readonly curtoCat = (id: string) => CATEGORIA_POR_ID[id].curto;
}
