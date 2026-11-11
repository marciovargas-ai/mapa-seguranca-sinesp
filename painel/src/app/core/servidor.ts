import { Panorama } from './modelos';

/**
 * Ponte com o Apps Script (google.script.run) em forma de Promise.
 * Fora do Apps Script (testes locais) usa window.__servidorTeste, se existir.
 */
declare const google: any;

function executor(): any {
  if (typeof google !== 'undefined' && google.script && google.script.run) return google.script.run;
  return (window as any).__servidorTeste || null;
}

function chamar<T>(funcao: string, ...args: unknown[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = executor();
    if (!run) { reject(new Error('Abra o painel pelo Apps Script')); return; }
    run.withSuccessHandler(resolve).withFailureHandler(reject)[funcao](...args);
  });
}

export const Servidor = {
  cidade: (uf: string, cidade: string, lat: number, lng: number, forcar: boolean, desde = 0) =>
    chamar<any>('obterOuAtualizarCidadeNacional', uf, cidade, lat, lng, forcar === true, desde || 0),
  panorama: (uf: string) => chamar<Panorama>('obterPanoramaEstado', uf),
  bairros: (ibge: string) => chamar<any[]>('obterBairrosCidade', ibge).then((l) => (Array.isArray(l) ? l : []), () => []),
  fogoCruzado: (uf: string, cidade: string) =>
    chamar<any>('obterFogoCruzado', uf, cidade).then((r) => r || null, (e) => ({ configurado: true, erro: String(e?.message || e), itens: [] })),
  fronteira: (codigo: string) =>
    chamar<string>('obterFronteiraIbge', codigo).then((t) => { try { return JSON.parse(t); } catch { return null; } }, () => null),
};
