import { idioma } from './i18n';
import { Injectable, inject, signal } from '@angular/core';
import { CATEGORIA_POR_ID, ESTADOS } from './dados';
import { encurtarOficial } from './analise';
import { EventoOficial, Municipio } from './modelos';
import { todosMunicipios } from './municipios';
import { carregarPopulacao, enriquecerOficial } from './populacao';
import { oficialPelaCdn } from './sinesp-cdn';
import { normalizar } from './util';
import { PainelStore } from './painel.store';
import { MonitorShopee } from './shopee';
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
  private readonly shopee = inject(MonitorShopee);
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
    this.montarContexto(t).then((ctx) => Servidor.agente(t, ctx, this.conversaId, idioma())).then((r) => {
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

  /** Contexto da tela + dados oficiais dos outros locais citados na pergunta (comparações). */
  private async montarContexto(pergunta: string): Promise<string> {
    const base = JSON.parse(this.contexto());
    let comparacao: Record<string, unknown> | null = null;
    try {
      const locais = localesCitados(pergunta, this.store.uf(), this.store.escopo() === 'ESTADO' ? 'ESTADO_INTEIRO' : this.store.cidade());
      if (locais.length) {
        const dados = await Promise.race([
          Promise.all(locais.map((l) => resumoOficialLocal(l.uf, l.nome, this.store.referencia()))),
          new Promise<null>((r) => setTimeout(() => r(null), 12000)),
        ]);
        if (dados) comparacao = {
          explicacao: 'Dados oficiais do Sinesp (mesmos 12 meses e mesma regra do painel) dos outros locais citados na pergunta, para comparar com o local aberto. Compare pela taxa por 100 mil habitantes, não só pelo total.',
          localAberto: base['resumoOficial'] || null,
          locais: dados.filter(Boolean),
        };
      }
    } catch { /* sem comparação: responde com o que está na tela */ }
    // A comparação vai na frente e o texto é enxugado aqui, para o servidor nunca cortar o JSON no meio
    const ctx: Record<string, unknown> = comparacao ? { comparacao, ...base } : base;
    let json = JSON.stringify(ctx);
    for (const [campo, manter] of [['noticiasRecentes', 12], ['bairros', 8], ['oficialPorBairro', 0], ['sinesp', 0], ['noticiasRecentes', 0]] as const) {
      if (json.length <= LIMITE_CONTEXTO) break;
      const v = ctx[campo];
      if (Array.isArray(v) && manter) ctx[campo] = v.slice(0, manter); else delete ctx[campo];
      json = JSON.stringify(ctx);
    }
    return json;
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
    if (c.risco?.semNota) ctx['indice'] = { titulo: c.risco.titulo, semNota: true, motivo: c.risco.resumo.join(' '), como: c.risco.metodo };
    else if (c.risco) ctx['indice'] = { titulo: c.risco.titulo, valor: c.risco.valor, faixaProvavel: c.risco.faixa || undefined, nivel: c.risco.nivel, partes: c.risco.componentes.map((k) => ({ nome: k.nome, peso: k.peso, nota: k.valor, detalhe: k.texto })), como: c.risco.metodo, confianca: c.risco.confianca?.texto };
    if (c.posicao) ctx['posicaoNoEstado'] = c.posicao;
    if (oficial?.disponivel && oficial.eventos) ctx['resumoOficial'] = resumirOficial(s.nomeLocal(), oficial.eventos, oficial.periodo || '', oficial.populacao || null);
    const ref = s.referencia();
    if (ref) ctx['brasil'] = { periodo: ref.periodo, mortesViolentas12m: ref.brasil.cvli, populacao: ref.brasil.pop, taxaPor100mil: ref.brasil.taxa };
    if (c.serie) ctx['serieMensalMortesViolentas'] = c.serie.labels.map((l, i) => ({ mes: l, sinesp: c.serie!.mvi[i], noticias: c.serie!.noticias[i] }));
    if (c.municipios?.length) {
      const com = c.municipios.filter((m) => m.taxa != null && (m.pop || 0) >= 20000);
      ctx['rankingEstado'] = {
        regra: 'mortes violentas por 100 mil habitantes, 12 meses, municípios com 20 mil habitantes ou mais',
        maioresTaxas: com.slice().sort((a, b) => b.taxa! - a.taxa!).slice(0, 10).map((m) => ({ nome: m.nome, taxa: m.taxa, mortes: m.total, populacao: m.pop })),
        menoresTaxas: com.slice().sort((a, b) => a.taxa! - b.taxa!).slice(0, 5).map((m) => ({ nome: m.nome, taxa: m.taxa, mortes: m.total, populacao: m.pop })),
        maisMortes: c.municipios.slice().sort((a, b) => b.total - a.total).slice(0, 10).map((m) => ({ nome: m.nome, mortes: m.total, anterior: m.anterior, taxa: m.taxa })),
      };
    }
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
    const sh = this.shopee.paraContexto();
    if (sh) ctx['shopeeNasNoticias'] = sh;
    return JSON.stringify(ctx);
  }
}

/** Tamanho máximo do contexto enviado (o servidor aceita 60 mil caracteres; folga para as instruções). */
const LIMITE_CONTEXTO = 55000;

/** Mesma regra dos cartões: homicídio doloso + feminicídio + latrocínio + lesão seguida de morte (+ intervenção, quando publicada). */
const RE_MORTES = /^(homic[ií]dio doloso|feminic[ií]dio|latroc[ií]nio|roubo seguido de morte|les[aã]o corporal seguida de morte|morte por interven)/i;

function resumirOficial(nome: string, eventos: EventoOficial[], periodo: string, populacao: number | null) {
  const mortes = eventos.filter((e) => RE_MORTES.test(e.nome));
  const total = mortes.reduce((a, e) => a + e.total, 0);
  const anterior = mortes.every((e) => e.anterior == null) ? null : mortes.reduce((a, e) => a + (e.anterior || 0), 0);
  const taxa = populacao ? Math.round((total / populacao) * 1e6) / 10 : null;
  return {
    local: nome, periodo12meses: periodo, populacao,
    mortesViolentas: { total12m: total, anterior12m: anterior, variacaoPct: anterior ? Math.round(((total - anterior) / anterior) * 100) : null, taxaPor100mil: taxa,
      composicao: mortes.map((e) => e.nome + ': ' + e.total).join(', ') },
    eventos: eventos.slice(0, 16).map((e) => ({ nome: e.nome, total12m: e.total, anterior12m: e.anterior, porAno: e.porAno, taxaPor100mil: e.taxa })),
  };
}

const PALAVRAS_COMUNS = new Set(['central', 'serra', 'natal', 'vitoria', 'esperanca', 'formosa', 'paraiso', 'bonito', 'planalto', 'floresta',
  'alegria', 'uniao', 'liberdade', 'progresso', 'estrela', 'aurora', 'independencia', 'conquista', 'harmonia', 'saudade', 'sorriso',
  'cristal', 'jardim', 'pedras', 'campos', 'palmeira', 'barra', 'recreio', 'fartura', 'bandeirantes', 'humaita', 'oriente', 'princesa',
  'salto', 'tupi', 'nova', 'boa vista do sul', 'brasil', 'ipiranga', 'colorado', 'cruzeiro', 'agua boa', 'campo alegre']);

/** Municípios e estados citados no texto da pergunta (fora o local aberto), até 4. */
export function localesCitados(texto: string, ufAtual: string, nomeAtual: string): { uf: string; nome: string }[] {
  const t = ' ' + normalizar(texto) + ' ';
  const achados: { uf: string; nome: string }[] = [];
  const ufsCitadas = new Set<string>();
  for (const uf of Object.keys(ESTADOS)) {
    const n = normalizar(ESTADOS[uf].nome);
    if (t.indexOf(' ' + n + ' ') !== -1 || new RegExp('(^|[^A-Za-z])' + uf + '([^A-Za-z]|$)').test(texto)) ufsCitadas.add(uf);
    if (new RegExp(' estado d[eoa] ' + n + ' | estado ' + n + ' ').test(t)) achados.push({ uf, nome: 'ESTADO_INTEIRO' });
  }
  // Municípios: nomes mais longos primeiro, palavra inteira; homônimos: estado citado, depois o estado aberto
  const porNome = new Map<string, Municipio[]>();
  for (const m of todosMunicipios()) { if (m.norm.length >= 4) { const l = porNome.get(m.norm); if (l) l.push(m); else porNome.set(m.norm, [m]); } }
  // Palavras comuns que também são nome de cidade só contam logo depois de "com", "e", "x", "vs", "em", "de"
  // (ou quando a sigla/nome do estado dela também aparece: "Natal RN")
  const comum = (n: string) => PALAVRAS_COMUNS.has(n) && !new RegExp(' (com|e|x|vs|versus|em|de|entre|a|e a|com a) ' + n + ' ').test(t)
    && !(porNome.get(n) || []).some((m) => ufsCitadas.has(m.uf));
  const nomes = [...porNome.keys()].filter((n) => t.indexOf(' ' + n + ' ') !== -1 && !comum(n)).sort((a, b) => b.length - a.length);
  const usados: string[] = [];
  for (const n of nomes) {
    if (usados.some((u) => u.indexOf(n) !== -1)) continue; // "sao jose" dentro de "sao jose dos campos"
    if (achados.some((a) => a.nome === 'ESTADO_INTEIRO' && normalizar(ESTADOS[a.uf].nome) === n)) continue;
    const cand = porNome.get(n)!;
    const m = cand.find((c) => ufsCitadas.has(c.uf)) || cand.find((c) => c.uf === ufAtual)
      || cand.find((c) => normalizar(ESTADOS[c.uf]?.capital || '') === n) || cand[0];
    usados.push(n);
    achados.push({ uf: m.uf, nome: m.nome });
  }
  // Estado citado sem município (ex.: "compare com o Rio Grande do Sul")
  for (const uf of ufsCitadas) {
    const n = normalizar(ESTADOS[uf].nome);
    if (!achados.some((a) => a.uf === uf) && t.indexOf(' ' + n + ' ') !== -1 && !porNome.has(n)) achados.push({ uf, nome: 'ESTADO_INTEIRO' });
  }
  return achados.filter((a) => !(a.uf === ufAtual && normalizar(a.nome) === normalizar(nomeAtual))).slice(0, 4);
}

async function resumoOficialLocal(uf: string, nome: string, ref: any) {
  const ehEstado = nome === 'ESTADO_INTEIRO';
  const [bruto, pop] = await Promise.all([oficialPelaCdn(uf, ehEstado ? '' : nome, ehEstado), carregarPopulacao(uf)]);
  const rotulo = ehEstado ? 'Estado: ' + ESTADOS[uf].nome : nome + ' (' + uf + ')';
  if (!bruto?.disponivel) return { local: rotulo, semDados: bruto?.motivo || 'Sem dados do Sinesp para este local.' };
  const o = enriquecerOficial(encurtarOficial(bruto), uf, ehEstado ? '' : nome, ehEstado, pop, null)!;
  const mun = ehEstado ? null : todosMunicipios().find((m) => m.uf === uf && m.nome === nome);
  const linha = mun && ref?.municipios ? ref.municipios[mun.ibge] : null;
  // População: IBGE ao vivo; se não vier, a da referência nacional (mesma base do índice de risco)
  let populacao = o.populacao || (linha && linha[1] > 0 ? linha[1] : null);
  if (!populacao && ehEstado && ref?.municipios) {
    populacao = todosMunicipios().filter((m) => m.uf === uf).reduce((a, m) => a + (ref.municipios[m.ibge]?.[1] || 0), 0) || null;
  }
  if (populacao && !o.populacao) o.eventos = o.eventos.map((e) => ({ ...e, taxa: e.taxa ?? Math.round((e.total / populacao!) * 1e6) / 10 }));
  const r: any = resumirOficial(rotulo, o.eventos, o.periodo || '', populacao);
  if (linha) r.indiceDeRisco = { taxaMortesAjustada: linha[2], mortesSimNoAno: linha[4], tentativasPor100mil: linha[5], roubosPor100mil: linha[8] >= 0 ? linha[8] : null };
  return r;
}
