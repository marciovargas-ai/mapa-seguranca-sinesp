/**
 * ============================================================================
 * ARQUIVO 1: 1_Config_Setup.gs (v3 — Nacional, sem dados fixos de nenhum estado)
 * Responsabilidade:
 *  1. Constantes globais (CONFIG)
 *  2. Referência geográfica das 27 UFs (nome, capital, centro, código IBGE)
 *  3. Menu da planilha (onOpen) e instalação (setupInicialProjeto)
 *
 * Onde ficam os dados: em arquivos JSON na pasta do Drive
 * "Mapa da Segurança — Dados" (um arquivo por cidade, um resumo por estado e
 * as estatísticas oficiais do Sinesp). A planilha guarda só a aba STATUS, com
 * poucas linhas fixas.
 * ============================================================================
 */

const CONFIG = {
  VERSAO: 3,
  FUSO: 'America/Sao_Paulo',
  NOME_PASTA_DADOS: 'Mapa da Segurança — Dados',
  ABA_STATUS: 'STATUS',

  // Atualização das notícias
  HORAS_VALIDADE_COLETA: 6,          // Abrir uma cidade com dados mais velhos que isso dispara coleta em segundo plano
  HORAS_ENTRE_COLETAS_ROBO: 20,      // O robô atualiza cada cidade monitorada no máximo 1 vez a cada 20 h (≈ diário)
  DIAS_MONITORAMENTO: 30,            // Cidades consultadas nesse período entram na rotina do robô
  MINUTOS_MIN_ENTRE_COLETAS: 10,     // "Atualizar agora" repetido dentro desse prazo não busca de novo
  TEMPO_MAXIMO_EXECUCAO_MS: 270000,  // 4,5 min: margem antes do limite de 6 min do Apps Script
  DIAS_JANELA_NOTICIAS: 365,         // Notícias mais antigas que isso são descartadas do arquivo da cidade
  MAX_OCORRENCIAS_POR_CIDADE: 500,   // Teto do arquivo da cidade (as mais recentes ficam)
  MAX_OCORRENCIAS_CIDADE_NO_RESUMO_UF: 40, // Quantas de cada cidade entram na visão do estado

  // Geocodificação (cota diária do serviço Maps do Apps Script)
  MAX_GEOCODING_POR_COLETA: 15,
  RAIO_MAXIMO_MUNICIPIO_KM: 45,      // Distância máxima entre a sede e um ponto geocodificado

  // Cache
  SEGUNDOS_CACHE_ARQUIVOS: 21600,    // 6 h (máximo do CacheService); é renovado a cada gravação

  // Estatística oficial (Sinesp VDE — Ministério da Justiça): resumo publicado pelo robô do GitHub.
  // {USUARIO} é trocado pelo usuário informado no menu "5. Conectar Sinesp (GitHub)".
  URL_SINESP_RESUMO: 'https://raw.githubusercontent.com/{USUARIO}/mapa-seguranca-sinesp/main/dados/',
  DIAS_ENTRE_IMPORTACOES_SINESP: 1,
  URL_PAINEL_SINESP: 'https://app.powerbi.com/view?r=eyJrIjoiYThmMDBkNTYtOGU0Zi00MjUxLWJiMzAtZjFlMmYzYTgwOTBlIiwidCI6ImViMDkwNDIwLTQ0NGMtNDNmNy05MWYyLTRiOGRhNmJmZThlMSJ9'
};

/**
 * Níveis de precisão geográfica de cada ocorrência.
 * Só ENDERECO, BAIRRO e RODOVIA entram no mapa de calor e nas zonas vermelhas.
 */
const PRECISAO = {
  ENDERECO: 'ENDERECO',
  BAIRRO: 'BAIRRO',
  RODOVIA: 'RODOVIA',
  MUNICIPIO: 'MUNICIPIO',
  PENDENTE: 'PENDENTE'
};

/**
 * Referência geográfica das 27 UFs. Só dados cadastrais (sem índices numéricos):
 * as estatísticas vêm do Sinesp importado e das notícias coletadas.
 */
const ESTADOS_BRASIL_METADATA = {
  'AC': { codigoIbge: '12', nome: 'Acre', capital: 'Rio Branco', lat: -9.9754, lng: -67.8249 },
  'AL': { codigoIbge: '27', nome: 'Alagoas', capital: 'Maceió', lat: -9.6658, lng: -35.7350 },
  'AP': { codigoIbge: '16', nome: 'Amapá', capital: 'Macapá', lat: 0.0349, lng: -51.0694 },
  'AM': { codigoIbge: '13', nome: 'Amazonas', capital: 'Manaus', lat: -3.1190, lng: -60.0217 },
  'BA': { codigoIbge: '29', nome: 'Bahia', capital: 'Salvador', lat: -12.9714, lng: -38.5014 },
  'CE': { codigoIbge: '23', nome: 'Ceará', capital: 'Fortaleza', lat: -3.7172, lng: -38.5433 },
  'DF': { codigoIbge: '53', nome: 'Distrito Federal', capital: 'Brasília', lat: -15.7975, lng: -47.8919 },
  'ES': { codigoIbge: '32', nome: 'Espírito Santo', capital: 'Vitória', lat: -20.3155, lng: -40.3128 },
  'GO': { codigoIbge: '52', nome: 'Goiás', capital: 'Goiânia', lat: -16.6869, lng: -49.2648 },
  'MA': { codigoIbge: '21', nome: 'Maranhão', capital: 'São Luís', lat: -2.5387, lng: -44.2825 },
  'MT': { codigoIbge: '51', nome: 'Mato Grosso', capital: 'Cuiabá', lat: -15.6014, lng: -56.0979 },
  'MS': { codigoIbge: '50', nome: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.4697, lng: -54.6201 },
  'MG': { codigoIbge: '31', nome: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.9167, lng: -43.9345 },
  'PA': { codigoIbge: '15', nome: 'Pará', capital: 'Belém', lat: -1.4558, lng: -48.4902 },
  'PB': { codigoIbge: '25', nome: 'Paraíba', capital: 'João Pessoa', lat: -7.1195, lng: -34.8450 },
  'PR': { codigoIbge: '41', nome: 'Paraná', capital: 'Curitiba', lat: -25.4284, lng: -49.2733 },
  'PE': { codigoIbge: '26', nome: 'Pernambuco', capital: 'Recife', lat: -8.0476, lng: -34.8770 },
  'PI': { codigoIbge: '22', nome: 'Piauí', capital: 'Teresina', lat: -5.0920, lng: -42.8038 },
  'RJ': { codigoIbge: '33', nome: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  'RN': { codigoIbge: '24', nome: 'Rio Grande do Norte', capital: 'Natal', lat: -5.7945, lng: -35.2110 },
  'RS': { codigoIbge: '43', nome: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.0346, lng: -51.2177 },
  'RO': { codigoIbge: '11', nome: 'Rondônia', capital: 'Porto Velho', lat: -8.7619, lng: -63.9039 },
  'RR': { codigoIbge: '14', nome: 'Roraima', capital: 'Boa Vista', lat: 2.8235, lng: -60.6758 },
  'SC': { codigoIbge: '42', nome: 'Santa Catarina', capital: 'Florianópolis', lat: -27.5954, lng: -48.5480 },
  'SP': { codigoIbge: '35', nome: 'São Paulo', capital: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  'SE': { codigoIbge: '28', nome: 'Sergipe', capital: 'Aracaju', lat: -10.9472, lng: -37.0731 },
  'TO': { codigoIbge: '17', nome: 'Tocantins', capital: 'Palmas', lat: -10.1840, lng: -48.3336 }
};

/**
 * MENU DA PLANILHA
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🛡️ Mapa da Segurança')
    .addItem('🗺️ Abrir painel', 'abrirMapaOperacionalModal')
    .addSeparator()
    .addItem('1. Instalar / verificar estrutura', 'setupInicialProjeto')
    .addItem('2. Ativar robô automático (de hora em hora)', 'ativarGatilhoAutomatico')
    .addItem('3. Rodar o robô agora', 'roboAtualizacao')
    .addItem('4. Importar estatísticas oficiais (Sinesp) agora', 'importarEstatisticasSinesp')
    .addItem('5. Conectar Sinesp (usuário do GitHub)', 'conectarSinespGithub')
    .addSeparator()
    .addItem('📂 Mostrar pasta de dados no Drive', 'mostrarPastaDados')
    .addItem('🧹 Remover abas antigas da v1/v2', 'removerAbasAntigas')
    .addItem('🛑 Desativar robô automático', 'desativarGatilhosAutomaticos')
    .addToUi();
}

/**
 * INSTALAÇÃO: cria a pasta de dados no Drive e a aba STATUS. Não apaga nada.
 */
function setupInicialProjeto() {
  const pasta = obterPastaDados_();
  registrarStatus_('Versão', 'Mapa da Segurança v' + CONFIG.VERSAO + ' (armazenamento em arquivos JSON no Drive)');
  registrarStatus_('Pasta de dados', pasta.getUrl());
  const temRobo = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'roboAtualizacao');
  registrarStatus_('Robô automático', temRobo ? 'Ativo — de hora em hora' : 'Desativado (menu → 2. Ativar robô automático)');
  Logger.log('Estrutura v3 pronta. Pasta de dados: ' + pasta.getUrl());
  try {
    SpreadsheetApp.getUi().alert('Mapa da Segurança v3 instalado',
      'Pasta de dados criada no seu Drive:\n' + pasta.getName() +
      '\n\nPróximos passos:\n• Menu → 2. Ativar robô automático\n• Menu → 5. Conectar Sinesp (usuário do GitHub)\n• Implantar como app da Web (opcional)',
      SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}
}

function mostrarPastaDados() {
  const pasta = obterPastaDados_();
  const html = HtmlService.createHtmlOutput(
    '<p style="font-family:sans-serif">Pasta de dados: <a href="' + pasta.getUrl() + '" target="_blank" rel="noopener">' + pasta.getName() + '</a></p>'
  ).setWidth(420).setHeight(90);
  SpreadsheetApp.getUi().showModalDialog(html, 'Mapa da Segurança');
}

/**
 * Apaga as abas de dados das versões anteriores (BD_OCORRENCIAS, DIM_BAIRROS_SC...).
 * Pede confirmação, porque não dá para desfazer pela planilha (só pelo histórico de versões).
 */
function removerAbasAntigas() {
  const antigas = ['BD_OCORRENCIAS', 'DIM_CIDADES_SC', 'DIM_BAIRROS_SC', 'BD_OFICIAL_MACRO', 'MATRIZ_MANCHA_CRIMINAL', 'LOG_EXECUCAO', 'FILA_COLETA'];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existentes = antigas.filter(n => ss.getSheetByName(n));
  const ui = SpreadsheetApp.getUi();
  if (!existentes.length) { ui.alert('Não há abas antigas para remover.'); return; }
  const resp = ui.alert('Remover abas antigas?',
    'Serão apagadas: ' + existentes.join(', ') + '.\n\nA v3 não usa esses dados. Dá para recuperar pelo histórico de versões da planilha.',
    ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;
  if (!ss.getSheetByName(CONFIG.ABA_STATUS)) registrarStatus_('Versão', 'Mapa da Segurança v' + CONFIG.VERSAO);
  existentes.forEach(n => ss.deleteSheet(ss.getSheetByName(n)));
  ui.alert('Abas removidas: ' + existentes.join(', '));
}

/** Pergunta o usuário do GitHub onde o robô publica o resumo do Sinesp e já faz a primeira leitura. */
function conectarSinespGithub() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  const atual = props.getProperty('SINESP_GITHUB_USUARIO') || '';
  const r = ui.prompt('Conectar Sinesp', 'Usuário do GitHub dono do repositório mapa-seguranca-sinesp' + (atual ? ' (atual: ' + atual + ')' : '') + ':', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const usuario = r.getResponseText().trim().replace(/^@/, '');
  if (!/^[A-Za-z0-9-]{1,39}$/.test(usuario)) { ui.alert('Usuário inválido.'); return; }
  props.setProperty('SINESP_GITHUB_USUARIO', usuario);
  ui.alert('Sinesp', importarEstatisticasSinesp(), ui.ButtonSet.OK);
}
