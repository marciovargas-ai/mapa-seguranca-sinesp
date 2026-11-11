/**
 * ============================================================================
 * ARQUIVO 3: 3_Ingestao_SSP_Matriz.gs (v4 — API do Painel e Robô)
 * Responsabilidade:
 *  1. Abrir o painel Angular (arquivos Painel*.html), no modal da planilha ou como app da Web
 *  2. Endpoint do painel: lê o arquivo da cidade (rápido, com cache) e pede
 *     coleta quando os dados estão velhos — "atualiza a cada consulta"
 *  3. Visão do estado (resumo por UF, um único arquivo)
 *  4. Contorno do município (IBGE) com cache permanente no Drive
 *  5. Robô de hora em hora — "atualiza diariamente"
 * ============================================================================
 */

function abrirMapaOperacionalModal() {
  const html = HtmlService.createTemplateFromFile('Painel').evaluate()
    .setWidth(1440)
    .setHeight(880)
    .setTitle('Mapa da Segurança');
  SpreadsheetApp.getUi().showModalDialog(html, 'Mapa da Segurança');
}

function doGet() {
  return HtmlService.createTemplateFromFile('Painel').evaluate()
    .setTitle('Mapa da Segurança — Ocorrências e indicadores por município')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function incluir(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

/**
 * Reserva do carregador do painel: quando a CDN do jsDelivr não responde, o
 * navegador pede aqui cada parte do aplicativo (arquivos Painel_App_N).
 */
function obterParteApp(n) {
  const html = HtmlService.createHtmlOutputFromFile('Painel_App_' + Number(n)).getContent();
  const m = html.match(/push\(([\s\S]*)\);<\/script>/);
  return m ? JSON.parse(m[1]) : '';
}

/**
 * ============================================================================
 * ENDPOINT DO PAINEL
 * forcarColeta !== true → só lê (≈ 0,3 s com cache). Se os dados da cidade têm
 *   mais de HORAS_VALIDADE_COLETA, devolve precisaColeta = true e o painel pede
 *   a coleta em segundo plano, mostrando enquanto isso o que já está salvo.
 * forcarColeta === true → coleta agora e devolve os dados atualizados.
 * ============================================================================
 */
// Notícias "em tempo real": dados mais velhos que isso fazem o painel pedir uma coleta em segundo plano
const MINUTOS_VALIDADE_TEMPO_REAL_ = 30;

/**
 * desdeMs (opcional): momento da última versão que o navegador já tem guardada. Quando
 * vem preenchido, a resposta traz só as notícias novas ou alteradas depois disso
 * (delta: true) e a lista de ids atuais, para o navegador remover as que saíram.
 */
function obterOuAtualizarCidadeNacional(uf, nomeCidade, latCentro, lngCentro, forcarColeta, desdeMs) {
  const t0 = Date.now();
  const siglaUf = String(uf || '').toUpperCase();
  const metaUf = ESTADOS_BRASIL_METADATA[siglaUf];
  if (!metaUf) throw new Error('UF inválida: ' + uf);

  if (!nomeCidade || nomeCidade === 'ESTADO_INTEIRO') return montarRespostaEstado_(siglaUf, metaUf, t0);

  const mun = obterMunicipioBase_(siglaUf, nomeCidade);
  if (!mun) throw new Error('Município não encontrado na base IBGE: ' + nomeCidade + ' (' + siglaUf + ')');

  registrarConsulta_(mun);

  let registro = lerJson_(nomeArquivoCidade_(mun.ibge));
  let coleta = null;
  const idadeMs = registro && registro.coletadoEm ? Date.now() - registro.coletadoEm : Infinity;
  if (forcarColeta === true) {
    if (idadeMs > CONFIG.MINUTOS_MIN_ENTRE_COLETAS * 60000) {
      coleta = coletarNoticiasCidade_(mun, 'busca');
      if (coleta.registro) registro = coleta.registro;
    }
  } else if (forcarColeta === 'materias') {
    // 2ª etapa: lê o texto das matérias para achar o bairro (o painel já mostra as notícias)
    coleta = coletarNoticiasCidade_(mun, 'materias');
    if (coleta.registro) registro = coleta.registro;
  }

  // Descarta na leitura as notícias de homônimos gravadas antes do filtro (São José dos Campos etc.)
  // (arquivos gravados a partir da v5 já vêm filtrados e marcados; a leitura fica rápida)
  const salvoBairros = lerJson_('bairros_' + mun.ibge + '.json');
  const bairrosSalvos = salvoBairros && salvoBairros.itens ? salvoBairros.itens : [];
  const daCidade = !registro ? [] : registro.filtroHomonimos === 2 ? registro.ocorrencias
    : registro.ocorrencias.filter(o => noticiaDaCidade_(mun, o.t, o.v, !!o.il, '', bairrosSalvos));

  // Delta só vale se o navegador tem uma versão desta mesma base (formato 2)
  const desde = Number(desdeMs) > 0 && registro && registro.coletadoEm ? Number(desdeMs) : 0;
  return {
    versao: CONFIG.VERSAO,
    uf: siglaUf,
    cidade: mun.nome,
    codigoIbge: mun.ibge,
    centroLat: mun.lat,
    centroLng: mun.lng,
    novasCapturadasAgora: coleta ? coleta.novasOcorrencias : 0,
    coletaEmAndamento: !!(coleta && coleta.erro === 'EM_ANDAMENTO'),
    materiasPendentes: coleta && coleta.materiasPendentes || 0,
    precisaColeta: forcarColeta !== true && idadeMs > MINUTOS_VALIDADE_TEMPO_REAL_ * 60000,
    ultimaColeta: registro && registro.coletadoEm ? Utilities.formatDate(new Date(registro.coletadoEm), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') : '',
    ultimaColetaMs: registro && registro.coletadoEm ? registro.coletadoEm : 0,
    atualizadoEm: Utilities.formatDate(new Date(), CONFIG.FUSO, 'HH:mm'),
    tempoServidorMs: Date.now() - t0,
    oficial: extrairIndicadoresOficiais_(siglaUf, mun.nome, false),
    totalNaBase: daCidade.length,
    // Bairros do OpenStreetMap já guardados (o painel busca os contornos direto no OSM)
    bairros: bairrosSalvos,
    formato: 2,
    delta: desde > 0,
    ids: desde > 0 ? daCidade.map(o => o.id) : undefined,
    ocorrencias: (desde > 0 ? daCidade.filter(o => (o.m || 0) > desde) : daCidade).map(o => formatarOcorrenciaPainel_(o, mun.nome, mun.uf))
  };
}

/**
 * Reserva do painel: pontos dos bairros do OpenStreetMap (quando o navegador
 * não consegue falar com o Overpass). Guardados no Drive por 90 dias.
 */
function obterBairrosCidade(codigoIbge) {
  const mun = obterMunicipioPorCodigoIbge_(codigoIbge);
  if (!mun) return [];
  return obterBairrosOsm_(mun);
}

function formatarOcorrenciaPainel_(o, cidade, uf) {
  return {
    id: o.id, data: dataIsoParaBr_(o.d), ts: dataIsoParaNumero_(o.d), cidade: cidade,
    bairro: o.b, categoria: o.c, score: o.s, titulo: o.t, veiculo: o.v, link: o.u,
    lat: o.lat, lng: o.lng, precisao: o.p,
    // Registros anteriores à marcação de órgãos: deduz pelo título
    orgaos: o.og || detectarOrgaos_(o.t, uf), local: !!o.il
  };
}

/**
 * Visão do estado: um único arquivo com as ocorrências mais recentes de cada
 * cidade já consultada naquele estado.
 */
function montarRespostaEstado_(siglaUf, metaUf, t0) {
  const resumo = lerJson_(nomeArquivoUf_(siglaUf)) || { cidades: {} };
  const ocorrencias = [];
  let totalNaBase = 0;
  let ultima = 0;
  Object.keys(resumo.cidades).forEach(ibge => {
    const c = resumo.cidades[ibge];
    totalNaBase += c.total || 0;
    ultima = Math.max(ultima, c.coletadoEm || 0);
    c.ocorrencias.forEach(o => ocorrencias.push(formatarOcorrenciaPainel_(o, c.cidade, siglaUf)));
  });
  ocorrencias.sort((a, b) => b.ts - a.ts);
  return {
    versao: CONFIG.VERSAO,
    uf: siglaUf,
    cidade: 'ESTADO_INTEIRO',
    codigoIbge: metaUf.codigoIbge,
    centroLat: metaUf.lat,
    centroLng: metaUf.lng,
    novasCapturadasAgora: 0,
    precisaColeta: false,
    cidadesMonitoradas: Object.keys(resumo.cidades).length,
    ultimaColeta: ultima ? Utilities.formatDate(new Date(ultima), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') : '',
    ultimaColetaMs: ultima,
    atualizadoEm: Utilities.formatDate(new Date(), CONFIG.FUSO, 'HH:mm'),
    tempoServidorMs: Date.now() - t0,
    oficial: extrairIndicadoresOficiais_(siglaUf, '', true),
    totalNaBase: totalNaBase,
    ocorrencias: ocorrencias
  };
}

/**
 * Mantém no resumo do estado as ocorrências mais recentes da cidade.
 */
function atualizarResumoUf_(mun, registro) {
  atualizarJsonComTrava_(nomeArquivoUf_(mun.uf), resumo => {
    resumo = resumo || { v: 3, uf: mun.uf, cidades: {} };
    resumo.cidades[mun.ibge] = {
      cidade: mun.nome,
      total: registro.ocorrencias.length,
      coletadoEm: registro.coletadoEm,
      ocorrencias: registro.ocorrencias.slice(0, CONFIG.MAX_OCORRENCIAS_CIDADE_NO_RESUMO_UF)
        .map(o => ({ id: o.id, d: o.d, t: o.t, v: o.v, u: o.u, c: o.c, s: o.s, b: o.b, lat: o.lat, lng: o.lng, p: o.p, og: o.og, il: o.il }))
    };
    resumo.atualizadoEm = Date.now();
    return resumo;
  });
}

/**
 * ============================================================================
 * ÍNDICE DE CIDADES CONSULTADAS (substitui a antiga aba FILA_COLETA)
 * ============================================================================
 */
function registrarConsulta_(mun) {
  const cache = CacheService.getScriptCache();
  const chave = 'CONSULTA3|' + mun.ibge;
  if (cache.get(chave)) return; // no máximo 1 gravação por cidade a cada 30 min
  cache.put(chave, '1', 1800);
  try {
    atualizarIndiceCidade_(mun, { consultadoEm: Date.now(), somarConsulta: true });
  } catch (e) {
    Logger.log('Índice não atualizado: ' + e.message);
  }
}

function atualizarIndiceCidade_(mun, campos) {
  atualizarJsonComTrava_(NOME_ARQUIVO_INDICE_, indice => {
    indice = indice || { v: 3, cidades: {} };
    const item = indice.cidades[mun.ibge] || { uf: mun.uf, cidade: mun.nome, consultadoEm: 0, coletadoEm: 0, consultas: 0 };
    if (campos.consultadoEm) item.consultadoEm = campos.consultadoEm;
    if (campos.coletadoEm) item.coletadoEm = campos.coletadoEm;
    if (campos.somarConsulta) item.consultas = (item.consultas || 0) + 1;
    indice.cidades[mun.ibge] = item;
    return indice;
  });
}

/**
 * ============================================================================
 * CONTORNO DO MUNICÍPIO / ESTADO (malha IBGE)
 * O painel baixa direto do IBGE; se falhar (rede, bloqueio, lentidão), chama
 * esta função, que guarda o contorno no Drive para sempre (malhas mudam raramente).
 * ============================================================================
 */
function obterFronteiraIbge(codigo) {
  const cod = String(codigo || '').replace(/\D/g, '');
  if (cod.length !== 7 && cod.length !== 2) throw new Error('Código IBGE inválido');
  const ehEstado = cod.length === 2;
  const nome = 'malha_' + cod + '.json';
  const salvo = lerJson_(nome);
  if (salvo) return JSON.stringify(salvo);

  const url = ehEstado
    ? 'https://servicodados.ibge.gov.br/api/v3/malhas/estados/' + cod + '?formato=application/vnd.geo+json&qualidade=minima'
    : 'https://servicodados.ibge.gov.br/api/v3/malhas/municipios/' + cod + '?formato=application/vnd.geo+json&qualidade=intermediaria';
  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (resp.getResponseCode() !== 200) throw new Error('IBGE respondeu ' + resp.getResponseCode());
  const geo = JSON.parse(resp.getContentText());
  if (!geo || !geo.features || !geo.features.length) throw new Error('Contorno vazio');
  gravarJson_(nome, geo);
  return JSON.stringify(geo);
}

/**
 * ============================================================================
 * ROBÔ (gatilho de hora em hora)
 * 1. Uma vez por dia confere se o robô do GitHub publicou um Sinesp mais novo.
 * 2. Atualiza as cidades consultadas nos últimos 30 dias cujos dados têm
 *    mais de 20 h, da mais desatualizada para a mais recente, até 4,5 min.
 * ============================================================================
 */
function roboAtualizacao() {
  const inicio = Date.now();
  const props = PropertiesService.getScriptProperties();
  const ultimaSinesp = Number(props.getProperty('SINESP_ULTIMA_IMPORTACAO') || 0);
  const ultimaTentativa = Number(props.getProperty('SINESP_ULTIMA_TENTATIVA') || 0);
  const sinespVencido = inicio - ultimaSinesp > CONFIG.DIAS_ENTRE_IMPORTACOES_SINESP * 86400000;
  if (sinespVencido && inicio - ultimaTentativa > 86400000) {
    props.setProperty('SINESP_ULTIMA_TENTATIVA', String(inicio));
    importarEstatisticasSinesp(); // só lê o manifesto do GitHub: leva 1 a 2 s
  }

  const indice = lerJson_(NOME_ARQUIVO_INDICE_) || { cidades: {} };
  const limiteConsulta = inicio - CONFIG.DIAS_MONITORAMENTO * 86400000;
  const limiteColeta = inicio - CONFIG.HORAS_ENTRE_COLETAS_ROBO * 3600000;
  const fila = Object.keys(indice.cidades)
    .map(ibge => Object.assign({ ibge: ibge }, indice.cidades[ibge]))
    .filter(c => c.consultadoEm >= limiteConsulta && (c.coletadoEm || 0) < limiteColeta)
    .sort((a, b) => (a.coletadoEm || 0) - (b.coletadoEm || 0));

  let processadas = 0, novas = 0, geocodificacoes = 0, falhas = 0;
  for (let i = 0; i < fila.length; i++) {
    // Cada cidade leva de 5 a 25 s; para com folga antes do limite
    if (Date.now() - inicio > CONFIG.TEMPO_MAXIMO_EXECUCAO_MS - 30000) break;
    const mun = obterMunicipioPorCodigoIbge_(fila[i].ibge);
    if (!mun) continue;
    const r = coletarNoticiasCidade_(mun);
    processadas++;
    novas += r.novasOcorrencias;
    geocodificacoes += r.geocodificacoes;
    if (r.erro && r.erro !== 'EM_ANDAMENTO') falhas++;
  }

  const monitoradas = Object.keys(indice.cidades).filter(k => indice.cidades[k].consultadoEm >= limiteConsulta).length;
  registrarStatus_('Última execução do robô',
    Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + ' — ' + processadas + ' cidades atualizadas, ' + novas +
    ' notícias novas, ' + geocodificacoes + ' geocodificações, ' + falhas + ' falhas, ' + Math.round((Date.now() - inicio) / 1000) + ' s');
  registrarStatus_('Cidades monitoradas', monitoradas + ' (consultadas nos últimos ' + CONFIG.DIAS_MONITORAMENTO + ' dias) • aguardando: ' + Math.max(0, fila.length - processadas));
}
