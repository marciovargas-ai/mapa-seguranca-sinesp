import { distanciaKm, fetchComTimeout, normalizar } from './util';

/** Ponto do CEP pesquisado: fica marcado no mapa até a pessoa remover. */
export interface PontoCep {
  /** cep = CEP pesquisado; coord = coordenada digitada ou colada (link do Google Maps) */
  tipo: 'cep' | 'coord';
  cep: string; logradouro: string; bairro: string; cidade: string; uf: string; ibge: string;
  lat: number; lng: number;
  /** endereco = coordenada do próprio CEP; rua = rua localizada no OpenStreetMap; bairro = centro do bairro; cidade = centro da cidade */
  precisao: 'endereco' | 'rua' | 'bairro' | 'cidade';
  fonte: string; em: number;
}

/** Dados do ViaCEP que interessam. */
export interface EnderecoCep { logradouro?: string; bairro?: string; localidade?: string; uf?: string; ibge?: string }

/** Distância máxima aceita entre o ponto achado e o centro da cidade (evita pino em cidade homônima de outro estado). */
const MAX_KM_DO_CENTRO = 60;

/**
 * Coordenada do CEP, da mais precisa para a menos precisa:
 * 1) coordenada do próprio CEP (AwesomeAPI de CEP, base pública com lat/lng por CEP);
 * 2) rua do CEP no OpenStreetMap (Nominatim);
 * 3) centro do bairro (ver pontoNoBairro, com os bairros já carregados no painel);
 * 4) centro da cidade.
 */
export async function localizarCep(cep: string, end: EnderecoCep, centro: { lat: number; lng: number }): Promise<Pick<PontoCep, 'lat' | 'lng' | 'precisao' | 'fonte'>> {
  const perto = (lat: number, lng: number) => isFinite(lat) && isFinite(lng) && distanciaKm(lat, lng, centro.lat, centro.lng) <= MAX_KM_DO_CENTRO;
  try {
    const r = await fetchComTimeout('https://cep.awesomeapi.com.br/json/' + cep, 6000);
    if (r.ok) {
      const j = await r.json();
      const lat = Number(j?.lat), lng = Number(j?.lng);
      if (perto(lat, lng)) return { lat, lng, precisao: 'endereco', fonte: 'AwesomeAPI (CEP)' };
    }
  } catch { /* próxima fonte */ }
  if (end.logradouro) {
    try {
      const q = new URLSearchParams({ format: 'jsonv2', limit: '1', countrycodes: 'br', street: end.logradouro, city: end.localidade || '', state: end.uf || '', country: 'Brasil' });
      const r = await fetchComTimeout('https://nominatim.openstreetmap.org/search?' + q.toString(), 6000);
      if (r.ok) {
        const j = await r.json();
        const lat = Number(j?.[0]?.lat), lng = Number(j?.[0]?.lon);
        if (perto(lat, lng)) return { lat, lng, precisao: 'rua', fonte: 'OpenStreetMap' };
      }
    } catch { /* centro da cidade */ }
  }
  return { lat: centro.lat, lng: centro.lng, precisao: 'cidade', fonte: 'IBGE' };
}

/** Sem coordenada da rua: usa o centro do bairro do CEP, se ele estiver entre os bairros carregados da cidade. */
export function pontoNoBairro(p: PontoCep, bairros: { nome: string; lat: number; lng: number }[]): PontoCep {
  if (p.precisao !== 'cidade' || !p.bairro) return p;
  const alvo = normalizar(p.bairro);
  const b = bairros.find((x) => normalizar(x.nome) === alvo);
  return b && isFinite(b.lat) ? { ...p, lat: b.lat, lng: b.lng, precisao: 'bairro', fonte: 'Bairros IBGE/OpenStreetMap' } : p;
}

export function formatarCep(cep: string): string { return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2'); }

/** Brasil com folga (inclui ilhas oceânicas). */
const NO_BRASIL = (lat: number, lng: number) => lat >= -34.5 && lat <= 6 && lng >= -74.5 && lng <= -28;

/**
 * Coordenada digitada ou colada na busca. Aceita:
 * - decimal: "-23.5505, -46.6333", "-23.5505 -46.6333", "-23,5505 -46,6333", "-23,5505; -46,6333";
 * - graus, minutos e segundos: 23°33'01.8"S 46°38'00.0"W (W ou O = oeste; S = sul);
 * - graus e minutos decimais: 23°33.03'S 46°38.00'W;
 * - link do Google Maps: .../@-23.55,-46.63,15z, ?q=-23.55,-46.63, ?ll=..., !3d-23.55!4d-46.63.
 * Fora do Brasil (ou ordem trocada longitude/latitude) é corrigido ou recusado.
 */
export function lerCoordenada(texto: string): { lat: number; lng: number } | null {
  const t = String(texto || '').trim();
  if (!t) return null;
  const num = (x: string) => Number(x.replace(',', '.'));
  const validar = (a: number, b: number) => {
    if (!isFinite(a) || !isFinite(b)) return null;
    if (NO_BRASIL(a, b)) return { lat: a, lng: b };
    if (NO_BRASIL(b, a)) return { lat: b, lng: a };  // colaram longitude, latitude
    return null;
  };
  // Link do Google Maps (ou de outro mapa com o mesmo padrão)
  let m = t.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/) || t.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
    || t.match(/[?&](?:q|query|ll|center|destination)=(-?\d+(?:\.\d+)?)(?:,|%2C)\s*(-?\d+(?:\.\d+)?)/i);
  if (m) return validar(Number(m[1]), Number(m[2]));
  // Graus (minutos (segundos)) com hemisfério
  const re = /(-?\d+(?:[.,]\d+)?)\s*[°º]\s*(?:(\d+(?:[.,]\d+)?)\s*['′’]\s*)?(?:(\d+(?:[.,]\d+)?)\s*(?:["″”]|'')\s*)?([NSLOEW])?/gi;
  const partes = [...t.matchAll(re)];
  if (partes.length === 2) {
    const v = partes.map((p) => {
      let g = Math.abs(num(p[1])) + (p[2] ? num(p[2]) / 60 : 0) + (p[3] ? num(p[3]) / 3600 : 0);
      const h = (p[4] || '').toUpperCase();
      if (p[1].startsWith('-') || h === 'S' || h === 'W' || h === 'O') g = -g;
      return { g, h };
    });
    // Sem hemisfério escrito, no Brasil: sul e oeste (latitude ao norte só em RR/AP/AM/PA, perto do equador)
    if (!v[0].h && !v[1].h) {
      const sul = validar(-Math.abs(v[0].g), -Math.abs(v[1].g));
      return sul || validar(Math.abs(v[0].g), -Math.abs(v[1].g));
    }
    if (v[0].h === 'W' || v[0].h === 'O' || v[0].h === 'E' || v[0].h === 'L') return validar(v[1].g, v[0].g);
    return validar(v[0].g, v[1].g);
  }
  // Decimal com ponto (separador vírgula, ponto e vírgula ou espaço)
  m = t.match(/^(-?\d{1,3}\.\d+)\s*[,;\s]\s*(-?\d{1,3}\.\d+)$/);
  if (m) return validar(Number(m[1]), Number(m[2]));
  // Decimal com vírgula (separador espaço, ponto e vírgula, ou vírgula seguida de espaço)
  m = t.match(/^(-?\d{1,3},\d+)\s*(?:;|,\s|\s)\s*(-?\d{1,3},\d+)$/);
  if (m) return validar(num(m[1]), num(m[2]));
  return null;
}

export function formatarCoordenada(lat: number, lng: number): string {
  return lat.toFixed(5) + ', ' + lng.toFixed(5);
}

/** Endereço do ponto (rua, bairro, cidade e UF) pelo OpenStreetMap; null se não responder. */
export async function enderecoDaCoordenada(lat: number, lng: number): Promise<{ rua: string; bairro: string; cidade: string; uf: string } | null> {
  try {
    const q = new URLSearchParams({ format: 'jsonv2', lat: String(lat), lon: String(lng), zoom: '18', addressdetails: '1', 'accept-language': 'pt-BR' });
    const r = await fetchComTimeout('https://nominatim.openstreetmap.org/reverse?' + q.toString(), 6000);
    if (!r.ok) return null;
    const a = (await r.json())?.address;
    if (!a || a.country_code !== 'br') return null;
    const uf = String(a['ISO3166-2-lvl4'] || '').replace('BR-', '').toUpperCase();
    return { rua: a.road || a.pedestrian || '', bairro: a.suburb || a.neighbourhood || a.quarter || a.city_district || '',
      cidade: a.city || a.town || a.village || a.municipality || '', uf };
  } catch { return null; }
}
