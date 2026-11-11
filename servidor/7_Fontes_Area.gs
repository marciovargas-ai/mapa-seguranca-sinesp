/**
 * Fontes verificadas abaixo do município.
 *
 * Fogo Cruzado (https://fogocruzado.org.br): tiroteios checados pelo instituto,
 * com coordenada exata, bairro, vítimas e ação policial. Cobre Grande Rio,
 * Recife, Salvador e Belém. Precisa de conta gratuita no site da API:
 *   Extensões > Apps Script > Configurações do projeto > Propriedades do script
 *   FOGO_CRUZADO_EMAIL = e-mail da conta
 *   FOGO_CRUZADO_SENHA = senha da conta
 * A senha fica só nas propriedades do script; nunca no código nem na planilha.
 */
const FOGO_CRUZADO_API_ = 'https://api-service.fogocruzado.org.br/api/v2';
const FOGO_CRUZADO_UFS_ = { RJ: 'Rio de Janeiro', PE: 'Pernambuco', BA: 'Bahia', PA: 'Pará' };
const FOGO_CRUZADO_HORAS_ = 1;      // a cidade é buscada de novo depois disso (perto do tempo real)
const FOGO_CRUZADO_MAX_PAGINAS_ = 15;

/** Chamado pelo painel. Devolve { configurado, erro?, atualizadoEm, itens: [...] }. */
function obterFogoCruzado(uf, nomeCidade) {
  const sigla = String(uf || '').toUpperCase();
  if (!FOGO_CRUZADO_UFS_[sigla] || !nomeCidade) return { configurado: true, itens: [] };
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty('FOGO_CRUZADO_EMAIL');
  const senha = props.getProperty('FOGO_CRUZADO_SENHA');
  if (!email || !senha) return { configurado: false, itens: [] };

  const mun = obterMunicipioBase_(sigla, nomeCidade);
  if (!mun) return { configurado: true, itens: [] };
  const arquivo = 'fogocruzado_' + mun.ibge + '.json';
  const salvo = lerJson_(arquivo);
  if (salvo && Date.now() - salvo.em < FOGO_CRUZADO_HORAS_ * 3600000) return salvo.resposta;

  try {
    const token = tokenFogoCruzado_(email, senha);
    const idEstado = idEstadoFogoCruzado_(token, sigla);
    if (!idEstado) return { configurado: true, itens: [] };
    const idCidade = idCidadeFogoCruzado_(token, idEstado, mun.nome);
    if (!idCidade) {
      const vazio = { configurado: true, atualizadoEm: agoraTexto_(), itens: [] };
      gravarJson_(arquivo, { em: Date.now(), resposta: vazio });
      return vazio;
    }
    const fim = new Date();
    const inicio = new Date(fim.getTime() - 365 * 86400000);
    const fmt = d => Utilities.formatDate(d, CONFIG.FUSO, 'yyyy-MM-dd');
    const itens = [];
    for (let pagina = 1; pagina <= FOGO_CRUZADO_MAX_PAGINAS_; pagina++) {
      const url = FOGO_CRUZADO_API_ + '/occurrences?idState=' + idEstado + '&idCities=' + idCidade +
        '&initialdate=' + fmt(inicio) + '&finaldate=' + fmt(fim) + '&page=' + pagina + '&take=500';
      const j = getFogoCruzado_(url, token);
      const lista = (j && j.data) || [];
      lista.forEach(o => {
        const lat = Number(o.latitude), lng = Number(o.longitude);
        if (!lat || !lng) return;
        const vitimas = o.victims || [];
        const situacao = v => String((v && (v.situation || v.situationName)) || '').toLowerCase();
        itens.push({
          id: String(o.id || ''),
          d: o.date ? Utilities.formatDate(new Date(o.date), CONFIG.FUSO, 'dd/MM/yyyy') : '',
          lat: Math.round(lat * 1e5) / 1e5,
          lng: Math.round(lng * 1e5) / 1e5,
          bairro: (o.neighborhood && o.neighborhood.name) || '',
          endereco: String(o.address || ''),
          mortos: vitimas.filter(v => /dead|morto/.test(situacao(v))).length,
          feridos: vitimas.filter(v => /wounded|ferido/.test(situacao(v))).length,
          policia: !!(o.policeAction || o.agentPresence),
          motivo: (o.contextInfo && o.contextInfo.mainReason && o.contextInfo.mainReason.name) || '',
          ...detalhesFogoCruzado_(o, vitimas, situacao)
        });
      });
      const meta = j && j.pageMeta;
      if (!lista.length || (meta && meta.hasNextPage === false) || lista.length < 500) break;
    }
    const resposta = { configurado: true, atualizadoEm: agoraTexto_(), itens: itens };
    gravarJson_(arquivo, { em: Date.now(), resposta: resposta });
    return resposta;
  } catch (e) {
    Logger.log('Fogo Cruzado (' + nomeCidade + '): ' + e.message);
    if (salvo) return salvo.resposta;  // mostra o último resultado bom
    return { configurado: true, erro: String(e.message).slice(0, 160), itens: [] };
  }
}

function agoraTexto_() {
  return Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm');
}

/** Token de acesso (vale 1 h); guardado 50 min no cache do script. */
function tokenFogoCruzado_(email, senha) {
  const cache = CacheService.getScriptCache();
  const guardado = cache.get('FOGO_TOKEN');
  if (guardado) return guardado;
  const resp = UrlFetchApp.fetch(FOGO_CRUZADO_API_ + '/auth/login', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify({ email: email, password: senha })
  });
  if (resp.getResponseCode() >= 300) throw new Error('login recusado pelo Fogo Cruzado (' + resp.getResponseCode() + '): confira e-mail e senha nas propriedades do script');
  const j = JSON.parse(resp.getContentText());
  const token = (j.data && (j.data.accessToken || j.data.access_token)) || j.accessToken;
  if (!token) throw new Error('Fogo Cruzado não devolveu o token de acesso');
  cache.put('FOGO_TOKEN', token, 3000);
  return token;
}

function getFogoCruzado_(url, token) {
  const resp = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
  const codigo = resp.getResponseCode();
  if (codigo === 401) { CacheService.getScriptCache().remove('FOGO_TOKEN'); throw new Error('token expirado; tente de novo'); }
  if (codigo >= 300) throw new Error('Fogo Cruzado respondeu ' + codigo);
  return JSON.parse(resp.getContentText());
}

/** Ids de estado e cidade do Fogo Cruzado, guardados 30 dias. */
function idEstadoFogoCruzado_(token, sigla) {
  const salvo = lerJson_('fogocruzado_estados.json');
  let estados = salvo && Date.now() - salvo.em < 30 * 86400000 ? salvo.itens : null;
  if (!estados) {
    estados = (getFogoCruzado_(FOGO_CRUZADO_API_ + '/states', token).data || []).map(e => ({ id: e.id, n: e.name }));
    gravarJson_('fogocruzado_estados.json', { em: Date.now(), itens: estados });
  }
  const alvo = normalizarTexto_(FOGO_CRUZADO_UFS_[sigla]);
  const achou = estados.find(e => normalizarTexto_(e.n) === alvo);
  return achou ? achou.id : '';
}

function idCidadeFogoCruzado_(token, idEstado, nomeCidade) {
  const nome = 'fogocruzado_cidades_' + idEstado + '.json';
  const salvo = lerJson_(nome);
  let cidades = salvo && Date.now() - salvo.em < 30 * 86400000 ? salvo.itens : null;
  if (!cidades) {
    cidades = (getFogoCruzado_(FOGO_CRUZADO_API_ + '/cities?stateId=' + idEstado, token).data || []).map(c => ({ id: c.id, n: c.name }));
    gravarJson_(nome, { em: Date.now(), itens: cidades });
  }
  const alvo = normalizarTexto_(nomeCidade);
  const achou = cidades.find(c => normalizarTexto_(c.n) === alvo);
  return achou ? achou.id : '';
}


/**
 * Tudo o que a API do Fogo Cruzado traz além do ponto, em campos curtos:
 * gp  = disputa entre grupos armados (facções e/ou milícia), pelo motivo "Disputa"
 *       ou por motivo complementar que cite facção, milícia ou tráfico;
 * mc  = motivos complementares; rc = recortes (clippings, ex.: "Chacina", "Bala perdida");
 * ch  = chacina (massacre, 3+ mortos);  ag = agentes de segurança mortos/feridos;
 * cr  = crianças/adolescentes atingidos; bp = bala perdida; tr = transporte interrompido;
 * an  = animais atingidos; un = unidade policial; tipoAcao = ação policial ou só presença de agentes.
 */
function detalhesFogoCruzado_(o, vitimas, situacao) {
  const ctx = o.contextInfo || {};
  const nomes = l => (l || []).map(x => String((x && (x.name || x.reason || x)) || '')).filter(Boolean);
  const motivo = String((ctx.mainReason && ctx.mainReason.name) || '');
  const mc = nomes(ctx.complementaryReasons);
  const rc = nomes(ctx.clippings);
  const todos = [motivo].concat(mc, rc).join(' | ').toLowerCase();
  const agentes = vitimas.filter(v => /agent|agente/i.test(String(v.personType || '')) || (v.coorporation && v.coorporation.name) || (v.agentPosition && (v.agentPosition.name || typeof v.agentPosition === 'string')));
  const jovens = vitimas.filter(v => {
    const faixa = String((v.ageGroup && v.ageGroup.name) || '').toLowerCase();
    return /crian|adolesc|beb/.test(faixa) || (Number(v.age) > 0 && Number(v.age) < 18);
  });
  const bala = /bala perdida/.test(todos) || vitimas.some(v => nomes(v.qualifications).some(q => /bala perdida/i.test(q)));
  return {
    gp: /disputa|fac[cç][aã]o|mil[ií]cia|tr[aá]fico/.test(todos) ? 1 : 0,
    mc: mc.slice(0, 4), rc: rc.slice(0, 4),
    ch: ctx.massacre ? 1 : 0,
    ag: agentes.length ? { m: agentes.filter(v => /dead|morto/.test(situacao(v))).length, f: agentes.filter(v => /wounded|ferido/.test(situacao(v))).length } : null,
    cr: jovens.length,
    bp: bala ? 1 : 0,
    tr: (o.transports || []).length ? (o.transports || []).map(t => String((t.transport && t.transport.name) || t.transportDescription || 'Transporte')).slice(0, 3) : [],
    an: (o.animalVictims || []).length,
    un: String((ctx.policeUnit && (ctx.policeUnit.name || ctx.policeUnit)) || '').slice(0, 60),
    tipoAcao: o.policeAction ? 'acao' : o.agentPresence ? 'presenca' : ''
  };
}
