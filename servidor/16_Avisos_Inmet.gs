/**
 * ============================================================================
 * ARQUIVO 16: 16_Avisos_Inmet.gs — Avisos meteorológicos do INMET
 * ============================================================================
 * Lê o RSS público de avisos do INMET (apiprevmet3.inmet.gov.br/avisos/rss) e,
 * para cada aviso ainda válido, o CAP do aviso, que traz a lista de municípios
 * com código IBGE. Guarda tudo em avisos_inmet.json (pasta de dados) e renova a
 * cada 30 minutos, só quando alguém abre o painel ou o gatilho dos alertas roda.
 * O painel mostra uma faixa quando o local aberto está sob aviso; os alertas por
 * e-mail avisam os de perigo (laranja) e grande perigo (vermelho).
 * ============================================================================
 */

const ARQUIVO_INMET_ = 'avisos_inmet.json';
const INMET_RSS_ = 'https://apiprevmet3.inmet.gov.br/avisos/rss';
const INMET_VALIDADE_MS_ = 30 * 60000;
const INMET_NIVEIS_ = { 'perigo potencial': 1, 'perigo': 2, 'grande perigo': 3 };
const INMET_CORES_ = { 1: '#E6B800', 2: '#F57C00', 3: '#C62828' };

/** Lê o arquivo e renova se tiver mais de 30 minutos. Nunca lança erro: em falha, devolve o que havia. */
function atualizarAvisosInmet_(forcar) {
  const atual = lerJson_(ARQUIVO_INMET_) || { atualizado: 0, avisos: [] };
  if (!forcar && Date.now() - (atual.atualizado || 0) < INMET_VALIDADE_MS_) return atual;
  if (!pegarTravaTarefa_('inmet', 180)) return atual;
  try {
    const agora = Date.now();
    const resp = UrlFetchApp.fetch(INMET_RSS_, { muteHttpExceptions: true, followRedirects: true });
    if (resp.getResponseCode() !== 200) throw new Error('RSS do INMET respondeu ' + resp.getResponseCode());
    const canal = XmlService.parse(resp.getContentText()).getRootElement().getChild('channel');
    const anteriores = {};
    (atual.avisos || []).forEach(a => { anteriores[a.id] = a; });
    const validos = [], buscar = [];
    (canal ? canal.getChildren('item') : []).forEach(it => {
      const link = String(it.getChildText('link') || it.getChildText('guid') || '').trim();
      const id = (link.match(/(\d+)\s*$/) || [])[1];
      if (!id) return;
      const titulo = String(it.getChildText('title') || '');
      const texto = limparHtml_(String(it.getChildText('description') || '')).replace(/\s+/g, ' ');
      const fim = dataInmet_((texto.match(/Fim\s*:?\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/) || [])[1]);
      if (fim && fim < agora) return;
      if (anteriores[id]) { validos.push(anteriores[id]); return; }
      const grau = String((titulo.match(/Grau:\s*(.+)$/i) || [])[1] || (texto.match(/Severidade\s*:?\s*(Grande Perigo|Perigo Potencial|Perigo)/i) || [])[1] || '').trim();
      buscar.push({
        id: id, link: link, grau: grau,
        evento: String((texto.match(/Evento\s*:?\s*(.+?)\s+Severidade/i) || [])[1] || titulo.replace(/^Aviso de\s*/i, '').replace(/\..*$/, '')).trim(),
        inicio: dataInmet_((texto.match(/In[ií]cio\s*:?\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/) || [])[1]),
        fim: fim,
        descricao: String((texto.match(/Descri[cç][aã]o\s*:?\s*(.+?)\s+[ÁA]rea\s*:/i) || [])[1] || '').trim().slice(0, 400)
      });
    });
    // CAP de cada aviso novo, em lotes paralelos (municípios com código IBGE)
    for (let i = 0; i < buscar.length; i += 20) {
      const lote = buscar.slice(i, i + 20);
      let respostas = [];
      try { respostas = UrlFetchApp.fetchAll(lote.map(a => ({ url: a.link, muteHttpExceptions: true }))); } catch (e) { respostas = []; }
      lote.forEach((a, j) => {
        const r = respostas[j];
        const cap = r && r.getResponseCode() === 200 ? lerCapInmet_(r.getContentText()) : null;
        if (!cap || !cap.mun) return;
        const nivel = INMET_NIVEIS_[normalizarTexto_(a.grau)] || cap.nivel || 1;
        validos.push({
          id: a.id, evento: a.evento || cap.evento, grau: a.grau || ['', 'Perigo potencial', 'Perigo', 'Grande perigo'][nivel], nivel: nivel,
          cor: INMET_CORES_[nivel], inicio: a.inicio || cap.inicio, fim: a.fim || cap.fim, descricao: a.descricao || cap.descricao,
          link: 'https://avisos.inmet.gov.br/' + a.id, ufs: cap.ufs, porUf: cap.porUf, mun: cap.mun
        });
      });
    }
    validos.sort((a, b) => (b.nivel - a.nivel) || (a.inicio - b.inicio));
    const novo = { atualizado: agora, fonte: 'INMET, avisos meteorológicos (RSS/CAP)', avisos: validos };
    gravarJson_(ARQUIVO_INMET_, novo);
    return novo;
  } catch (e) {
    Logger.log('Avisos do INMET: ' + e.message);
    // Tenta de novo em 10 minutos, sem perder os avisos que já havia
    const volta = { atualizado: Date.now() - INMET_VALIDADE_MS_ + 10 * 60000, fonte: atual.fonte, avisos: (atual.avisos || []).filter(a => !a.fim || a.fim > Date.now()), erro: e.message };
    try { gravarJson_(ARQUIVO_INMET_, volta); } catch (e2) {}
    return volta;
  } finally {
    soltarTravaTarefa_('inmet');
  }
}

/** "2026-11-19 23:59" (hora de Brasília) em milissegundos. */
function dataInmet_(t) {
  if (!t) return 0;
  const d = new Date(String(t).replace(' ', 'T') + ':00-03:00');
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

/** Lê o CAP 1.2 do aviso: evento, severidade, datas e a lista "Município - UF (IBGE)". */
function lerCapInmet_(xml) {
  try {
    const raiz = XmlService.parse(xml).getRootElement();
    const ns = raiz.getNamespace();
    const info = raiz.getChild('info', ns);
    if (!info) return null;
    const params = {};
    info.getChildren('parameter', ns).forEach(p => { params[p.getChildText('valueName', ns)] = p.getChildText('value', ns); });
    const textoMun = String(params.Municipios || '');
    const mun = [], porUf = {};
    const re = /-\s*([A-Z]{2})\s*\((\d{7})\)/g;
    let m;
    while ((m = re.exec(textoMun))) { mun.push(m[2]); porUf[m[1]] = (porUf[m[1]] || 0) + 1; }
    const sev = String(info.getChildText('severity', ns) || '');
    const nivel = /extreme|severe/i.test(sev) ? (/extreme/i.test(sev) ? 3 : 2) : 1;
    const seg = n => (Number(n) > 0 ? Number(n) * 1000 : 0);
    return {
      evento: String(info.getChildText('event', ns) || ''), nivel: nivel,
      inicio: seg(params.TimeStampDateOnSet) || Date.parse(info.getChildText('onset', ns) || '') || 0,
      fim: seg(params.TimeStampDateExpires) || Date.parse(info.getChildText('expires', ns) || '') || 0,
      descricao: String(info.getChildText('description', ns) || '').slice(0, 400),
      ufs: Object.keys(porUf), porUf: porUf, mun: mun.join(',')
    };
  } catch (e) {
    return null;
  }
}

/** Avisos válidos que atingem o município (código IBGE de 7 dígitos) ou, sem município, o estado. */
function avisosInmetDoLocal_(dado, uf, ibge) {
  const agora = Date.now();
  const sigla = String(uf || '').toUpperCase();
  const cod = String(ibge || '');
  return ((dado && dado.avisos) || []).filter(a =>
    (!a.fim || a.fim > agora) && (cod.length === 7 ? (',' + a.mun + ',').indexOf(',' + cod + ',') !== -1 : (a.ufs || []).indexOf(sigla) !== -1));
}

/** Painel: avisos do INMET em vigor (ou que começam em breve) para a cidade ou o estado aberto. */
function obterAvisosInmet(uf, ibge) {
  const dado = atualizarAvisosInmet_(false);
  const sigla = String(uf || '').toUpperCase();
  const lista = avisosInmetDoLocal_(dado, sigla, ibge).slice(0, 8).map(a => ({
    id: a.id, evento: a.evento, grau: a.grau, nivel: a.nivel, cor: a.cor, inicio: a.inicio, fim: a.fim,
    descricao: a.descricao, link: a.link, municipiosNoEstado: (a.porUf || {})[sigla] || 0
  }));
  return { ok: true, atualizado: dado.atualizado || 0, avisos: lista, erro: dado.erro || '' };
}
