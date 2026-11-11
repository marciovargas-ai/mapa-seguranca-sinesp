/**
 * ============================================================================
 * ARQUIVO 4: 4_Utils_Gatilhos.gs (v3 — Armazenamento, Cache e Robô)
 * Responsabilidade:
 *  1. Armazenamento em arquivos JSON numa pasta do Google Drive (a planilha não
 *     recebe mais linhas de dados).
 *  2. Cache em camadas: memória da execução → CacheService (compactado e
 *     dividido em partes) → arquivo no Drive.
 *  3. Robô automático (gatilho de hora em hora) e utilitários de texto.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. ARMAZENAMENTO NO DRIVE
// ----------------------------------------------------------------------------
let pastaDadosCache_ = null;
const memoriaArquivos_ = {};

/**
 * Pasta "Mapa da Segurança — Dados" no Drive do dono do script. É criada na
 * primeira execução e o ID fica guardado nas propriedades do script.
 */
function obterPastaDados_() {
  if (pastaDadosCache_) return pastaDadosCache_;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PASTA_DADOS_ID');
  if (id) {
    try {
      const pasta = DriveApp.getFolderById(id);
      if (!pasta.isTrashed()) { pastaDadosCache_ = pasta; return pasta; }
    } catch (e) {}
  }
  const pasta = DriveApp.createFolder(CONFIG.NOME_PASTA_DADOS);
  props.setProperty('PASTA_DADOS_ID', pasta.getId());
  pastaDadosCache_ = pasta;
  return pasta;
}

function localizarArquivo_(nome) {
  const chaveId = 'FID3|' + nome;
  const cache = CacheService.getScriptCache();
  const idEmCache = cache.get(chaveId);
  if (idEmCache) {
    try { return DriveApp.getFileById(idEmCache); } catch (e) { cache.remove(chaveId); }
  }
  const it = obterPastaDados_().getFilesByName(nome);
  if (!it.hasNext()) return null;
  const arquivo = it.next();
  cache.put(chaveId, arquivo.getId(), 21600);
  return arquivo;
}

/**
 * Lê um JSON guardado (memória → cache → Drive). Devolve null se não existir.
 */
function lerJson_(nome) {
  if (memoriaArquivos_[nome] !== undefined) return memoriaArquivos_[nome];
  const chave = 'ARQ3|' + nome;
  let valor = cacheLerGrande_(chave);
  if (valor === null) {
    const arquivo = localizarArquivo_(nome);
    if (arquivo) {
      try { valor = JSON.parse(arquivo.getBlob().getDataAsString('UTF-8')); } catch (e) { valor = null; }
      if (valor !== null) cacheGravarGrande_(chave, valor, CONFIG.SEGUNDOS_CACHE_ARQUIVOS);
    }
  }
  memoriaArquivos_[nome] = valor;
  return valor;
}

/**
 * Grava um JSON (Drive + cache). Use dentro de uma trava quando o arquivo
 * puder ser alterado ao mesmo tempo pelo painel e pelo robô.
 */
function gravarJson_(nome, valor) {
  const conteudo = JSON.stringify(valor);
  const arquivo = localizarArquivo_(nome);
  if (arquivo) {
    arquivo.setContent(conteudo);
  } else {
    const novo = obterPastaDados_().createFile(nome, conteudo, MimeType.PLAIN_TEXT);
    CacheService.getScriptCache().put('FID3|' + nome, novo.getId(), 21600);
  }
  memoriaArquivos_[nome] = valor;
  cacheGravarGrande_('ARQ3|' + nome, valor, CONFIG.SEGUNDOS_CACHE_ARQUIVOS);
}

/**
 * Lê, altera e grava um arquivo sob trava, sempre a partir da versão mais nova
 * (evita que duas execuções simultâneas apaguem o trabalho uma da outra).
 */
function atualizarJsonComTrava_(nome, alterar) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    delete memoriaArquivos_[nome];
    cacheRemoverGrande_('ARQ3|' + nome);
    const atual = lerJson_(nome);
    const novo = alterar(atual);
    if (novo !== undefined && novo !== null) gravarJson_(nome, novo);
    return novo;
  } finally {
    lock.releaseLock();
  }
}

function nomeArquivoCidade_(ibge) { return 'cidade_' + ibge + '.json'; }
function nomeArquivoUf_(uf) { return 'uf_' + String(uf).toUpperCase() + '.json'; }
const NOME_ARQUIVO_INDICE_ = 'indice_cidades.json';

// ----------------------------------------------------------------------------
// 2. CACHE (CacheService): JSON compactado com gzip e dividido em partes de
//    ~90 KB, porque cada chave aceita no máximo 100 KB.
// ----------------------------------------------------------------------------
const TAMANHO_PARTE_CACHE_ = 90000;
const MAX_PARTES_CACHE_ = 20;

function compactarJson_(valor) {
  const blob = Utilities.gzip(Utilities.newBlob(JSON.stringify(valor), 'application/json'));
  return Utilities.base64Encode(blob.getBytes());
}

function descompactarJson_(texto) {
  const blob = Utilities.newBlob(Utilities.base64Decode(texto), 'application/x-gzip');
  return JSON.parse(Utilities.ungzip(blob).getDataAsString('UTF-8'));
}

function cacheLerGrande_(chave) {
  try {
    const cache = CacheService.getScriptCache();
    const cabecalho = cache.get(chave);
    if (!cabecalho) return null;
    const n = Number(cabecalho);
    if (!n) return null;
    const chaves = [];
    for (let i = 0; i < n; i++) chaves.push(chave + '#' + i);
    const partes = cache.getAll(chaves);
    let texto = '';
    for (let i = 0; i < n; i++) {
      const p = partes[chaves[i]];
      if (!p) return null;
      texto += p;
    }
    return descompactarJson_(texto);
  } catch (e) {
    return null;
  }
}

function cacheGravarGrande_(chave, valor, segundos) {
  try {
    const texto = compactarJson_(valor);
    const n = Math.ceil(texto.length / TAMANHO_PARTE_CACHE_);
    if (n > MAX_PARTES_CACHE_) return;
    const lote = {};
    for (let i = 0; i < n; i++) lote[chave + '#' + i] = texto.substr(i * TAMANHO_PARTE_CACHE_, TAMANHO_PARTE_CACHE_);
    lote[chave] = String(n);
    CacheService.getScriptCache().putAll(lote, Math.min(21600, segundos));
  } catch (e) {}
}

function cacheRemoverGrande_(chave) {
  try { CacheService.getScriptCache().remove(chave); } catch (e) {}
}

// Versões simples (valores pequenos)
function cacheLerJson_(chave) { return cacheLerGrande_(chave); }
function cacheGravarJson_(chave, valor, segundos) { cacheGravarGrande_(chave, valor, segundos); }

// ----------------------------------------------------------------------------
// 3. ROBÔ AUTOMÁTICO
// ----------------------------------------------------------------------------
const FUNCOES_GATILHO_ANTIGAS_ = ['executarVarreduraSegurancaSC', 'executarVarreduraNacional', 'roboAtualizacao'];

/**
 * Cria o gatilho do robô: de hora em hora ele atualiza as cidades que alguém
 * consultou nos últimos dias e cujos dados têm mais de 20 horas. Assim cada
 * cidade em uso é atualizada pelo menos uma vez por dia, sem estourar o limite
 * de 6 minutos por execução do Apps Script.
 */
function ativarGatilhoAutomatico() {
  desativarGatilhosAutomaticos();
  ScriptApp.newTrigger('roboAtualizacao').timeBased().everyHours(1).create();
  registrarStatus_('Robô automático', 'Ativo — de hora em hora (' + Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + ')');
  try {
    SpreadsheetApp.getUi().alert('Robô automático ativado',
      'A função roboAtualizacao vai rodar de hora em hora.\n\nEla atualiza as notícias das cidades consultadas no painel nos últimos ' +
      CONFIG.DIAS_MONITORAMENTO + ' dias (cada uma no máximo 1 vez por dia) e importa as estatísticas oficiais do Sinesp uma vez por mês.',
      SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}
}

function desativarGatilhosAutomaticos() {
  const nomes = new Set(FUNCOES_GATILHO_ANTIGAS_);
  ScriptApp.getProjectTriggers().forEach(t => {
    if (nomes.has(t.getHandlerFunction())) ScriptApp.deleteTrigger(t);
  });
  registrarStatus_('Robô automático', 'Desativado');
}

// Nomes antigos: se ainda existir um gatilho apontando para eles, continua funcionando
function executarVarreduraNacional() { roboAtualizacao(); }
function executarVarreduraSegurancaSC() { roboAtualizacao(); }

// ----------------------------------------------------------------------------
// 4. ABA STATUS (poucas linhas fixas, sobrescritas — nunca cresce)
// ----------------------------------------------------------------------------
function registrarStatus_(item, valor) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    let aba = ss.getSheetByName(CONFIG.ABA_STATUS);
    if (!aba) {
      aba = ss.insertSheet(CONFIG.ABA_STATUS, 0);
      aba.getRange(1, 1, 1, 2).setValues([['ITEM', 'SITUAÇÃO']]).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
      aba.setColumnWidth(1, 240);
      aba.setColumnWidth(2, 640);
      aba.setFrozenRows(1);
    }
    const n = Math.max(0, aba.getLastRow() - 1);
    const itens = n ? aba.getRange(2, 1, n, 1).getValues() : [];
    for (let i = 0; i < itens.length; i++) {
      if (itens[i][0] === item) { aba.getRange(i + 2, 2).setValue(valor); return; }
    }
    aba.getRange(n + 2, 1, 1, 2).setValues([[item, valor]]);
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// 5. UTILITÁRIOS DE TEXTO E GEOGRAFIA
// ----------------------------------------------------------------------------
function distanciaKm_(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatarTitleCase_(texto) {
  const conectivos = new Set(['de', 'da', 'do', 'dos', 'das', 'e']);
  return texto.split(/\s+/).map((palavra, idx) => {
    const pBaixa = palavra.toLowerCase();
    if (idx > 0 && conectivos.has(pBaixa)) return pBaixa;
    return pBaixa.charAt(0).toUpperCase() + pBaixa.slice(1);
  }).join(' ');
}

function limparHtml_(htmlStr) {
  if (!htmlStr) return '';
  return htmlStr.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, ' ').trim();
}

function normalizarTexto_(str) {
  if (!str) return '';
  return str.toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function escaparRegex_(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Verifica se o termo (já normalizado) aparece como palavra inteira no texto normalizado.
 */
function contemTermoInteiro_(textoNorm, termoNorm) {
  if (!termoNorm) return false;
  return new RegExp(`(^|\\s)${escaparRegex_(termoNorm)}(\\s|$)`).test(textoNorm);
}

function gerarHashMD5_(texto) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, texto, Utilities.Charset.UTF_8);
  return rawHash.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

const PALAVRAS_IGNORADAS_TITULO_ = new Set([
  'para', 'pela', 'pelo', 'com', 'sem', 'apos', 'durante', 'entre', 'sobre', 'contra', 'como',
  'mais', 'menos', 'muito', 'onde', 'quando', 'que', 'nesta', 'neste', 'essa', 'esse', 'isso',
  'diz', 'dizem', 'video', 'veja', 'foto', 'fotos'
]);

/**
 * Palavras significativas de um título (detecta a mesma ocorrência publicada por veículos diferentes).
 */
function assinaturaTitulo_(titulo) {
  const set = new Set();
  normalizarTexto_(titulo).split(' ').forEach(p => {
    if (p.length >= 4 && !PALAVRAS_IGNORADAS_TITULO_.has(p)) set.add(p);
  });
  return set;
}

function similaridadeJaccard_(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  a.forEach(x => { if (b.has(x)) inter++; });
  return inter / (a.size + b.size - inter);
}

/** "2026-10-25" → "25/10/2026" */
function dataIsoParaBr_(iso) {
  const p = String(iso || '').split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : '';
}

/** "2026-10-25" → 20261025 (ordenável) */
function dataIsoParaNumero_(iso) {
  return Number(String(iso || '').replace(/-/g, '')) || 0;
}
