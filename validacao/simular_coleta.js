/**
 * Simulador do servidor (Apps Script) para validar a coleta de notícias com dados reais.
 * Carrega os .gs de servidor/, troca os serviços do Google por equivalentes em Node
 * (rede real, Drive em memória, geocodificação desligada) e roda a primeira coleta
 * de uma amostra de municípios. Grava validacao/relatorio.json e relatorio.md.
 *
 * Uso: node validacao/simular_coleta.js "RS:Alvorada" "BA:Feira de Santana" ...
 *      (sem argumentos usa a amostra nacional de validacao/amostra.txt)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const arquivosMemoria = {};
const cacheMem = {};

// ---------- Serviços do Apps Script ----------
function resposta(r) {
  return { getResponseCode: () => r.code, getContentText: () => r.body, getHeaders: () => ({}), getBlob: () => ({ getDataAsString: () => r.body }) };
}
const estat = { pedidos: 0, porHost: {} };
function buscarLote(pedidos) {
  const lista = pedidos.map((p) => (typeof p === 'string' ? { url: p } : p));
  lista.forEach((p) => { estat.pedidos++; const h = (p.url.match(/^https?:\/\/([^/]+)/) || [])[1] || '?'; estat.porHost[h] = (estat.porHost[h] || 0) + 1; });
  const out = execFileSync('node', [path.join(__dirname, 'buscar.js')], { input: JSON.stringify(lista), maxBuffer: 1 << 30 });
  return JSON.parse(out.toString()).map(resposta);
}
const UrlFetchApp = {
  fetch: (url, op) => buscarLote([Object.assign({ url }, op || {})])[0],
  fetchAll: (lista) => buscarLote(lista),
};

function bytesAssinados(buf) { return Array.from(buf).map((b) => (b > 127 ? b - 256 : b)); }
function formatar(data, tz, padrao) {
  const partes = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: tz || 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    .formatToParts(data).forEach((p) => (partes[p.type] = p.value));
  if (partes.hour === '24') partes.hour = '00';
  return padrao.replace(/yyyy|MM|dd|HH|mm|ss/g, (t) => ({ yyyy: partes.year, MM: partes.month, dd: partes.day, HH: partes.hour, mm: partes.minute, ss: partes.second })[t]);
}
const Utilities = {
  formatDate: formatar,
  DigestAlgorithm: { MD5: 'md5', SHA_1: 'sha1', SHA_256: 'sha256' },
  Charset: { UTF_8: 'utf8' },
  computeDigest: (alg, s) => bytesAssinados(crypto.createHash(alg).update(String(s), 'utf8').digest()),
  base64DecodeWebSafe: (s) => bytesAssinados(Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')),
  base64Decode: (s) => bytesAssinados(Buffer.from(s, 'base64')),
  base64Encode: (s) => Buffer.from(typeof s === 'string' ? s : Buffer.from(s)).toString('base64'),
  sleep: () => {},
  newBlob: (s) => ({ getDataAsString: () => String(s), getBytes: () => Buffer.from(String(s)) }),
};
const CacheService = { getScriptCache: () => ({
  get: (k) => (k in cacheMem ? cacheMem[k] : null), put: (k, v) => { cacheMem[k] = String(v); }, remove: (k) => { delete cacheMem[k]; },
  getAll: (ks) => { const o = {}; ks.forEach((k) => { if (k in cacheMem) o[k] = cacheMem[k]; }); return o; },
  putAll: (o) => Object.assign(cacheMem, o), removeAll: (ks) => ks.forEach((k) => delete cacheMem[k]),
}) };
const props = {};
const PropertiesService = { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; }, getProperties: () => props }) };
const LockService = { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) };
const geocoder = { setLanguage() { return geocoder; }, setRegion() { return geocoder; }, setBounds() { return geocoder; }, geocode: () => ({ status: 'ZERO_RESULTS', results: [] }) };
const Maps = { newGeocoder: () => geocoder };

// XML mínimo (o servidor só usa getRootElement/getChild/getChildren/getChildText/getText/getAttribute)
function parseXml(xml) {
  const raiz = { nome: '#doc', filhos: [], texto: '', attrs: {} };
  const pilha = [raiz];
  const re = /<!\[CDATA\[([\s\S]*?)\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/([\w:.-]+)\s*>|<([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  const ent = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
  let m;
  while ((m = re.exec(xml))) {
    const topo = pilha[pilha.length - 1];
    if (m[1] !== undefined) topo.texto += m[1];
    else if (m[2]) { if (pilha.length > 1) pilha.pop(); }
    else if (m[3]) {
      const el = { nome: m[3], filhos: [], texto: '', attrs: {} };
      (m[4] || '').replace(/([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g, (x, k, y, a, b) => { el.attrs[k] = ent(a !== undefined ? a : b); });
      topo.filhos.push(el);
      if (!m[5]) pilha.push(el);
    } else if (m[6]) topo.texto += ent(m[6]);
  }
  return raiz;
}
function envolver(el) {
  return {
    getChild: (n) => { const f = el.filhos.find((c) => c.nome === n); return f ? envolver(f) : null; },
    getChildren: (n) => el.filhos.filter((c) => !n || c.nome === n).map(envolver),
    getChildText: (n) => { const f = el.filhos.find((c) => c.nome === n); return f ? f.texto : null; },
    getText: () => el.texto,
    getName: () => el.nome,
    getAttribute: (n) => (n in el.attrs ? { getValue: () => el.attrs[n] } : null),
  };
}
const XmlService = { parse: (xml) => { const d = parseXml(String(xml)); if (!d.filhos.length) throw new Error('XML vazio'); return { getRootElement: () => envolver(d.filhos[0]) }; } };

// ---------- Carrega o servidor ----------
const ctx = vm.createContext({
  UrlFetchApp, Utilities, CacheService, PropertiesService, LockService, Maps, XmlService,
  Logger: { log: (s) => { if (process.env.LOG) console.log('  [log]', s); } },
  console, Date, Math, JSON, Set, Map, RegExp, Object, Array, String, Number, Boolean, Error, encodeURIComponent, decodeURIComponent, isNaN, parseInt, parseFloat, Intl,
  MimeType: { PLAIN_TEXT: 'text/plain' }, DriveApp: {}, SpreadsheetApp: {}, ScriptApp: {}, HtmlService: {}, Session: { getScriptTimeZone: () => 'America/Sao_Paulo' },
});
const servidor = path.join(RAIZ, 'servidor');
for (const f of fs.readdirSync(servidor).filter((f) => f.endsWith('.gs')).sort()) {
  vm.runInContext(fs.readFileSync(path.join(servidor, f), 'utf8'), ctx, { filename: f });
}
vm.runInContext(`
  lerJson_ = function (n) { return __mem[n] === undefined ? null : JSON.parse(JSON.stringify(__mem[n])); };
  gravarJson_ = function (n, v) { __mem[n] = JSON.parse(JSON.stringify(v)); };
  atualizarJsonComTrava_ = function (n, f) { const v = f(lerJson_(n)); if (v !== undefined && v !== null) gravarJson_(n, v); return v; };
`, Object.assign(ctx, { __mem: arquivosMemoria }));

// ---------- Amostra ----------
let alvos = process.argv.slice(2);
if (!alvos.length) alvos = fs.readFileSync(path.join(__dirname, 'amostra.txt'), 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));

const relatorio = [];
for (const alvo of alvos) {
  const [uf, nome] = alvo.split(':');
  const t0 = Date.now();
  const antes = estat.pedidos;
  let linha;
  try {
    const mun = vm.runInContext(`obterMunicipioBase_(${JSON.stringify(uf)}, ${JSON.stringify(nome)})`, ctx);
    if (!mun) throw new Error('município não encontrado na base');
    const r = vm.runInContext(`coletarNoticiasCidade_(${JSON.stringify(mun)})`, ctx);
    const reg = arquivosMemoria['cidade_' + mun.ibge + '.json'] || { ocorrencias: [] };
    const oc = reg.ocorrencias || [];
    const comBairro = oc.filter((o) => o.b && !/local n[aã]o informado/i.test(o.b) && o.b !== mun.nome);
    const bairrosArq = arquivosMemoria['bairros_' + mun.ibge + '.json'];
    const porCat = {};
    oc.forEach((o) => (porCat[o.c] = (porCat[o.c] || 0) + 1));
    const feeds = arquivosMemoria['feeds_itens_' + uf + '.json'];
    linha = {
      uf, cidade: mun.nome, ibge: mun.ibge, segundos: Math.round((Date.now() - t0) / 1000), pedidos: estat.pedidos - antes,
      erro: r.erro || '', noticias: oc.length, comBairro: comBairro.length, pctBairro: oc.length ? Math.round((100 * comBairro.length) / oc.length) : 0,
      imprensaLocal: oc.filter((o) => o.il).length, viaRssDireto: oc.filter((o) => !/news\.google\.com/.test(o.u || '')).length,
      bairrosConhecidos: bairrosArq ? (bairrosArq.itens || []).length : null, fonteBairros: bairrosArq ? bairrosArq.fonte || 'OSM' : null,
      itensFeedsUf: feeds ? feeds.itens.length : null, feedsUf: feeds ? feeds.feeds : null, porCategoria: porCat,
      exemplos: oc.slice(0, 6).map((o) => `[${o.c}] ${o.t} — ${o.b || 'sem bairro'} (${o.v})`),
    };
  } catch (e) {
    linha = { uf, cidade: nome, erro: String(e.stack || e).slice(0, 400) };
  }
  relatorio.push(linha);
  console.log(JSON.stringify({ uf: linha.uf, cidade: linha.cidade, noticias: linha.noticias, comBairro: linha.comBairro, rss: linha.viaRssDireto, s: linha.segundos, erro: linha.erro }));
}

fs.writeFileSync(path.join(__dirname, 'relatorio.json'), JSON.stringify({ em: new Date().toISOString(), estat, relatorio }, null, 1));
const md = ['| UF | Município | Notícias | Com bairro | % | Imprensa local | RSS direto | Bairros conhecidos | Tempo (s) | Erro |', '|---|---|---|---|---|---|---|---|---|---|']
  .concat(relatorio.map((l) => `| ${l.uf} | ${l.cidade} | ${l.noticias ?? '-'} | ${l.comBairro ?? '-'} | ${l.pctBairro ?? '-'} | ${l.imprensaLocal ?? '-'} | ${l.viaRssDireto ?? '-'} | ${l.bairrosConhecidos ?? '-'} ${l.fonteBairros || ''} | ${l.segundos ?? '-'} | ${(l.erro || '').slice(0, 60)} |`));
fs.writeFileSync(path.join(__dirname, 'relatorio.md'), md.join('\n') + '\n');
console.log(md.join('\n'));
