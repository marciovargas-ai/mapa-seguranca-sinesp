/**
 * ============================================================================
 * ARQUIVO 2: 2_Motor_OSINT_NLP.gs (v3 — Coleta por Cidade em Arquivo Próprio)
 * Responsabilidade: buscar notícias policiais da cidade (Google News RSS, em
 * paralelo), classificar o tipo de crime, extrair rua/bairro/rodovia,
 * geocodificar com validação de município e gravar no arquivo da cidade.
 *
 * Arquivo da cidade (cidade_<IBGE>.json):
 *  { v, uf, cidade, ibge, lat, lng, coletadoEm, ocorrencias: [...], locais: {...} }
 *  ocorrência: { id, d:'AAAA-MM-DD', t:título, v:veículo, u:link, c:categoria,
 *                s:score, b:local citado, lat, lng, p:precisão, g:descrição geo,
 *                og:[órgãos citados], il:1 se veio da imprensa local do estado,
 *                l:{b,r,h} (só enquanto estiver PENDENTE) }
 *  locais: dicionário aprendido da cidade { normalizado: { o, lat, lng, p } }
 * ============================================================================
 */

// Literais (não PRECISAO.*): constantes de outro arquivo podem ainda não existir quando este é carregado
const PRECISOES_NO_MAPA_ = new Set(['ENDERECO', 'BAIRRO', 'RODOVIA']);

/**
 * Imprensa local por estado (domínios). Usada em buscas direcionadas no Google
 * Notícias (site:) e para marcar a notícia como "imprensa local". Para incluir
 * um veículo, acrescente o domínio dele na lista do estado.
 */
const MIN_NOTICIAS_HISTORICO_ = 20;
/** Sobe quando o filtro de cidade passa a aceitar mais notícias: cada cidade refaz os 12 meses uma vez. */
const VERSAO_FILTRO_CIDADE_ = 3;
const SEGUNDOS_ORCAMENTO_COLETA_ = 60;
const IMPRENSA_LOCAL_UF = {
  AC: ['ac24horas.com', 'contilnetnoticias.com.br', 'oaltoacre.com'],
  AL: ['gazetaweb.com', 'tnh1.com.br', 'cadaminuto.com.br', 'alagoas24horas.com.br', '7segundos.com.br'],
  AP: ['diariodoamapa.com.br', 'selesnafes.com'],
  AM: ['portaldoholanda.com.br', 'acritica.com', 'd24am.com', 'emtempo.com.br'],
  BA: ['bnews.com.br', 'correio24horas.com.br', 'acordacidade.com.br', 'informebaiano.com.br', 'bahianoticias.com.br'],
  CE: ['diariodonordeste.verdesmares.com.br', 'opovo.com.br', 'gcmais.com.br', 'cearaagora.com.br'],
  DF: ['metropoles.com', 'correiobraziliense.com.br', 'jornaldebrasilia.com.br'],
  ES: ['agazeta.com.br', 'folhavitoria.com.br', 'tribunaonline.com.br'],
  GO: ['maisgoias.com.br', 'opopular.com.br', 'diariodegoias.com.br', 'portal6.com.br'],
  MA: ['imirante.com', 'oimparcial.com.br', 'jornalpequeno.com.br'],
  MT: ['folhamax.com', 'olhardireto.com.br', 'midianews.com.br', 'gazetadigital.com.br', 'sonoticias.com.br'],
  MS: ['midiamax.uol.com.br', 'campograndenews.com.br', 'topmidianews.com.br', 'douradosnews.com.br'],
  MG: ['itatiaia.com.br', 'otempo.com.br', 'em.com.br', 'bhaz.com.br', 'diariodoaco.com.br'],
  PA: ['dol.com.br', 'oliberal.com', 'romanews.com.br', 'zedudu.com.br'],
  PB: ['portalcorreio.com.br', 'clickpb.com.br', 'pbagora.com.br'],
  PR: ['bandab.com.br', 'tribunapr.uol.com.br', 'cgn.inf.br', 'ricmais.com.br', 'bonde.com.br', 'gmconline.com.br'],
  PE: ['jc.com.br', 'folhape.com.br', 'diariodepernambuco.com.br', 'tvjornal.com.br'],
  PI: ['gp1.com.br', 'meionorte.com', 'cidadeverde.com', 'portalodia.com'],
  RJ: ['extra.globo.com', 'odia.ig.com.br', 'osaogoncalo.com.br', 'oglobo.globo.com'],
  RN: ['tribunadonorte.com.br', 'pontanegranews.com.br', 'portalnoar.com.br'],
  RS: ['gauchazh.clicrbs.com.br', 'correiodopovo.com.br', 'jornalnh.com.br', 'diariogaucho.clicrbs.com.br'],
  RO: ['rondoniaovivo.com', 'rondoniagora.com', 'newsrondonia.com.br'],
  RR: ['folhabv.com.br', 'roraimaemtempo.com.br', 'roraima1.com.br'],
  SC: ['ndmais.com.br', 'nsctotal.com.br', 'scc10.com.br', 'ocp.news', 'diarinho.net', 'omunicipio.com.br', 'clicrdc.com.br', 'engeplus.com.br'],
  SP: ['r7.com', 'band.uol.com.br', 'acidadeon.com', 'atribuna.com.br', 'ovale.com.br', 'agora.folha.uol.com.br'],
  SE: ['infonet.com.br', 'f5news.com.br', 'faxaju.com.br'],
  TO: ['afnoticias.com.br', 'jornaldotocantins.com.br', 't1noticias.com.br', 'conexaoto.com.br']
};
const DOMINIOS_POR_BUSCA_ = 3;
const MAX_BUSCAS_IMPRENSA_LOCAL_ = 3;
// Busca por bairro: cidades com lista oficial de bairros ganham buscas com os nomes dos bairros
// (8 por busca, até 12 buscas por coleta). Cidades com muitos bairros fazem rodízio a cada coleta.
const BAIRROS_POR_BUSCA_ = 8;
const MAX_BUSCAS_BAIRROS_ = 12;

/**
 * Órgãos de segurança reconhecidos no texto da notícia (cruzamento por fonte).
 * Códigos iguais aos do painel (ORGAOS em Mapa_Dados.html).
 */
const ORGAOS_SEGURANCA_ = [
  { id: 'PM', termos: ['policia militar', 'pm', 'batalhao', 'bpm', 'rotam', 'tatico', 'choque', 'brigada militar'], prefixoUf: 'pm' },
  { id: 'COPOM', termos: ['copom', '190', 'ciops', 'cicc', 'central de operacoes', 'centro integrado de operacoes', 'central de emergencia'] },
  { id: 'PC', termos: ['policia civil', 'delegacia', 'delegado', 'delegada', 'dhpp', 'deic', 'dic', 'investigacao policial'], prefixoUf: 'pc' },
  { id: 'PRF', termos: ['prf', 'policia rodoviaria federal'] },
  { id: 'GM', termos: ['guarda municipal', 'guarda civil municipal', 'guarda civil', 'gcm'] },
  { id: 'SSP', termos: ['ssp', 'secretaria de seguranca', 'secretaria da seguranca', 'sesp', 'sspds', 'sejusp', 'segup', 'sesed', 'sesds', 'sds'] },
  { id: 'PF', termos: ['policia federal'] }
];

/** Lista de códigos de órgãos citados no texto, na ordem de ORGAOS_SEGURANCA_. */
function detectarOrgaos_(texto, uf) {
  const t = normalizarTexto_(texto);
  if (!t) return [];
  const sigla = String(uf || '').toLowerCase();
  return ORGAOS_SEGURANCA_.filter(o => {
    const termos = o.prefixoUf && sigla ? o.termos.concat([o.prefixoUf + sigla]) : o.termos;
    return termos.some(termo => contemTermoInteiro_(t, termo));
  }).map(o => o.id);
}

/** true se a URL pertence a um veículo da imprensa local do estado. */
function ehImprensaLocal_(url, uf) {
  const host = String(url || '').toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  if (!host) return false;
  return (IMPRENSA_LOCAL_UF[uf] || []).some(d => host === d || host.endsWith('.' + d));
}

/**
 * ============================================================================
 * NOTÍCIA É MESMO DESTA CIDADE?
 * "São José" aparece em São José dos Campos (SP), São José do Cedro (SC),
 * "Vila São José" etc. A checagem:
 * 1. apaga do texto os nomes de municípios maiores que contêm o da cidade e
 *    expressões como "Vila São José", "Rua São José";
 * 2. descarta a notícia com sinal de outro estado (sigla, nome do estado,
 *    imprensa local de outra UF) e nenhum sinal do estado certo;
 * 3. se o nome é ambíguo (existe homônimo), exige sinal do estado certo:
 *    sigla ou nome da UF, imprensa local da UF, município vizinho ou bairro citado.
 * ============================================================================
 */
const homonimosCache_ = {};
const PREFIXOS_LOGRADOURO_ = 'vila|jardim|jd|parque|bairro|residencial|conjunto|loteamento|condominio|rua|r|avenida|av|travessa|rodovia|estrada|praca|comunidade|morro|escola|colegio|hospital|igreja|paroquia|capela|santuario|ponte|porto|sitio|fazenda|clube|colonia';
const RAIO_VIZINHOS_KM_ = 45;

function homonimosCidade_(mun) {
  if (homonimosCache_[mun.ibge]) return homonimosCache_[mun.ibge];
  const cidNorm = normalizarTexto_(mun.nome);
  const maiores = [];
  const vizinhos = [];
  let mesmoNomeOutraUf = false;
  Object.keys(BASE_MUNICIPIOS_BR).forEach(uf => {
    BASE_MUNICIPIOS_BR[uf].split(';').forEach(reg => {
      const p = reg.split('|');
      const n = normalizarTexto_(p[0]);
      if (n === cidNorm) { if (uf !== mun.uf) mesmoNomeOutraUf = true; return; }
      if (contemTermoInteiro_(n, cidNorm)) maiores.push(n);
      else if (uf === mun.uf && n.length >= 5 && distanciaKm_(Number(p[2]), Number(p[3]), mun.lat, mun.lng) <= RAIO_VIZINHOS_KM_) vizinhos.push(n);
    });
  });
  maiores.sort((a, b) => b.length - a.length);
  const meta = ESTADOS_BRASIL_METADATA[mun.uf] || {};
  const r = {
    cidNorm: cidNorm, maiores: maiores, vizinhos: vizinhos,
    // Ambíguo: mesmo nome em outra UF, ou nome curto de muitos municípios ("São José", "Santa Maria"),
    // que a imprensa usa como apelido do maior deles. Capitais não entram.
    ambigua: (mesmoNomeOutraUf || maiores.length >= 3) && normalizarTexto_(meta.capital) !== cidNorm,
    logradouro: new RegExp('(^|\\s)(' + PREFIXOS_LOGRADOURO_ + ')( d[aeo]s?)? ' + escaparRegex_(cidNorm) + '(?=\\s|$)', 'g')
  };
  homonimosCache_[mun.ibge] = r;
  return r;
}

/** Siglas e nomes de estado em formato de localização: "Mogi Mirim / SP", "(SP)", "- SP", "Santa Catarina". */
function ufsCitadas_(textoOriginal, textoNorm) {
  const achadas = {};
  const re = /(?:[\/(\-–,|]|\bem|\bno|\bna|\bdo|\bda|\bde)\s*(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\b/g;
  let m;
  while ((m = re.exec(textoOriginal))) achadas[m[1]] = true;
  Object.keys(ESTADOS_BRASIL_METADATA).forEach(uf => {
    const nome = normalizarTexto_(ESTADOS_BRASIL_METADATA[uf].nome);
    if (uf === 'PA' || uf === 'AC') return; // "para" e "acre" são palavras comuns
    if (contemTermoInteiro_(textoNorm, nome)) achadas[uf] = true;
  });
  return achadas;
}

function ehImprensaDeOutraUf_(url, uf) {
  return Object.keys(IMPRENSA_LOCAL_UF).some(outra => outra !== uf && ehImprensaLocal_(url, outra));
}

/**
 * texto = manchete + resumo; veiculo = nome do jornal; imprensaLocal = domínio da imprensa da UF;
 * urlFonte = site do jornal (opcional); bairros = bairros do OSM da cidade (opcional).
 */
/**
 * Como a imprensa chama as capitais sem o nome completo: "na capital gaúcha", "BH", "Floripa" e,
 * no caso do Rio, "no Rio", "Zona Norte do Rio". Vale para as 27 capitais (texto já normalizado).
 */
const GENTILICO_CAPITAL_ = { AC: 'acreana', AL: 'alagoana', AP: 'amapaense', AM: 'amazonense', BA: 'baiana', CE: 'cearense', DF: 'federal',
  ES: 'capixaba', GO: 'goiana', MA: 'maranhense', MT: 'mato grossense', MS: 'sul mato grossense', MG: 'mineira', PA: 'paraense',
  PB: 'paraibana', PR: 'paranaense', PE: 'pernambucana', PI: 'piauiense', RJ: 'fluminense', RN: 'potiguar', RS: 'gaucha',
  RO: 'rondoniense', RR: 'roraimense', SC: 'catarinense', SP: 'paulista', SE: 'sergipana', TO: 'tocantinense' };
const APELIDO_CAPITAL_ = {
  RJ: /(^|\s)(no|do|ao|pelo|o|zona (norte|sul|oeste) do|centro do) rio(?!\s(grande|branco|claro|verde|preto|negro|bonito|novo|pardo|doce|largo|das|dos|de|do|da|sao|tiete|paraiba|madeira|amazonas|jacui|guaiba|capibaribe|pomba|piracicaba|parana|uruguai|xingu|tocantins|araguaia|sapucai|itajai|cuiaba|iguacu|mearim|acre))(\s|$)/,
  MG: /(^|\s)bh(\s|$)/, SC: /(^|\s)floripa(\s|$)/, SP: /(^|\s)sampa(\s|$)/, PA: /(^|\s)capital paraense(\s|$)/
};
function citaApelidoCapital_(mun, norm) {
  const meta = ESTADOS_BRASIL_METADATA[mun.uf] || {};
  if (normalizarTexto_(meta.capital) !== normalizarTexto_(mun.nome)) return false;
  const gent = GENTILICO_CAPITAL_[mun.uf];
  if (gent && contemTermoInteiro_(norm, 'capital ' + gent)) return true;
  const re = APELIDO_CAPITAL_[mun.uf];
  return !!(re && re.test(norm));
}

function noticiaDaCidade_(mun, texto, veiculo, imprensaLocal, urlFonte, bairros) {
  const h = homonimosCidade_(mun);
  const original = String(texto || '') + ' | ' + String(veiculo || '');
  let norm = normalizarTexto_(original);
  h.maiores.forEach(n => { norm = norm.split(n).join(' '); });
  norm = norm.replace(h.logradouro, ' ');
  if (!contemTermoInteiro_(norm, h.cidNorm) && !citaApelidoCapital_(mun, norm)) return false;

  const ufs = ufsCitadas_(original, norm);
  const outraUf = Object.keys(ufs).some(u => u !== mun.uf) || (urlFonte && ehImprensaDeOutraUf_(urlFonte, mun.uf));
  // Sigla da UF no nome do veículo ("Correio SC", "GZH RS") também conta como sinal do estado
  let propria = !!imprensaLocal || !!ufs[mun.uf] || new RegExp('\\b' + mun.uf + '\\b').test(String(veiculo || ''));
  if (!propria) propria = h.vizinhos.some(v => contemTermoInteiro_(norm, v));
  if (!propria && bairros) propria = bairros.some(b => { const n = normalizarTexto_(b.n); return n.length >= 5 && n !== h.cidNorm && contemTermoInteiro_(norm, n); });

  if (outraUf && !propria) return false;
  if (h.ambigua && !propria) return false;
  return true;
}

/**
 * Coleta as notícias de um município e atualiza o arquivo dele.
 * mun = { uf, nome, ibge, lat, lng } (de 6_Base_Municipios.gs).
 */
function coletarNoticiasCidade_(mun, modo) {
  // modo: 'busca' = só procura notícias novas (rápido, o painel espera); 'materias' = só lê o texto
  // das matérias ainda sem bairro (o painel chama em seguida, sem travar a tela); vazio = tudo (robô)
  const resultado = { novasOcorrencias: 0, revalidadas: 0, geocodificacoes: 0, erro: '' };
  const inicioColeta = Date.now();
  const nomeArquivo = nomeArquivoCidade_(mun.ibge);
  const cidNorm = normalizarTexto_(mun.nome);

  // Evita duas coletas simultâneas da mesma cidade (painel + robô)
  const cache = CacheService.getScriptCache();
  const chaveColetando = 'COLETANDO3|' + mun.ibge;
  if (cache.get(chaveColetando)) { resultado.erro = 'EM_ANDAMENTO'; return resultado; }
  cache.put(chaveColetando, '1', 300);

  try {
    const atual = lerJson_(nomeArquivo) || novoRegistroCidade_(mun);
    // Histórico completo (12 meses) na primeira coleta e também, uma vez por dia, enquanto a cidade
    // tiver poucas notícias guardadas: uma primeira coleta que falhou ou achou pouco não fica para sempre vazia
    const primeiraColeta = modo !== 'materias' && (!atual.coletadoEm || (atual.versaoFiltro || 0) < VERSAO_FILTRO_CIDADE_ ||
      ((atual.ocorrencias || []).length < MIN_NOTICIAS_HISTORICO_ && Date.now() - (atual.historicoEm || 0) > 86400000));

    // 1. Busca (fora da trava). Primeira coleta: 12 meses; depois só os últimos dias.
    const janela = primeiraColeta ? CONFIG.DIAS_JANELA_NOTICIAS + 'd'
      : Math.min(CONFIG.DIAS_JANELA_NOTICIAS, Math.ceil((Date.now() - atual.coletadoEm) / 86400000) + 3) + 'd';
    const bairrosOsm = obterBairrosOsm_(mun);
    const candidatos = modo === 'materias' ? [] : buscarNoticiasRss_(mun, cidNorm, janela, bairrosOsm);

    // 2. Deduplicação contra o que já existe no arquivo
    const idsExistentes = new Set(atual.ocorrencias.map(o => o.id));
    const assinaturas = atual.ocorrencias.map(o => assinaturaTitulo_(o.t));
    const ctx = criarContextoGeo_(mun, atual.locais, { restantes: CONFIG.MAX_GEOCODING_POR_COLETA });
    adicionarBairrosOsm_(ctx, bairrosOsm);
    const novas = [];

    candidatos.forEach(c => {
      const id = gerarHashMD5_(`${c.dataIso}|${mun.ibge}|${normalizarTexto_(c.manchete).substring(0, 40)}`).substring(0, 16);
      if (idsExistentes.has(id)) return;
      const assinatura = assinaturaTitulo_(c.manchete);
      if (assinaturas.some(a => similaridadeJaccard_(a, assinatura) >= 0.6)) return;
      idsExistentes.add(id);
      assinaturas.push(assinatura);

      const local = extrairLocalNLP_(c.texto, ctx.locais, mun.nome);
      const geo = resolverCoordenadaOcorrencia_(local, ctx);
      const oc = {
        id: id, d: c.dataIso, t: c.manchete, v: c.veiculo, u: c.link,
        c: c.classificacao.categoria, s: c.classificacao.score, b: local.rotulo,
        lat: geo.lat, lng: geo.lng, p: geo.precisao, g: geo.descricao
      };
      if (c.orgaos.length) oc.og = c.orgaos;
      if (c.imprensaLocal) oc.il = 1;
      if (geo.precisao === PRECISAO.PENDENTE) oc.l = { b: local.bairro, r: local.rua, h: local.rodovia };
      novas.push(oc);
    });

    // 3. Pendências antigas (ficaram sem cota de geocodificação em coletas anteriores)
    //    e notícias sem local que citam um bairro conhecido (OpenStreetMap), sem custo de geocodificação
    const revalidadas = {};
    atual.ocorrencias.forEach(o => {
      if (o.p !== PRECISAO.MUNICIPIO) return;
      const local = extrairLocalNLP_(o.t, ctx.locais, mun.nome);
      const entrada = local.bairro && ctx.locais[normalizarTexto_(local.bairro)];
      if (entrada && entrada.lat && PRECISOES_NO_MAPA_.has(entrada.p)) {
        revalidadas[o.id] = { lat: entrada.lat, lng: entrada.lng, precisao: entrada.p, descricao: entrada.o, rotulo: local.rotulo };
      }
    });
    atual.ocorrencias.forEach(o => {
      if (o.p !== PRECISAO.PENDENTE || !o.l || ctx.orcamento.restantes <= 0) return;
      const geo = resolverCoordenadaOcorrencia_({ bairro: o.l.b, rua: o.l.r, rodovia: o.l.h }, ctx);
      if (geo.precisao !== PRECISAO.PENDENTE) revalidadas[o.id] = geo;
    });

    // 3b. Texto da matéria: manchete e resumo do Google Notícias raramente citam o bairro.
    //     Lê o texto das notícias novas (e de antigas ainda sem bairro) para achar bairro ou rua.
    const materiasLidas = {};
    const semLocal = novas.filter(o => o.p === PRECISAO.MUNICIPIO || o.p === PRECISAO.PENDENTE && !o.l)
      .concat(atual.ocorrencias.filter(o => o.p === PRECISAO.MUNICIPIO && !o.mt && !revalidadas[o.id]));
    const totalSemLocal = semLocal.length;
    // Orçamento de tempo: na busca rápida o painel espera, então a leitura fica para a chamada seguinte
    semLocal.splice(modo === 'busca' || Date.now() - inicioColeta > SEGUNDOS_ORCAMENTO_COLETA_ * 1000 ? 0 : MAX_MATERIAS_POR_COLETA_);
    resultado.materiasPendentes = totalSemLocal - semLocal.length;
    if (semLocal.length) {
      const textos = lerTextoMaterias_(semLocal.map(o => o.u));
      semLocal.forEach((o, i) => {
        materiasLidas[o.id] = 1;
        o.mt = 1;
        if (!textos[i]) return;
        const local = extrairLocalNLP_(o.t + '. ' + textos[i], ctx.locais, mun.nome);
        if (!local.bairro && !local.rua && !local.rodovia) return;
        const geo = resolverCoordenadaOcorrencia_(local, ctx);
        if (geo.precisao === PRECISAO.MUNICIPIO || geo.precisao === PRECISAO.PENDENTE) {
          // Bairro citado, mas sem coordenada: guarda o nome (o painel liga pelo nome ao contorno do bairro)
          if (local.bairro) { o.b = local.rotulo; revalidadas[o.id] = revalidadas[o.id] || { lat: o.lat, lng: o.lng, precisao: o.p, descricao: o.g, rotulo: local.rotulo }; }
          return;
        }
        if (novas.indexOf(o) !== -1) { o.lat = geo.lat; o.lng = geo.lng; o.p = geo.precisao; o.g = geo.descricao; o.b = local.rotulo; delete o.l; }
        else revalidadas[o.id] = { lat: geo.lat, lng: geo.lng, precisao: geo.precisao, descricao: geo.descricao, rotulo: local.rotulo };
      });
      resultado.materiasLidas = semLocal.length;
    }

    // 4. Gravação: relê a versão mais nova sob trava e mescla
    // `m` = quando o registro entrou ou mudou: o painel pede só o que mudou desde a última abertura
    const agora = Date.now();
    const salvo = atualizarJsonComTrava_(nomeArquivo, reg => {
      reg = reg || novoRegistroCidade_(mun);
      const ids = new Set(reg.ocorrencias.map(o => o.id));
      novas.forEach(o => { if (!ids.has(o.id)) { o.m = agora; reg.ocorrencias.push(o); } });
      reg.ocorrencias.forEach(o => {
        if (materiasLidas[o.id]) o.mt = 1;
        const geo = revalidadas[o.id];
        if (!geo) return;
        o.lat = geo.lat; o.lng = geo.lng; o.p = geo.precisao; o.g = geo.descricao;
        if (geo.rotulo) o.b = geo.rotulo;
        o.m = agora;
        delete o.l;
      });
      // Bairros do OpenStreetMap ficam no arquivo próprio (bairros_<IBGE>.json), não no da cidade
      Object.keys(ctx.locais).forEach(k => { if (!ctx.locais[k].osm) reg.locais[k] = ctx.locais[k]; });
      // Limpa notícias antigas de homônimos (São José dos Campos, Vila São José...)
      // Só uma vez por arquivo antigo: as notícias novas já passaram pelo filtro com manchete + resumo
      // (refiltrar a cada coleta só pela manchete apagava notícias válidas e o total caía)
      if (reg.filtroHomonimos !== 2) reg.ocorrencias = reg.ocorrencias.filter(o => noticiaDaCidade_(mun, o.t, o.v, !!o.il, '', bairrosOsm));
      reg.filtroHomonimos = 2;  // já filtrado: a leitura do painel não precisa refazer
      if (modo !== 'materias') reg.coletadoEm = agora;
      if (primeiraColeta) { reg.historicoEm = agora; reg.versaoFiltro = VERSAO_FILTRO_CIDADE_; }
      return podarRegistroCidade_(reg);
    });

    atualizarResumoUf_(mun, salvo);
    atualizarIndiceCidade_(mun, { coletadoEm: salvo.coletadoEm });

    resultado.novasOcorrencias = novas.length;
    resultado.revalidadas = Object.keys(revalidadas).length;
    resultado.geocodificacoes = ctx.geocodificacoesFeitas;
    resultado.registro = salvo;
    return resultado;
  } catch (e) {
    resultado.erro = String(e && e.message || e);
    Logger.log(`Falha na coleta de ${mun.nome}/${mun.uf}: ${resultado.erro}`);
    return resultado;
  } finally {
    cache.remove(chaveColetando);
  }
}

function novoRegistroCidade_(mun) {
  return { v: 3, uf: mun.uf, cidade: mun.nome, ibge: mun.ibge, lat: mun.lat, lng: mun.lng, coletadoEm: 0, ocorrencias: [], locais: {} };
}

/**
 * Remove notícias fora da janela e limita o tamanho do arquivo (mais recentes primeiro).
 */
function podarRegistroCidade_(reg) {
  const limite = Utilities.formatDate(new Date(Date.now() - CONFIG.DIAS_JANELA_NOTICIAS * 86400000), CONFIG.FUSO, 'yyyy-MM-dd');
  reg.ocorrencias = reg.ocorrencias
    .filter(o => o.d >= limite)
    .sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0))
    .slice(0, CONFIG.MAX_OCORRENCIAS_POR_CIDADE);
  return reg;
}

/**
 * Google News RSS, em paralelo: crimes, polícia, locais, órgãos (PRF, Guarda
 * Municipal, COPOM, SSP) e buscas direcionadas aos sites da imprensa local do estado.
 */
function buscarNoticiasRss_(mun, cidNorm, janela, bairrosOsm) {
  const nome = mun.nome;
  const uf = mun.uf;
  const queries = [
    `("assalto" OR "roubo" OR "homicídio" OR "tiroteio" OR "latrocínio" OR "morto a tiros" OR "furto") "${nome}" ${uf} when:${janela}`,
    `("Polícia Militar" OR "Polícia Civil" OR "PRF" OR "operação policial" OR "preso" OR "tráfico") "${nome}" ${uf} when:${janela}`,
    `("bairro" OR "rua" OR "avenida") ("polícia" OR "crime" OR "baleado" OR "assaltado") "${nome}" ${uf} when:${janela}`,
    `("PRF" OR "Polícia Rodoviária Federal" OR "Guarda Municipal" OR "GCM" OR "COPOM" OR "Polícia Civil" OR "SSP") "${nome}" ${uf} when:${janela}`
  ];
  // Histórico (12 meses): o Google Notícias devolve no máximo ~100 itens por busca, os mais recentes.
  // Em cidade grande isso cobre poucas semanas; por isso a busca principal é repetida mês a mês e a de
  // polícia trimestre a trimestre. Em cidade pequena as fatias voltam quase vazias, sem custo real.
  if (janela === CONFIG.DIAS_JANELA_NOTICIAS + 'd') {
    const dia = d => Utilities.formatDate(d, CONFIG.FUSO, 'yyyy-MM-dd');
    const agora = Date.now();
    for (let m = 0; m < 12; m++) {
      const fim = new Date(agora - m * 30.4 * 86400000), ini = new Date(agora - (m + 1) * 30.4 * 86400000);
      queries.push(`("assalto" OR "roubo" OR "homicídio" OR "tiroteio" OR "latrocínio" OR "morto a tiros" OR "baleado" OR "preso") "${nome}" ${uf} after:${dia(ini)} before:${dia(fim)}`);
    }
    for (let t = 0; t < 4; t++) {
      const fim = new Date(agora - t * 91.3 * 86400000), ini = new Date(agora - (t + 1) * 91.3 * 86400000);
      queries.push(`("Polícia Militar" OR "Polícia Civil" OR "operação policial" OR "tráfico" OR "facção" OR "milícia") "${nome}" ${uf} after:${dia(ini)} before:${dia(fim)}`);
    }
  }
  const dominios = ['g1.globo.com'].concat(IMPRENSA_LOCAL_UF[uf] || []);
  for (let i = 0; i < dominios.length && i / DOMINIOS_POR_BUSCA_ < MAX_BUSCAS_IMPRENSA_LOCAL_; i += DOMINIOS_POR_BUSCA_) {
    const sites = dominios.slice(i, i + DOMINIOS_POR_BUSCA_).map(d => 'site:' + d).join(' OR ');
    queries.push(`(${sites}) "${nome}" ("polícia" OR "crime" OR "preso" OR "morto" OR "assalto" OR "baleado") when:${janela}`);
  }
  // Busca por bairro: sempre 12 meses, para encher o histórico dos bairros aos poucos
  const nomesBairros = (bairrosOsm || []).map(b => String(b.n || '').trim())
    .filter(n => n.length >= 4 && normalizarTexto_(n) !== cidNorm && n.indexOf('"') === -1);
  if (nomesBairros.length) {
    const porColeta = BAIRROS_POR_BUSCA_ * MAX_BUSCAS_BAIRROS_;
    const rodada = Math.floor(Date.now() / (6 * 3600000));
    const inicio = nomesBairros.length > porColeta ? (rodada * porColeta) % nomesBairros.length : 0;
    const escolhidos = [];
    for (let i = 0; i < Math.min(porColeta, nomesBairros.length); i++) escolhidos.push(nomesBairros[(inicio + i) % nomesBairros.length]);
    for (let i = 0; i < escolhidos.length; i += BAIRROS_POR_BUSCA_) {
      const grupo = escolhidos.slice(i, i + BAIRROS_POR_BUSCA_).map(n => '"' + n + '"').join(' OR ');
      queries.push(`(${grupo}) "${nome}" ("polícia" OR "crime" OR "assalto" OR "roubo" OR "baleado" OR "morto" OR "tiroteio" OR "preso" OR "tráfico") when:${CONFIG.DIAS_JANELA_NOTICIAS}d`);
    }
  }

  const requests = queries.map(q => ({
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`,
    method: 'get',
    muteHttpExceptions: true
  }));

  let respostas = [];
  try {
    respostas = UrlFetchApp.fetchAll(requests);
  } catch (erro) {
    Logger.log(`Falha na busca RSS (${nome}/${uf}): ${erro.message}`);
    return candidatosFeedsDiretos_(mun, bairrosOsm, new Set(), Date.now() - CONFIG.DIAS_JANELA_NOTICIAS * 86400000);
  }

  const limiteData = Date.now() - CONFIG.DIAS_JANELA_NOTICIAS * 86400000;
  const candidatos = [];
  const linksVistos = new Set();
  respostas.forEach(resposta => {
    if (resposta.getResponseCode() !== 200) return;
    let itens = [];
    try {
      const channel = XmlService.parse(resposta.getContentText()).getRootElement().getChild('channel');
      itens = channel ? channel.getChildren('item') : [];
    } catch (e) {
      return;
    }

    itens.forEach(item => {
      const link = item.getChildText('link') || '';
      if (!link || linksVistos.has(link)) return;
      linksVistos.add(link);

      const dataPub = new Date(item.getChildText('pubDate') || '');
      if (isNaN(dataPub.getTime()) || dataPub.getTime() < limiteData) return;

      const partesTitulo = (item.getChildText('title') || '').split(' - ');
      const fonteTag = item.getChild('source');
      const veiculoTag = fonteTag ? fonteTag.getText() : '';
      const urlFonte = fonteTag && fonteTag.getAttribute('url') ? fonteTag.getAttribute('url').getValue() : '';
      const veiculo = veiculoTag || (partesTitulo.length > 1 ? partesTitulo[partesTitulo.length - 1].trim() : 'Imprensa');
      if (partesTitulo.length > 1) partesTitulo.pop();
      const manchete = partesTitulo.join(' - ').trim();
      if (!manchete) return;
      const texto = `${manchete}. ${limparHtml_(item.getChildText('description') || '')}`;

      // A cidade precisa aparecer como palavra inteira e a notícia ser do estado certo (sem homônimos)
      const imprensaLocal = ehImprensaLocal_(urlFonte, uf);
      if (!noticiaDaCidade_(mun, texto, veiculo, imprensaLocal, urlFonte, bairrosOsm)) return;

      const classificacao = classificarCrimeNLP_(texto);
      if (!classificacao.valido) return;

      candidatos.push({
        dataIso: Utilities.formatDate(dataPub, CONFIG.FUSO, 'yyyy-MM-dd'),
        manchete: manchete,
        veiculo: veiculo,
        link: link,
        texto: texto,
        classificacao: classificacao,
        orgaos: detectarOrgaos_(texto, uf),
        imprensaLocal: imprensaLocal
      });
    });
  });
  // Feeds RSS diretos dos jornais do estado (9_Feeds_RSS) vêm primeiro: link real e
  // publicação mais recente; a mesma matéria achada no Google Notícias cai na deduplicação
  return candidatosFeedsDiretos_(mun, bairrosOsm, linksVistos, limiteData).concat(candidatos);
}

/**
 * Classificador de tipo de crime. Os códigos são os mesmos usados no painel.
 */
function classificarCrimeNLP_(texto) {
  const t = normalizarTexto_(texto);
  const termosDescarte = ['juri popular', 'condenado a', 'anos de prisao', 'absolvido', 'concurso publico', 'formatura',
    'novela', 'futebol', 'leilao', 'campanha de vacinacao', 'simulado', 'palestra'];
  for (let termo of termosDescarte) {
    if (t.includes(termo)) return { valido: false };
  }

  const taxonomias = [
    { categoria: 'CVLI', termos: ['homicidio', 'assassinado', 'assassinada', 'morto a tiros', 'morta a tiros', 'executado', 'latrocinio', 'corpo encontrado', 'feminicidio', 'esfaqueado', 'encontrado morto', 'encontrada morta'], peso: 90 },
    { categoria: 'CONFRONTO', termos: ['tiroteio', 'troca de tiros', 'confronto policial', 'baleado', 'baleada', 'disparos de arma', 'fuzil', 'alvejado', 'arma de fogo', 'bala perdida'], peso: 85 },
    { categoria: 'CARGA', termos: ['roubo de carga', 'carga roubada', 'caminhao roubado', 'sequestro de motorista', 'carga recuperada'], peso: 80 },
    { categoria: 'PATRIMONIO', termos: ['assalto', 'roubo', 'furto', 'arrastao', 'arrombamento', 'assaltantes', 'refens', 'veiculo roubado', 'furtado', 'assaltado', 'assaltada', 'golpe'], peso: 75 },
    { categoria: 'TRAFICO', termos: ['trafico de drogas', 'apreensao de drogas', 'cocaina', 'maconha', 'crack', 'operacao policial', 'mandado de prisao', 'foragido', 'preso em flagrante', 'boca de fumo'], peso: 70 },
    { categoria: 'BLOQUEIO', termos: ['bloqueio na br', 'incendio em onibus', 'onibus incendiado', 'barricada', 'toque de recolher', 'vandalismo'], peso: 60 }
  ];

  for (let tax of taxonomias) {
    for (let palavraChave of tax.termos) {
      if (t.includes(palavraChave)) return { valido: true, categoria: tax.categoria, score: tax.peso };
    }
  }
  return { valido: false };
}

/**
 * ============================================================================
 * BAIRROS DO OPENSTREETMAP (Overpass API)
 * Lista de bairros do município com coordenadas (place=suburb/neighbourhood/
 * quarter e limites administrativos de bairro), localizada pelo código IBGE.
 * Uma notícia que cite um desses bairros vai para o mapa sem gastar a cota de
 * geocodificação do Google. Guardada em bairros_<IBGE>.json por 90 dias.
 * ============================================================================
 */
const SERVIDORES_OVERPASS_ = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const DIAS_VALIDADE_BAIRROS_ = 90;

// Malha oficial de bairros do IBGE (Censo 2022), publicada pelo robô do GitHub, um arquivo por município
const BASES_DADOS_GITHUB_ = ['https://cdn.jsdelivr.net/gh/marciovargas-ai/mapa-seguranca-sinesp@main/dados/',
  'https://raw.githubusercontent.com/marciovargas-ai/mapa-seguranca-sinesp/main/dados/'];

/**
 * Nomes e centros dos bairros oficiais do IBGE. [] quando o município não tem
 * bairros cadastrados no IBGE; null quando o GitHub não respondeu.
 */
function obterBairrosIbge_(mun) {
  let ausentes = 0;
  for (let i = 0; i < BASES_DADOS_GITHUB_.length; i++) {
    try {
      const resp = UrlFetchApp.fetch(BASES_DADOS_GITHUB_[i] + 'bairros/' + mun.ibge + '.json', { muteHttpExceptions: true });
      const codigo = resp.getResponseCode();
      // A CDN pode guardar um 404 antigo de arquivo publicado depois: só desiste se todos disserem 404
      if (codigo === 404) { if (++ausentes === BASES_DADOS_GITHUB_.length) return []; continue; }
      if (codigo !== 200) continue;
      return JSON.parse(resp.getContentText())
        .filter(b => b && b.n && b.lat && b.lng)
        .map(b => ({ n: String(b.n), lat: Number(b.lat), lng: Number(b.lng), f: b.f || '' }));
    } catch (e) {
      Logger.log('Bairros IBGE (' + mun.nome + '): ' + e.message);
    }
  }
  return null;
}

/**
 * Bairros do município: primeiro a malha oficial do IBGE; onde o IBGE não tem,
 * o OpenStreetMap. Guardados no Drive por 90 dias.
 */
function obterBairrosOsm_(mun) {
  const nome = 'bairros_' + mun.ibge + '.json';
  const salvo = lerJson_(nome);
  if (salvo && salvo.fonte === 'IBGE' && Date.now() - salvo.em < DIAS_VALIDADE_BAIRROS_ * 86400000) return salvo.itens;
  // Arquivo do OSM gravado antes da malha do IBGE: confere uma vez por semana se o IBGE tem esse município
  if (salvo && salvo.fonte !== 'IBGE' && Date.now() - (salvo.conferidoIbge || 0) < 7 * 86400000 &&
      Date.now() - salvo.em < DIAS_VALIDADE_BAIRROS_ * 86400000) return salvo.itens;

  const ibge = obterBairrosIbge_(mun);
  if (ibge && ibge.length) {
    gravarJson_(nome, { em: Date.now(), fonte: ibge[0].f ? 'OSM (robô)' : 'IBGE', itens: ibge });
    return ibge;
  }
  if (salvo && Date.now() - salvo.em < DIAS_VALIDADE_BAIRROS_ * 86400000) {
    if (ibge !== null) { salvo.conferidoIbge = Date.now(); gravarJson_(nome, salvo); }
    return salvo.itens;
  }

  // Falhou há pouco: não tenta de novo por 6 h (Overpass fora do ar não atrasa a coleta)
  const cache = CacheService.getScriptCache();
  const chaveFalha = 'OSMFALHA|' + mun.ibge;
  if (cache.get(chaveFalha)) return salvo ? salvo.itens : [];

  const filtro = '["place"~"^(suburb|neighbourhood|quarter)$"]';
  const consulta = '[out:json][timeout:25];' +
    'area["IBGE:GEOCODIGO"="' + mun.ibge + '"]["admin_level"="8"]->.m;' +
    '(node' + filtro + '(area.m);way' + filtro + '(area.m);relation' + filtro + '(area.m);' +
    'relation["boundary"="administrative"]["admin_level"~"^(9|10)$"](area.m););out center tags;';

  for (let i = 0; i < SERVIDORES_OVERPASS_.length; i++) {
    try {
      const resp = UrlFetchApp.fetch(SERVIDORES_OVERPASS_[i], { method: 'post', payload: { data: consulta }, muteHttpExceptions: true });
      if (resp.getResponseCode() !== 200) continue;
      const elementos = JSON.parse(resp.getContentText()).elements || [];
      const vistos = {};
      const itens = [];
      elementos.forEach(el => {
        const n = el.tags && (el.tags.name || el.tags['name:pt']);
        const lat = el.lat || (el.center && el.center.lat);
        const lng = el.lon || (el.center && el.center.lon);
        const norm = normalizarTexto_(n);
        if (!n || !lat || !lng || vistos[norm]) return;
        if (distanciaKm_(lat, lng, mun.lat, mun.lng) > CONFIG.RAIO_MAXIMO_MUNICIPIO_KM) return;
        vistos[norm] = true;
        itens.push({ n: n, lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) });
      });
      gravarJson_(nome, { em: Date.now(), fonte: 'OpenStreetMap', conferidoIbge: Date.now(), itens: itens });
      return itens;
    } catch (e) {
      Logger.log('Overpass (' + mun.nome + '): ' + e.message);
    }
  }
  cache.put(chaveFalha, '1', 21600);
  return salvo ? salvo.itens : [];
}

/** Acrescenta os bairros do OSM ao dicionário da coleta, sem sobrescrever o que já foi aprendido. */
function adicionarBairrosOsm_(ctx, itens) {
  (itens || []).forEach(b => {
    const norm = normalizarTexto_(b.n);
    if (norm.length < 4 || norm === ctx.cidNorm || FALSOS_LOCAIS_.has(norm) || ctx.locais[norm]) return;
    ctx.locais[norm] = { o: b.n, lat: b.lat, lng: b.lng, p: PRECISAO.BAIRRO, osm: 1 };
  });
}

/**
 * ============================================================================
 * GEOCODIFICAÇÃO VALIDADA
 * Cascata rua > bairro > rodovia, usando primeiro o dicionário aprendido da
 * cidade. Só aceita resultados do tipo rua/bairro/rodovia DENTRO do município
 * e a até 45 km da sede. Sem local confiável → precisão MUNICIPIO (fora do
 * mapa de calor). Nenhuma coordenada é inventada.
 * ============================================================================
 */
function criarContextoGeo_(mun, locais, orcamento) {
  return {
    uf: mun.uf,
    cidade: mun.nome,
    cidNorm: normalizarTexto_(mun.nome),
    sede: { lat: mun.lat, lng: mun.lng },
    locais: locais || {},
    orcamento: orcamento,
    geocodificacoesFeitas: 0
  };
}

function resolverCoordenadaOcorrencia_(local, ctx) {
  const tentativas = [];
  if (local.rua) tentativas.push({ consulta: [local.rua, local.bairro].filter(Boolean).join(', '), tipo: PRECISAO.ENDERECO });
  if (local.bairro) tentativas.push({ consulta: local.bairro, tipo: PRECISAO.BAIRRO });
  if (local.rodovia) tentativas.push({ consulta: local.rodovia, tipo: PRECISAO.RODOVIA });

  let ficouPendente = false;
  for (let i = 0; i < tentativas.length; i++) {
    const t = tentativas[i];
    const norm = normalizarTexto_(t.consulta);
    const entrada = ctx.locais[norm];

    if (entrada && entrada.lat && entrada.lng && PRECISOES_NO_MAPA_.has(entrada.p)) {
      return { lat: entrada.lat, lng: entrada.lng, precisao: entrada.p, descricao: entrada.o };
    }
    if (entrada && entrada.p === 'NAO_ENCONTRADO') continue;
    if (ctx.orcamento.restantes <= 0) { ficouPendente = true; continue; }

    ctx.orcamento.restantes--;
    ctx.geocodificacoesFeitas++;
    const geo = geocodificarLocalValidado_(t.consulta, t.tipo, ctx);
    if (geo === 'COTA') { ficouPendente = true; continue; }

    if (geo) {
      ctx.locais[norm] = { o: t.consulta, lat: geo.lat, lng: geo.lng, p: geo.precisao };
      return { lat: geo.lat, lng: geo.lng, precisao: geo.precisao, descricao: geo.descricao };
    }
    ctx.locais[norm] = { o: t.consulta, lat: null, lng: null, p: 'NAO_ENCONTRADO' };
  }

  return {
    lat: ctx.sede.lat,
    lng: ctx.sede.lng,
    precisao: ficouPendente ? PRECISAO.PENDENTE : PRECISAO.MUNICIPIO,
    descricao: ficouPendente ? 'Aguardando geocodificação' : 'Local não identificado na notícia'
  };
}

const TIPOS_GEO_ENDERECO_ = new Set(['street_address', 'premise', 'subpremise', 'intersection', 'route', 'point_of_interest', 'establishment']);
const TIPOS_GEO_BAIRRO_ = new Set(['neighborhood', 'sublocality', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3', 'colloquial_area']);

/**
 * Geocodifica "<local>, <cidade> - <UF>, Brasil".
 * Retorna { lat, lng, precisao, descricao }, null (não encontrado) ou 'COTA' (limite diário).
 */
function geocodificarLocalValidado_(consulta, tipoEsperado, ctx) {
  const endereco = `${consulta}, ${ctx.cidade} - ${ctx.uf}, Brasil`;
  const chaveCache = 'GEO3|' + gerarHashMD5_(normalizarTexto_(endereco) + '|' + tipoEsperado);
  const emCache = cacheLerJson_(chaveCache);
  if (emCache) return emCache.ok ? emCache.r : null;

  let resposta;
  try {
    resposta = Maps.newGeocoder().setLanguage('pt-BR').setRegion('br').geocode(endereco);
  } catch (e) {
    if (/quota|limit|too many/i.test(String(e.message))) { ctx.orcamento.restantes = 0; return 'COTA'; }
    return null;
  }
  if (resposta && resposta.status === 'OVER_QUERY_LIMIT') { ctx.orcamento.restantes = 0; return 'COTA'; }

  let aceito = null;
  if (resposta && resposta.status === 'OK' && resposta.results) {
    for (let i = 0; i < resposta.results.length && !aceito; i++) {
      aceito = validarResultadoGeocoder_(resposta.results[i], consulta, tipoEsperado, ctx);
    }
  }
  cacheGravarJson_(chaveCache, aceito ? { ok: true, r: aceito } : { ok: false }, 21600);
  return aceito;
}

function validarResultadoGeocoder_(r, consulta, tipoEsperado, ctx) {
  const tipos = r.types || [];
  const temTipo = conjunto => tipos.some(t => conjunto.has(t));

  let precisao = null;
  if (tipoEsperado === PRECISAO.RODOVIA) {
    if (tipos.indexOf('route') !== -1) precisao = PRECISAO.RODOVIA;
  } else if (tipoEsperado === PRECISAO.BAIRRO) {
    // Uma busca por bairro que volta como "rua com o mesmo nome" é rejeitada
    if (temTipo(TIPOS_GEO_BAIRRO_)) precisao = PRECISAO.BAIRRO;
    else if (tipos.indexOf('route') === -1 && temTipo(TIPOS_GEO_ENDERECO_)) precisao = PRECISAO.ENDERECO;
  } else {
    if (temTipo(TIPOS_GEO_ENDERECO_)) precisao = PRECISAO.ENDERECO;
    else if (temTipo(TIPOS_GEO_BAIRRO_)) precisao = PRECISAO.BAIRRO;
  }
  if (!precisao) return null; // locality / administrative_area = centro da cidade: descartado

  const comps = r.address_components || [];
  const compMunicipio = comps.find(c => (c.types || []).indexOf('administrative_area_level_2') !== -1) ||
    comps.find(c => (c.types || []).indexOf('locality') !== -1);
  if (compMunicipio && normalizarTexto_(compMunicipio.long_name) !== ctx.cidNorm) return null;

  if (r.partial_match) {
    const nomeEncontrado = normalizarTexto_((comps[0] || {}).long_name || '');
    const termo = normalizarTexto_(String(consulta).split(',')[0]);
    if (!nomeEncontrado || (nomeEncontrado.indexOf(termo) === -1 && termo.indexOf(nomeEncontrado) === -1)) return null;
  }

  const lat = Number(r.geometry && r.geometry.location && r.geometry.location.lat);
  const lng = Number(r.geometry && r.geometry.location && r.geometry.location.lng);
  if (!lat || !lng) return null;
  if (ctx.sede && ctx.sede.lat && distanciaKm_(lat, lng, ctx.sede.lat, ctx.sede.lng) > CONFIG.RAIO_MAXIMO_MUNICIPIO_KM) return null;

  return { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6, precisao: precisao, descricao: String(r.formatted_address || consulta) };
}

/**
 * ============================================================================
 * EXTRAÇÃO DE LOCAL (rua, bairro, rodovia) DO TEXTO DA NOTÍCIA
 * ============================================================================
 */
const SIGLAS_RODOVIA_ = new Set(['BR', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']);

const FALSOS_LOCAIS_ = new Set([
  'policia', 'militar', 'civil', 'federal', 'rodoviaria', 'suspeito', 'homem', 'mulher',
  'jovem', 'adolescente', 'criminoso', 'assaltante', 'hospital', 'delegacia', 'presidio',
  'estado', 'ontem', 'hoje', 'madrugada', 'noite', 'tarde', 'manha', 'carro', 'moto', 'caminhao', 'onibus',
  'centro', 'regiao', 'local', 'cidade', 'mesmo', 'onde'
]);

function limparLocalExtraido_(bruto, nomeCidade) {
  return formatarTitleCase_(String(bruto || '').trim()
    .replace(new RegExp(`\\s+(?:em|na|no|de|da|do)\\s+${escaparRegex_(nomeCidade)}.*$`, 'i'), '')
    .replace(/\s+(?:em|na|no|apos|após|onde|quando|durante|segundo|para|por|com|nesta|neste|e|que)\b.*$/i, '')
    .replace(/[.,;:!?)"]+$/, '')
    .trim());
}

/**
 * Devolve { bairro, rua, rodovia, metodo, rotulo } (cada parte pode faltar).
 */
function extrairLocalNLP_(texto, locaisCidade, nomeCidade) {
  const textoNorm = normalizarTexto_(texto);
  const cidNorm = normalizarTexto_(nomeCidade);
  const res = { bairro: '', rua: '', rodovia: '', metodo: 'SEM_LOCAL', rotulo: 'Local não informado' };

  // 1. Dicionário aprendido da cidade, do nome mais longo ao mais curto
  const ordenados = Object.keys(locaisCidade || {})
    .filter(k => k.length >= 4 && k !== cidNorm && locaisCidade[k].p !== 'NAO_ENCONTRADO')
    .sort((a, b) => b.length - a.length);
  for (let i = 0; i < ordenados.length; i++) {
    const k = ordenados[i];
    const e = locaisCidade[k];
    if (k.indexOf(',') !== -1 || !contemTermoInteiro_(textoNorm, k)) continue;
    if (e.p === PRECISAO.RODOVIA) { if (!res.rodovia) res.rodovia = e.o; continue; }
    if (e.p === PRECISAO.ENDERECO || /^(rua|avenida|av|travessa|servidao|alameda|estrada)\b/.test(k)) {
      if (!res.rua) res.rua = e.o.split(',')[0];
      continue;
    }
    if (!res.bairro) { res.bairro = e.o; res.metodo = 'DICIONARIO'; }
  }

  // 2. Padrões gramaticais de bairro
  if (!res.bairro) {
    const padroesBairro = [
      /(?:no|do|pelo|ao|em)\s+bairro\s+([A-ZÀ-Úa-zà-ú0-9]+(?:\s+(?:de|da|do|dos|das|e|São|Santo|Santa|Dom|Nova|Novo|Alto|Baixo)?\s*[A-ZÀ-Úa-zà-ú0-9]+){0,2})/i,
      /\bbairro\s+([A-ZÀ-Ú][a-zà-ú0-9]+(?:\s+(?:de|da|do|dos|das)?\s*[A-ZÀ-Ú][a-zà-ú0-9]+){0,2})/,
      /\b((?:Morro|Vila|Jardim|Loteamento|Comunidade|Conjunto|Residencial|Parque|Favela|Complexo)\s+(?:de|da|do|dos|das)?\s*[A-ZÀ-Ú][a-zà-ú0-9]+(?:\s+[A-ZÀ-Ú][a-zà-ú0-9]+){0,1})/
    ];
    for (let p of padroesBairro) {
      const m = texto.match(p);
      if (!m || !m[1]) continue;
      const b = limparLocalExtraido_(m[1], nomeCidade);
      const bNorm = normalizarTexto_(b);
      if (b.length >= 3 && b.length <= 40 && bNorm !== cidNorm && !FALSOS_LOCAIS_.has(bNorm)) {
        res.bairro = b;
        res.metodo = 'REGEX_BAIRRO';
        break;
      }
    }
  }

  // 3. Rua / avenida
  if (!res.rua) {
    const m = texto.match(/\b((?:Rua|Avenida|Av\.|Travessa|Servidão|Alameda|Estrada)\s+(?:(?:de|da|do|dos|das)\s+)?[A-ZÀ-Ú0-9][\wà-ú.]*(?:\s+(?:(?:de|da|do|dos|das|e)\s+)?[A-ZÀ-Ú0-9][\wà-ú.]*){0,4})/);
    if (m && m[1]) {
      const r = limparLocalExtraido_(m[1].replace(/^Av\.\s*/, 'Avenida '), nomeCidade);
      if (r.split(' ').length >= 2 && r.length <= 60) res.rua = r;
    }
  }

  // 4. Rodovia federal ou estadual (BR-101, SP-330...)
  if (!res.rodovia) {
    const re = /\b([A-Z]{2})[-\s]?(\d{3})\b/g;
    let m;
    while ((m = re.exec(texto)) !== null) {
      if (SIGLAS_RODOVIA_.has(m[1])) { res.rodovia = `${m[1]}-${m[2]}`; break; }
    }
  }

  if (res.bairro) res.rotulo = res.bairro;
  else if (res.rua) { res.rotulo = res.rua; res.metodo = 'REGEX_RUA'; }
  else if (res.rodovia) { res.rotulo = `Rodovia ${res.rodovia}`; res.metodo = 'RODOVIA'; }
  return res;
}
