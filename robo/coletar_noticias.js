/**
 * Robô de notícias (GitHub Actions): roda a MESMA coleta do servidor (servidor/*.gs) para todos os
 * municípios de um estado e grava um arquivo por cidade. O servidor do Apps Script importa esse arquivo
 * na primeira consulta da cidade (importarNoticiasGithub_), e a cidade abre em segundos.
 *
 * Uso: node robo/coletar_noticias.js <UF> <pasta de saída>
 *   A pasta já pode ter os arquivos da rodada anterior (<ibge>.json): a coleta continua deles
 *   (só busca o que é novo) e respeita o prazo de atualização de cada cidade.
 * Variáveis: MINUTOS (tempo máximo da rodada, padrão 290), LIMITE (máx. de cidades, para teste).
 *
 * Diferenças para o Apps Script: sem geocodificação do Google (rua/endereço ficam pendentes e o servidor
 * resolve depois), sem Overpass (bairros vêm dos arquivos do IBGE/OSM já publicados em dados/bairros)
 * e sem Drive (memória + arquivos da pasta de saída).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const UF = String(process.argv[2] || '').toUpperCase();
const SAIDA = process.argv[3] || path.join(RAIZ, 'saida', UF);
const MINUTOS = Number(process.env.MINUTOS || 290);
const LIMITE = Number(process.env.LIMITE || 0);
if (!UF) { console.error('Informe a UF'); process.exit(1); }
fs.mkdirSync(SAIDA, { recursive: true });

const memoria = {};
const cacheMem = {};

// ---------- Rede (com os arquivos de dados/ lidos do disco) ----------
const estat = { pedidos: 0, google: 0, googleFalhas: 0, porHost: {} };
let falhasSeguidasGoogle = 0;
const RE_DADOS = /^https:\/\/(?:cdn\.jsdelivr\.net\/gh\/marciovargas-ai\/mapa-seguranca-sinesp@main|raw\.githubusercontent\.com\/marciovargas-ai\/mapa-seguranca-sinesp\/main)\/dados\/(.+)$/;
function resposta(r) {
  return { getResponseCode: () => r.code, getContentText: () => r.body, getHeaders: () => ({}), getBlob: () => ({ getDataAsString: () => r.body }) };
}
function buscarLote(pedidos) {
  const lista = pedidos.map((p) => (typeof p === 'string' ? { url: p } : p));
  const saida = new Array(lista.length);
  const rede = [];
  lista.forEach((p, i) => {
    const m = RE_DADOS.exec(p.url);
    if (m) {
      const arq = path.join(RAIZ, 'dados', m[1].split('?')[0]);
      saida[i] = fs.existsSync(arq) ? { code: 200, body: fs.readFileSync(arq, 'utf8') } : { code: 404, body: '' };
    } else rede.push(i);
  });
  if (rede.length) {
    rede.forEach((i) => { estat.pedidos++; const h = (lista[i].url.match(/^https?:\/\/([^/]+)/) || [])[1] || '?'; estat.porHost[h] = (estat.porHost[h] || 0) + 1; });
    const out = execFileSync('node', [path.join(__dirname, '..', 'validacao', 'buscar.js')], {
      input: JSON.stringify(rede.map((i) => lista[i])), maxBuffer: 1 << 30, env: Object.assign({ TEMPO_MS: '15000' }, process.env),
    });
    JSON.parse(out.toString()).forEach((r, k) => {
      const i = rede[k];
      saida[i] = r;
      if (/news\.google\.com\/rss/.test(lista[i].url)) {
        estat.google++;
        if (r.code === 200) falhasSeguidasGoogle = 0; else { estat.googleFalhas++; falhasSeguidasGoogle++; }
      }
    });
  }
  return saida.map(resposta);
}
const UrlFetchApp = {
  fetch: (url, op) => buscarLote([Object.assign({ url }, op || {})])[0],
  fetchAll: (lista) => buscarLote(lista),
};

// ---------- Serviços do Apps Script ----------
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
const PropertiesService = { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; }, getProperties: () => props, deleteProperty: (k) => { delete props[k]; } }) };
const LockService = { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) };
const geocoder = { setLanguage() { return geocoder; }, setRegion() { return geocoder; }, setBounds() { return geocoder; }, geocode: () => ({ status: 'ZERO_RESULTS', results: [] }) };
const Maps = { newGeocoder: () => geocoder };

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
  ROBO_GITHUB_: true,  // o robô nunca importa do próprio GitHub
});
const servidor = path.join(RAIZ, 'servidor');
for (const f of fs.readdirSync(servidor).filter((f) => f.endsWith('.gs')).sort()) {
  vm.runInContext(fs.readFileSync(path.join(servidor, f), 'utf8'), ctx, { filename: f });
}
vm.runInContext(`
  lerJson_ = function (n) { return __mem[n] === undefined ? null : JSON.parse(JSON.stringify(__mem[n])); };
  gravarJson_ = function (n, v) { __mem[n] = JSON.parse(JSON.stringify(v)); };
  atualizarJsonComTrava_ = function (n, f) { const v = f(lerJson_(n)); if (v !== undefined && v !== null) gravarJson_(n, v); return v; };
  // Sem Overpass no robô: os bairros vêm de dados/bairros (IBGE e OSM já publicados)
  const __bairrosOriginal = obterBairrosOsm_;
  obterBairrosOsm_ = function (mun) { return __bairrosOriginal(mun, true); };
  // Sem Google Maps no robô: endereço e rua ficam pendentes (o servidor geocodifica depois). Orçamento zero
  // evita gravar 'NAO_ENCONTRADO' no dicionário da cidade, o que impediria o servidor de tentar de novo.
  const __ctxOriginal = criarContextoGeo_;
  criarContextoGeo_ = function (mun, locais) { return __ctxOriginal(mun, locais, { restantes: 0 }); };
`, Object.assign(ctx, { __mem: memoria }));

// ---------- Fila do estado ----------
const pop = (() => {
  try {
    const p = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dados', 'populacao.json'), 'utf8'));
    const m = {};
    Object.values(p.ufs[UF] || {}).forEach((x) => { if (x && x[0]) m[String(x[0])] = Number(x[1]) || 0; });
    return m;
  } catch (e) { return {}; }
})();
/** Cidade grande muda todo dia; cidade pequena tem pouca notícia nova. */
function prazoDias(hab) { return hab >= 100000 ? 1 : hab >= 20000 ? 2 : 4; }

const arqIndice = path.join(SAIDA, 'indice.json');
let indice = { uf: UF, cidades: {} };
try { indice = JSON.parse(fs.readFileSync(arqIndice, 'utf8')); indice.cidades = indice.cidades || {}; } catch (e) { /* primeira rodada */ }

const municipios = vm.runInContext(`listarMunicipiosUF_(${JSON.stringify(UF)})`, ctx);
const agora = Date.now();
const fila = municipios
  .map((m) => {
    const ant = indice.cidades[m.ibge];
    const hab = pop[m.ibge] || 0;
    const idadeDias = ant ? (agora - ant[0]) / 86400000 : Infinity;
    return { m, hab, idadeDias, vencida: idadeDias >= prazoDias(hab) - 0.1 };
  })
  .filter((x) => x.vencida)
  // Nunca coletadas primeiro (das maiores para as menores); depois as mais atrasadas
  .sort((a, b) => (a.idadeDias === Infinity) !== (b.idadeDias === Infinity) ? (a.idadeDias === Infinity ? -1 : 1)
    : a.idadeDias === Infinity ? b.hab - a.hab : b.idadeDias / prazoDias(b.hab) - a.idadeDias / prazoDias(a.hab));
console.log(`${UF}: ${municipios.length} municípios, ${fila.length} na fila desta rodada (limite ${MINUTOS} min)`);

const inicio = Date.now();
let feitas = 0, erros = 0, paradaGoogle = false;
for (const item of fila) {
  if (LIMITE && feitas >= LIMITE) break;
  if (Date.now() - inicio > MINUTOS * 60000) { console.log('Tempo da rodada esgotado; o resto fica para a próxima.'); break; }
  if (falhasSeguidasGoogle >= 40) { paradaGoogle = true; console.log('O Google Notícias parou de responder (limite de acesso). Rodada encerrada.'); break; }
  const mun = item.m;
  const nomeArq = 'cidade_' + mun.ibge + '.json';
  const arqCidade = path.join(SAIDA, mun.ibge + '.json');
  try { if (fs.existsSync(arqCidade)) memoria[nomeArq] = JSON.parse(fs.readFileSync(arqCidade, 'utf8')); } catch (e) { /* recomeça */ }
  const t0 = Date.now();
  const antesGoogle = estat.google, antesFalhas = estat.googleFalhas;
  try {
    const r = vm.runInContext(`coletarNoticiasCidade_(${JSON.stringify(mun)})`, ctx);
    const reg = memoria[nomeArq];
    const falhasCidade = estat.googleFalhas - antesFalhas, buscasCidade = estat.google - antesGoogle;
    // Busca que falhou quase toda não substitui a anterior (nem marca a cidade como atualizada)
    if (r.erro || !reg || (buscasCidade && falhasCidade / buscasCidade > 0.5)) {
      erros++;
      console.log(`  ✗ ${mun.nome}: ${r.erro || 'buscas falharam'} (${falhasCidade}/${buscasCidade} falhas no Google)`);
    } else {
      reg.robo = { em: Date.now(), segundos: Math.round((Date.now() - t0) / 1000) };
      fs.writeFileSync(arqCidade, JSON.stringify(reg));
      indice.cidades[mun.ibge] = [reg.coletadoEm, (reg.ocorrencias || []).length];
      feitas++;
      if (feitas % 10 === 0 || process.env.LOG_CIDADES) {
        fs.writeFileSync(arqIndice, JSON.stringify(Object.assign(indice, { atualizado: Date.now() })));
      }
      console.log(`  ✓ ${mun.nome} (${item.hab || '?'} hab.): ${(reg.ocorrencias || []).length} notícias, +${r.novasOcorrencias} novas, ${Math.round((Date.now() - t0) / 1000)} s`);
    }
  } catch (e) {
    erros++;
    console.log(`  ✗ ${mun.nome}: ${String(e && e.message || e).slice(0, 200)}`);
  }
  // Libera a memória: só o estado (feeds do estado) fica entre uma cidade e outra
  Object.keys(memoria).forEach((k) => { if (!/^feeds_/.test(k)) delete memoria[k]; });
}
indice.atualizado = Date.now();
indice.rodada = { feitas, erros, paradaGoogle, minutos: Math.round((Date.now() - inicio) / 60000), pedidos: estat.pedidos, google: estat.google, googleFalhas: estat.googleFalhas };
fs.writeFileSync(arqIndice, JSON.stringify(indice));
console.log(`${UF}: ${feitas} cidades atualizadas, ${erros} com erro, ${Object.keys(indice.cidades).length}/${municipios.length} com arquivo. ` +
  `Pedidos: ${estat.pedidos} (Google Notícias ${estat.google}, ${estat.googleFalhas} falhas).`);
console.log('Por site:', JSON.stringify(Object.entries(estat.porHost).sort((a, b) => b[1] - a[1]).slice(0, 12)));
