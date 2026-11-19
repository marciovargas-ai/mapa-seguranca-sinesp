/**
 * ============================================================================
 * ALERTAS POR E-MAIL (Meus alertas)
 * Cada pessoa (conta @shopee.com) escolhe cidades/estados, temas e frequência no painel.
 * O gatilho alertasEmailGatilho (a cada 15 min) junta o que é novo desde o último envio:
 *  - ocorrências das cidades escolhidas (arquivos cidade_<IBGE>.json / uf_<UF>.json);
 *  - notícias que citam a Shopee (shopee_noticias.json, do 11_Monitor_Shopee);
 *  - avisos do INMET de perigo e grande perigo (16_Avisos_Inmet).
 * Frequências: assim que sair, resumo diário ou resumo semanal (segunda-feira).
 * Envia pelo remetente security.br@shopee.com (alias do Gmail da conta dona do script);
 * sem o alias, envia pela própria conta com o nome "Shopee Security Brasil" e resposta para o remetente.
 * As cidades com alerta entram na fila do robô (roboAtualizacao), que as mantém atualizadas.
 * ============================================================================
 */

const ALERTAS_REMETENTE_PADRAO_ = 'security.br@shopee.com';
const ALERTAS_NOME_ = 'Shopee Security Brasil';
const ALERTAS_URL_PADRAO_ = 'https://sites.google.com/shopee.com/mapadaseguranca';
const ALERTAS_MAX_LOCAIS_ = 25;
const ALERTAS_MAX_ITENS_EMAIL_ = 40;
const ALERTAS_TEMAS_ = {
  CVLI: { nome: 'Homicídio e latrocínio', cor: '#dc2626' },
  CONFRONTO: { nome: 'Tiroteio e arma de fogo', cor: '#ea580c' },
  CARGA: { nome: 'Roubo de carga', cor: '#9333ea' },
  PATRIMONIO: { nome: 'Roubo e furto', cor: '#2563eb' },
  TRAFICO: { nome: 'Tráfico e operação policial', cor: '#0d9488' },
  BLOQUEIO: { nome: 'Distúrbio e bloqueio de via', cor: '#64748b' }
};

/** Nomes em inglês (e-mail com o painel em inglês americano). */
const ALERTAS_TEMAS_EN_ = {
  CVLI: 'Homicide and robbery-murder', CONFRONTO: 'Shootings and firearms', CARGA: 'Cargo theft',
  PATRIMONIO: 'Robbery and theft', TRAFICO: 'Drug trafficking and police operations', BLOQUEIO: 'Unrest and road blockades'
};
const INMET_EVENTOS_EN_ = {
  'tempestade': 'storm', 'chuvas intensas': 'heavy rain', 'acumulado de chuva': 'rain accumulation', 'vendaval': 'windstorm',
  'ventos costeiros': 'coastal winds', 'onda de calor': 'heat wave', 'baixa umidade': 'low humidity', 'declínio de temperatura': 'temperature drop',
  'geada': 'frost', 'perigo potencial': 'potential danger', 'perigo': 'danger', 'grande perigo': 'great danger'
};
/** Texto no idioma do usuário: L_(p, 'português', 'English'). */
function L_(p, pt, en) { return p && p.idioma === 'en' ? en : pt; }
function nomeTemaAlerta_(p, id) {
  return L_(p, (ALERTAS_TEMAS_[id] || {}).nome || id, ALERTAS_TEMAS_EN_[id] || (ALERTAS_TEMAS_[id] || {}).nome || id);
}
function inmetEn_(t) { const k = String(t || '').toLowerCase(); return INMET_EVENTOS_EN_[k] || k; }

/** Município de um local do alerta (cidade, ou a cidade do pino); null para estado inteiro. */
function municipioLocalAlerta_(f) {
  if (!f || f.nome === 'ESTADO_INTEIRO') return null;
  return obterMunicipioBase_(f.uf, f.tipo === 'pino' ? f.cidade : f.nome);
}
function nomeLocalAlerta_(f, p) {
  if (f.tipo === 'pino') return L_(p, 'Pino ', 'Pin ') + '"' + f.nome + '" (' + f.cidade + '/' + f.uf + ')';
  return f.nome === 'ESTADO_INTEIRO' ? nomeUfAlerta_(f.uf) : f.nome + '/' + f.uf;
}
/** Pino com prazo de monitoramento vencido não gera mais alerta. */
function pinoVencido_(f) { return f && f.tipo === 'pino' && f.ate && f.ate < Date.now(); }

function chaveAlerta_(email) { return 'ALERTA::' + email; }
function chaveAlertaEnviados_(email) { return 'ALERTA_ENV::' + email; }

function lerIndiceAlertas_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('ALERTA_INDICE') || '[]'); } catch (e) { return []; }
}

function remetenteAlertas_() {
  return String(PropertiesService.getScriptProperties().getProperty('ALERTAS_REMETENTE') || ALERTAS_REMETENTE_PADRAO_).trim();
}

function urlPainelAlertas_() {
  return String(PropertiesService.getScriptProperties().getProperty('MAPA_URL_PAINEL') || ALERTAS_URL_PADRAO_);
}

function limparPreferenciasAlerta_(p, anterior) {
  p = p || {};
  const temas = (Array.isArray(p.temas) ? p.temas : []).filter(t => ALERTAS_TEMAS_[t]);
  return {
    ativo: !!p.ativo,
    locais: limparFavoritos_(p.locais).slice(0, ALERTAS_MAX_LOCAIS_),
    temas: temas,
    shopee: !!p.shopee,
    shopeeEscopo: p.shopeeEscopo === 'brasil' ? 'brasil' : 'locais',
    shopeeSoSeguranca: p.shopeeSoSeguranca !== false,
    inmet: p.inmet !== false,
    frequencia: p.frequencia === 'diario' || p.frequencia === 'semanal' ? p.frequencia : 'imediato',
    hora: Math.max(5, Math.min(22, Number(p.hora) || 7)),
    idioma: p.idioma === 'en' ? 'en' : 'pt',
    criado: (anterior && anterior.criado) || Date.now(),
    ultimoEnvio: (anterior && anterior.ultimoEnvio) || Date.now(),
    ultimoDiario: (anterior && anterior.ultimoDiario) || '',
    ultimoSemanal: (anterior && anterior.ultimoSemanal) || ''
  };
}

function lerPreferenciasAlerta_(email) {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(chaveAlerta_(email)) || 'null'); } catch (e) { return null; }
}

function gravarPreferenciasAlerta_(email, prefs) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty(chaveAlerta_(email), JSON.stringify(prefs));
  const indice = lerIndiceAlertas_();
  if (indice.indexOf(email) === -1) { indice.push(email); props.setProperty('ALERTA_INDICE', JSON.stringify(indice)); }
}

/** Painel: quando o usuário troca o idioma, os próximos e-mails saem no idioma novo (se ele tiver alertas). */
function definirIdiomaAlertas(idioma) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false };
  const p = lerPreferenciasAlerta_(conta);
  if (!p) return { ok: true };
  p.idioma = idioma === 'en' ? 'en' : 'pt';
  gravarPreferenciasAlerta_(conta, p);
  return { ok: true };
}

/** Painel: preferências do usuário logado. */
function obterAlertas() {
  const conta = contaFavoritos_();
  const temas = Object.keys(ALERTAS_TEMAS_).map(id => ({ id: id, nome: ALERTAS_TEMAS_[id].nome }));
  if (!conta) return { ok: true, conta: '', prefs: null, temas: temas, remetente: remetenteAlertas_() };
  return { ok: true, conta: conta, prefs: lerPreferenciasAlerta_(conta), temas: temas, remetente: remetenteAlertas_() };
}

/** Painel: grava as preferências e garante o gatilho dos alertas. */
function salvarAlertas(prefs) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, erro: 'Os alertas por e-mail precisam da conta @shopee.com (implantação "Qualquer pessoa em shopee.com").' };
  const limpa = limparPreferenciasAlerta_(prefs, lerPreferenciasAlerta_(conta));
  gravarPreferenciasAlerta_(conta, limpa);
  if (limpa.ativo) {
    garantirGatilhoAlertas_();
    limpa.locais.forEach(f => { const mun = municipioLocalAlerta_(f); if (mun) registrarConsulta_(mun); });
  }
  return { ok: true, prefs: limpa };
}

/** Painel: manda agora um e-mail de exemplo com o que saiu nos últimos 7 dias nos locais escolhidos. */
function testarAlertas(prefs) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, erro: 'Sem conta @shopee.com identificada.' };
  const p = limparPreferenciasAlerta_(prefs, lerPreferenciasAlerta_(conta));
  const desde = Date.now() - 7 * 86400000;
  const blocos = juntarNovidadesAlerta_(p, desde, {});
  const via = enviarEmailAlerta_(conta, p, blocos, true);
  return { ok: true, para: conta, itens: contarItensBlocos_(blocos), via: via };
}

function garantirGatilhoAlertas_() {
  try {
    const existe = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'alertasEmailGatilho');
    if (!existe) ScriptApp.newTrigger('alertasEmailGatilho').timeBased().everyMinutes(15).create();
  } catch (e) { Logger.log('Gatilho dos alertas não criado: ' + e.message); }
}

/** Rode uma vez no editor, se preferir ativar à mão. */
function ativarAlertasEmail() { garantirGatilhoAlertas_(); }
function desativarAlertasEmail() {
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'alertasEmailGatilho') ScriptApp.deleteTrigger(t); });
}

/** Gatilho (15 min): envia a cada pessoa o que é novo nos locais e temas dela. */
function alertasEmailGatilho() {
  if (!pegarTravaTarefa_('alertas', 900)) return;
  try {
    const agora = Date.now();
    const hoje = Utilities.formatDate(new Date(), CONFIG.FUSO, 'yyyy-MM-dd');
    const hora = Number(Utilities.formatDate(new Date(), CONFIG.FUSO, 'H'));
    const segunda = Utilities.formatDate(new Date(), CONFIG.FUSO, 'u') === '1';
    const cache = {};
    lerIndiceAlertas_().forEach(email => {
      const p = lerPreferenciasAlerta_(email);
      if (!p || !p.ativo || (!p.locais.length && !p.shopee)) return;
      manterCidadesNoRobo_(p);
      if (p.frequencia === 'diario' && (hora < p.hora || p.ultimoDiario === hoje)) return;
      if (p.frequencia === 'semanal' && (!segunda || hora < p.hora || p.ultimoSemanal === hoje)) return;
      const desde = Math.max(p.ultimoEnvio || 0, p.criado || 0, agora - (p.frequencia === 'semanal' ? 7 : 3) * 86400000);
      const enviados = lerEnviadosAlerta_(email);
      const blocos = juntarNovidadesAlerta_(p, desde, cache, enviados);
      const total = contarItensBlocos_(blocos);
      if (p.frequencia === 'diario') p.ultimoDiario = hoje;
      if (p.frequencia === 'semanal') p.ultimoSemanal = hoje;
      if (total) {
        if (MailApp.getRemainingDailyQuota() < 1) return;
        enviarEmailAlerta_(email, p, blocos, false);
        blocos.forEach(b => b.itens.forEach(i => enviados.push(i.id)));
        gravarEnviadosAlerta_(email, enviados);
      }
      p.ultimoEnvio = agora;
      PropertiesService.getScriptProperties().setProperty(chaveAlerta_(email), JSON.stringify(p));
    });
  } finally {
    soltarTravaTarefa_('alertas');
  }
}

function manterCidadesNoRobo_(p) {
  const cache = CacheService.getScriptCache();
  p.locais.forEach(f => {
    if (pinoVencido_(f)) return;
    const mun = municipioLocalAlerta_(f);
    if (!mun || cache.get('ALERTA_ROBO|' + mun.ibge)) return;
    cache.put('ALERTA_ROBO|' + mun.ibge, '1', 21600);
    registrarConsulta_(mun);
  });
}

function lerEnviadosAlerta_(email) {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(chaveAlertaEnviados_(email)) || '[]'); } catch (e) { return []; }
}
function gravarEnviadosAlerta_(email, lista) {
  PropertiesService.getScriptProperties().setProperty(chaveAlertaEnviados_(email), JSON.stringify(lista.slice(-350)));
}

function contarItensBlocos_(blocos) { return blocos.reduce((s, b) => s + b.itens.length, 0); }

/** Monta os blocos do e-mail: um por local escolhido e um da Shopee. */
function juntarNovidadesAlerta_(p, desde, cache, enviados) {
  const ja = new Set(enviados || []);
  const temas = new Set(p.temas);
  const limiteData = Utilities.formatDate(new Date(desde - 86400000), CONFIG.FUSO, 'yyyy-MM-dd');
  const blocos = [];
  const ler = nome => (nome in cache ? cache[nome] : (cache[nome] = lerJson_(nome)));
  // Unidades Shopee com endereço exato: o alerta diz quando a ocorrência foi a menos de 3 km de uma delas
  if (!cache.__unidades) {
    try { cache.__unidades = ((obterUnidadesShopee() || {}).unidades || []).filter(u => u.origem === 'planilha' && !/closed|cancel/i.test(u.status || '')); }
    catch (e) { cache.__unidades = []; }
  }
  const unidades = cache.__unidades;
  const novo = (o, ehUf) => temas.has(o.c) && !ja.has(o.id) && String(o.d || '') >= limiteData && (ehUf || !o.m || o.m > desde) && !ehNoticiaPolitica_(o.t || '');

  p.locais.forEach(f => {
    if (!temas.size || pinoVencido_(f)) return;
    let itens = [];
    if (f.tipo === 'pino') {
      // Pino: só ocorrências com local preciso dentro do raio (padrão 1 km)
      const mun = municipioLocalAlerta_(f);
      const reg = mun ? ler(nomeArquivoCidade_(mun.ibge)) : null;
      const raio = f.raio || 1;
      ((reg && reg.ocorrencias) || []).forEach(o => {
        if (!novo(o, false) || !o.lat || !o.lng || !PRECISOES_NO_MAPA_.has(o.p)) return;
        if (Math.abs(o.lat - f.lat) > 0.1 || Math.abs(o.lng - f.lng) > 0.1) return;
        const d = distanciaKm_(o.lat, o.lng, f.lat, f.lng);
        if (d > raio) return;
        const it = itemAlerta_(o, mun.nome, unidades, p);
        it.local = [L_(p, 'A ', '') + String(Math.round(d * 10) / 10).replace('.', L_(p, ',', '.')) + L_(p, ' km do pino', ' km from the pin'), it.local].filter(Boolean).join(' · ');
        itens.push(it);
      });
    } else if (f.nome === 'ESTADO_INTEIRO') {
      const resumo = ler(nomeArquivoUf_(f.uf));
      Object.keys((resumo && resumo.cidades) || {}).forEach(ibge => {
        const c = resumo.cidades[ibge];
        (c.ocorrencias || []).forEach(o => { if (novo(o, true)) itens.push(itemAlerta_(o, c.cidade, unidades, p)); });
      });
    } else {
      const mun = municipioLocalAlerta_(f);
      const reg = mun ? ler(nomeArquivoCidade_(mun.ibge)) : null;
      ((reg && reg.ocorrencias) || []).forEach(o => { if (novo(o, false)) itens.push(itemAlerta_(o, mun.nome, unidades, p)); });
    }
    // Primeiro o que aconteceu perto de unidade Shopee, depois por gravidade e data
    itens.sort((a, b) => ((a.unidade ? 0 : 1) - (b.unidade ? 0 : 1)) || (ALERTAS_ORDEM_[a.tema] - ALERTAS_ORDEM_[b.tema]) || (b.data < a.data ? -1 : 1));
    const porTema = {};
    itens.forEach(i => { porTema[i.tema] = (porTema[i.tema] || 0) + 1; });
    const max = p.frequencia === 'semanal' ? 20 : 15;
    const titulo = f.tipo === 'pino'
      ? L_(p, 'Pino ', 'Pin ') + '"' + f.nome + '" · ' + f.cidade + '/' + f.uf + L_(p, ' · raio de ', ' · ') + String(f.raio || 1).replace('.', L_(p, ',', '.')) + L_(p, ' km', ' km radius')
      : f.nome === 'ESTADO_INTEIRO' ? L_(p, 'Estado: ', 'State: ') + nomeUfAlerta_(f.uf) : f.nome + ' (' + f.uf + ')';
    if (itens.length) blocos.push({ titulo: titulo, itens: itens.slice(0, max), total: itens.length, porTema: porTema });
  });

  // Avisos do INMET (perigo e grande perigo) que atingem os locais escolhidos
  if (p.inmet !== false && p.locais.length) {
    if (!cache.__inmet) { try { cache.__inmet = atualizarAvisosInmet_(false); } catch (e) { cache.__inmet = { avisos: [] }; } }
    const itens = [];
    (cache.__inmet.avisos || []).forEach(a => {
      if (a.nivel < 2 || ja.has('inmet' + a.id) || (a.fim && a.fim < Date.now())) return;
      const nomes = p.locais.filter(f => {
        if (pinoVencido_(f)) return false;
        const mun = municipioLocalAlerta_(f);
        return avisosInmetDoLocal_({ avisos: [a] }, f.uf, mun ? mun.ibge : '').length > 0;
      }).map(f => nomeLocalAlerta_(f, p));
      if (!nomes.length) return;
      const quando = t => (t ? Utilities.formatDate(new Date(t), CONFIG.FUSO, L_(p, "dd/MM HH'h'mm", 'MM/dd HH:mm')) : '');
      itens.push({ id: 'inmet' + a.id, tema: 'INMET', rotulo: 'INMET · ' + L_(p, a.grau, inmetEn_(a.grau)), cor: a.cor || '#F57C00',
        titulo: L_(p, 'Aviso de ' + String(a.evento || '').toLowerCase() + ' (' + String(a.grau || '').toLowerCase() + ')',
          'Warning: ' + inmetEn_(a.evento) + ' (' + inmetEn_(a.grau) + ')'),
        link: a.link, veiculo: 'INMET', data: [quando(a.inicio), quando(a.fim)].filter(Boolean).join(L_(p, ' a ', ' to ')), local: juntarComE_(nomes, p) });
    });
    if (itens.length) blocos.push({ titulo: L_(p, 'Avisos do INMET', 'INMET weather warnings'), itens: itens.slice(0, 6), inmet: true });
  }

  if (p.shopee) {
    const ufs = new Set(p.locais.map(f => f.uf));
    const dado = ler(ARQUIVO_SHOPEE_);
    const itens = ((dado && dado.itens) || []).filter(i =>
      ehNoticiaDaShopee_(i.titulo, i.resumo) && !ja.has(i.id) && (i.achadoEm || 0) > desde &&
      (!p.shopeeSoSeguranca || i.seguranca) &&
      (p.shopeeEscopo === 'brasil' || !i.ufs || !i.ufs.length || i.ufs.some(u => ufs.has(u))))
      .slice(0, 15)
      .map(i => ({ id: i.id, tema: 'SHOPEE', rotulo: i.tipo || 'Shopee', cor: '#EE4D2D', titulo: i.titulo, link: i.link, veiculo: i.veiculo, data: i.data || '', local: (i.ufs || []).join(', ') }));
    if (itens.length) blocos.push({ titulo: L_(p, 'Shopee nas notícias', 'Shopee in the news'), itens: itens, shopee: true });
  }

  // Limite total por e-mail
  let resto = ALERTAS_MAX_ITENS_EMAIL_;
  blocos.forEach(b => { b.itens = b.itens.slice(0, Math.max(0, resto)); resto -= b.itens.length; });
  return blocos.filter(b => b.itens.length);
}

const ALERTAS_ORDEM_ = { CVLI: 0, CONFRONTO: 1, CARGA: 2, PATRIMONIO: 3, TRAFICO: 4, BLOQUEIO: 5, SHOPEE: 6, INMET: 7 };

const ALERTAS_RAIO_UNIDADE_KM_ = 3;

/** Unidade Shopee mais próxima a até 3 km da ocorrência (só ocorrências com local preciso). */
function unidadeProximaAlerta_(o, unidades, p) {
  if (!unidades || !unidades.length || !o.lat || !o.lng || !PRECISOES_NO_MAPA_.has(o.p)) return '';
  let melhor = null, dist = ALERTAS_RAIO_UNIDADE_KM_;
  unidades.forEach(u => {
    if (Math.abs(u.lat - o.lat) > 0.05 || Math.abs(u.lng - o.lng) > 0.05) return;
    const d = distanciaKm_(o.lat, o.lng, u.lat, u.lng);
    if (d <= dist) { dist = d; melhor = u; }
  });
  if (!melhor) return '';
  const km = String(Math.round(dist * 10) / 10);
  return L_(p, 'A ' + km.replace('.', ',') + ' km da unidade ', km + ' km from site ') + melhor.codigo + (melhor.nome ? ' · ' + melhor.nome : '');
}

function itemAlerta_(o, cidade, unidades, p) {
  const t = ALERTAS_TEMAS_[o.c] || { nome: o.c, cor: '#64748b' };
  const en = p && p.idioma === 'en';
  const partes = String(o.d || '').split('-');
  return { id: o.id, tema: o.c, rotulo: nomeTemaAlerta_(p, o.c), cor: t.cor, titulo: o.t, link: o.u, veiculo: o.v, unidade: unidadeProximaAlerta_(o, unidades, p),
    data: partes.length === 3 ? (en ? partes[1] + '/' + partes[2] + '/' + partes[0] : partes[2] + '/' + partes[1] + '/' + partes[0]) : '',
    local: [o.b ? (en ? 'Neighborhood ' : 'Bairro ') + o.b : '', cidade].filter(Boolean).join(' · ') };
}

function nomeUfAlerta_(uf) {
  try { return (ESTADOS_BRASIL_METADATA[uf] && ESTADOS_BRASIL_METADATA[uf].nome) || uf; } catch (e) { return uf; }
}

function juntarComE_(l, p) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + L_(p, ' e ', ' and ') + l[l.length - 1]; }

function escAlerta_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function linkSeguroAlerta_(u) { return /^https?:\/\//i.test(String(u || '')) ? String(u) : ''; }

/** E-mail em HTML com tabelas e estilos embutidos (abre bem no Gmail, Outlook e celular). */
function montarEmailAlerta_(p, blocos, teste) {
  const total = contarItensBlocos_(blocos);
  const en = p.idioma === 'en';
  const quando = Utilities.formatDate(new Date(), CONFIG.FUSO, en ? "MM/dd/yyyy 'at' HH:mm" : "dd/MM/yyyy 'às' HH:mm");
  const titulo = teste ? L_(p, 'E-mail de teste dos seus alertas', 'Test email for your alerts')
    : p.frequencia === 'diario' ? L_(p, 'Resumo diário de segurança', 'Daily security summary')
    : p.frequencia === 'semanal' ? L_(p, 'Resumo semanal de segurança', 'Weekly security summary') : L_(p, 'Novo alerta de segurança', 'New security alert');
  const resumo = total
    ? total + (total === 1 ? L_(p, ' novidade: ', ' update: ') : L_(p, ' novidades: ', ' updates: ')) + juntarComE_(blocos.map(b => (b.total || b.itens.length) +
      (b.shopee ? L_(p, ' sobre a Shopee', ' about Shopee') : b.inmet ? (b.itens.length === 1 ? L_(p, ' aviso do INMET', ' INMET warning') : L_(p, ' avisos do INMET', ' INMET warnings')) : L_(p, ' em ', ' in ') + b.titulo)), p)
    : L_(p, 'Nada novo nos locais e temas escolhidos', 'Nothing new in the chosen places and topics') + (teste ? L_(p, ' nos últimos 7 dias.', ' in the last 7 days.') : '.');
  const url = urlPainelAlertas_();

  const linhas = blocos.map(b => {
    const itens = b.itens.map(i => {
      const link = linkSeguroAlerta_(i.link);
      const tituloItem = link ? '<a href="' + escAlerta_(link) + '" style="color:#1f2937;text-decoration:none;font-weight:600">' + escAlerta_(i.titulo) + '</a>' : '<span style="font-weight:600">' + escAlerta_(i.titulo) + '</span>';
      return '<tr><td style="padding:12px 0;border-bottom:1px solid #eef0f3">' +
        '<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:' + i.cor + ';color:#fff;font-size:11px;font-weight:700;letter-spacing:.2px">' + escAlerta_(i.rotulo) + '</span>' +
        '<div style="margin-top:6px;font-size:15px;line-height:1.4">' + tituloItem + '</div>' +
        '<div style="margin-top:4px;font-size:12px;color:#6b7280">' + escAlerta_([i.veiculo, i.data, i.local].filter(Boolean).join(' · ')) + '</div>' +
        (i.unidade ? '<div style="margin-top:6px;display:inline-block;padding:3px 8px;border-radius:6px;background:#FDE7E2;color:#B3261E;font-size:12px;font-weight:700">' + escAlerta_(i.unidade) + '</div>' : '') +
        '</td></tr>';
    }).join('');
    const contagem = b.porTema && (p.frequencia !== 'imediato' || b.total > b.itens.length)
      ? '<div style="margin-top:4px;font-size:12px;color:#6b7280">' + escAlerta_((b.total > b.itens.length ? b.total + L_(p, ' no período, as ' + b.itens.length + ' mais relevantes abaixo: ', ' in the period, the ' + b.itens.length + ' most relevant below: ') : '') +
        Object.keys(b.porTema).sort((x, y) => ALERTAS_ORDEM_[x] - ALERTAS_ORDEM_[y]).map(t => b.porTema[t] + ' ' + nomeTemaAlerta_(p, t).toLowerCase()).join(', ')) + '</div>' : '';
    return '<tr><td style="padding:20px 28px 4px"><div style="font-size:13px;font-weight:700;color:' + (b.shopee ? '#EE4D2D' : '#113366') + ';text-transform:uppercase;letter-spacing:.6px">' + escAlerta_(b.titulo) + ' (' + (b.total || b.itens.length) + ')</div>' + contagem +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + itens + '</table></td></tr>';
  }).join('');

  const temas = p.temas.map(t => nomeTemaAlerta_(p, t)).join(', ') || L_(p, 'nenhum tema de ocorrência', 'no incident topic');
  const locais = p.locais.filter(f => !pinoVencido_(f)).map(f => nomeLocalAlerta_(f, p)).join(', ') || L_(p, 'nenhum local', 'no place');

  const html = '<!doctype html><html lang="' + L_(p, 'pt-BR', 'en-US') + '"><body style="margin:0;padding:0;background:#f3f4f6;font-family:Roboto,Arial,Helvetica,sans-serif;color:#1f2937">' +
    '<div style="display:none;max-height:0;overflow:hidden">' + escAlerta_(resumo) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6"><tr><td align="center" style="padding:24px 12px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)">' +
    '<tr><td style="background:#EE4D2D;padding:20px 28px">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
      '<td style="width:44px"><div style="width:40px;height:40px;border-radius:10px;background:#ffffff;color:#EE4D2D;font:900 24px/40px Arial,sans-serif;text-align:center">S</div></td>' +
      '<td style="padding-left:12px;color:#ffffff"><div style="font-size:12px;letter-spacing:.8px;text-transform:uppercase;opacity:.9">Shopee Security Brasil</div>' +
      '<div style="font-size:20px;font-weight:700;margin-top:2px">' + escAlerta_(titulo) + '</div></td></tr></table>' +
    '</td></tr>' +
    '<tr><td style="padding:20px 28px 0"><div style="font-size:14px;color:#374151;line-height:1.5">' + escAlerta_(resumo) + '</div>' +
      '<div style="font-size:12px;color:#9ca3af;margin-top:4px">' + L_(p, 'Mapa da Segurança', 'Security Map') + ' · ' + escAlerta_(quando) + '</div></td></tr>' +
    linhas +
    '<tr><td align="center" style="padding:24px 28px 8px"><a href="' + escAlerta_(url) + '" style="display:inline-block;background:#EE4D2D;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px">' + L_(p, 'Abrir o Mapa da Segurança', 'Open the Security Map') + '</a></td></tr>' +
    '<tr><td style="padding:16px 28px 24px;font-size:11px;line-height:1.6;color:#9ca3af;border-top:1px solid #eef0f3">' +
      (en
        ? 'You receive this email because you turned on alerts in the Security Map. Places: ' + escAlerta_(locais) + '. Topics: ' + escAlerta_(temas) + (p.shopee ? '; Shopee news' : '') + (p.inmet !== false ? '; INMET warnings' : '') + '. ' +
          'To change or cancel, open the dashboard and click <b>My email alerts</b>.<br>' +
          'News comes from public sources and is supplementary; the official statistics are from Sinesp/MJSP. For internal Shopee use only: do not forward outside the company.'
        : 'Você recebe este e-mail porque ativou os alertas no Mapa da Segurança. Locais: ' + escAlerta_(locais) + '. Temas: ' + escAlerta_(temas) + (p.shopee ? '; notícias da Shopee' : '') + (p.inmet !== false ? '; avisos do INMET' : '') + '. ' +
          'Para mudar ou cancelar, abra o painel e clique em <b>Meus alertas</b>.<br>' +
          'Notícias são fontes públicas e servem de complemento; a estatística oficial é a do Sinesp/MJSP. Uso interno da Shopee: não encaminhe para fora da empresa.') +
    '</td></tr></table></td></tr></table></body></html>';

  const texto = titulo + '\n' + resumo + '\n\n' + blocos.map(b => b.titulo + '\n' + b.itens.map(i => '- [' + i.rotulo + '] ' + i.titulo + ' (' + [i.veiculo, i.data, i.local, i.unidade].filter(Boolean).join(' · ') + ') ' + (i.link || '')).join('\n')).join('\n\n') +
    L_(p, '\n\nAbrir o Mapa da Segurança: ', '\n\nOpen the Security Map: ') + url + L_(p, '\nPara mudar ou cancelar: painel → Meus alertas.', '\nTo change or cancel: dashboard → My email alerts.');
  const assunto = (teste ? L_(p, '[Teste] ', '[Test] ') : '') + (total ? L_(p, '[Alerta] ', '[Alert] ') + resumo : titulo + ' — ' + L_(p, 'Mapa da Segurança', 'Security Map'));
  return { assunto: assunto.slice(0, 180), html: html, texto: texto };
}

/** Envia pelo alias security.br@shopee.com quando ele existe na conta; senão, pela conta do script com o mesmo nome. */
function enviarEmailAlerta_(para, p, blocos, teste) {
  const m = montarEmailAlerta_(p, blocos, teste);
  const remetente = remetenteAlertas_();
  try {
    const efetivo = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
    if (efetivo === remetente.toLowerCase()) {
      MailApp.sendEmail({ to: para, subject: m.assunto, body: m.texto, htmlBody: m.html, name: ALERTAS_NOME_ });
      return 'remetente';
    }
    if (GmailApp.getAliases().map(a => a.toLowerCase()).indexOf(remetente.toLowerCase()) !== -1) {
      GmailApp.sendEmail(para, m.assunto, m.texto, { htmlBody: m.html, from: remetente, name: ALERTAS_NOME_, replyTo: remetente });
      return 'remetente';
    }
  } catch (e) {
    Logger.log('Remetente ' + remetente + ' indisponível: ' + e.message);
  }
  MailApp.sendEmail({ to: para, subject: m.assunto, body: m.texto, htmlBody: m.html, name: ALERTAS_NOME_, replyTo: remetente });
  return 'reserva';
}
