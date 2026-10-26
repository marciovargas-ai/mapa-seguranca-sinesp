/** Formatos trocados com o servidor (Apps Script) e estruturas derivadas no painel. */

export interface Ocorrencia {
  id: string; data: string; ts: number; cidade: string; bairro: string; cat: string;
  titulo: string; veiculo: string; link: string; lat: number | null; lng: number | null;
  precisao: string; precisa: boolean; orgaos: string[]; local: boolean;
}

export interface EventoOficial {
  nome: string; total: number; anterior: number | null; serie: number[];
  porAno: (number | null)[]; parcialAnterior: number | null; serie36: number[];
  federais: Record<string, number> | null; taxa: number | null; taxaEstado?: number | null;
}

export interface Oficial {
  disponivel: boolean; motivo?: string; fonte?: string; urlPainel?: string; escopo?: 'ESTADO' | 'MUNICIPIO';
  periodo?: string; meses?: string[]; anos?: number[]; ultimoMes?: string; periodoTresAnos?: string;
  anoUltimoDado?: number; fimMesIdx?: number; populacao?: number | null; codigoIbge?: string | null;
  anoPopulacao?: number | null; importadoEm?: string; eventos: EventoOficial[];
}

export interface Pacote {
  uf: string; cidade: string; codigoIbge: string; centroLat: number; centroLng: number;
  ocorrencias: Ocorrencia[]; totalNaBase: number; cidadesMonitoradas: number;
  oficial: Oficial | null; atualizadoEm: string; ultimaColeta: string; versaoLocal: number; vazio?: boolean;
  bairros?: { n: string; lat: number; lng: number }[];
}

export interface LinhaRanking { n: string; ibge: string | null; pop: number | null; total: number; anterior: number; taxa: number | null }

export interface Ranking {
  evento: string; municipiosComRegistro: number; porTotal: LinhaRanking[]; porTaxa: LinhaRanking[];
  altas: LinhaRanking[]; quedas: LinhaRanking[]; valoresTaxa: Record<string, number>;
  todas?: [string, number, number][];
}

export interface Panorama {
  disponivel: boolean; motivo?: string; uf?: string; oficial?: Oficial; rankings?: Ranking[];
  municipios?: number; fonte?: string; anoPopulacao?: number | null;
}

export interface Local {
  nome: string; cidade: string; qtd: number; n: number; lat?: number; lng?: number; catTop: string;
}

export interface Zona {
  lat: number; lng: number; qtd: number; peso: number; raio: number; nome: string; cidade: string;
  cats: { id: string; qtd: number }[]; graves: number; recentes: number; anteriores30: number;
  rank: number; indice: number; nivel: 'critica' | 'alta' | 'moderada';
}

export interface ResumoOrgao { qtd: number; graves: number; precisas: number }

export interface Filtrados {
  todas: Ocorrencia[]; anteriores: Ocorrencia[]; comparavel: boolean; precisas: Ocorrencia[]; semLocal: Ocorrencia[];
  porCat: Record<string, number>; porCatAnt: Record<string, number>; locais: Local[];
  serie: { labels: string[]; porCat: Record<string, number[]> }; semana: number[];
  fontes: { nome: string; qtd: number }[]; zonas: Zona[];
  porOrgao: Record<string, ResumoOrgao>; imprensaLocal: number; totalCruzamento: number; semOrgao: number;
}

export type Tom = 'alerta' | 'positivo' | 'neutro';
export interface Insight { icone: string; tom: Tom; titulo: string; texto: string; fonte: string }

export interface Municipio { uf: string; nome: string; ibge: string; lat: number; lng: number; norm: string }
