/**
 * ============================================================================
 * ARQUIVO 15: 15_Relatos_Internos.gs — Relatos das equipes Shopee
 * ============================================================================
 * Quem entra com conta @shopee.com registra ocorrências vividas pelas equipes
 * (assalto a motorista, tentativa de invasão, bloqueio de acesso...). Os relatos
 * ficam num JSON da pasta de dados (relatos_internos.json), só são lidos por
 * contas @shopee.com e nunca saem do Apps Script. Autor guardado só para que a
 * própria pessoa possa apagar o relato: os outros veem "Equipe Shopee".
 * Grau de confiança: B2 (fonte própria, geralmente confiável; sem confirmação externa).
 * ============================================================================
 */

const ARQUIVO_RELATOS_ = 'relatos_internos.json';
const RELATOS_MAX_ = 3000;
const RELATOS_DIAS_ = 365;
const RELATOS_TIPOS_ = {
  ASSALTO_MOTORISTA: 'Assalto a motorista ou entregador',
  ROUBO_CARGA: 'Roubo de carga',
  INVASAO: 'Invasão ou tentativa de invasão na unidade',
  FURTO: 'Furto (unidade, veículo ou carga)',
  AMEACA: 'Ameaça ou extorsão',
  TIROTEIO: 'Tiroteio ou disparo perto da operação',
  BLOQUEIO: 'Bloqueio de via, protesto ou toque de recolher',
  OUTRO: 'Outra ocorrência'
};

/** Painel: relatos do estado (e da cidade, quando houver) dos últimos 180 dias. */
function obterRelatos(uf, cidade) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: true, conta: '', relatos: [], tipos: RELATOS_TIPOS_ };
  const limite = Utilities.formatDate(new Date(Date.now() - 180 * 86400000), CONFIG.FUSO, 'yyyy-MM-dd');
  const cid = normalizarTexto_(cidade || '');
  const lista = (lerJson_(ARQUIVO_RELATOS_) || { itens: [] }).itens
    .filter(r => r.uf === uf && r.data >= limite && (!cid || cid === 'estado inteiro' || normalizarTexto_(r.cidade) === cid))
    .slice(0, 500)
    .map(r => ({ id: r.id, uf: r.uf, cidade: r.cidade, data: r.data, hora: r.hora, tipo: r.tipo, descricao: r.descricao,
      unidade: r.unidade || '', bairro: r.bairro || '', lat: r.lat || null, lng: r.lng || null, criadoEm: r.criadoEm, meu: r.autor === conta }));
  return { ok: true, conta: conta, relatos: lista, tipos: RELATOS_TIPOS_ };
}

/** Painel: grava um relato novo. */
function salvarRelato(r) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, erro: 'Os relatos precisam da conta @shopee.com (implantação "Qualquer pessoa em shopee.com").' };
  r = r || {};
  const uf = String(r.uf || '').toUpperCase().slice(0, 2);
  const cidade = String(r.cidade || '').trim().slice(0, 80);
  const tipo = RELATOS_TIPOS_[r.tipo] ? r.tipo : 'OUTRO';
  const data = /^\d{4}-\d{2}-\d{2}$/.test(String(r.data || '')) ? r.data : Utilities.formatDate(new Date(), CONFIG.FUSO, 'yyyy-MM-dd');
  const hora = /^\d{2}:\d{2}$/.test(String(r.hora || '')) ? r.hora : '';
  const descricao = String(r.descricao || '').replace(/\s+/g, ' ').trim().slice(0, 600);
  if (!uf || !cidade) return { ok: false, erro: 'Abra a cidade da ocorrência no painel antes de registrar.' };
  if (descricao.length < 10) return { ok: false, erro: 'Descreva o que aconteceu (pelo menos 10 letras).' };
  if (data > Utilities.formatDate(new Date(), CONFIG.FUSO, 'yyyy-MM-dd')) return { ok: false, erro: 'A data não pode estar no futuro.' };
  const lat = Number(r.lat), lng = Number(r.lng);
  const temPonto = isFinite(lat) && isFinite(lng) && lat > -34 && lat < 6 && lng > -75 && lng < -28;
  const item = {
    id: Utilities.getUuid().slice(0, 12), uf: uf, cidade: cidade, data: data, hora: hora, tipo: tipo, descricao: descricao,
    unidade: String(r.unidade || '').slice(0, 40), bairro: String(r.bairro || '').slice(0, 80),
    lat: temPonto ? Math.round(lat * 1e5) / 1e5 : null, lng: temPonto ? Math.round(lng * 1e5) / 1e5 : null,
    autor: conta, criadoEm: Date.now()
  };
  const limite = Utilities.formatDate(new Date(Date.now() - RELATOS_DIAS_ * 86400000), CONFIG.FUSO, 'yyyy-MM-dd');
  atualizarJsonComTrava_(ARQUIVO_RELATOS_, atual => {
    const itens = ((atual && atual.itens) || []).filter(x => x.data >= limite);
    itens.unshift(item);
    return { v: 1, itens: itens.slice(0, RELATOS_MAX_) };
  });
  return { ok: true, id: item.id };
}

/** Painel: apaga um relato (só quem registrou). */
function apagarRelato(id) {
  const conta = contaFavoritos_();
  if (!conta) return { ok: false, erro: 'Sem conta @shopee.com identificada.' };
  let apagou = false;
  atualizarJsonComTrava_(ARQUIVO_RELATOS_, atual => {
    const itens = ((atual && atual.itens) || []).filter(x => { const sai = x.id === id && x.autor === conta; if (sai) apagou = true; return !sai; });
    return { v: 1, itens: itens };
  });
  return apagou ? { ok: true } : { ok: false, erro: 'Só quem registrou pode apagar este relato.' };
}
