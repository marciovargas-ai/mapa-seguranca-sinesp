import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { carregarRoubos } from './core/areas';
import { PainelStore } from './core/painel.store';
import { manifestoSinesp } from './core/sinesp-cdn';

type Estado = 'ok' | 'atrasado' | 'falta' | 'fora';
interface LinhaFonte { nome: string; grau: string; uso: string; quando: string; estado: Estado; detalhe: string }

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const DIA = 86400000;

/** Lê datas no formato do robô e do servidor: ISO, dd/mm/aaaa, milissegundos. */
function paraMs(v: unknown): number | null {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return v;
  const s = String(v);
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\D+(\d{1,2})[:h](\d{2}))?/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)).getTime();
  m = s.match(/^(\d{2})\/(\d{2})(?:\D+(\d{1,2})[:h](\d{2}))?$/);
  if (m) { const a = new Date(); return new Date(a.getFullYear(), +m[2] - 1, +m[1], +(m[3] || 0), +(m[4] || 0)).getTime(); }
  return null;
}
const dataBr = (ms: number) => new Date(ms).toLocaleDateString('pt-BR');
function estadoPorIdade(ms: number | null, limiteDias: number): Estado {
  if (ms == null) return 'falta';
  return Date.now() - ms <= limiteDias * DIA ? 'ok' : 'atrasado';
}

/** "Saúde das fontes": quando cada base foi atualizada pela última vez e o grau de confiança de cada uma. */
@Component({
  selector: 'app-fontes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="titulo"><mat-icon>monitor_heart</mat-icon> Saúde das fontes</h2>
    <mat-dialog-content>
      <p class="intro">Até quando vale cada número do painel. Verde: atualizado no prazo. Amarelo: atrasado. Cinza: não se aplica a {{ store.nomeLocal() }}.</p>
      <div class="lista">
        @for (l of linhas(); track l.nome) {
          <div class="linha" [class]="l.estado">
            <span class="ponto" [attr.aria-label]="rotulo[l.estado]"></span>
            <div class="nome"><b>{{ l.nome }}</b> <span class="grau" [title]="'Grau de confiança da fonte (escala Admiralty)'">{{ l.grau }}</span><small>{{ l.uso }}</small></div>
            <div class="quando"><b>{{ l.quando }}</b><small>{{ l.detalhe }}</small></div>
          </div>
        }
      </div>
      <p class="rodape">Grau de confiança: a letra avalia a fonte (A oficial, B geralmente confiável, C razoavelmente confiável) e o número avalia a informação (1 confirmada, 2 provável, 3 possível). Nas notícias, o grau aparece em cada item e sobe para 1 quando o mesmo fato sai em mais de um veículo.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end"><button mat-button mat-dialog-close>Fechar</button></mat-dialog-actions>
  `,
  styles: `
    .titulo { display: flex; align-items: center; gap: 8px; }
    .titulo mat-icon { color: #EE4D2D; }
    .intro, .rodape { font-size: 13px; margin: 0 0 12px; color: var(--mat-sys-on-surface-variant); }
    .rodape { margin: 14px 0 0; }
    .lista { display: grid; gap: 6px; }
    .linha { display: grid; grid-template-columns: 14px 1fr auto; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; background: var(--mat-sys-surface-container); }
    .ponto { width: 10px; height: 10px; border-radius: 50%; background: #16a34a; }
    .atrasado .ponto { background: #ca8a04; }
    .falta .ponto { background: #dc2626; }
    .fora { opacity: .55; }
    .fora .ponto { background: #9ca3af; }
    .nome, .quando { display: grid; gap: 2px; font-size: 13px; }
    .quando { text-align: right; }
    small { color: var(--mat-sys-on-surface-variant); font-size: 12px; }
    .grau { display: inline-block; margin-left: 4px; font: 700 10px/1 Roboto, sans-serif; padding: 2px 5px; border: 1px solid var(--borda-suave); border-radius: 5px; }
    @media (max-width: 520px) { .linha { grid-template-columns: 14px 1fr; } .quando { grid-column: 2; text-align: left; } }
  `,
})
export class FontesComponent {
  protected readonly store = inject(PainelStore);
  protected readonly rotulo: Record<Estado, string> = { ok: 'atualizado', atrasado: 'atrasado', falta: 'sem resposta', fora: 'não se aplica' };
  private readonly manifesto = signal<{ atualizadoEm?: number; anos: Record<string, { publicadoAte: number }> } | null | undefined>(undefined);
  private readonly roubos = signal<any>(undefined);

  constructor() {
    manifestoSinesp().then((m) => this.manifesto.set(m as any), () => this.manifesto.set(null));
    carregarRoubos().then((r) => this.roubos.set(r), () => this.roubos.set(null));
  }

  protected readonly linhas = computed<LinhaFonte[]>(() => {
    const s = this.store, uf = s.uf();
    const l: LinhaFonte[] = [];
    const m = this.manifesto();
    const anos = m?.anos ? Object.keys(m.anos).map(Number).sort() : [];
    const ultimo = anos.length ? anos[anos.length - 1] : null;
    const imp = ultimo ? (m as any).atualizadoEm || (m!.anos[ultimo] as any).importadoEm : null;
    l.push({ nome: 'Sinesp (Ministério da Justiça)', grau: 'A', uso: 'Cartões do topo, aba Dados oficiais, índice',
      quando: m === undefined ? 'conferindo…' : imp ? 'conferido em ' + dataBr(imp) : 'sem resposta',
      detalhe: ultimo ? `dados até ${MESES[(m!.anos[ultimo].publicadoAte || 1) - 1]}/${ultimo} (o ministério publica com 1 a 2 meses de atraso)` : '',
      estado: m === undefined ? 'ok' : estadoPorIdade(imp, 3) });
    const ref = s.referencia();
    l.push({ nome: 'Referência nacional (5.570 municípios)', grau: 'A', uso: 'Índice de criminalidade e ranking', quando: ref ? ref.periodo : 'carregando…',
      detalhe: 'Sinesp + DATASUS, com população do IBGE', estado: ref ? 'ok' : 'falta' });
    l.push({ nome: 'DATASUS (atestados de óbito)', grau: 'A', uso: 'Índice (quando registra mais mortes que o Sinesp)', quando: ref?.sim ? String(ref.sim.ano) + (ref.sim.preliminar ? ' (preliminar)' : '') : '—',
      detalhe: 'O Ministério da Saúde fecha o ano com cerca de 1 ano de atraso', estado: ref?.sim ? 'ok' : 'falta' });
    const rb = this.roubos(), rbMs = paraMs(rb?.atualizado);
    l.push({ nome: 'Roubos por município (secretarias estaduais)', grau: 'A', uso: 'Parte de roubos do índice', quando: rb === undefined ? 'conferindo…' : rbMs ? 'atualizado em ' + dataBr(rbMs) : 'sem resposta',
      detalhe: rb?.estados ? 'Estados: ' + Object.keys(rb.estados).join(', ') : '', estado: rb === undefined ? 'ok' : estadoPorIdade(rbMs, 10) });
    const ob = s.oficialBairros()?.dado, obMs = paraMs(ob?.atualizado);
    l.push({ nome: 'SSP-SP por bairro (boletins de ocorrência)', grau: 'A', uso: 'Camada Dados oficiais por bairro', quando: uf !== 'SP' ? 'só São Paulo' : obMs ? 'atualizado em ' + dataBr(obMs) : 'sem dado para este município',
      detalhe: ob?.periodo || '', estado: uf !== 'SP' ? 'fora' : estadoPorIdade(obMs, 10) });
    const isp = s.ispCidade();
    l.push({ nome: 'ISP-RJ por delegacia', grau: 'A', uso: 'Mapa por área de delegacia (RJ)', quando: uf !== 'RJ' ? 'só Rio de Janeiro' : isp ? `${isp.periodo.de} a ${isp.periodo.ate}` : 'sem dado para este município',
      detalhe: isp?.fonte || '', estado: uf !== 'RJ' ? 'fora' : isp ? 'ok' : 'falta' });
    const fc = s.fogoCidade()?.dado, fcMs = paraMs(fc?.atualizadoEm);
    const temFc = ['RJ', 'PE', 'BA', 'PA'].includes(uf);
    l.push({ nome: 'Instituto Fogo Cruzado (tiroteios)', grau: 'B', uso: 'Pontos de tiroteio e zonas vermelhas', quando: !temFc ? 'só RJ, PE, BA e PA' : fc?.erro ? fc.erro : fcMs ? 'atualizado em ' + dataBr(fcMs) : fc ? `${fc.itens.length} tiroteios em 12 meses` : 'sem dado para este município',
      detalhe: '', estado: !temFc ? 'fora' : fc?.erro ? 'falta' : fc ? estadoPorIdade(fcMs ?? Date.now(), 2) : 'falta' });
    const d = s.dados(), dMs = paraMs(d?.ultimaColeta || d?.atualizadoEm);
    const inm = s.inmet();
    l.push({ nome: 'INMET (avisos meteorológicos)', grau: 'A', uso: 'Faixa de aviso no topo e alerta por e-mail', quando: inm ? (inm.avisos.length ? inm.avisos.length + (inm.avisos.length === 1 ? ' aviso em vigor' : ' avisos em vigor') : 'nenhum aviso para este local') : 'conferindo…',
      detalhe: 'RSS oficial, renovado a cada 30 minutos', estado: 'ok' });
    l.push({ nome: 'Notícias (Google Notícias, GDELT, g1 e imprensa local)', grau: 'B/C', uso: 'Mapa, zonas vermelhas e aba Notícias (complemento)', quando: d?.ultimaColeta ? 'última coleta ' + d.ultimaColeta : 'aguardando coleta',
      detalhe: `${s.filtrados().todas.length} ocorrências no período, já sem repetições`, estado: estadoPorIdade(dMs, 1) });
    return l;
  });
}
