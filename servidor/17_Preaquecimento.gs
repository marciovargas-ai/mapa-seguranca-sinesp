/**
 * ============================================================================
 * PRÉ-CARGA DAS CIDADES (segundo plano)
 * ============================================================================
 * A primeira consulta de uma cidade é lenta porque o servidor busca 12 meses de notícias em várias fontes.
 * Este robô faz essa primeira coleta antes de alguém pedir, para que a pessoa já encontre a cidade pronta:
 *   1. cidades com unidade Shopee (planilha de unidades);
 *   2. capitais;
 *   3. demais municípios com 20 mil habitantes ou mais, do maior para o menor.
 * Cidades menores continuam com a primeira coleta na hora da consulta (é rápida: têm poucas notícias).
 *
 * Limites (Google Workspace): gatilhos somam no máximo 6 h por dia e cada execução no máximo 6 min.
 * Por isso cada rodada usa até 4 min e a pré-carga para sozinha ao passar de 3 h no dia. Se o Google
 * avisar que a cota de buscas acabou, ela pausa 6 h. A rotina normal do robô (cidades consultadas) não muda.
 *
 * Para ligar: rode ativarPreaquecimento() uma vez no editor.
 */
const PREAQUECER_MIN_HAB_ = 20000;
const PREAQUECER_MS_POR_EXECUCAO_ = 240000;
const PREAQUECER_MS_POR_DIA_ = 3 * 3600000;

function ativarPreaquecimento() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'preaquecerCidadesGatilho').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('preaquecerCidadesGatilho').timeBased().everyMinutes(30).create();
  const fila = filaPreaquecimento_();
  registrarStatus_('Pré-carga de cidades', 'Ativa — a cada 30 min. Na fila: ' + fila.length + ' cidades (' +
    Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + ')');
  Logger.log('Pré-carga ativada. Cidades na fila: ' + fila.length + '. Primeiras: ' + fila.slice(0, 10).map(m => m.nome + '/' + m.uf).join(', '));
}

function desativarPreaquecimento() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'preaquecerCidadesGatilho').forEach(t => ScriptApp.deleteTrigger(t));
  registrarStatus_('Pré-carga de cidades', 'Desligada (' + Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm') + ')');
}

function preaquecerCidadesGatilho() {
  const inicio = Date.now();
  if (!pegarTravaTarefa_('preaquecer', 330)) return;
  try {
    const props = PropertiesService.getScriptProperties();
    if (Number(props.getProperty('PREAQUECER_PAUSA_ATE') || 0) > inicio) return;
    const hoje = Utilities.formatDate(new Date(), CONFIG.FUSO, 'yyyyMMdd');
    let uso = {};
    try { uso = JSON.parse(props.getProperty('PREAQUECER_USO') || '{}'); } catch (e) {}
    if (uso.dia !== hoje) uso = { dia: hoje, ms: 0, cidades: 0 };
    if (uso.ms >= PREAQUECER_MS_POR_DIA_) return;

    const fila = filaPreaquecimento_();
    let feitas = 0;
    for (let i = 0; i < fila.length; i++) {
      const decorrido = Date.now() - inicio;
      // Cada cidade leva de 10 a 40 s (etapa rápida + histórico); para com folga antes do limite
      if (decorrido > PREAQUECER_MS_POR_EXECUCAO_ - 45000 || uso.ms + decorrido >= PREAQUECER_MS_POR_DIA_) break;
      const mun = fila[i];
      try {
        const r = coletarNoticiasCidade_(mun, 'busca', { enxuto: true });
        if (r.erro === 'EM_ANDAMENTO') continue;  // alguém abriu a cidade agora: a coleta já está em curso
        if (r.historicoPendente && Date.now() - inicio < PREAQUECER_MS_POR_EXECUCAO_ - 60000) coletarNoticiasCidade_(mun, 'historico', { enxuto: true });
        feitas++;
      } catch (e) {
        Logger.log('Pré-carga (' + mun.nome + '/' + mun.uf + '): ' + e.message);
        if (/too many times|invocad|quota|cota|Limit Exceeded|Bandwidth/i.test(e.message)) {
          props.setProperty('PREAQUECER_PAUSA_ATE', String(Date.now() + 6 * 3600000));
          break;
        }
      }
    }
    uso.ms += Date.now() - inicio;
    uso.cidades += feitas;
    props.setProperty('PREAQUECER_USO', JSON.stringify(uso));
    registrarStatus_('Pré-carga de cidades', Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM HH:mm') + ' — ' + feitas +
      ' cidades nesta rodada, ' + uso.cidades + ' hoje (' + Math.round(uso.ms / 60000) + ' min). Faltam ' + Math.max(0, fila.length - feitas) + '.');
  } finally {
    soltarTravaTarefa_('preaquecer');
  }
}

/** Cidades ainda nunca coletadas, na ordem de prioridade. */
function filaPreaquecimento_() {
  const indice = lerJson_(NOME_ARQUIVO_INDICE_) || { cidades: {} };
  const ordem = [], vistos = {};
  const incluir = mun => {
    if (!mun || vistos[mun.ibge]) return;
    vistos[mun.ibge] = 1;
    const item = indice.cidades[mun.ibge];
    if (!item || !item.coletadoEm) ordem.push(mun);
  };
  try {
    const r = obterUnidadesShopee();
    (r && r.unidades || []).forEach(u => incluir(obterMunicipioBase_(u.uf, limparCidadeUnidade_(u.cidade || u.nome, u.uf))));
  } catch (e) { Logger.log('Pré-carga: unidades não lidas (' + e.message + ')'); }
  Object.keys(ESTADOS_BRASIL_METADATA).forEach(uf => incluir(obterMunicipioBase_(uf, ESTADOS_BRASIL_METADATA[uf].capital)));
  populacaoMunicipios_().filter(x => x.hab >= PREAQUECER_MIN_HAB_).forEach(x => incluir(obterMunicipioPorCodigoIbge_(x.ibge)));
  return ordem;
}

/** População do IBGE por município (do robô no GitHub), do maior para o menor. Guardada no Drive por 30 dias. */
function populacaoMunicipios_() {
  const salvo = lerJson_('populacao_municipios.json');
  if (salvo && salvo.lista && Date.now() - (salvo.em || 0) < 30 * 86400000) return salvo.lista;
  for (let i = 0; i < BASES_DADOS_GITHUB_.length; i++) {
    try {
      const resp = UrlFetchApp.fetch(BASES_DADOS_GITHUB_[i] + 'populacao.json', { muteHttpExceptions: true });
      if (resp.getResponseCode() !== 200) continue;
      const p = JSON.parse(resp.getContentText());
      const lista = [];
      Object.keys(p.ufs || {}).forEach(uf => Object.keys(p.ufs[uf]).forEach(n => {
        const x = p.ufs[uf][n];
        if (x && x[0] && x[1]) lista.push({ ibge: String(x[0]), hab: Number(x[1]) });
      }));
      lista.sort((a, b) => b.hab - a.hab);
      if (lista.length) { gravarJson_('populacao_municipios.json', { em: Date.now(), lista: lista }); return lista; }
    } catch (e) { Logger.log('Pré-carga: população não lida (' + e.message + ')'); }
  }
  return salvo && salvo.lista || [];
}
