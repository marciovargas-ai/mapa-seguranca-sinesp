/**
 * Feeds RSS diretos dos jornais (além do Google Notícias).
 *
 * Por que: o Google Notícias demora para indexar e devolve links codificados.
 * O feed do próprio jornal chega minutos depois da publicação e traz o endereço
 * real da matéria (o texto é lido direto, sem decodificar link).
 *
 * Fontes por estado:
 * 1) g1 do estado (g1.globo.com/rss/g1/<uf>/<estado>/);
 * 2) cada site da imprensa local de IMPRENSA_LOCAL_UF (2_Motor): o servidor
 *    descobre o feed sozinho (tag <link rel="alternate"> da página inicial,
 *    depois /feed/ e /rss) e guarda a lista por 7 dias.
 *
 * Os itens de cada estado ficam guardados 10 minutos, então todas as cidades do
 * estado aproveitam a mesma leitura. Falhas são silenciosas: feed fora do ar
 * só deixa de contribuir.
 */
const FEEDS_G1_UF_ = {
  AC: 'ac/acre', AL: 'al/alagoas', AP: 'ap/amapa', AM: 'am/amazonas', BA: 'ba/bahia', CE: 'ce/ceara',
  DF: 'df/distrito-federal', ES: 'es/espirito-santo', GO: 'go/goias', MA: 'ma/maranhao', MT: 'mt/mato-grosso',
  MS: 'ms/mato-grosso-do-sul', MG: 'mg/minas-gerais', PA: 'pa/para', PB: 'pb/paraiba', PR: 'pr/parana',
  PE: 'pe/pernambuco', PI: 'pi/piaui', RJ: 'rj/rio-de-janeiro', RN: 'rn/rio-grande-do-norte',
  RS: 'rs/rio-grande-do-sul', RO: 'ro/rondonia', RR: 'rr/roraima', SC: 'sc/santa-catarina',
  SP: 'sp/sao-paulo', SE: 'se/sergipe', TO: 'to/tocantins'
};
/** Feeds extras conhecidos (regionais do g1 e jornais grandes). Pode acrescentar à vontade. */
const FEEDS_EXTRAS_UF_ = {
  RJ: ['https://g1.globo.com/rss/g1/rj/norte-fluminense/', 'https://g1.globo.com/rss/g1/rj/regiao-serrana/', 'https://g1.globo.com/rss/g1/rj/sul-do-rio-costa-verde/'],
  SP: ['https://g1.globo.com/rss/g1/sp/santos-regiao/', 'https://g1.globo.com/rss/g1/sp/campinas-regiao/', 'https://g1.globo.com/rss/g1/sp/ribeirao-preto-franca/'],
  MG: ['https://g1.globo.com/rss/g1/mg/centro-oeste/', 'https://g1.globo.com/rss/g1/mg/vales-mg/', 'https://g1.globo.com/rss/g1/mg/grande-minas/'],
  PR: ['https://g1.globo.com/rss/g1/pr/campos-gerais-sul/', 'https://g1.globo.com/rss/g1/pr/norte-noroeste/', 'https://g1.globo.com/rss/g1/pr/oeste-sudoeste/']
};
const MINUTOS_CACHE_FEEDS_ = 10;
const DIAS_DESCOBERTA_FEEDS_ = 7;
const MAX_ITENS_FEEDS_UF_ = 600;
const UA_FEEDS_ = { 'User-Agent': 'Mozilla/5.0 (compatible; MapaSeguranca/1.0; +RSS)' };

/** Candidatos (mesmo formato da busca no Google Notícias) vindos dos feeds diretos do estado. */
function candidatosFeedsDiretos_(mun, bairros, linksVistos, limiteData) {
  const saida = [];
  let itens = [];
  try { itens = itensFeedsUf_(mun.uf); } catch (e) { Logger.log('Feeds RSS ' + mun.uf + ': ' + e.message); return saida; }
  itens.forEach(it => {
    if (!it.l || linksVistos.has(it.l) || it.ms < limiteData) return;
    const texto = it.t + '. ' + (it.r || '');
    const local = it.loc || ehImprensaLocal_(it.l, mun.uf);
    if (!noticiaDaCidade_(mun, texto, it.v, local, it.l, bairros)) return;
    const classificacao = classificarCrimeNLP_(texto);
    if (!classificacao.valido) return;
    linksVistos.add(it.l);
    saida.push({
      dataIso: Utilities.formatDate(new Date(it.ms), CONFIG.FUSO, 'yyyy-MM-dd'),
      manchete: it.t, veiculo: it.v, link: it.l, texto: texto, classificacao: classificacao,
      orgaos: detectarOrgaos_(texto, mun.uf), imprensaLocal: local, rssDireto: true
    });
  });
  return saida;
}

/** Itens recentes de todos os feeds do estado, guardados por alguns minutos. */
function itensFeedsUf_(uf) {
  const arquivo = 'feeds_itens_' + uf + '.json';
  const salvo = lerJson_(arquivo);
  if (salvo && Date.now() - salvo.em < MINUTOS_CACHE_FEEDS_ * 60000) return salvo.itens || [];
  const feeds = listaFeedsUf_(uf);
  if (!feeds.length) return (salvo && salvo.itens) || [];
  let respostas = [];
  try {
    respostas = UrlFetchApp.fetchAll(feeds.map(f => ({ url: f.u, muteHttpExceptions: true, followRedirects: true, headers: UA_FEEDS_ })));
  } catch (e) { return (salvo && salvo.itens) || []; }
  const novos = [];
  respostas.forEach((r, k) => {
    try {
      if (r.getResponseCode() !== 200) return;
      lerItensXml_(r.getContentText()).forEach(it => { it.v = feeds[k].v; it.loc = feeds[k].loc; novos.push(it); });
    } catch (e) { /* feed ilegível */ }
  });
  // Junta com o que já estava guardado: feeds trazem só os últimos itens, o histórico fica
  const porLink = {};
  ((salvo && salvo.itens) || []).concat(novos).forEach(it => { porLink[it.l] = it; });
  const limite = Date.now() - CONFIG.DIAS_JANELA_NOTICIAS * 86400000;
  const itens = Object.keys(porLink).map(k => porLink[k]).filter(it => it.ms >= limite)
    .sort((a, b) => b.ms - a.ms).slice(0, MAX_ITENS_FEEDS_UF_);
  gravarJson_(arquivo, { em: Date.now(), feeds: feeds.length, itens: itens });
  return itens;
}

/** Lista de feeds do estado: g1 + extras + feeds descobertos nos sites da imprensa local. */
function listaFeedsUf_(uf) {
  const arquivo = 'feeds_lista_' + uf + '.json';
  const salvo = lerJson_(arquivo);
  if (salvo && Date.now() - salvo.em < DIAS_DESCOBERTA_FEEDS_ * 86400000) return salvo.feeds || [];
  const feeds = [];
  if (FEEDS_G1_UF_[uf]) feeds.push({ u: 'https://g1.globo.com/rss/g1/' + FEEDS_G1_UF_[uf] + '/', v: 'g1', loc: true });
  (FEEDS_EXTRAS_UF_[uf] || []).forEach(u => feeds.push({ u: u, v: 'g1', loc: true }));
  try { descobrirFeeds_(IMPRENSA_LOCAL_UF[uf] || []).forEach(f => feeds.push(f)); } catch (e) { Logger.log('Descoberta de feeds ' + uf + ': ' + e.message); }
  gravarJson_(arquivo, { em: Date.now(), feeds: feeds });
  return feeds;
}

/** Para cada site: procura <link rel="alternate" type="application/rss+xml"> e testa /feed/ e /rss. */
function descobrirFeeds_(dominios) {
  if (!dominios.length) return [];
  const achados = [];
  const paginas = UrlFetchApp.fetchAll(dominios.map(d => ({ url: 'https://' + d + '/', muteHttpExceptions: true, followRedirects: true, headers: UA_FEEDS_ })));
  const testar = [];
  paginas.forEach((r, i) => {
    const d = dominios[i];
    let href = '';
    try {
      if (r.getResponseCode() === 200) {
        const h = r.getContentText().slice(0, 200000);
        const tags = h.match(/<link[^>]+type=["']application\/(rss|atom)\+xml["'][^>]*>/gi) || [];
        for (const tag of tags) {
          const m = tag.match(/href=["']([^"']+)["']/i);
          if (m && !/comments|coment/i.test(m[1])) { href = m[1]; break; }
        }
      }
    } catch (e) { /* segue para os caminhos padrão */ }
    if (href) {
      if (href.indexOf('//') === 0) href = 'https:' + href;
      else if (href.charAt(0) === '/') href = 'https://' + d + href;
      achados.push({ u: href, v: d, loc: true });
    } else {
      testar.push({ d: d, u: 'https://' + d + '/feed/' }, { d: d, u: 'https://' + d + '/rss' });
    }
  });
  if (testar.length) {
    const ok = {};
    UrlFetchApp.fetchAll(testar.map(t => ({ url: t.u, muteHttpExceptions: true, followRedirects: true, headers: UA_FEEDS_ }))).forEach((r, k) => {
      const t = testar[k];
      if (ok[t.d]) return;
      try {
        if (r.getResponseCode() === 200 && /<(rss|feed)[\s>]/i.test(r.getContentText().slice(0, 3000))) { ok[t.d] = true; achados.push({ u: t.u, v: t.d, loc: true }); }
      } catch (e) { /* sem feed */ }
    });
  }
  return achados;
}

/** RSS 2.0 e Atom, por expressão regular (aceita feeds com XML imperfeito). */
function lerItensXml_(xml) {
  const itens = [];
  const blocos = String(xml || '').match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  const tag = (b, nomes) => {
    for (const n of nomes) {
      const m = b.match(new RegExp('<' + n + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + n + '>', 'i'));
      if (m) return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1').trim();
    }
    return '';
  };
  blocos.forEach(b => {
    let link = tag(b, ['link']);
    if (!link || /^</.test(link)) {
      const m = b.match(/<link[^>]+href=["']([^"']+)["']/i);
      link = m ? m[1] : '';
    }
    link = link.replace(/&amp;/g, '&').trim();
    const titulo = limparHtml_(tag(b, ['title'])).replace(/\s+/g, ' ').trim();
    const data = new Date(tag(b, ['pubDate', 'published', 'updated', 'dc:date']));
    if (!/^https?:\/\//.test(link) || !titulo || isNaN(data.getTime())) return;
    const resumo = limparHtml_(tag(b, ['description', 'summary', 'content:encoded', 'content'])).replace(/\s+/g, ' ').trim().slice(0, 600);
    itens.push({ l: link, t: titulo, r: resumo, ms: data.getTime() });
  });
  return itens;
}
