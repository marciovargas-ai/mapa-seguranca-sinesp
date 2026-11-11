/**
 * Texto das matérias. O Google Notícias entrega só a manchete e um link
 * codificado (news.google.com/rss/articles/...). Para achar o bairro, o servidor
 * descobre o endereço real da matéria e lê os primeiros parágrafos.
 *
 * Tudo em lotes paralelos (UrlFetchApp.fetchAll), com limite por coleta e
 * falhas silenciosas: se o site não responder, a notícia fica como estava.
 */
const MAX_MATERIAS_POR_COLETA_ = 25;
const MAX_CARACTERES_MATERIA_ = 4000;

/** Devolve, na mesma ordem dos links, o texto da matéria ('' quando não deu). */
function lerTextoMaterias_(links) {
  const urls = resolverLinksGoogleNews_(links);
  const pedidos = [], posicoes = [];
  urls.forEach((u, i) => {
    if (!u || /news\.google\.com/.test(u)) return;
    pedidos.push({ url: u, muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MapaSeguranca/1.0)' } });
    posicoes.push(i);
  });
  const textos = links.map(() => '');
  if (!pedidos.length) return textos;
  let respostas = [];
  try { respostas = UrlFetchApp.fetchAll(pedidos); } catch (e) { Logger.log('Matérias: ' + e.message); return textos; }
  respostas.forEach((r, k) => {
    try {
      if (r.getResponseCode() !== 200) return;
      textos[posicoes[k]] = paragrafosDaMateria_(r.getContentText());
    } catch (e) { /* página ilegível */ }
  });
  return textos;
}

/** Junta os <p> do corpo da página (sem menus, scripts e rodapés), até o limite. */
function paragrafosDaMateria_(html) {
  const corpo = String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(nav|header|footer|aside|form)[\s\S]*?<\/\1>/gi, ' ');
  const partes = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m, total = 0;
  while ((m = re.exec(corpo)) && total < MAX_CARACTERES_MATERIA_) {
    const t = limparHtml_(m[1]).replace(/\s+/g, ' ').trim();
    // Parágrafos curtos costumam ser legenda, crédito ou "leia também"
    if (t.length < 60 || /^(leia (também|mais)|veja (também|mais)|siga|inscreva-se|clique)/i.test(t)) continue;
    partes.push(t);
    total += t.length;
  }
  return partes.join(' ').slice(0, MAX_CARACTERES_MATERIA_);
}

/**
 * Converte os links do Google Notícias no endereço real da matéria.
 * 1) Formato antigo: o endereço vem dentro do próprio código (base64).
 * 2) Formato atual: a página do artigo traz uma assinatura (data-n-a-sg / data-n-a-ts)
 *    que o serviço "batchexecute" do Google Notícias troca pelo endereço.
 */
function resolverLinksGoogleNews_(links) {
  const saida = links.map(l => (/news\.google\.com\/(rss\/)?articles\//.test(l || '') ? '' : l || ''));
  const pendentes = [];
  links.forEach((l, i) => {
    if (saida[i] || !l) return;
    const id = (String(l).match(/articles\/([^?/#]+)/) || [])[1];
    if (!id) return;
    const antigo = decodificarIdAntigo_(id);
    if (antigo) { saida[i] = antigo; return; }
    pendentes.push({ i: i, id: id });
  });
  if (!pendentes.length) return saida;

  // Passo 1: assinatura de cada artigo
  let paginas = [];
  try {
    paginas = UrlFetchApp.fetchAll(pendentes.map(p => ({ url: 'https://news.google.com/rss/articles/' + p.id, muteHttpExceptions: true })));
  } catch (e) { return saida; }
  const comAssinatura = [];
  paginas.forEach((r, k) => {
    if (r.getResponseCode() !== 200) return;
    const h = r.getContentText();
    const sg = (h.match(/data-n-a-sg="([^"]+)"/) || [])[1];
    const ts = (h.match(/data-n-a-ts="([^"]+)"/) || [])[1];
    if (sg && ts) comAssinatura.push({ i: pendentes[k].i, id: pendentes[k].id, sg: sg, ts: ts });
  });
  if (!comAssinatura.length) return saida;

  // Passo 2: troca pela URL
  let trocas = [];
  try {
    trocas = UrlFetchApp.fetchAll(comAssinatura.map(p => {
      const interno = '["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"' +
        p.id + '",' + p.ts + ',"' + p.sg + '"]';
      const freq = JSON.stringify([[['Fbv4je', interno, null, 'generic']]]);
      return {
        url: 'https://news.google.com/_/DotsSplashUi/data/batchexecute', method: 'post', muteHttpExceptions: true,
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', payload: 'f.req=' + encodeURIComponent(freq)
      };
    }));
  } catch (e) { return saida; }
  trocas.forEach((r, k) => {
    try {
      if (r.getResponseCode() !== 200) return;
      const corpo = r.getContentText().split('\n\n')[1];
      const externo = JSON.parse(corpo);
      const url = JSON.parse(externo[0][2])[1];
      if (/^https?:\/\//.test(url)) saida[comAssinatura[k].i] = url;
    } catch (e) { /* formato mudou: fica sem a matéria */ }
  });
  return saida;
}

function decodificarIdAntigo_(id) {
  try {
    let b64 = id.replace(/=+$/, '');
    while (b64.length % 4) b64 += '=';
    const bytes = Utilities.base64DecodeWebSafe(b64);
    const texto = bytes.map(b => String.fromCharCode(b < 0 ? b + 256 : b)).join('');
    const m = texto.match(/https?:\/\/[\x21-\x7e]+/);
    // Formato novo ("AU_yqL..."): o endereço não vem no código; vai pelo passo da assinatura
    return m ? m[0] : '';
  } catch (e) {
    return '';
  }
}
