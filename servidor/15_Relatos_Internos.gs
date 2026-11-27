/**
 * ============================================================================
 * ARQUIVO 15: 15_Relatos_Internos.gs — Relatos das equipes Shopee
 * ============================================================================
 * Quem entra com conta @shopee.com registra ocorrências vividas pelas equipes
 * (assalto a motorista, tentativa de invasão, bloqueio de acesso...). Os relatos
 * ficam num JSON da pasta de dados (relatos_internos.json), só são lidos por
 * contas @shopee.com e nunca saem do Apps Script. Cada relato guarda o e-mail
 * (conta Google) e o nome de quem registrou; no painel, os outros veem "Equipe Shopee".
 * Fotos (até 3 por relato) ficam na pasta "relatos_fotos" dentro da pasta de dados,
 * privadas: o painel só as recebe pelo servidor, e só contas @shopee.com.
 * Grau de confiança: B2 (fonte própria, geralmente confiável; sem confirmação externa).
 * ============================================================================
 */

const ARQUIVO_RELATOS_ = 'relatos_internos.json';
const RELATOS_MAX_ = 3000;
const RELATOS_DIAS_ = 365;
const RELATOS_MAX_FOTOS_ = 3;
const RELATOS_MAX_BYTES_FOTO_ = 2500000;  // o painel reduz a foto antes de enviar (lado maior 1600 px)
const PASTA_FOTOS_RELATOS_ = 'relatos_fotos';
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
      unidade: r.unidade || '', bairro: r.bairro || '', lat: r.lat || null, lng: r.lng || null, criadoEm: r.criadoEm, meu: r.autor === conta,
      fotos: (r.fotos || []).length }));
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
  const nome = String(r.nome || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (nome.length < 3) return { ok: false, erro: 'Informe o seu nome.' };
  const fotosEnviadas = (Array.isArray(r.fotos) ? r.fotos : []).slice(0, RELATOS_MAX_FOTOS_);
  const lat = Number(r.lat), lng = Number(r.lng);
  const temPonto = isFinite(lat) && isFinite(lng) && lat > -34 && lat < 6 && lng > -75 && lng < -28;
  const item = {
    id: Utilities.getUuid().slice(0, 12), uf: uf, cidade: cidade, data: data, hora: hora, tipo: tipo, descricao: descricao,
    unidade: String(r.unidade || '').slice(0, 40), bairro: String(r.bairro || '').slice(0, 80),
    lat: temPonto ? Math.round(lat * 1e5) / 1e5 : null, lng: temPonto ? Math.round(lng * 1e5) / 1e5 : null,
    autor: conta, nome: nome, criadoEm: Date.now(), fotos: []
  };
  try {
    item.fotos = salvarFotosRelato_(item, fotosEnviadas);
  } catch (e) {
    return { ok: false, erro: 'Não foi possível salvar a foto: ' + e.message };
  }
  const limite = Utilities.formatDate(new Date(Date.now() - RELATOS_DIAS_ * 86400000), CONFIG.FUSO, 'yyyy-MM-dd');
  atualizarJsonComTrava_(ARQUIVO_RELATOS_, atual => {
    const itens = ((atual && atual.itens) || []).filter(x => { if (x.data >= limite) return true; apagarFotosRelato_(x); return false; });
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
    const itens = ((atual && atual.itens) || []).filter(x => {
      const sai = x.id === id && x.autor === conta;
      if (sai) { apagou = true; apagarFotosRelato_(x); }
      return !sai;
    });
    return { v: 1, itens: itens };
  });
  return apagou ? { ok: true } : { ok: false, erro: 'Só quem registrou pode apagar este relato.' };
}

/** Pasta das fotos dos relatos, dentro da pasta de dados (criada na primeira foto). */
function pastaFotosRelatos_() {
  const pasta = obterPastaDados_();
  const it = pasta.getFoldersByName(PASTA_FOTOS_RELATOS_);
  return it.hasNext() ? it.next() : pasta.createFolder(PASTA_FOTOS_RELATOS_);
}

/** Grava as fotos enviadas pelo painel ({ dados: base64, tipo: 'image/jpeg' }) e devolve os ids dos arquivos no Drive. */
function salvarFotosRelato_(item, fotos) {
  if (!fotos.length) return [];
  const pasta = pastaFotosRelatos_();
  return fotos.map((f, i) => {
    const tipo = /^image\/(jpeg|png|webp)$/.test(String(f && f.tipo)) ? f.tipo : 'image/jpeg';
    const bytes = Utilities.base64Decode(String(f && f.dados || '').replace(/^data:[^,]*,/, ''));
    if (!bytes.length) throw new Error('foto vazia');
    if (bytes.length > RELATOS_MAX_BYTES_FOTO_) throw new Error('foto grande demais');
    const ext = tipo === 'image/png' ? 'png' : tipo === 'image/webp' ? 'webp' : 'jpg';
    const nomeArq = item.data + '_' + item.uf + '_' + item.id + '_' + (i + 1) + '.' + ext;
    const arq = pasta.createFile(Utilities.newBlob(bytes, tipo, nomeArq));
    arq.setDescription('Relato ' + item.id + ' · ' + item.cidade + '/' + item.uf + ' · ' + item.nome + ' <' + item.autor + '>');
    return arq.getId();
  });
}

function apagarFotosRelato_(item) {
  (item && item.fotos || []).forEach(id => { try { DriveApp.getFileById(id).setTrashed(true); } catch (e) { /* já apagada */ } });
}

/** Painel: uma foto do relato, como data URL (só para contas @shopee.com). */
function obterFotoRelato(id, n) {
  if (!contaFavoritos_()) return { ok: false, erro: 'Sem conta @shopee.com identificada.' };
  const item = ((lerJson_(ARQUIVO_RELATOS_) || { itens: [] }).itens).find(x => x.id === id);
  const fotoId = item && (item.fotos || [])[Number(n) || 0];
  if (!fotoId) return { ok: false, erro: 'Foto não encontrada.' };
  const blob = DriveApp.getFileById(fotoId).getBlob();
  return { ok: true, url: 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()) };
}
