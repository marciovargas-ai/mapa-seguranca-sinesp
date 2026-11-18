/**
 * ============================================================================
 * ARQUIVO 12: 12_Unidades_Shopee.gs
 * Unidades da Shopee no mapa (camada "Unidades Shopee", desmarcada ao abrir).
 *
 * Fonte: planilha UNIDADES PADRAO, aba "UNIDADES SHOPEE" (só leitura; o portal
 * nunca grava nela). Mesmo método do Portal Budget:
 *   1. coordenada da coluna LocalizacaoNoMapa (validada dentro do Brasil);
 *   2. sem coordenada: centro da cidade pelo geocoder (cache nas propriedades,
 *      no máximo 25 consultas por execução);
 *   3. por último, centro do estado.
 * Pontos aproximados são afastados em espiral; o ponto exato nunca é mexido.
 *
 * Propriedade opcional: UNIDADES_SHOPEE_PLANILHA_ID (troca a planilha).
 * ============================================================================
 */

const PLANILHA_UNIDADES_PADRAO_ = '1M7zgzBNnj3m7TlCwn87Idf0VWVBA1FxiLE8ZdjG9M20';
const ABA_UNIDADES_SHOPEE_ = 'UNIDADES SHOPEE';
const GEOCODE_UNIDADES_MAX_ = 25;
const PESO_STATUS_UNIDADE_ = { 'IN OPERATION': 3, 'NOT STARTED': 2, 'CLOSED': 1, 'CANCELADO': 0, 'CANCELLED': 0 };

/** Chamado pelo painel quando a camada é ligada. Cache de 30 min. */
function obterUnidadesShopee(forcar) {
  const cache = CacheService.getScriptCache();
  if (!forcar) {
    const salvo = cacheLerGrande_('UNIDADES_SHOPEE_V1');
    if (salvo) return salvo;
  }
  let r;
  try {
    r = montarUnidadesShopee_();
  } catch (e) {
    return { ok: false, erro: 'Não foi possível ler a planilha de unidades: ' + e.message, unidades: [] };
  }
  cacheGravarGrande_('UNIDADES_SHOPEE_V1', r, 1800);
  return r;
}

function montarUnidadesShopee_() {
  const id = PropertiesService.getScriptProperties().getProperty('UNIDADES_SHOPEE_PLANILHA_ID') || PLANILHA_UNIDADES_PADRAO_;
  const aba = SpreadsheetApp.openById(id).getSheetByName(ABA_UNIDADES_SHOPEE_);
  if (!aba) throw new Error('aba "' + ABA_UNIDADES_SHOPEE_ + '" não encontrada');
  const valores = aba.getDataRange().getDisplayValues();
  if (valores.length < 2) return { ok: true, atualizado: Date.now(), unidades: [], problemas: {} };

  const cab = valores[0].map(c => normalizarTexto_(String(c)).toUpperCase());
  const col = nome => cab.indexOf(normalizarTexto_(nome).toUpperCase());
  const C = {
    codigo: col('SORT CODE'), nome: col('UNIDADE'), status: col('Status'), uf: col('UF'), cidade: col('CIDADE'),
    endereco: col('ENDEREÇO'), coord: col('LocalizacaoNoMapa'), tipoHub: col('TIPO DE HUB'), operacao: col('TIPO DE OPERAÇÃO'),
    regiao: col('REGIÃO'), gestor: col('GESTOR'), classe: col('Class'),
    a1: col('ANALISTA'), e1: col('E-MAIL'), t1: col('TELEFONE'),
    a2: col('ANALISTA 2'), e2: col('E-MAIL 2'), t2: col('TELEFONE 2'),
    a3: col('ANALISTA 3'), e3: col('E-MAIL 3'), t3: col('TELEFONE 3')
  };
  if (C.codigo < 0 || C.coord < 0) throw new Error('colunas SORT CODE ou LocalizacaoNoMapa não encontradas');
  const v = (linha, k) => (C[k] >= 0 ? String(linha[C[k]] || '').trim() : '');

  // Passo 2: lê cada linha e desempata Sort Codes repetidos pela nota
  const porCodigo = {};
  const repetidos = {};
  for (let i = 1; i < valores.length; i++) {
    const l = valores[i];
    const codigo = v(l, 'codigo').toUpperCase();
    if (!codigo) continue;
    const status = v(l, 'status');
    const coord = lerCoordenadaUnidade_(v(l, 'coord'));
    const analistas = [['a1', 'e1', 't1'], ['a2', 'e2', 't2'], ['a3', 'e3', 't3']]
      .map(([a, e, t]) => ({ nome: v(l, a), email: v(l, e), telefone: v(l, t) }))
      .filter(x => x.nome || x.email || x.telefone);
    const nota = (PESO_STATUS_UNIDADE_[status.toUpperCase()] || 0) * 10 + (coord ? 5 : 0) + analistas.filter(x => x.nome).length;
    const item = {
      codigo: codigo, nome: v(l, 'nome'), status: status, uf: v(l, 'uf').toUpperCase(), cidade: v(l, 'cidade'),
      endereco: v(l, 'endereco'), tipo: v(l, 'tipoHub') || v(l, 'operacao'), operacao: v(l, 'operacao'),
      regiao: v(l, 'regiao'), gestor: v(l, 'gestor'), classe: v(l, 'classe'), analistas: analistas,
      lat: coord ? coord.lat : null, lng: coord ? coord.lng : null, origem: coord ? 'planilha' : '', nota: nota, linha: i + 1
    };
    if (porCodigo[codigo]) {
      repetidos[codigo] = true;
      if (porCodigo[codigo].nota >= nota) continue;
    }
    porCodigo[codigo] = item;
  }

  // Unidades encerradas ou canceladas não vão para o mapa
  const lista = Object.keys(porCodigo).map(k => porCodigo[k])
    .filter(u => !/^(CLOSED|CANCELADO|CANCELLED|CANCELED)$/i.test(u.status));

  // Passo 4: plano B pela cidade (geocoder com cache) e pelo centro do estado
  const props = PropertiesService.getScriptProperties();
  let consultas = 0;
  lista.forEach(u => {
    if (u.origem) return;
    const cidade = limparCidadeUnidade_(u.cidade || u.nome, u.uf);
    if (cidade && u.uf) {
      const chave = 'UNID_GEO::' + normalizarTexto_(cidade) + '|' + u.uf;
      let salvo = props.getProperty(chave);
      if (salvo === null && consultas < GEOCODE_UNIDADES_MAX_) {
        consultas++;
        salvo = '0,0';
        try {
          const r = Maps.newGeocoder().setRegion('br').setLanguage('pt-BR').geocode(cidade + ', ' + u.uf + ', Brasil');
          const loc = r && r.results && r.results[0] && r.results[0].geometry.location;
          if (loc && dentroDoBrasilUnidade_(loc.lat, loc.lng)) salvo = loc.lat + ',' + loc.lng;
        } catch (e) { salvo = null; }
        if (salvo !== null) props.setProperty(chave, salvo);
      }
      if (salvo && salvo !== '0,0') {
        const p = salvo.split(',').map(Number);
        u.lat = p[0]; u.lng = p[1]; u.origem = 'cidade';
        return;
      }
    }
    const est = ESTADOS_BRASIL_METADATA[u.uf];
    if (est) { u.lat = est.lat; u.lng = est.lng; u.origem = 'uf'; }
  });

  // Passo 5: afasta em espiral só os pontos aproximados que caem no mesmo lugar
  const ocupados = {};
  lista.forEach(u => {
    if (u.lat === null || u.origem === 'planilha') return;
    const k = u.lat.toFixed(3) + ',' + u.lng.toFixed(3);
    const n = ocupados[k] || 0;
    ocupados[k] = n + 1;
    if (n) {
      const ang = n * 137.508 * Math.PI / 180, raio = 0.012 * Math.sqrt(n);
      u.lat += raio * Math.cos(ang); u.lng += raio * Math.sin(ang);
    }
    u.lat = Math.round(u.lat * 1e5) / 1e5; u.lng = Math.round(u.lng * 1e5) / 1e5;
  });

  // Passo 7: o que falta corrigir na planilha
  const problemas = {
    semCoordenada: lista.filter(u => u.origem !== 'planilha').map(u => u.codigo + ' (linha ' + u.linha + ')'),
    repetidos: Object.keys(repetidos),
    semLocal: lista.filter(u => u.lat === null).map(u => u.codigo)
  };
  lista.forEach(u => { delete u.nota; });
  return {
    ok: true, atualizado: Date.now(),
    fonte: 'Planilha UNIDADES PADRAO, aba UNIDADES SHOPEE',
    unidades: lista.filter(u => u.lat !== null),
    problemas: problemas,
    pendentesGeocoder: lista.some(u => u.origem === 'uf' && limparCidadeUnidade_(u.cidade || u.nome, u.uf))
  };
}

/** "-9.563665, -35.769371" ou "-9,563665; -35,769371" → {lat, lng}, só dentro do Brasil. */
function lerCoordenadaUnidade_(texto) {
  const s = String(texto || '').trim();
  if (!s) return null;
  let partes;
  if (s.indexOf(';') !== -1) partes = s.split(';');
  else {
    const m = s.match(/(-?\d+(?:[.,]\d+)?)\s*,\s*(-?\d+(?:[.,]\d+)?)/);
    partes = m ? [m[1], m[2]] : s.split(/\s+/);
  }
  if (!partes || partes.length < 2) return null;
  const lat = Number(String(partes[0]).trim().replace(',', '.'));
  const lng = Number(String(partes[1]).trim().replace(',', '.'));
  if (!isFinite(lat) || !isFinite(lng) || !dentroDoBrasilUnidade_(lat, lng)) return null;
  return { lat: lat, lng: lng };
}

function dentroDoBrasilUnidade_(lat, lng) {
  return lat >= -34 && lat <= 6 && lng >= -74 && lng <= -34;
}

/** "LM Hub_BA_Guanambi" → "Guanambi"; cidade comum fica como está. */
function limparCidadeUnidade_(texto, uf) {
  let s = String(texto || '').trim();
  if (!s) return '';
  const m = s.match(/_([A-Z]{2})_(.+)$/);
  if (m) s = m[2];
  s = s.replace(/\s*\/\s*[A-Za-z]{2}$/, '').replace(/\d+$/, '').replace(/_/g, ' ').trim();
  return s;
}
