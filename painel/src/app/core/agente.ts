import { Injectable, inject, signal } from '@angular/core';
import { CATEGORIA_POR_ID } from './dados';
import { PainelStore } from './painel.store';
import { Servidor } from './servidor';
import { rotuloPeriodo } from './util';

export interface MensagemIA {
  id: number; papel: 'usuario' | 'ia'; texto: string;
  /** Pergunta que gerou a resposta e título para exportar. */
  pergunta?: string; titulo?: string; erro?: boolean;
  exportando?: 'pdf' | 'sheets' | null; links?: { pdf?: string; sheets?: string }; erroExportar?: string;
}

/** Conversa com o agente de IA do painel (Super Agent pelo servidor). */
@Injectable({ providedIn: 'root' })
export class AgenteIA {
  private readonly store = inject(PainelStore);
  readonly aberto = signal(false);
  readonly mensagens = signal<MensagemIA[]>([]);
  readonly pensando = signal(false);
  readonly configurado = signal<boolean | null>(null);
  private conversaId = '';
  private seq = 0;

  abrir(): void {
    this.aberto.set(true);
    if (this.configurado() === null) Servidor.agenteStatus().then((s) => this.configurado.set(!!s?.configurado), () => this.configurado.set(null));
  }
  fechar(): void { this.aberto.set(false); }
  limpar(): void { this.mensagens.set([]); this.conversaId = ''; }

  /** Pergunta livre sobre o painel. */
  perguntar(texto: string, titulo = 'Resposta do agente', exibir?: string): void {
    const t = texto.trim();
    if (!t || this.pensando()) return;
    this.abrir();
    this.mensagens.update((l) => [...l, { id: ++this.seq, papel: 'usuario', texto: exibir || t }]);
    this.pensando.set(true);
    Servidor.agente(t, this.contexto(), this.conversaId).then((r) => {
      if (r?.ok) {
        this.conversaId = r.conversaId || this.conversaId;
        this.mensagens.update((l) => [...l, { id: ++this.seq, papel: 'ia', texto: r.resposta || '', pergunta: exibir || t, titulo }]);
      } else {
        if (r && r.configurado === false) this.configurado.set(false);
        this.mensagens.update((l) => [...l, { id: ++this.seq, papel: 'ia', texto: r?.erro || 'O agente não respondeu.', erro: true }]);
      }
    }).catch((e) => {
      this.mensagens.update((l) => [...l, { id: ++this.seq, papel: 'ia', texto: 'Falha ao falar com o servidor: ' + (e?.message || e), erro: true }]);
    }).finally(() => this.pensando.set(false));
  }

  /** Resumo de um cartão: manda o texto que está na tela junto com a pergunta. */
  resumirCartao(titulo: string, conteudo: string): void {
    const texto = conteudo.replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim().slice(0, 5000);
    this.perguntar(`Faça um resumo curto e claro do cartão "${titulo}" do painel, explicando o que os números significam para quem mora na cidade. ` +
      `Conteúdo do cartão, como aparece na tela:\n"""${texto}"""`, 'Resumo: ' + titulo, `Resumir o cartão "${titulo}"`);
  }

  exportar(m: MensagemIA, formato: 'pdf' | 'sheets'): void {
    if (m.exportando) return;
    const atualizar = (mud: Partial<MensagemIA>) => this.mensagens.update((l) => l.map((x) => (x.id === m.id ? { ...x, ...mud } : x)));
    atualizar({ exportando: formato, erroExportar: '' });
    Servidor.exportar(formato, m.titulo || 'Resposta do agente', this.store.nomeLocal(), m.pergunta || '', m.texto).then((r) => {
      const links = { ...(m.links || {}), [formato]: r.url };
      atualizar({ exportando: null, links });
      window.open(r.url, '_blank', 'noopener');
    }).catch((e) => atualizar({ exportando: null, erroExportar: 'Não foi possível gerar o arquivo: ' + (e?.message || e) }));
  }

  /** Resumo compacto do que o painel mostra agora (vai para o agente como base da resposta). */
  contexto(): string {
    const s = this.store;
    const c = s.compilado();
    const f = s.filtrados();
    const d = s.dados();
    const oficial = s.oficial();
    const ctx: Record<string, unknown> = {
      local: s.nomeLocal(), escopo: s.escopo(), uf: s.uf(),
      periodo: 'últimos ' + rotuloPeriodo(s.periodoDias()),
      filtros: s.categorias().map((id) => CATEGORIA_POR_ID[id]?.nome || id),
      atualizado: d?.ultimaColeta || d?.atualizadoEm || '',
      parecer: c.parecer,
      indicadores: c.indicadores.map((i) => ({ titulo: i.titulo, valor: i.valor + (i.unidade ? ' ' + i.unidade : ''), detalhe: i.sub, fonte: i.fonte })),
    };
    if (c.risco) ctx['indice'] = { titulo: c.risco.titulo, valor: c.risco.valor, nivel: c.risco.nivel, partes: c.risco.componentes.map((k) => ({ nome: k.nome, peso: k.peso, nota: k.valor, detalhe: k.texto })), como: c.risco.metodo, confianca: c.risco.confianca?.texto };
    if (c.posicao) ctx['posicaoNoEstado'] = c.posicao;
    if (oficial?.disponivel && oficial.eventos) ctx['sinesp'] = { periodo: oficial.periodoTresAnos, anos: oficial.anos, eventos: oficial.eventos.slice(0, 14).map((e) => ({ nome: e.nome, porAno: e.porAno, taxa: e.taxa })) };
    ctx['zonasVermelhas'] = f.zonas.slice(0, 10).map((z) => ({ nome: z.nome, ocorrencias: z.qtd, graves: z.graves, indice: z.indice, nivel: z.nivel }));
    ctx['bairros'] = s.bairrosMapa().lista.filter((b) => b.qtd).sort((a, b) => b.qtd - a.qtd).slice(0, 15).map((b) => ({ nome: b.nome, noticias: b.qtd, graves: b.graves }));
    const ob = s.oficialBairros();
    if (ob) ctx['oficialPorBairro'] = { fonte: ob.dado.orgao, periodo: ob.dado.periodo, totais: ob.dado.cats,
      bairros: [...ob.porBairro.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 15).map(([n, v]) => ({ nome: n, total: v.total, porTipo: v.cats })) };
    const fogo = s.fogoCidade()?.dado;
    if (fogo?.itens?.length) ctx['fogoCruzado'] = { tiroteios12m: fogo.itens.length, mortos: fogo.itens.reduce((a, t) => a + t.mortos, 0),
      feridos: fogo.itens.reduce((a, t) => a + t.feridos, 0), disputasEntreGrupos: fogo.itens.filter((t) => t.gp).length, comAcaoPolicial: fogo.itens.filter((t) => t.policia).length };
    ctx['noticiasRecentes'] = f.todas.slice().sort((a, b) => b.ts - a.ts).slice(0, 30)
      .map((o) => ({ data: o.data, tipo: CATEGORIA_POR_ID[o.cat]?.nome || o.cat, bairro: o.bairro, titulo: o.titulo, veiculo: o.veiculo }));
    ctx['totalNoticiasNoPeriodo'] = f.todas.length;
    return JSON.stringify(ctx);
  }
}
