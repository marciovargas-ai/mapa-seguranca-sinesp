/**
 * ============================================================================
 * ARQUIVO 5: 5_Conector_Sinesp_BI.gs (v3 — Estatística Oficial por Município)
 * Responsabilidade: trazer a base pública do Sinesp VDE (Ministério da Justiça
 * e Segurança Pública) — por UF, município, tipo de evento e mês: homicídio
 * doloso, feminicídio, latrocínio, roubo e furto de veículos, tráfico etc. — e
 * entregar ao painel os últimos 3 anos.
 *
 * Os arquivos do Ministério têm ~26 MB e ~750 mil linhas por ano: grandes
 * demais para o Google Sheets e para o tempo do Apps Script. Por isso um robô
 * no GitHub (repositório mapa-seguranca-sinesp) baixa e resume a base duas
 * vezes por mês, e aqui só se lê o resumo publicado (poucos KB por estado):
 *   <URL_SINESP_RESUMO>manifesto.json
 *   <URL_SINESP_RESUMO>sinesp_<ANO>_<UF>.json
 * Cada arquivo lido é guardado na pasta de dados do Drive e só é baixado de
 * novo quando o manifesto indica uma versão mais nova.
 * ============================================================================
 */

/** Confere o manifesto publicado; se houver versão nova, invalida os indicadores em cache. */
function importarEstatisticasSinesp() {
  const props = PropertiesService.getScriptProperties();
  let texto;
  const manifesto = obterManifestoSinesp_(true);
  if (!manifesto) {
    texto = urlSinespResumo_() ? 'Resumo do Sinesp não encontrado no GitHub: confira se o robô já rodou (aba Actions do repositório).' : 'Sinesp não conectado: use o menu 5. Conectar Sinesp (usuário do GitHub).';
  } else {
    const anterior = Number(props.getProperty('SINESP_VERSAO') || 0);
    if (manifesto.atualizadoEm > anterior) props.setProperty('SINESP_VERSAO', String(manifesto.atualizadoEm));
    props.setProperty('SINESP_ULTIMA_IMPORTACAO', String(Date.now()));
    const anos = Object.keys(manifesto.anos).sort().map(a => {
      const m = manifesto.anos[a];
      return a + ': até ' + (m.publicadoAte >= 12 ? 'dez' : NOMES_MES_SINESP_[Math.max(0, m.publicadoAte - 1)]) + ', ' + m.ufs.length + ' UFs';
    });
    texto = 'Resumo de ' + Utilities.formatDate(new Date(manifesto.atualizadoEm), CONFIG.FUSO, 'dd/MM/yyyy') + ' — ' + anos.join(' | ') +
      (manifesto.atualizadoEm > anterior ? ' (versão nova)' : '');
  }
  texto = Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + ' — ' + texto;
  registrarStatus_('Estatística oficial (Sinesp)', texto);
  Logger.log(texto);
  return texto;
}

const NOMES_MES_SINESP_ = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Repositório público do robô Sinesp usado quando o menu 5 nunca foi executado. */
const SINESP_USUARIO_PADRAO_ = 'marciovargas-ai';

/** Endereço do resumo publicado pelo robô no GitHub (menu 5 só troca o usuário). */
function urlSinespResumo_() {
  const usuario = PropertiesService.getScriptProperties().getProperty('SINESP_GITHUB_USUARIO') || SINESP_USUARIO_PADRAO_;
  const base = String(CONFIG.URL_SINESP_RESUMO || '');
  if (base.indexOf('{USUARIO}') === -1) return /^https:\/\//.test(base) ? base : '';
  return usuario ? base.replace('{USUARIO}', usuario) : '';
}

/** Manifesto do resumo publicado (cache de 6 h). forcar=true ignora o cache. */
function obterManifestoSinesp_(forcar) {
  const base = urlSinespResumo_();
  if (!base) return null;
  const chave = 'SINESP_MANIFESTO|' + base;
  if (!forcar) {
    const emCache = cacheLerJson_(chave);
    if (emCache) return emCache;
  }
  try {
    const resp = UrlFetchApp.fetch(base + 'manifesto.json', { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return null;
    const m = JSON.parse(resp.getContentText());
    if (!m || !m.anos || !m.atualizadoEm) return null;
    cacheGravarJson_(chave, m, 21600);
    return m;
  } catch (e) {
    Logger.log('Manifesto do Sinesp: ' + e.message);
    return null;
  }
}

/** Resumo de um ano/UF: cópia no Drive se estiver em dia com o manifesto; senão baixa do GitHub. */
function lerSinespUf_(ano, uf, manifesto) {
  const nome = 'sinesp_' + ano + '_' + uf + '.json';
  const local = lerJson_(nome);
  const info = manifesto && manifesto.anos[String(ano)];
  if (!info || info.ufs.indexOf(uf) === -1) return local;
  if (local && local.importadoEm >= info.importadoEm) return local;
  try {
    const resp = UrlFetchApp.fetch(urlSinespResumo_() + nome, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return local;
    const dados = JSON.parse(resp.getContentText());
    gravarJson_(nome, dados);
    return dados;
  } catch (e) {
    Logger.log('Sinesp ' + nome + ': ' + e.message);
    return local;
  }
}

/** Município no resumo: nome normalizado; se o Sinesp grafar diferente, compara sem espaços. */
function municipioNoSinesp_(municipios, nomeCidade) {
  const norm = normalizarTexto_(nomeCidade);
  if (municipios[norm]) return municipios[norm];
  const compacto = norm.replace(/\s+/g, '');
  const chave = Object.keys(municipios).find(k => k.replace(/\s+/g, '') === compacto);
  return chave ? municipios[chave] : null;
}

/**
 * ============================================================================
 * INDICADORES PARA O PAINEL: últimos 12 meses com dado + 12 meses anteriores
 * ============================================================================
 */
const ORDEM_EVENTOS_SINESP_ = [
  'homicidio doloso', 'feminicidio', 'roubo seguido de morte', 'latrocinio', 'lesao corporal seguida de morte',
  'morte por intervencao', 'tentativa de homicidio', 'tentativa de feminicidio', 'estupro', 'roubo de veiculo', 'furto de veiculo',
  'roubo de carga', 'roubo a instituicao financeira', 'morte no transito', 'trafico de drogas', 'apreensao de cocaina',
  'apreensao de maconha', 'arma de fogo apreendida', 'mandado de prisao'
];

/** Atividades dos bombeiros e administrativas que o VDE também publica: não são ocorrências criminais. */
const EVENTOS_FORA_PAINEL_SINESP_ = ['atendimento pre', 'busca e salvamento', 'combate a incend', 'emissao de alvar', 'realizacao de vistoria', 'pessoa localizada'];

function eventoCriminalSinesp_(nome) {
  const n = normalizarTexto_(nome);
  return !EVENTOS_FORA_PAINEL_SINESP_.some(e => n.indexOf(e) === 0);
}

function posicaoEventoSinesp_(nome) {
  const n = normalizarTexto_(nome);
  // Pelo início do nome: "Morte no trânsito (exceto homicídio doloso)" não é homicídio doloso
  const i = ORDEM_EVENTOS_SINESP_.findIndex(e => n.indexOf(e) === 0);
  return i < 0 ? 999 : i;
}

/** População por município (IBGE), publicada pelo robô junto com o Sinesp: { ano, fonte, ufs: { UF: { norm: [ibge, pop] } } }. */
function lerPopulacao_(manifesto) {
  const nome = 'populacao.json';
  const local = lerJson_(nome);
  if (local && (!manifesto || local.baixadoEm >= manifesto.atualizadoEm)) return local;
  try {
    const resp = UrlFetchApp.fetch(urlSinespResumo_() + nome, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return local;
    const dados = JSON.parse(resp.getContentText());
    dados.baixadoEm = Date.now();
    gravarJson_(nome, dados);
    return dados;
  } catch (e) {
    Logger.log('População: ' + e.message);
    return local;
  }
}

/** [ibge, populacao] de um município, ou null. */
function populacaoMunicipio_(pop, uf, nomeCidade) {
  const lista = pop && pop.ufs && pop.ufs[uf];
  return lista ? municipioNoSinesp_(lista, nomeCidade) : null;
}

function populacaoEstado_(pop, uf) {
  const lista = pop && pop.ufs && pop.ufs[uf];
  return lista ? Object.keys(lista).reduce((s, k) => s + lista[k][1], 0) : 0;
}

/** Taxa por 100 mil habitantes, com 1 casa decimal. */
function taxa100mil_(total, populacao) {
  return populacao > 0 ? Math.round((total / populacao) * 1000000) / 10 : null;
}

function extrairIndicadoresOficiais_(uf, nomeCidade, ehEstado) {
  const sigla = String(uf || '').toUpperCase();
  const versao = PropertiesService.getScriptProperties().getProperty('SINESP_VERSAO') || '0';
  const chave = 'OFI7|' + versao + '|' + sigla + '|' + (ehEstado ? '_UF' : normalizarTexto_(nomeCidade));
  const emCache = cacheLerJson_(chave);
  if (emCache) return emCache;

  const base = { fonte: 'Sinesp VDE — Ministério da Justiça e Segurança Pública', urlPainel: CONFIG.URL_PAINEL_SINESP, escopo: ehEstado ? 'ESTADO' : 'MUNICIPIO' };
  const manifesto = obterManifestoSinesp_(false);
  // Sempre o ano corrente e os dois anteriores (em 2026: 2024, 2025 e 2026); avança sozinho na virada do ano
  const anoCorrente = Number(Utilities.formatDate(new Date(), CONFIG.FUSO, 'yyyy'));
  const anosJanela = [anoCorrente - 2, anoCorrente - 1, anoCorrente];
  const anosPublicados = manifesto ? anosJanela.filter(a => manifesto.anos[String(a)]) : [];
  const arquivos = {};
  anosPublicados.forEach(ano => {
    const a = lerSinespUf_(ano, sigla, manifesto);
    if (a) arquivos[ano] = a;
  });
  const anos = Object.keys(arquivos).map(Number).sort();
  if (!anos.length) {
    const r = Object.assign(base, { disponivel: false, motivo: manifesto
      ? 'O Sinesp não traz dados deste estado nos anos publicados.'
      : 'Estatística oficial ainda não conectada: o resumo do Sinesp (robô do GitHub) não foi encontrado.' });
    cacheGravarJson_(chave, r, 3600);
    return r;
  }

  // Último mês com algum registro no estado
  let fimAno = 0, fimMes = -1;
  anos.forEach(ano => {
    const est = arquivos[ano].estado;
    Object.keys(est).forEach(ev => est[ev].forEach((v, m) => {
      if (v > 0 && (ano > fimAno || (ano === fimAno && m > fimMes))) { fimAno = ano; fimMes = m; }
    }));
  });

  const fonteDados = ano => {
    const a = arquivos[ano];
    if (!a) return null;
    if (ehEstado) return a.estado;
    const m = municipioNoSinesp_(a.municipios, nomeCidade);
    return m ? m.e : null;
  };
  // Registros da PRF e da PF (coluna "abrangencia" do Sinesp), para o cruzamento por órgão
  const fonteOrgaos = ano => {
    const a = arquivos[ano];
    if (!a) return null;
    if (ehEstado) return a.orgaos || null;
    const m = municipioNoSinesp_(a.municipios, nomeCidade);
    return m ? m.o || null : null;
  };
  const federaisEvento = ev => {
    const r = {};
    meses.slice(12).forEach(pm => {
      const o = fonteOrgaos(pm.ano);
      if (!o) return;
      Object.keys(o).forEach(org => {
        const v = o[org][ev] ? o[org][ev][pm.mes] || 0 : 0;
        if (v) r[org] = (r[org] || 0) + v;
      });
    });
    return Object.keys(r).length ? r : null;
  };
  const temMunicipio = ehEstado || anos.some(ano => fonteDados(ano));
  if (!temMunicipio) {
    const r = Object.assign(base, { disponivel: false, motivo: 'O Sinesp não traz registros para este município no período importado.' });
    cacheGravarJson_(chave, r, 21600);
    return r;
  }

  // 24 meses terminando no último mês com dado
  const meses = [];
  for (let k = 23; k >= 0; k--) {
    const d = new Date(fimAno, fimMes - k, 1);
    meses.push({ ano: d.getFullYear(), mes: d.getMonth() });
  }
  const eventos = {};
  meses.forEach((pm, idx) => {
    const dados = fonteDados(pm.ano);
    if (!dados) return;
    Object.keys(dados).forEach(ev => {
      const s = eventos[ev] || (eventos[ev] = new Array(24).fill(0));
      s[idx] += dados[ev][pm.mes] || 0;
    });
  });

  // Três anos civis (o último até o mês mais recente publicado): totais por ano e série mensal
  const soma = l => l.reduce((a, b) => a + b, 0);
  const porAnoEvento = ev => anosJanela.map(ano => {
    const dados = fonteDados(ano);
    if (!dados) return null;
    const s = dados[ev] || [];
    return soma(s.slice(0, ano === fimAno ? fimMes + 1 : 12).map(v => v || 0));
  });
  const serie36Evento = ev => {
    const s = [];
    anosJanela.forEach(ano => {
      if (ano > fimAno) return;
      const dados = fonteDados(ano);
      const lim = ano === fimAno ? fimMes + 1 : 12;
      for (let m = 0; m < lim; m++) s.push(dados && dados[ev] ? (dados[ev][m] || 0) : 0);
    });
    return s;
  };
  // Mesmo período do ano anterior (jan até o último mês publicado), para comparar o ano parcial
  const parcialAnoAnterior = ev => {
    const dados = fonteDados(fimAno - 1);
    return dados ? soma((dados[ev] || []).slice(0, fimMes + 1).map(v => v || 0)) : null;
  };

  const nomesMes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const lista = Object.keys(eventos).filter(eventoCriminalSinesp_).map(ev => {
    const s = eventos[ev];
    const ult = s.slice(12);
    const ant = s.slice(0, 12);
    const temAnterior = anos.indexOf(meses[0].ano) !== -1;
    return {
      nome: ev, total: ult.reduce((a, b) => a + b, 0), anterior: temAnterior ? ant.reduce((a, b) => a + b, 0) : null, serie: ult,
      porAno: porAnoEvento(ev), parcialAnterior: parcialAnoAnterior(ev), serie36: serie36Evento(ev), federais: federaisEvento(ev)
    };
  }).filter(e => e.total > 0 || e.porAno.some(v => v > 0))
    .sort((a, b) => posicaoEventoSinesp_(a.nome) - posicaoEventoSinesp_(b.nome) || b.total - a.total);

  // População e taxas por 100 mil habitantes (12 meses); no município, também a taxa do estado para comparação
  const pop = lerPopulacao_(manifesto);
  const popEstado = populacaoEstado_(pop, sigla);
  const popMun = ehEstado ? null : populacaoMunicipio_(pop, sigla, nomeCidade);
  const populacao = ehEstado ? popEstado : (popMun ? popMun[1] : 0);
  lista.forEach(e => {
    e.taxa = taxa100mil_(e.total, populacao);
    if (!ehEstado) {
      let totalEstado = 0;
      meses.slice(12).forEach(pm => {
        const a = arquivos[pm.ano];
        if (a && a.estado[e.nome]) totalEstado += a.estado[e.nome][pm.mes] || 0;
      });
      e.taxaEstado = taxa100mil_(totalEstado, popEstado);
    }
  });

  const ultimoArquivo = arquivos[anos[anos.length - 1]];
  const r = Object.assign(base, {
    populacao: populacao || null,
    codigoIbge: popMun ? popMun[0] : null,
    anoPopulacao: pop ? pop.ano : null,
    fimMesIdx: fimMes,
    disponivel: lista.length > 0,
    motivo: lista.length ? '' : 'Sem registros nos últimos 3 anos.',
    periodo: nomesMes[meses[12].mes] + '/' + meses[12].ano + ' a ' + nomesMes[fimMes] + '/' + fimAno,
    meses: meses.slice(12).map(pm => nomesMes[pm.mes] + '/' + String(pm.ano).slice(2)),
    anos: anosJanela,
    ultimoMes: nomesMes[fimMes],
    periodoTresAnos: 'jan/' + anosJanela[0] + ' a ' + nomesMes[fimMes] + '/' + fimAno,
    anoUltimoDado: fimAno,
    importadoEm: Utilities.formatDate(new Date(ultimoArquivo.importadoEm), CONFIG.FUSO, 'dd/MM/yyyy'),
    eventos: lista.slice(0, 24)
  });
  cacheGravarJson_(chave, r, 21600);
  return r;
}

/**
 * ============================================================================
 * PANORAMA DO ESTADO (chamado pelo painel)
 * Indicadores do estado em 3 anos + ranking dos municípios nos 12 meses mais
 * recentes (total, taxa por 100 mil e maiores altas) + valores por código IBGE
 * para o mapa coroplético.
 * ============================================================================
 */
function obterPanoramaEstado(uf) {
  const sigla = String(uf || '').toUpperCase();
  const versao = PropertiesService.getScriptProperties().getProperty('SINESP_VERSAO') || '0';
  const chave = 'PAN2|' + versao + '|' + sigla;
  const emCache = cacheLerJson_(chave);
  if (emCache) return emCache;

  const oficial = extrairIndicadoresOficiais_(sigla, '', true);
  if (!oficial.disponivel) return { disponivel: false, motivo: oficial.motivo, oficial: oficial };

  const manifesto = obterManifestoSinesp_(false);
  const pop = lerPopulacao_(manifesto);
  const popUf = (pop && pop.ufs && pop.ufs[sigla]) || {};
  const fimAno = oficial.anoUltimoDado, fimMes = oficial.fimMesIdx;
  const meses = [];
  for (let k = 23; k >= 0; k--) {
    const d = new Date(fimAno, fimMes - k, 1);
    meses.push({ ano: d.getFullYear(), mes: d.getMonth() });
  }
  const arquivos = {};
  meses.forEach(pm => { if (!(pm.ano in arquivos)) arquivos[pm.ano] = lerSinespUf_(pm.ano, sigla, manifesto); });

  // Municípios presentes em qualquer ano da janela
  const nomes = {};
  Object.keys(arquivos).forEach(ano => {
    const a = arquivos[ano];
    if (a) Object.keys(a.municipios).forEach(k => { nomes[k] = a.municipios[k].n; });
  });

  const somaJanela = (chaveMun, ev, de, ate) => {
    let s = 0;
    for (let i = de; i < ate; i++) {
      const a = arquivos[meses[i].ano];
      const m = a && a.municipios[chaveMun];
      if (m && m.e[ev]) s += m.e[ev][meses[i].mes] || 0;
    }
    return s;
  };

  // Indicadores com registro por município, na ordem de gravidade
  const eventosMunicipais = oficial.eventos.map(e => e.nome).filter(ev =>
    Object.keys(nomes).some(k => somaJanela(k, ev, 12, 24) > 0)).slice(0, 8);

  const rankings = eventosMunicipais.map(ev => {
    const linhas = Object.keys(nomes).map(k => {
      const p = popUf[k] || municipioNoSinesp_(popUf, nomes[k]);
      const total = somaJanela(k, ev, 12, 24);
      const anterior = somaJanela(k, ev, 0, 12);
      return { n: formatarTitleCase_(String(nomes[k]).toLowerCase()), ibge: p ? p[0] : null, pop: p ? p[1] : null,
               total: total, anterior: anterior, taxa: p ? taxa100mil_(total, p[1]) : null };
    }).filter(l => l.total > 0 || l.anterior > 0);
    const valores = {};
    linhas.forEach(l => { if (l.ibge && l.taxa !== null) valores[l.ibge] = l.taxa; });
    return {
      evento: ev,
      municipiosComRegistro: linhas.filter(l => l.total > 0).length,
      porTotal: linhas.slice().sort((a, b) => b.total - a.total).slice(0, 15),
      // Taxa só para municípios com 20 mil habitantes ou mais (evita distorção de cidades muito pequenas)
      porTaxa: linhas.filter(l => l.pop >= 20000 && l.taxa !== null).sort((a, b) => b.taxa - a.taxa).slice(0, 15),
      altas: linhas.filter(l => l.total - l.anterior > 0).sort((a, b) => (b.total - b.anterior) - (a.total - a.anterior)).slice(0, 8),
      quedas: linhas.filter(l => l.anterior - l.total > 0).sort((a, b) => (b.anterior - b.total) - (a.anterior - a.total)).slice(0, 8),
      valoresTaxa: valores,
      // Todos os municípios [nome, total, anterior]: o painel calcula as taxas com a população do IBGE quando o servidor não a tem
      todas: linhas.map(l => [l.n, l.total, l.anterior])
    };
  });

  const r = {
    disponivel: true, uf: sigla, oficial: oficial, rankings: rankings,
    municipios: Object.keys(popUf).length, fonte: oficial.fonte, anoPopulacao: pop ? pop.ano : null
  };
  cacheGravarJson_(chave, r, 21600);
  return r;
}
