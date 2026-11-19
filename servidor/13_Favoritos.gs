/**
 * Favoritos de cada usuário (cidades e estados salvos, e pinos de endereço/CEP/coordenada com nome próprio).
 * Pino: { tipo: 'pino', id, nome (dado pela pessoa), uf, cidade, endereco, lat, lng, raio (km), por (e-mail de quem
 * criou), em (data), alerta (monitorado por e-mail), ate (fim do monitoramento; 0 = sem prazo) }.
 *
 * Com a implantação em "Executar como: eu" e "Quem pode acessar: qualquer pessoa em shopee.com",
 * o Google exige a conta da Shopee e Session.getActiveUser() devolve o e-mail de quem está usando:
 * os favoritos ficam guardados no servidor e acompanham a pessoa em qualquer aparelho.
 * Sem e-mail (implantação aberta a qualquer pessoa), devolve conta vazia e o painel guarda no navegador.
 */

const MAX_FAVORITOS_ = 60;
const DOMINIO_FAVORITOS_ = 'shopee.com';

function contaFavoritos_() {
  let email = '';
  try { email = String(Session.getActiveUser().getEmail() || '').toLowerCase().trim(); } catch (e) { email = ''; }
  if (!email || email.split('@')[1] !== DOMINIO_FAVORITOS_) return '';
  return email;
}

function chaveFavoritos_(email) {
  return 'FAV::' + email;
}

function limparPino_(f) {
  const lat = Number(f.lat), lng = Number(f.lng);
  if (!isFinite(lat) || !isFinite(lng) || lat < -34.5 || lat > 6 || lng < -74.5 || lng > -28) return null;
  const uf = String(f.uf || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
  const nome = String(f.nome || '').replace(/[<>]/g, '').trim().slice(0, 60);
  if (uf.length !== 2 || !nome) return null;
  const txt = (v, n) => String(v || '').replace(/[<>]/g, '').trim().slice(0, n);
  return {
    tipo: 'pino', id: String(f.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 24) || ('p' + Date.now().toString(36)),
    nome: nome, uf: uf, cidade: txt(f.cidade, 80), endereco: txt(f.endereco, 160),
    lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6, raio: Math.max(0.3, Math.min(5, Number(f.raio) || 1)),
    por: txt(f.por, 80).toLowerCase(), em: Number(f.em) || Date.now(), alerta: !!f.alerta, ate: Number(f.ate) || 0
  };
}

function limparFavoritos_(lista) {
  const vistos = {};
  const saida = [];
  (Array.isArray(lista) ? lista : []).forEach(function (f) {
    if (f && f.tipo === 'pino') {
      const pino = limparPino_(f);
      if (!pino || vistos['P|' + pino.id]) return;
      vistos['P|' + pino.id] = true;
      saida.push(pino);
      return;
    }
    const uf = String((f && f.uf) || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    const nome = String((f && f.nome) || '').replace(/[<>]/g, '').trim().slice(0, 80);
    if (uf.length !== 2 || !nome) return;
    const k = uf + '|' + nome.toLowerCase();
    if (vistos[k]) return;
    vistos[k] = true;
    saida.push({ uf: uf, nome: nome });
  });
  return saida.slice(0, MAX_FAVORITOS_);
}

/** Painel: { ok, conta, favoritos } — conta vazia quando o Google não informa o e-mail. */
function obterFavoritos() {
  const conta = contaFavoritos_();
  if (!conta) return { ok: true, conta: '', favoritos: null };
  let lista = [];
  try { lista = JSON.parse(PropertiesService.getScriptProperties().getProperty(chaveFavoritos_(conta)) || '[]'); } catch (e) { lista = []; }
  return { ok: true, conta: conta, favoritos: limparFavoritos_(lista) };
}

/** Painel: grava a lista inteira de favoritos do usuário logado. */
function salvarFavoritos(lista) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, conta: '', erro: 'Sem conta Shopee identificada: favoritos ficam no navegador.' };
  const limpa = limparFavoritos_(lista);
  PropertiesService.getScriptProperties().setProperty(chaveFavoritos_(conta), JSON.stringify(limpa));
  return { ok: true, conta: conta, favoritos: limpa };
}


/**
 * Painel: salva um pino nos favoritos com o nome dado pela pessoa (quem criou e quando ficam gravados)
 * e, se pedido, inclui o pino nos alertas por e-mail (ocorrências com local preciso no raio do pino).
 * prazoDias: 0 = sem prazo. Devolve { ok, conta, favoritos, pino, alerta }.
 */
function adicionarPino(pino, alertar, prazoDias, idioma) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, conta: '', erro: 'Sem conta Shopee identificada: o pino fica salvo só neste navegador e sem alerta por e-mail.' };
  const agora = Date.now();
  const dias = Math.max(0, Math.min(365, Number(prazoDias) || 0));
  const limpo = limparPino_(Object.assign({}, pino, { por: conta, em: (pino && pino.em) || agora, alerta: !!alertar, ate: alertar && dias ? agora + dias * 86400000 : 0 }));
  if (!limpo) return { ok: false, conta: conta, erro: 'Pino inválido (nome ou local).' };
  const props = PropertiesService.getScriptProperties();
  let lista = [];
  try { lista = JSON.parse(props.getProperty(chaveFavoritos_(conta)) || '[]'); } catch (e) { lista = []; }
  lista = [limpo].concat(lista.filter(function (f) { return !(f && f.tipo === 'pino' && f.id === limpo.id); }));
  const favoritos = limparFavoritos_(lista);
  props.setProperty(chaveFavoritos_(conta), JSON.stringify(favoritos));
  let alerta = false;
  if (alertar) {
    const anterior = lerPreferenciasAlerta_(conta);
    const base = anterior || { ativo: true, locais: [], temas: Object.keys(ALERTAS_TEMAS_), shopee: false, inmet: true, frequencia: 'imediato', idioma: idioma };
    const locais = [limpo].concat((base.locais || []).filter(function (f) { return !(f && f.tipo === 'pino' && f.id === limpo.id); }));
    const prefs = limparPreferenciasAlerta_(Object.assign({}, base, { ativo: true, locais: locais, temas: (base.temas && base.temas.length) ? base.temas : Object.keys(ALERTAS_TEMAS_) }), anterior);
    gravarPreferenciasAlerta_(conta, prefs);
    garantirGatilhoAlertas_();
    try { const mun = obterMunicipioBase_(limpo.uf, limpo.cidade); if (mun) registrarConsulta_(mun); } catch (e) { /* o robô pega depois */ }
    alerta = prefs.locais.some(function (f) { return f.tipo === 'pino' && f.id === limpo.id; });
  }
  return { ok: true, conta: conta, favoritos: favoritos, pino: limpo, alerta: alerta };
}

/** Painel: tira um pino dos favoritos e dos alertas. */
function removerPino(id) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, conta: '' };
  const props = PropertiesService.getScriptProperties();
  let lista = [];
  try { lista = JSON.parse(props.getProperty(chaveFavoritos_(conta)) || '[]'); } catch (e) { lista = []; }
  const favoritos = limparFavoritos_(lista.filter(function (f) { return !(f && f.tipo === 'pino' && f.id === id); }));
  props.setProperty(chaveFavoritos_(conta), JSON.stringify(favoritos));
  const p = lerPreferenciasAlerta_(conta);
  if (p && (p.locais || []).some(function (f) { return f.tipo === 'pino' && f.id === id; })) {
    p.locais = p.locais.filter(function (f) { return !(f.tipo === 'pino' && f.id === id); });
    gravarPreferenciasAlerta_(conta, p);
  }
  return { ok: true, conta: conta, favoritos: favoritos };
}
