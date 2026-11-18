/**
 * Favoritos de cada usuário (cidades e estados salvos).
 *
 * Com a implantação em "Executar como: eu" e "Quem pode acessar: qualquer pessoa em shopee.com",
 * o Google exige a conta da Shopee e Session.getActiveUser() devolve o e-mail de quem está usando:
 * os favoritos ficam guardados no servidor e acompanham a pessoa em qualquer aparelho.
 * Sem e-mail (implantação aberta a qualquer pessoa), devolve conta vazia e o painel guarda no navegador.
 */

const MAX_FAVORITOS_ = 30;
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

function limparFavoritos_(lista) {
  const vistos = {};
  const saida = [];
  (Array.isArray(lista) ? lista : []).forEach(function (f) {
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
