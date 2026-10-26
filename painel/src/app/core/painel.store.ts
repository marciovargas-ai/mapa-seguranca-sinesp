import { computed, Injectable, signal } from '@angular/core';
import { encurtarOficial, encurtarPanorama, filtrar, normalizarPacote, pacoteVazio } from './analise';
import { CacheDisco } from './cache-disco';
import { CFG, ESTADOS } from './dados';
import { gerarInsights } from './insights';
import { Pacote, Panorama } from './modelos';
import { buscarMunicipio, municipioMaisProximo, municipioPorCodigo } from './municipios';
import { carregarPopulacao, enriquecerOficial, enriquecerPanorama, PopulacaoUf } from './populacao';
import { Servidor } from './servidor';
import { fetchComTimeout, gravarLocal, lerLocal, normalizar } from './util';

export type Aba = 'GERAL' | 'OFICIAL' | 'ESTADO' | 'ZONAS' | 'NOTICIAS';
export type Escopo = 'CIDADE' | 'ESTADO';
export interface Camadas { zonas: boolean; calor: boolean; pinos: boolean; bairros: boolean; fronteira: boolean; satelite: boolean; mapaEscuro: boolean; coropletico: boolean }
export interface Status { icone: string; texto: string; tipo: '' | 'ok' | 'erro' }
export type Foco = { lat: number; lng: number; zoom?: number; raio?: number; n: number } | null;

const chaveLocal = (uf: string, cidade: string) => uf + '|' + normalizar(cidade);

/** Estado único do painel (signals) e as ações que falam com o servidor. */
@Injectable({ providedIn: 'root' })
export class PainelStore {
  readonly uf = signal(CFG.UF_PADRAO);
  readonly cidade = signal('');
  readonly escopo = signal<Escopo>('CIDADE');
  readonly periodoDias = signal(CFG.PERIODO_PADRAO_DIAS);
  readonly categorias = signal<string[]>([]);
  readonly orgao = signal('');
  readonly aba = signal<Aba>('OFICIAL');
  readonly camadas = signal<Camadas>({ zonas: true, calor: true, pinos: true, bairros: true, fronteira: true, satelite: false, mapaEscuro: false, coropletico: true });
  readonly dados = signal<Pacote | null>(null);
  readonly carregando = signal(false);
  readonly coletando = signal(false);
  readonly status = signal<Status>({ icone: 'hourglass_empty', texto: 'Iniciando…', tipo: '' });
  /** Panorama como veio do servidor; `panorama` já traz as taxas completadas com a população do IBGE. */
  readonly panoramaBruto = signal<Panorama | null>(null);
  readonly populacao = signal<PopulacaoUf | null>(null);
  readonly panorama = computed(() => enriquecerPanorama(encurtarPanorama(this.panoramaBruto()), this.populacao()));
  readonly panoramaCarregando = signal(false);
  readonly eventoPanorama = signal(0);
  readonly escuro = signal(false);
  readonly foco = signal<Foco>(null);

  readonly nomeLocal = computed(() =>
    this.escopo() === 'ESTADO' ? ESTADOS[this.uf()].nome : `${this.cidade()} — ${this.uf()}`);

  readonly filtrados = computed(() =>
    filtrar(this.dados(), this.periodoDias(), this.categorias(), this.orgao(), this.escopo() === 'ESTADO'));

  /** Indicadores oficiais do local aberto (no estado, o panorama traz os mesmos números). */
  readonly oficial = computed(() => {
    const d = this.dados();
    const ehEstado = this.escopo() === 'ESTADO';
    const o = d?.oficial ? encurtarOficial(d.oficial) : ehEstado ? this.panorama()?.oficial || null : null;
    return enriquecerOficial(o, this.uf(), this.cidade(), ehEstado, this.populacao(), this.panorama());
  });

  readonly insights = computed(() =>
    gerarInsights({
      ehEstado: this.escopo() === 'ESTADO', nomeLocal: this.nomeLocal(), cidade: this.cidade(),
      oficial: this.oficial(), panorama: this.panorama()?.uf === this.uf() ? this.panorama() : null,
      f: this.filtrados(), periodoDias: this.periodoDias(),
    }));

  private tokenAbertura = 0;
  private memoria = new Map<string, { em: number; res: any }>();
  private panoramas = new Map<string, Panorama>();

  constructor() {
    const tema = lerLocal(CFG.CHAVE_TEMA);
    this.definirTema(tema ? tema === 'escuro' : window.matchMedia?.('(prefers-color-scheme: dark)').matches, false);
  }

  definirTema(escuro: boolean, salvar = true): void {
    this.escuro.set(escuro);
    document.documentElement.classList.toggle('tema-escuro', escuro);
    if (salvar) gravarLocal(CFG.CHAVE_TEMA, escuro ? 'escuro' : 'claro');
  }

  alternarCamada(nome: keyof Camadas): void {
    this.camadas.update((c) => ({ ...c, [nome]: !c[nome] }));
  }

  alternarCategoria(id: string): void {
    if (!id) { this.categorias.set([]); return; }
    this.categorias.update((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  }

  definirOrgao(id: string): void {
    this.orgao.update((atual) => (id && id !== atual ? id : ''));
  }

  focar(lat: number | undefined, lng: number | undefined, zoom = 16, raio?: number): void {
    if (!lat || !lng) return;
    this.foco.set({ lat, lng, zoom, raio, n: Date.now() });
  }

  private definirStatus(icone: string, texto: string, tipo: Status['tipo'] = ''): void {
    this.status.set({ icone, texto, tipo });
  }

  /** Abre uma cidade ou o estado: mostra o que está guardado na hora e atualiza em seguida. */
  abrirLocal(uf: string, nome: string): void {
    const meta = ESTADOS[uf];
    if (!meta) return;
    const token = ++this.tokenAbertura;
    const ehEstado = nome === 'ESTADO_INTEIRO';
    const mun = ehEstado ? null : buscarMunicipio(uf, nome);
    if (!ehEstado && !mun) { this.definirStatus('error', 'Município não encontrado: ' + nome, 'erro'); return; }

    const ufMudou = uf !== this.uf();
    this.uf.set(uf);
    this.escopo.set(ehEstado ? 'ESTADO' : 'CIDADE');
    this.cidade.set(ehEstado ? '' : mun!.nome);
    if (ehEstado && this.aba() === 'ZONAS') this.aba.set('ESTADO');
    if (!ehEstado && this.aba() === 'ESTADO') this.aba.set('OFICIAL');
    if (ufMudou) this.eventoPanorama.set(0);

    const lat = ehEstado ? meta.lat : mun!.lat;
    const lng = ehEstado ? meta.lng : mun!.lng;
    const nomeServidor = ehEstado ? 'ESTADO_INTEIRO' : mun!.nome;
    const chave = chaveLocal(uf, nomeServidor);
    this.dados.set(pacoteVazio(uf, nomeServidor, lat, lng, ehEstado ? meta.ibge : mun!.ibge));
    this.carregarPanorama(uf);
    if (this.populacao()?.uf !== uf) {
      this.populacao.set(null);
      carregarPopulacao(uf).then((p) => { if (p && this.uf() === uf) this.populacao.set(p); });
    }

    const emMemoria = this.memoria.get(chave);
    if (emMemoria && emMemoria.em > Date.now() - CFG.MINUTOS_CACHE_NAVEGADOR * 60000) {
      this.dados.set(normalizarPacote(emMemoria.res));
      this.carregando.set(false);
      this.definirStatus('check_circle', 'Atualizado às ' + (emMemoria.res.atualizadoEm || ''), 'ok');
      return;
    }

    this.carregando.set(true);
    this.definirStatus('sync', 'Carregando ' + (ehEstado ? meta.nome : mun!.nome) + '…');
    let mostrouDoDisco = false;
    CacheDisco.obterPacote<any>(chave).then((v) => {
      if (!v || token !== this.tokenAbertura || !this.carregando()) return;
      mostrouDoDisco = true;
      this.dados.set(normalizarPacote(v.dado));
      this.definirStatus('sync', 'Mostrando dados guardados · atualizando…');
    });

    Servidor.cidade(uf, nomeServidor, lat, lng, false).then((res) => {
      if (!this.receber(res, token)) return;
      this.carregando.set(false);
      if (res.precisaColeta && !ehEstado) { this.coletar(uf, mun!.nome, lat, lng, token); return; }
      this.definirStatus('check_circle', res.ultimaColeta ? 'Dados de ' + res.ultimaColeta : 'Atualizado às ' + res.atualizadoEm, 'ok');
    }).catch((erro) => {
      if (token !== this.tokenAbertura) return;
      this.carregando.set(false);
      this.definirStatus('error', mostrouDoDisco ? 'Sem conexão com o servidor; mostrando dados guardados'
        : 'Falha ao carregar: ' + (erro?.message || 'erro'), 'erro');
    });
  }

  private receber(res: any, token: number): boolean {
    if (token !== this.tokenAbertura || !res) return false;
    this.dados.set(normalizarPacote(res));
    const chave = chaveLocal(res.uf, res.cidade);
    this.memoria.set(chave, { em: Date.now(), res });
    CacheDisco.salvarPacote(chave, res);
    return true;
  }

  private coletar(uf: string, cidade: string, lat: number, lng: number, token: number): void {
    this.definirStatus('travel_explore', 'Consultando Google Notícias e imprensa local…');
    this.coletando.set(true);
    Servidor.cidade(uf, cidade, lat, lng, true).then((res) => {
      this.coletando.set(false);
      if (!this.receber(res, token)) return;
      if (res.coletaEmAndamento) { this.definirStatus('hourglass_top', 'Coleta em andamento; atualize em instantes'); return; }
      const novas = res.novasCapturadasAgora || 0;
      this.definirStatus('check_circle', (novas ? `Google Notícias: ${novas} ${novas === 1 ? 'notícia nova' : 'notícias novas'} · `
        : 'Google Notícias: nada novo · ') + 'atualizado às ' + res.atualizadoEm, 'ok');
    }).catch(() => {
      this.coletando.set(false);
      if (token === this.tokenAbertura) this.definirStatus('error', 'Coleta não concluída; mostrando dados salvos', 'erro');
    });
  }

  atualizarAgora(): void {
    const d = this.dados();
    if (!d) return;
    if (this.escopo() === 'ESTADO') {
      this.memoria.delete(chaveLocal(this.uf(), 'ESTADO_INTEIRO'));
      this.panoramas.delete(this.uf());
      this.abrirLocal(this.uf(), 'ESTADO_INTEIRO');
      return;
    }
    this.coletar(this.uf(), this.cidade(), d.centroLat, d.centroLng, this.tokenAbertura);
  }

  /** Panorama do estado (rankings municipais do Sinesp), guardado em memória e no disco por 6 h. */
  carregarPanorama(uf: string): void {
    const atual = this.panoramaBruto();
    if (atual?.uf === uf && (atual.disponivel || this.panoramas.has(uf))) return;
    const emMemoria = this.panoramas.get(uf);
    if (emMemoria) { this.panoramaBruto.set(emMemoria); return; }
    this.panoramaBruto.set(null);
    this.panoramaCarregando.set(true);
    const chave = 'PANORAMA_' + uf;
    CacheDisco.obter<Panorama>(chave, 0.25).then((guardado) => {
      if (guardado && this.uf() === uf && !this.panoramaBruto()) this.panoramaBruto.set(guardado);
    });
    Servidor.panorama(uf).then((p) => {
      p = { ...p, uf };
      this.panoramas.set(uf, p);
      if (p.disponivel) CacheDisco.salvar(chave, p);
      if (this.uf() === uf) { this.panoramaBruto.set(p); this.panoramaCarregando.set(false); }
    }).catch((e) => {
      if (this.uf() !== uf) return;
      this.panoramaCarregando.set(false);
      if (!this.panoramaBruto()) this.panoramaBruto.set({ disponivel: false, uf, motivo: 'Não foi possível carregar o panorama: ' + (e?.message || 'erro') });
    });
  }

  buscarCep(cep: string): void {
    if (cep.length !== 8) { this.definirStatus('error', 'Digite um CEP com 8 números', 'erro'); return; }
    this.definirStatus('search', 'Buscando CEP…');
    fetchComTimeout('https://viacep.com.br/ws/' + cep + '/json/').then((r) => r.json()).then((d) => {
      const mun = d && !d.erro ? municipioPorCodigo(d.ibge) || buscarMunicipio(String(d.uf).toUpperCase(), d.localidade) : null;
      if (mun) this.abrirLocal(mun.uf, mun.nome);
      else this.definirStatus('error', 'CEP não encontrado', 'erro');
    }).catch(() => this.definirStatus('error', 'Não foi possível consultar o CEP', 'erro'));
  }

  /** GPS do aparelho; se falhar, localização aproximada pela rede. */
  localizar(aoFalhar?: () => void): void {
    let concluido = false;
    const concluir = (mun: { uf: string; nome: string } | null) => {
      if (concluido) return;
      concluido = true;
      clearTimeout(timer);
      if (mun) this.abrirLocal(mun.uf, mun.nome);
      else aoFalhar?.();
    };
    const timer = setTimeout(() => concluir(null), CFG.TEMPO_LIMITE_LOCALIZACAO_MS);
    const porRede = () => {
      fetchComTimeout('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=pt', 2000)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d || d.countryCode !== 'BR') return concluir(null);
          const uf = String(d.principalSubdivisionCode || '').replace('BR-', '').toUpperCase();
          let mun = ESTADOS[uf] && d.city ? buscarMunicipio(uf, d.city) : null;
          if (!mun && d.latitude && d.longitude) mun = municipioMaisProximo(Number(d.latitude), Number(d.longitude));
          concluir(mun);
        }).catch(() => concluir(null));
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => concluir(municipioMaisProximo(pos.coords.latitude, pos.coords.longitude)),
        porRede, { timeout: CFG.TEMPO_LIMITE_LOCALIZACAO_MS - 300, maximumAge: 600000 });
    } else porRede();
  }

  statusLocalizando(): void { this.definirStatus('my_location', 'Localizando…'); }
  statusSemLocalizacao(): void { this.definirStatus('location_off', 'Localização indisponível', 'erro'); }
}
