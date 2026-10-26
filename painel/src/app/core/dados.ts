/**
 * Parâmetros e referências do painel. Nenhum número de criminalidade fica fixo
 * aqui: ocorrências vêm das notícias coletadas e os indicadores oficiais vêm do
 * Sinesp importado pelo servidor.
 */
export const CFG = {
  PERIODO_PADRAO_DIAS: 90,
  UF_PADRAO: 'SP', // só se GPS e rede não indicarem a cidade do usuário
  CIDADE_PADRAO: 'São Paulo',
  TEMPO_LIMITE_LOCALIZACAO_MS: 3000,
  TIMEOUT_REDE_EXTERNA_MS: 6000,
  MINUTOS_CACHE_NAVEGADOR: 5, // reabrir a mesma cidade nesse prazo não chama o servidor
  DIAS_CACHE_FRONTEIRAS: 60, // contornos do IBGE guardados no navegador
  CACHE_PACOTES_MB: 40, // dados guardados no navegador (abre na hora; apaga os menos usados)
  MAX_NOTICIAS_POR_PAGINA: 40,

  RAIO_CALOR_METROS: 350,
  RAIO_CALOR_MIN_PX: 14,
  RAIO_CALOR_MAX_PX: 46,
  RAIO_PINO: 6,

  ZONA_CELULA_METROS: 400,
  ZONA_MIN_OCORRENCIAS: 3,
  ZONA_MAX_EXIBIDAS: 8,
  ZONA_RAIO_MIN_METROS: 250,
  ZONA_RAIO_MAX_METROS: 1600,
  ZONA_MEIA_VIDA_DIAS: 90,
  ZONA_PESO_MINIMO: 1.5,
  DIAS_HISTORICO_SERVIDOR: 365,

  ZOOM_CIDADE: 13,
  COR_FRONTEIRA_CIDADE: '#2563eb',
  COR_FRONTEIRA_ESTADO: '#d97706',
  CHAVE_AJUDA_VISTA: 'MAPA_SEG_V4_AJUDA',
  CHAVE_TEMA: 'MAPA_SEG_V4_TEMA',
  CHAVE_LARGURA: 'MAPA_SEG_V5_LARGURA',
};

export interface Categoria { id: string; nome: string; curto: string; cor: string; peso: number }
export interface Orgao { id: string; nome: string; curto: string; cor: string }

/** Tipos de crime do classificador do servidor; "peso" = gravidade no calor e nas zonas. */
export const CATEGORIAS: Categoria[] = [
  { id: 'CVLI', nome: 'Homicídio e latrocínio', curto: 'Homicídio', cor: '#dc2626', peso: 1.0 },
  { id: 'CONFRONTO', nome: 'Tiroteio e arma de fogo', curto: 'Tiroteio', cor: '#ea580c', peso: 0.85 },
  { id: 'CARGA', nome: 'Roubo de carga', curto: 'Carga', cor: '#9333ea', peso: 0.7 },
  { id: 'PATRIMONIO', nome: 'Roubo e furto', curto: 'Roubo/furto', cor: '#2563eb', peso: 0.55 },
  { id: 'TRAFICO', nome: 'Tráfico e operação policial', curto: 'Tráfico', cor: '#0d9488', peso: 0.45 },
  { id: 'BLOQUEIO', nome: 'Distúrbio e bloqueio de via', curto: 'Distúrbio', cor: '#64748b', peso: 0.35 },
];
export const CATEGORIA_POR_ID: Record<string, Categoria> = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c]));

/** Órgãos citados nas notícias (detectados no servidor) e registrados no Sinesp. */
export const ORGAOS: Orgao[] = [
  { id: 'PM', nome: 'Polícia Militar', curto: 'PM', cor: '#1d4ed8' },
  { id: 'COPOM', nome: 'COPOM / 190', curto: 'COPOM', cor: '#0891b2' },
  { id: 'PC', nome: 'Polícia Civil', curto: 'PC', cor: '#7c3aed' },
  { id: 'PRF', nome: 'Polícia Rodoviária Federal', curto: 'PRF', cor: '#ca8a04' },
  { id: 'GM', nome: 'Guarda Municipal', curto: 'GM', cor: '#059669' },
  { id: 'SSP', nome: 'Secretaria de Segurança (SSP)', curto: 'SSP', cor: '#be123c' },
  { id: 'PF', nome: 'Polícia Federal', curto: 'PF', cor: '#334155' },
];
export const ORGAO_POR_ID: Record<string, Orgao> = Object.fromEntries(ORGAOS.map((g) => [g.id, g]));

export const ROTULOS_PRECISAO: Record<string, { nome: string; cor: string }> = {
  ENDERECO: { nome: 'Rua / endereço', cor: '#059669' },
  BAIRRO: { nome: 'Bairro', cor: '#2563eb' },
  RODOVIA: { nome: 'Rodovia', cor: '#d97706' },
  MUNICIPIO: { nome: 'Só o município', cor: '#64748b' },
  PENDENTE: { nome: 'Em revalidação', cor: '#64748b' },
};
export const PRECISOES_NO_MAPA: Record<string, boolean> = { ENDERECO: true, BAIRRO: true, RODOVIA: true };

export const COR_NIVEL: Record<string, string> = { critica: '#dc2626', alta: '#f97316', moderada: '#eab308' };
export const NOME_NIVEL: Record<string, string> = { critica: 'Crítica', alta: 'Alta', moderada: 'Moderada' };

export const PERIODOS = [
  { dias: 30, rotulo: '30 dias' },
  { dias: 90, rotulo: '90 dias' },
  { dias: 180, rotulo: '6 meses' },
  { dias: 365, rotulo: '12 meses' },
];

export interface Estado { ibge: string; nome: string; capital: string; lat: number; lng: number }

/** Referência geográfica das 27 UFs. */
export const ESTADOS: Record<string, Estado> = {
  AC: { ibge: '12', nome: 'Acre', capital: 'Rio Branco', lat: -9.9754, lng: -67.8249 },
  AL: { ibge: '27', nome: 'Alagoas', capital: 'Maceió', lat: -9.6658, lng: -35.7350 },
  AP: { ibge: '16', nome: 'Amapá', capital: 'Macapá', lat: 0.0349, lng: -51.0694 },
  AM: { ibge: '13', nome: 'Amazonas', capital: 'Manaus', lat: -3.1190, lng: -60.0217 },
  BA: { ibge: '29', nome: 'Bahia', capital: 'Salvador', lat: -12.9714, lng: -38.5014 },
  CE: { ibge: '23', nome: 'Ceará', capital: 'Fortaleza', lat: -3.7172, lng: -38.5433 },
  DF: { ibge: '53', nome: 'Distrito Federal', capital: 'Brasília', lat: -15.7975, lng: -47.8919 },
  ES: { ibge: '32', nome: 'Espírito Santo', capital: 'Vitória', lat: -20.3155, lng: -40.3128 },
  GO: { ibge: '52', nome: 'Goiás', capital: 'Goiânia', lat: -16.6869, lng: -49.2648 },
  MA: { ibge: '21', nome: 'Maranhão', capital: 'São Luís', lat: -2.5387, lng: -44.2825 },
  MT: { ibge: '51', nome: 'Mato Grosso', capital: 'Cuiabá', lat: -15.6014, lng: -56.0979 },
  MS: { ibge: '50', nome: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.4697, lng: -54.6201 },
  MG: { ibge: '31', nome: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.9167, lng: -43.9345 },
  PA: { ibge: '15', nome: 'Pará', capital: 'Belém', lat: -1.4558, lng: -48.4902 },
  PB: { ibge: '25', nome: 'Paraíba', capital: 'João Pessoa', lat: -7.1195, lng: -34.8450 },
  PR: { ibge: '41', nome: 'Paraná', capital: 'Curitiba', lat: -25.4284, lng: -49.2733 },
  PE: { ibge: '26', nome: 'Pernambuco', capital: 'Recife', lat: -8.0476, lng: -34.8770 },
  PI: { ibge: '22', nome: 'Piauí', capital: 'Teresina', lat: -5.0920, lng: -42.8038 },
  RJ: { ibge: '33', nome: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  RN: { ibge: '24', nome: 'Rio Grande do Norte', capital: 'Natal', lat: -5.7945, lng: -35.2110 },
  RS: { ibge: '43', nome: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.0346, lng: -51.2177 },
  RO: { ibge: '11', nome: 'Rondônia', capital: 'Porto Velho', lat: -8.7619, lng: -63.9039 },
  RR: { ibge: '14', nome: 'Roraima', capital: 'Boa Vista', lat: 2.8235, lng: -60.6758 },
  SC: { ibge: '42', nome: 'Santa Catarina', capital: 'Florianópolis', lat: -27.5954, lng: -48.5480 },
  SP: { ibge: '35', nome: 'São Paulo', capital: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  SE: { ibge: '28', nome: 'Sergipe', capital: 'Aracaju', lat: -10.9472, lng: -37.0731 },
  TO: { ibge: '17', nome: 'Tocantins', capital: 'Palmas', lat: -10.1840, lng: -48.3336 }
};
export const UFS = Object.keys(ESTADOS).sort();
