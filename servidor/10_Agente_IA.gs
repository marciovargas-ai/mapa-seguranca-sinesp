/**
 * ============================================================================
 * ARQUIVO 10: 10_Agente_IA.gs — Agente de IA do painel e exportação das respostas
 * ============================================================================
 * O painel manda a pergunta e um resumo dos dados que está mostrando; o servidor
 * chama o Super Agent (insea.io) e devolve a resposta. A chave fica só aqui, nas
 * propriedades do script (INSEA_API_KEY), nunca no navegador.
 *
 * Configuração (uma vez): Configurações do projeto → Propriedades do script:
 *   INSEA_API_KEY   = chave da API do Super Agent
 *   INSEA_AGENTE_ID = 30297 (opcional; é o padrão)
 *
 * Exportar: cada resposta vira PDF ou planilha Google numa pasta do Drive
 * ("Mapa da Segurança - Exportações"), com link de leitura para quem tiver o link.
 * ============================================================================
 */

const AGENTE_IA_URL_ = 'https://ai.insea.io/api/superagents/';
const AGENTE_IA_PADRAO_ = '30297';
const AGENTE_IA_MAX_CONTEXTO_ = 30000;   // caracteres do resumo do painel enviados por pergunta
const AGENTE_IA_LIMITE_HORA_ = 300;      // perguntas por hora no portal inteiro (proteção de custo)
const NOME_PASTA_EXPORTACOES_ = 'Mapa da Segurança - Exportações';

const INSTRUCOES_AGENTE_ = [
  'Você é o assistente do Mapa da Segurança, um painel de dados de segurança pública do Brasil.',
  'Responda sempre em português do Brasil, de forma clara e objetiva.',
  'Use SOMENTE os dados do painel enviados abaixo. Se a resposta não estiver nos dados, diga isso com franqueza e sugira onde olhar no painel. Nunca invente números.',
  'Sempre diga de qual fonte vem cada número (Sinesp, DATASUS, SSP, ISP-RJ, Fogo Cruzado, notícias) e o período.',
  'Notícias são complemento: não trate contagem de notícias como estatística oficial.',
  'Quando houver vários números, organize em tabela Markdown. Seja breve: no máximo uns 15 itens ou linhas.'
].join('\n');

/** Diz ao painel se o agente está configurado (sem expor a chave). */
function statusAgenteIA() {
  return { configurado: !!PropertiesService.getScriptProperties().getProperty('INSEA_API_KEY') };
}

/**
 * pergunta: texto do usuário. contexto: JSON (texto) com o que o painel está mostrando.
 * conversaId: id da conversa anterior (mantém o histórico no Super Agent).
 * Devolve { ok, resposta, conversaId } ou { ok:false, erro, configurado }.
 */
function perguntarAgenteIA(pergunta, contexto, conversaId) {
  const props = PropertiesService.getScriptProperties();
  const chave = props.getProperty('INSEA_API_KEY');
  if (!chave) return { ok: false, configurado: false, erro: 'O agente ainda não foi configurado: falta gravar INSEA_API_KEY nas propriedades do script.' };
  const texto = String(pergunta || '').trim().slice(0, 2000);
  if (!texto) return { ok: false, configurado: true, erro: 'Escreva uma pergunta.' };

  // Limite global por hora (evita estourar o orçamento do Super Agent)
  const cache = CacheService.getScriptCache();
  const chaveHora = 'AGENTE_IA_HORA|' + Math.floor(Date.now() / 3600000);
  const usadas = Number(cache.get(chaveHora) || 0);
  if (usadas >= AGENTE_IA_LIMITE_HORA_) return { ok: false, configurado: true, erro: 'Muitas perguntas nesta hora. Tente de novo em alguns minutos.' };
  cache.put(chaveHora, String(usadas + 1), 3700);

  let ctx = String(contexto || '');
  if (ctx.length > AGENTE_IA_MAX_CONTEXTO_) ctx = ctx.slice(0, AGENTE_IA_MAX_CONTEXTO_) + '…(cortado)';
  const consulta = INSTRUCOES_AGENTE_ + '\n\nDADOS DO PAINEL (JSON, gerado agora pelo painel):\n' + ctx + '\n\nPERGUNTA DO USUÁRIO:\n' + texto;

  const corpo = { query: consulta };
  if (conversaId) corpo.conversation_id = String(conversaId);
  const id = props.getProperty('INSEA_AGENTE_ID') || AGENTE_IA_PADRAO_;
  let resp;
  try {
    resp = UrlFetchApp.fetch(AGENTE_IA_URL_ + encodeURIComponent(id) + '/run?stream=false', {
      method: 'post', contentType: 'application/json', payload: JSON.stringify(corpo),
      headers: { Authorization: 'Bearer ' + chave }, muteHttpExceptions: true
    });
  } catch (e) {
    return { ok: false, configurado: true, erro: 'Não foi possível falar com o agente agora (' + e.message + ').' };
  }
  const codigo = resp.getResponseCode();
  let json = null;
  try { json = JSON.parse(resp.getContentText()); } catch (e) {}
  // Conversa expirada: tenta de novo sem o id antigo
  if (codigo === 410 && conversaId) return perguntarAgenteIA(pergunta, contexto, '');
  if (codigo !== 200 || !json || (json.error && json.error.code)) {
    const cod = json && json.error && json.error.code || ('HTTP_' + codigo);
    return { ok: false, configurado: true, erro: mensagemErroAgente_(cod, codigo) };
  }
  const d = json.data || {};
  const resposta = String(d.answer || (d.outputs && (d.outputs.answer || d.outputs.text)) || '').trim();
  if (!resposta) return { ok: false, configurado: true, erro: 'O agente não devolveu resposta. Tente reformular a pergunta.' };
  return { ok: true, resposta: resposta, conversaId: String(d.conversation_id || json.conversation_id || conversaId || '') };
}

function mensagemErroAgente_(cod, http) {
  const m = {
    AUTH_REQUIRED: 'A chave do agente foi recusada. Confira INSEA_API_KEY nas propriedades do script.',
    RATE_LIMIT_EXCEEDED: 'O agente está recebendo perguntas demais. Tente de novo em instantes.',
    BUDGET_LIMIT_EXCEEDED: 'O orçamento mensal do agente acabou.',
    TOKEN_LIMIT_EXCEEDED: 'O limite mensal de uso do agente acabou.',
    SUPER_AGENT_NOT_FOUND: 'O agente não foi encontrado. Confira INSEA_AGENTE_ID.',
    SUPER_AGENT_PUBLISH_REQUIRED: 'O agente precisa ser publicado (com uma versão) no insea.io.'
  };
  return m[cod] || ('O agente respondeu com erro (' + cod + (http ? ', HTTP ' + http : '') + ').');
}

/**
 * Exporta uma resposta: formato 'pdf' ou 'sheets'.
 * Devolve { ok, url, nome } (link de leitura para quem tiver o link).
 */
function exportarRespostaIA(formato, titulo, local, pergunta, resposta) {
  const nomeBase = ('Mapa da Segurança - ' + String(titulo || 'Resposta do agente')).slice(0, 90) + ' - ' +
    Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd-MM-yyyy HH.mm');
  const pasta = obterPastaExportacoes_();
  let arquivo;
  if (formato === 'sheets') {
    const ss = SpreadsheetApp.create(nomeBase);
    preencherPlanilhaResposta_(ss, titulo, local, pergunta, resposta);
    arquivo = DriveApp.getFileById(ss.getId());
    arquivo.moveTo(pasta);
  } else {
    const html = htmlPdfResposta_(titulo, local, pergunta, resposta);
    const pdf = Utilities.newBlob(html, 'text/html', 'resposta.html').getAs('application/pdf').setName(nomeBase + '.pdf');
    arquivo = pasta.createFile(pdf);
  }
  try { arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { /* domínio pode bloquear */ }
  return { ok: true, url: arquivo.getUrl(), nome: arquivo.getName() };
}

function obterPastaExportacoes_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PASTA_EXPORTACOES_ID');
  if (id) { try { const p = DriveApp.getFolderById(id); if (!p.isTrashed()) return p; } catch (e) {} }
  const pasta = DriveApp.createFolder(NOME_PASTA_EXPORTACOES_);
  props.setProperty('PASTA_EXPORTACOES_ID', pasta.getId());
  return pasta;
}

/** Linhas da resposta: tabelas Markdown viram células; o resto, texto na coluna A. */
function linhasDaResposta_(resposta) {
  const linhas = [];
  String(resposta || '').split('\n').forEach(l => {
    const t = l.trim();
    if (/^\|?\s*:?-{2,}/.test(t) && /-\s*\|/.test(t)) return;           // separador de tabela
    if (t.indexOf('|') !== -1 && /^\|.*\|$/.test(t)) {
      linhas.push({ tabela: true, celulas: t.slice(1, -1).split('|').map(c => limparMarkdown_(c.trim())) });
    } else {
      linhas.push({ tabela: false, celulas: [limparMarkdown_(t.replace(/^#+\s*/, '').replace(/^[-*]\s+/, '• '))] });
    }
  });
  return linhas;
}

function limparMarkdown_(s) {
  return String(s || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)');
}

function preencherPlanilhaResposta_(ss, titulo, local, pergunta, resposta) {
  const aba = ss.getSheets()[0];
  aba.setName('Resposta');
  const cab = [['Mapa da Segurança'], [String(titulo || '')], ['Local: ' + String(local || '')],
    ['Gerado em ' + Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm')], ['Pergunta: ' + String(pergunta || '')], ['']];
  aba.getRange(1, 1, cab.length, 1).setValues(cab);
  aba.getRange(1, 1).setFontSize(14).setFontWeight('bold').setFontColor('#EE4D2D');
  aba.getRange(2, 1).setFontWeight('bold');
  const linhas = linhasDaResposta_(resposta);
  const largura = Math.max(1, ...linhas.map(l => l.celulas.length));
  let r = cab.length + 1, primeiraDaTabela = true;
  linhas.forEach(l => {
    const vals = l.celulas.concat(Array(largura - l.celulas.length).fill(''));
    // Números com formato brasileiro viram número na planilha
    const conv = vals.map(v => (/^-?[\d.]+(,\d+)?%?$/.test(v) && !/%$/.test(v) ? Number(v.replace(/\./g, '').replace(',', '.')) : v));
    aba.getRange(r, 1, 1, largura).setValues([conv]);
    if (l.tabela && primeiraDaTabela) aba.getRange(r, 1, 1, largura).setFontWeight('bold').setBackground('#FDE7E2');
    primeiraDaTabela = !l.tabela;
    r++;
  });
  aba.setColumnWidth(1, 320);
  for (let c = 2; c <= largura; c++) aba.setColumnWidth(c, 160);
  aba.getRange(r + 1, 1).setValue('Fonte: Mapa da Segurança (dados do Sinesp, DATASUS, IBGE, secretarias estaduais, Fogo Cruzado e notícias), resposta gerada por IA.').setFontColor('#666666');
}

function escHtml_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Markdown simples (títulos, negrito, listas, tabelas) → HTML. */
function markdownParaHtml_(md) {
  const saida = [];
  let lista = false, tabela = false, cabecalho = true;
  const inline = s => escHtml_(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/`(.+?)`/g, '<code>$1</code>');
  const fechar = () => { if (lista) { saida.push('</ul>'); lista = false; } if (tabela) { saida.push('</table>'); tabela = false; } };
  String(md || '').split('\n').forEach(l => {
    const t = l.trim();
    if (/^\|.*\|$/.test(t)) {
      if (/^\|?\s*:?-{2,}/.test(t)) return;
      if (!tabela) { fechar(); saida.push('<table>'); tabela = true; cabecalho = true; }
      const tag = cabecalho ? 'th' : 'td';
      saida.push('<tr>' + t.slice(1, -1).split('|').map(c => '<' + tag + '>' + inline(c.trim()) + '</' + tag + '>').join('') + '</tr>');
      cabecalho = false;
      return;
    }
    if (/^[-*]\s+/.test(t)) { if (!lista) { fechar(); saida.push('<ul>'); lista = true; } saida.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>'); return; }
    fechar();
    const h = t.match(/^(#{1,4})\s+(.*)$/);
    if (h) saida.push('<h' + (h[1].length + 1) + '>' + inline(h[2]) + '</h' + (h[1].length + 1) + '>');
    else if (t) saida.push('<p>' + inline(t) + '</p>');
  });
  fechar();
  return saida.join('\n');
}

function htmlPdfResposta_(titulo, local, pergunta, resposta) {
  return '<html><head><meta charset="utf-8"><style>' +
    'body{font-family:Arial,sans-serif;color:#1f2937;font-size:11pt;margin:28px}' +
    '.topo{border-bottom:3px solid #EE4D2D;padding-bottom:8px;margin-bottom:14px}' +
    '.marca{color:#EE4D2D;font-weight:bold;font-size:16pt}.sub{color:#113366;font-size:12pt;margin-top:4px}' +
    '.meta{color:#6b7280;font-size:9pt}.pergunta{background:#FDE7E2;border-radius:8px;padding:8px 10px;margin:10px 0}' +
    'table{border-collapse:collapse;width:100%;margin:8px 0}th{background:#113366;color:#fff;text-align:left}' +
    'th,td{border:1px solid #d1d5db;padding:5px 7px;font-size:10pt}h2,h3,h4{color:#113366}' +
    '.rodape{margin-top:18px;color:#6b7280;font-size:8pt;border-top:1px solid #e5e7eb;padding-top:6px}' +
    '</style></head><body>' +
    '<div class="topo"><div class="marca">Mapa da Segurança</div><div class="sub">' + escHtml_(titulo) + '</div>' +
    '<div class="meta">' + escHtml_(local) + ' · gerado em ' + Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + '</div></div>' +
    (pergunta ? '<div class="pergunta"><b>Pergunta:</b> ' + escHtml_(pergunta) + '</div>' : '') +
    markdownParaHtml_(resposta) +
    '<div class="rodape">Fonte: Mapa da Segurança (Sinesp, DATASUS, IBGE, secretarias estaduais, Fogo Cruzado e notícias). Resposta gerada por IA a partir dos dados do painel; confira os números no painel.</div>' +
    '</body></html>';
}
