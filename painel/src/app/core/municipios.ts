import { ESTADOS } from './dados';
import { Municipio } from './modelos';
import { distanciaKm, normalizar } from './util';

/** Base das 5.570 sedes municipais, injetada pelo template do Apps Script. */
declare const BASE_MUNICIPIOS_BR: { codigosUf: Record<string, string>; municipios: Record<string, string> } | undefined;

const porUf = new Map<string, Municipio[]>();
const porCodigo = new Map<string, Municipio>();
let todas: Municipio[] | null = null;

export function municipiosUf(uf: string): Municipio[] {
  const emCache = porUf.get(uf);
  if (emCache) return emCache;
  const base = typeof BASE_MUNICIPIOS_BR !== 'undefined' ? BASE_MUNICIPIOS_BR : (window as any).BASE_MUNICIPIOS_BR;
  const lista: Municipio[] = [];
  if (base && base.municipios[uf]) {
    const codUf = base.codigosUf[uf];
    for (const reg of base.municipios[uf].split(';')) {
      const p = reg.split('|');
      const m = { uf, nome: p[0], ibge: codUf + p[1], lat: Number(p[2]), lng: Number(p[3]), norm: normalizar(p[0]) };
      lista.push(m);
      porCodigo.set(m.ibge, m);
    }
  }
  porUf.set(uf, lista);
  return lista;
}

export function todosMunicipios(): Municipio[] {
  if (!todas) todas = Object.keys(ESTADOS).flatMap((uf) => municipiosUf(uf));
  return todas;
}

export function buscarMunicipio(uf: string, nome: string): Municipio | null {
  const alvo = normalizar(nome);
  return municipiosUf(uf).find((m) => m.norm === alvo) || null;
}

export function municipioPorCodigo(cod: string | number | null | undefined): Municipio | null {
  todosMunicipios();
  return porCodigo.get(String(cod || '')) || null;
}

export function municipioMaisProximo(lat: number, lng: number): Municipio | null {
  let melhor: Municipio | null = null;
  let menor = Infinity;
  for (const m of todosMunicipios()) {
    const d = distanciaKm(lat, lng, m.lat, m.lng);
    if (d < menor) { menor = d; melhor = m; }
  }
  return melhor;
}

export interface Sugestao { tipo: 'CEP' | 'UF' | 'MUN'; rotulo: string; detalhe: string; uf?: string; nome?: string; cep?: string }

export function sugerir(texto: string): Sugestao[] {
  const bruto = String(texto || '').trim();
  const digitos = bruto.replace(/\D/g, '');
  const itens: Sugestao[] = [];
  if (/^\d[\d\-\s.]*$/.test(bruto) && digitos.length >= 5) {
    itens.push({ tipo: 'CEP', cep: digitos, rotulo: 'Buscar CEP ' + digitos.replace(/^(\d{5})(\d{0,3})/, '$1-$2'), detalhe: digitos.length === 8 ? 'Enter' : 'digite 8 números' });
    return itens;
  }
  if (bruto.length < 2) return itens;
  const alvo = normalizar(bruto);
  for (const uf of Object.keys(ESTADOS)) {
    if (normalizar(ESTADOS[uf].nome).startsWith(alvo) || uf.toLowerCase() === alvo) {
      itens.push({ tipo: 'UF', uf, rotulo: 'Estado: ' + ESTADOS[uf].nome, detalhe: uf });
    }
  }
  const comeca: Municipio[] = [];
  const contem: Municipio[] = [];
  for (const m of todosMunicipios()) {
    if (comeca.length >= 8) break;
    if (m.norm.startsWith(alvo)) comeca.push(m);
    else if (contem.length < 8 && m.norm.indexOf(alvo) > 0) contem.push(m);
  }
  comeca.sort((a, b) => a.norm.length - b.norm.length);
  for (const m of comeca.concat(contem).slice(0, 8)) itens.push({ tipo: 'MUN', uf: m.uf, nome: m.nome, rotulo: m.nome, detalhe: m.uf });
  return itens.slice(0, 9);
}
