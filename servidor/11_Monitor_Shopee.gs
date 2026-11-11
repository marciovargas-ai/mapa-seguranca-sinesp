/**
 * ============================================================================
 * ARQUIVO 11: 11_Monitor_Shopee.gs
 * Monitor de notícias que citam a Shopee (motoristas, entregadores, cargas,
 * funcionários, assaltos, furtos). Busca no Google Notícias e nos feeds RSS dos
 * jornais já lidos pelo sistema, guarda num arquivo só (shopee_noticias.json) e
 * o painel mostra como notificação (sino com contador e popup).
 *
 * - O painel chama obterNoticiasShopee(desde) a cada poucos minutos; se a
 *   última busca tem mais de 15 min, a busca é refeita na hora.
 * - Para buscar mesmo com o portal fechado, rode uma vez ativarMonitorShopee()
 *   (cria um gatilho de 15 em 15 minutos).
 * ============================================================================
 */

const ARQUIVO_SHOPEE_ = 'shopee_noticias.json';
const MINUTOS_ENTRE_BUSCAS_SHOPEE_ = 15;
const DIAS_GUARDAR_SHOPEE_ = 120;
const MAX_NOTICIAS_SHOPEE_ = 600;

/** Termos pedidos pelo Márcio (2026-11-11). Cada um vira uma busca exata. */
const TERMOS_SHOPEE_ = [
  'Driver Shopee', 'Motorista da Shopee', 'Carga da Shopee', 'trabalha na Shopee',
  'Funcionário da Shopee', 'Empregado da Shopee', 'Carga roubada da Shopee',
  'assalto Shopee', 'Furto Shopee', 'entregador da Shopee'
];

/** Buscas mais largas: qualquer notícia com "Shopee" ligada a segurança. */
const BUSCAS_LARGAS_SHOPEE_ = [
  '"Shopee" (roubo OR assalto OR furto OR assaltado OR roubada OR roubado OR bandidos)',
  '"Shopee" (polícia OR preso OR presos OR prisão OR operação OR quadrilha OR receptação)',
  '"Shopee" (morto OR morte OR baleado OR tiroteio OR sequestro OR refém OR agredido)',
  '"Shopee" (entregador OR motorista OR caminhão OR carreta OR van OR "centro de distribuição" OR galpão OR hub)',
  '"Shopee" (golpe OR fraude OR estelionato OR golpista OR falso)',
  '"Shopee"'
];

/** Chamado pelo painel. desde = maior "achadoEm" que o painel já tem (0 = tudo). */
function obterNoticiasShopee(desde) {
  let dado = lerJson_(ARQUIVO_SHOPEE_);
  const velho = !dado || !dado.atualizado || Date.now() - dado.atualizado > MINUTOS_ENTRE_BUSCAS_SHOPEE_ * 60000;
  if (velho) {
    const lock = LockService.getScriptLock();
    if (lock.tryLock(1000)) {
      try { dado = atualizarMonitorShopee_(); } catch (e) { Logger.log('Monitor Shopee: ' + e.message); }
      finally { lock.releaseLock(); }
    }
  }
  dado = dado || { atualizado: 0, itens: [] };
  const d = Number(desde) || 0;
  return {
    ok: true,
    atualizado: dado.atualizado || 0,
    termos: TERMOS_SHOPEE_,
    gatilho: ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'monitorShopeeGatilho'),
    itens: (dado.itens || []).filter(i => !d || i.achadoEm > d)
  };
}

/** Gatilho de tempo (ver ativarMonitorShopee). */
function monitorShopeeGatilho() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try { atualizarMonitorShopee_(); } finally { lock.releaseLock(); }
}

/** Rode uma vez no editor: busca de 15 em 15 minutos, mesmo sem ninguém no portal. */
function ativarMonitorShopee() {
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'monitorShopeeGatilho') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('monitorShopeeGatilho').timeBased().everyMinutes(15).create();
  atualizarMonitorShopee_();
  registrarStatus_('Monitor Shopee', 'Ativo — de 15 em 15 minutos (' + Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + ')');
}

function desativarMonitorShopee() {
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'monitorShopeeGatilho') ScriptApp.deleteTrigger(t); });
  registrarStatus_('Monitor Shopee', 'Desativado');
}

/** Busca, junta com o que já existe e grava. Devolve o arquivo novo. */
function atualizarMonitorShopee_() {
  const agora = Date.now();
  const anterior = lerJson_(ARQUIVO_SHOPEE_) || { atualizado: 0, itens: [] };
  const primeira = !anterior.itens || !anterior.itens.length;
  // Primeira busca: 30 dias de histórico; depois só os últimos 2 dias (o que mudou)
  const janela = primeira ? '30d' : '2d';
  const consultas = TERMOS_SHOPEE_.map(t => '"' + t + '"').concat(BUSCAS_LARGAS_SHOPEE_)
    .map(q => q + ' when:' + janela);

  const novos = [];
  let respostas = [];
  try {
    respostas = UrlFetchApp.fetchAll(consultas.map(q => ({
      url: 'https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      muteHttpExceptions: true
    })));
  } catch (e) {
    Logger.log('Busca Shopee falhou: ' + e.message);
  }
  respostas.forEach((r, k) => {
    if (r.getResponseCode() !== 200) return;
    let itens = [];
    try {
      const ch = XmlService.parse(r.getContentText()).getRootElement().getChild('channel');
      itens = ch ? ch.getChildren('item') : [];
    } catch (e) { return; }
    const termo = k < TERMOS_SHOPEE_.length ? TERMOS_SHOPEE_[k] : '';
    itens.forEach(item => {
      const partes = (item.getChildText('title') || '').split(' - ');
      const fonte = item.getChild('source');
      const veiculo = (fonte && fonte.getText()) || (partes.length > 1 ? partes[partes.length - 1].trim() : 'Imprensa');
      if (partes.length > 1) partes.pop();
      const pub = new Date(item.getChildText('pubDate') || '');
      novos.push({
        titulo: partes.join(' - ').trim(),
        resumo: limparHtml_(item.getChildText('description') || ''),
        link: item.getChildText('link') || '',
        veiculo: veiculo,
        ts: isNaN(pub.getTime()) ? agora : pub.getTime(),
        termo: termo
      });
    });
  });

  // Feeds RSS dos jornais de cada estado que o sistema já leu (cache de 10 min, sem custo extra)
  try {
    Object.keys(ESTADOS_BRASIL_METADATA).forEach(uf => {
      const cache = CacheService.getScriptCache().get('FEEDS_UF_SHOPEE_' + uf);
      if (cache) return; // já olhado há pouco
      let itens = [];
      try { itens = (lerJson_('feeds_itens_' + uf + '.json') || {}).itens || []; } catch (e) { itens = []; }
      itens.forEach(it => {
        const titulo = String(it.t || '');
        const resumo = String(it.r || '');
        if (!/shopee/i.test(titulo + ' ' + resumo)) return;
        novos.push({ titulo: titulo, resumo: limparHtml_(resumo), link: String(it.l || ''),
          veiculo: String(it.v || 'Imprensa'), ts: Number(it.ms) || agora, termo: '' });
      });
      CacheService.getScriptCache().put('FEEDS_UF_SHOPEE_' + uf, '1', 600);
    });
  } catch (e) { Logger.log('Feeds Shopee: ' + e.message); }

  const porLink = {};
  const porAssinatura = {};
  (anterior.itens || []).forEach(i => { porLink[i.link] = i; porAssinatura[chaveTituloShopee_(i.titulo)] = i; });
  const lista = (anterior.itens || []).slice();
  const limite = agora - DIAS_GUARDAR_SHOPEE_ * 86400000;
  novos.forEach(n => {
    if (!n.titulo || !n.link || n.ts < limite) return;
    const texto = n.titulo + '. ' + n.resumo;
    if (!/shopee/i.test(texto)) return; // só o que cita a Shopee de verdade
    const ass = chaveTituloShopee_(n.titulo);
    const igual = porLink[n.link] || porAssinatura[ass];
    if (igual) { if (n.termo && !igual.termo) igual.termo = n.termo; return; }
    const norm = normalizarTexto_(texto);
    const cls = classificarCrimeNLP_(texto);
    const ufs = Object.keys(ufsCitadas_(texto, norm));
    const item = {
      id: gerarHashMD5_(n.link).slice(0, 12),
      titulo: n.titulo,
      resumo: n.resumo.slice(0, 400),
      link: n.link,
      veiculo: n.veiculo,
      ts: n.ts,
      data: Utilities.formatDate(new Date(n.ts), CONFIG.FUSO, 'dd/MM/yyyy HH:mm'),
      // Na primeira busca as notícias antigas não viram "novidade" para ninguém
      achadoEm: primeira ? n.ts : agora,
      termo: n.termo || termoShopeeNoTexto_(norm),
      tipo: tipoShopee_(norm, cls),
      seguranca: !!(cls && cls.valido) || /roub|assalt|furt|polici|pres[oa]|golpe|fraud|baleado|morto|morte|tiro|sequestr|quadrilha|receptac/.test(norm),
      ufs: ufs.slice(0, 3)
    };
    porLink[item.link] = item; porAssinatura[ass] = item;
    lista.push(item);
  });

  const final = lista.filter(i => i.ts >= limite).sort((a, b) => b.ts - a.ts).slice(0, MAX_NOTICIAS_SHOPEE_);
  const dado = { atualizado: agora, itens: final };
  gravarJson_(ARQUIVO_SHOPEE_, dado);
  return dado;
}

/** Mesma manchete em veículos diferentes vira uma notícia só. */
function chaveTituloShopee_(titulo) {
  return Array.from(assinaturaTitulo_(titulo)).sort().join(' ');
}

function termoShopeeNoTexto_(norm) {
  for (let i = 0; i < TERMOS_SHOPEE_.length; i++) {
    if (norm.indexOf(normalizarTexto_(TERMOS_SHOPEE_[i])) !== -1) return TERMOS_SHOPEE_[i];
  }
  return '';
}

/** Rótulo curto para a notificação. */
function tipoShopee_(norm, cls) {
  if (/carga|caminh|carreta|furgao|van\b/.test(norm) && /roub|assalt|furt|desvi/.test(norm)) return 'Roubo de carga';
  if (/(motorista|entregador|driver)/.test(norm) && /(assalt|roub|morto|morte|baleado|agredid|sequestr)/.test(norm)) return 'Motorista/entregador vítima';
  if (/(funcionari|empregad|trabalha)/.test(norm)) return 'Funcionário';
  if (/golpe|fraud|estelionat|falso|falsa|phishing/.test(norm)) return 'Golpe ou fraude';
  if (/furt/.test(norm)) return 'Furto';
  if (/roub|assalt/.test(norm)) return 'Roubo/assalto';
  if (/pres[oa]s?\b|prisao|operacao|policia/.test(norm)) return 'Ação policial';
  if (cls && cls.valido) return 'Segurança';
  return 'Outros assuntos';
}
