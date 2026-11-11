import { computed, Injectable, signal } from '@angular/core';
import { calcularZonas, encurtarOficial, encurtarPanorama, filtrar, normalizarPacote, pacoteVazio } from './analise';
import { carregarOficial, catsOficiais, OficialArea, oficialPorBairro } from './oficial';
import { carregarFogoCruzado, carregarIsp, carregarReferencia, carregarSim, carregarRoubos, FogoCruzado, IspMunicipio, ReferenciaNacional, Tiroteio } from './areas';
import { Bairro, carregarBairros, resumirBairros } from './bairros';
import { CacheDisco } from './cache-disco';
import { compilar } from './compilado';
import { CFG, ESTADOS } from './dados';
import { gerarInsights } from './insights';
import { Filtrados, Ocorrencia, Pacote, Panorama } from './modelos';
import { buscarMunicipio, municipioMaisProximo, municipioPorCodigo, municipiosUf } from './municipios';
import { carregarPopulacao, enriquecerOficial, enriquecerPanorama, PopulacaoUf } from './populacao';
import { aplicarPeriodo, mesesDoPeriodo } from './periodo';
import { Servidor } from './servidor';
import { distanciaKm, fetchComTimeout, gravarLocal, lerLocal, normalizar, tsParaData } from './util';

export type Aba = 'PANORAMA' | 'OFICIAL' | 'ESTADO' | 'ZONAS' | 'FACCOES' | 'NOTICIAS';
export type Escopo = 'CIDADE' | 'ESTADO';
export interface Camadas { zonas: boolean; calor: boolean; pinos: boolean; bairros: boolean; fronteira: boolean; vizinhos: boolean; satelite: boolean; mapaEscuro: boolean; coropletico: boolean; delegacias: boolean; oficial: boolean }
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
  readonly aba = signal<Aba>('PANORAMA');
  readonly camadas = signal<Camadas>({ zonas: true, calor: false, pinos: true, bairros: true, fronteira: true, vizinhos: false, satelite: false, mapaEscuro: false, coropletico: true, delegacias: true, oficial: true });
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

  readonly filtrados = computed(() => {
    const f = filtrar(this.dados(), this.periodoDias(), this.categorias(), this.orgao(), this.escopo() === 'ESTADO');
    return this.orgao() ? f : this.comTiroteios(f, this.periodoDias(), this.categorias());
  });
  /** Zonas vermelhas usam também os tiroteios verificados (Fogo Cruzado), onde houver. */
  private comTiroteios(f: Filtrados, dias: number, categorias: string[]): Filtrados {
    const extra = tiroteiosComoOcorrencias(this.fogoCidade()?.dado?.itens, this.cidade(), dias, categorias);
    if (!extra.length) return f;
    // Não contar o mesmo fato duas vezes: notícia de homicídio/tiroteio a menos de 1 km e 1 dia de um
    // tiroteio do Fogo Cruzado é tratada como o mesmo caso e fica só o registro verificado.
    const dia = (ts: number) => Math.round(tsParaData(ts).getTime() / 86400000);
    const noticias = f.precisas.filter((o) => !((o.cat === 'CVLI' || o.cat === 'CONFRONTO') &&
      extra.some((t) => Math.abs(dia(t.ts) - dia(o.ts)) <= 1 && distanciaKm(o.lat!, o.lng!, t.lat!, t.lng!) < 1)));
    return { ...f, zonas: calcularZonas([...noticias, ...extra]), tiroteiosZonas: extra.length, duplicadasFogo: f.precisas.length - noticias.length };
  }
  /** Notícias dos 12 meses, sem filtros: base do Panorama. */
  readonly filtrados12 = computed(() => this.comTiroteios(filtrar(this.dados(), CFG.DIAS_HISTORICO_SERVIDOR, [], '', this.escopo() === 'ESTADO'), CFG.DIAS_HISTORICO_SERVIDOR, []));

  /** Código IBGE do município aberto ('' no estado). */
  readonly ibgeCidade = computed(() => (this.escopo() === 'CIDADE' ? this.dados()?.codigoIbge || buscarMunicipio(this.uf(), this.cidade())?.ibge || '' : ''));

  /** Bairros do OpenStreetMap da cidade aberta (com contorno quando o OSM tem). */
  readonly bairrosOsm = signal<{ ibge: string; lista: Bairro[]; carregando: boolean } | null>(null);
  readonly listaBairros = computed(() => {
    const b = this.bairrosOsm();
    const d = this.dados();
    if (this.escopo() !== 'CIDADE' || !d) return [] as Bairro[];
    return b?.ibge === this.ibgeCidade() && b.lista.length ? b.lista : d.bairros || [];
  });
  /** Dados oficiais e verificados abaixo do município (ISP-RJ por delegacia, Fogo Cruzado). */
  readonly isp = signal<{ ibge: string; dado: IspMunicipio | null } | null>(null);
  readonly fogo = signal<{ chave: string; dado: FogoCruzado | null; carregando: boolean } | null>(null);
  readonly referencia = signal<ReferenciaNacional | null>(null);
  /** Ocorrências oficiais por bairro e ponto (secretarias estaduais que publicam boletins). */
  readonly oficialArea = signal<{ ibge: string; dado: OficialArea | null } | null>(null);
  readonly oficialCidade = computed(() => { const v = this.oficialArea(); return v && this.escopo() === 'CIDADE' && v.ibge === this.ibgeCidade() ? v.dado : null; });
  readonly oficialBairros = computed(() => {
    const o = this.oficialCidade();
    if (!o) return null;
    const cats = catsOficiais(this.categorias());
    return { ...oficialPorBairro(o, this.listaBairros(), cats), cats, dado: o };
  });
  readonly ispCidade = computed(() => { const v = this.isp(); return v && v.ibge === this.ibgeCidade() ? v.dado : null; });
  readonly fogoCidade = computed(() => {
    const v = this.fogo();
    return v && this.escopo() === 'CIDADE' && v.chave === this.uf() + '|' + this.cidade() ? v : null;
  });
  /** Bairros com as notícias do filtro atual (mapa) e dos 12 meses (Panorama). */
  readonly bairrosMapa = computed(() => resumirBairros(this.listaBairros(), this.filtrados().todas));
  readonly bairros12 = computed(() => resumirBairros(this.listaBairros(), this.filtrados12().todas));

  /** Indicadores oficiais do local aberto (no estado, o panorama traz os mesmos números). */
  readonly oficial = computed(() => {
    const d = this.dados();
    const ehEstado = this.escopo() === 'ESTADO';
    const o = d?.oficial ? encurtarOficial(d.oficial) : ehEstado ? this.panorama()?.oficial || null : null;
    return aplicarPeriodo(enriquecerOficial(o, this.uf(), this.cidade(), ehEstado, this.populacao(), this.panorama()), mesesDoPeriodo(this.periodoDias()));
  });

  readonly insights = computed(() =>
    gerarInsights({
      ehEstado: this.escopo() === 'ESTADO', nomeLocal: this.nomeLocal(), cidade: this.cidade(),
      oficial: this.oficial(), panorama: this.panorama()?.uf === this.uf() ? this.panorama() : null,
      f: this.filtrados(), periodoDias: this.periodoDias(),
    }));

  /** Panorama compilado de todas as fontes (aba inicial). */
  readonly compilado = computed(() => {
    const d = this.dados();
    const ehEstado = this.escopo() === 'ESTADO';
    const b = this.bairrosOsm();
    return compilar({
      ehEstado, nomeLocal: this.nomeLocal(), cidade: this.cidade(), uf: this.uf(), ibge: this.ibgeCidade() || null,
      oficial: this.oficial(), panorama: this.panorama()?.uf === this.uf() ? this.panorama() : null, pop: this.populacao(),
      f12: this.filtrados(), bairros: this.bairrosMapa().lista, periodoDias: this.periodoDias(), bairrosOsm: ehEstado ? 0 : (b?.lista.length || d?.bairros?.length || 0),
      bairrosCarregando: !!b?.carregando, ultimaColeta: d?.ultimaColeta || '',
      referencia: this.referencia(), isp: this.ispCidade(), tiroteios: this.fogoCidade()?.dado?.itens || null,
    });
  });

  private tokenAbertura = 0;
  private memoria = new Map<string, { em: number; res: any }>();
  private panoramas = new Map<string, Panorama>();

  constructor() {
    // Tempo real: com o painel aberto e visível, busca novidades a cada poucos minutos (só o que mudou)
    setInterval(() => this.buscarNovidades(), CFG.MINUTOS_ATUALIZACAO_AUTOMATICA * 60000);
    // Referência nacional: totais do robô + população de cada estado (IBGE, guardada 180 dias no navegador)
    setTimeout(() => montarReferencia().then((r) => this.referencia.set(r)), 1500);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.buscarNovidades(); });
    const tema = lerLocal(CFG.CHAVE_TEMA);
    this.definirTema(tema ? tema === 'escuro' : window.matchMedia?.('(prefers-color-scheme: dark)').matches, false);
  }

  private ultimaBusca = Date.now();

  /** Atualização automática: pede ao servidor só o que mudou; se os dados estão velhos, dispara a coleta. */
  private buscarNovidades(): void {
    if (document.visibilityState !== 'visible' || this.escopo() !== 'CIDADE' || this.carregando() || this.coletando()) return;
    if (Date.now() - this.ultimaBusca < 60000) return;
    this.ultimaBusca = Date.now();
    const d = this.dados(); if (!d) return;
    const uf = this.uf(), cidade = this.cidade(), token = this.tokenAbertura;
    const base = this.memoria.get(chaveLocal(uf, cidade))?.res || null;
    Servidor.cidade(uf, cidade, d.centroLat, d.centroLng, false, desdeDe(base)).then((res) => {
      if (!this.receber(res, token)) return;
      if (res.precisaColeta) this.coletar(uf, cidade, d.centroLat, d.centroLng, token);
      else this.definirStatus('check_circle', 'Dados de ' + (res.ultimaColeta || res.atualizadoEm) + ' · atualização automática', 'ok');
    }).catch(() => { /* tenta de novo no próximo ciclo */ });
    this.recarregarFogo();
  }

  private recarregarFogo(): void {
    const f = this.fogo(); if (!f || f.carregando) return;
    const [uf, cidade] = f.chave.split('|');
    carregarFogoCruzado(uf, cidade, true).then((dado) => { if (this.fogo()?.chave === f.chave && dado?.configurado && !dado.erro) this.fogo.set({ chave: f.chave, dado, carregando: false }); });
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
    if (ehEstado && (this.aba() === 'ZONAS' || this.aba() === 'FACCOES')) this.aba.set('ESTADO');
    if (!ehEstado && this.aba() === 'ESTADO') this.aba.set('PANORAMA');
    if (ufMudou) this.eventoPanorama.set(0);

    const lat = ehEstado ? meta.lat : mun!.lat;
    const lng = ehEstado ? meta.lng : mun!.lng;
    const nomeServidor = ehEstado ? 'ESTADO_INTEIRO' : mun!.nome;
    const chave = chaveLocal(uf, nomeServidor);
    this.dados.set(pacoteVazio(uf, nomeServidor, lat, lng, ehEstado ? meta.ibge : mun!.ibge));
    this.carregarPanorama(uf);
    if (!ehEstado && this.bairrosOsm()?.ibge !== mun!.ibge) {
      const ibge = mun!.ibge;
      this.bairrosOsm.set({ ibge, lista: [], carregando: true });
      const vale = () => this.bairrosOsm()?.ibge === ibge;
      carregarBairros(ibge, (pontos) => { if (vale()) this.bairrosOsm.set({ ibge, lista: pontos, carregando: true }); })
        .then((lista) => { if (vale()) this.bairrosOsm.set({ ibge, lista: lista.length ? lista : this.bairrosOsm()!.lista, carregando: false }); })
        .catch(() => { if (vale()) this.bairrosOsm.set({ ...this.bairrosOsm()!, carregando: false }); });
    }
    if (!ehEstado) this.carregarAreas(uf, mun!.nome, mun!.ibge);
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
    // 1º o que está guardado no navegador; depois o servidor manda só o que mudou desde essa versão
    CacheDisco.obterPacote<any>(chave).then((v) => {
      const base = v?.dado || null;
      if (base && token === this.tokenAbertura && this.carregando()) {
        mostrouDoDisco = true;
        this.dados.set(normalizarPacote(base));
        this.memoria.set(chave, { em: 0, res: base });
        this.definirStatus('sync', 'Mostrando dados guardados · buscando novidades…');
      }
      return Servidor.cidade(uf, nomeServidor, lat, lng, false, desdeDe(base));
    }).then((res) => {
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

  private receber(resposta: any, token: number): boolean {
    if (token !== this.tokenAbertura || !resposta) return false;
    const chave = chaveLocal(resposta.uf, resposta.cidade);
    const res = mesclarDelta(this.memoria.get(chave)?.res || null, resposta);
    this.dados.set(normalizarPacote(res));
    this.memoria.set(chave, { em: Date.now(), res });
    CacheDisco.salvarPacote(chave, res);
    return true;
  }

  private coletar(uf: string, cidade: string, lat: number, lng: number, token: number): void {
    this.definirStatus('travel_explore', 'Consultando Google Notícias e imprensa local…');
    this.coletando.set(true);
    const base = this.memoria.get(chaveLocal(uf, cidade))?.res || null;
    Servidor.cidade(uf, cidade, lat, lng, true, desdeDe(base)).then((res) => {
      this.coletando.set(false);
      if (!this.receber(res, token)) return;
      if (res.coletaEmAndamento) { this.definirStatus('hourglass_top', 'Coleta em andamento; atualize em instantes'); return; }
      const novas = res.novasCapturadasAgora || 0;
      this.definirStatus('check_circle', (novas ? `Google Notícias: ${novas} ${novas === 1 ? 'notícia nova' : 'notícias novas'} · `
        : 'Google Notícias: nada novo · ') + 'atualizado às ' + res.atualizadoEm, 'ok');
      if (res.materiasPendentes) this.lerMaterias(uf, cidade, lat, lng, token, 4);
    }).catch(() => {
      this.coletando.set(false);
      if (token === this.tokenAbertura) this.definirStatus('error', 'Coleta não concluída; mostrando dados salvos', 'erro');
    });
  }

  /** 2ª etapa, sem travar a tela: o servidor lê o texto das matérias para achar o bairro de cada notícia. */
  private lerMaterias(uf: string, cidade: string, lat: number, lng: number, token: number, rodadas: number): void {
    if (rodadas <= 0 || token !== this.tokenAbertura) return;
    const base = this.memoria.get(chaveLocal(uf, cidade))?.res || null;
    Servidor.cidade(uf, cidade, lat, lng, 'materias', desdeDe(base)).then((res) => {
      if (!this.receber(res, token)) return;
      if (res.materiasPendentes) this.lerMaterias(uf, cidade, lat, lng, token, rodadas - 1);
    }).catch(() => undefined);
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

  private carregarAreas(uf: string, cidade: string, ibge: string): void {
    if (this.isp()?.ibge !== ibge) {
      this.isp.set({ ibge, dado: null });
      carregarIsp(uf, ibge).then((dado) => { if (this.isp()?.ibge === ibge) this.isp.set({ ibge, dado }); });
    }
    if (this.oficialArea()?.ibge !== ibge) {
      this.oficialArea.set({ ibge, dado: null });
      carregarOficial(ibge).then((dado) => { if (this.oficialArea()?.ibge === ibge) this.oficialArea.set({ ibge, dado }); }).catch(() => undefined);
    }
    const chave = uf + '|' + cidade;
    if (this.fogo()?.chave !== chave) {
      this.fogo.set({ chave, dado: null, carregando: true });
      carregarFogoCruzado(uf, cidade)
        .then((dado) => { if (this.fogo()?.chave === chave) this.fogo.set({ chave, dado, carregando: false }); })
        .catch(() => { if (this.fogo()?.chave === chave) this.fogo.set({ chave, dado: null, carregando: false }); });
    }
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

/** Momento da versão guardada (só pacotes no formato com delta). */
function desdeDe(base: any): number {
  return base && base.formato === 2 && !base.ehEstado && base.cidade !== 'ESTADO_INTEIRO' ? Number(base.ultimaColetaMs) || 0 : 0;
}

/** Junta a resposta "só o que mudou" com a versão guardada: troca as alteradas, acrescenta as novas e tira as que saíram. */
function mesclarDelta(base: any, res: any): any {
  if (!res?.delta) return res;
  if (!base?.ocorrencias) return { ...res, delta: false, ids: undefined };
  const atuais = new Set<string>(res.ids || []);
  const porId = new Map<string, any>();
  base.ocorrencias.forEach((o: any) => { if (!res.ids || atuais.has(o.id)) porId.set(o.id, o); });
  (res.ocorrencias || []).forEach((o: any) => porId.set(o.id, o));
  const ocorrencias = [...porId.values()].sort((a, b) => (b.ts || 0) - (a.ts || 0));
  return { ...res, delta: false, ids: undefined, ocorrencias, totalNaBase: ocorrencias.length };
}

/** Tiroteios do Fogo Cruzado no formato de ocorrência, para entrarem no cálculo das zonas vermelhas. */
function tiroteiosComoOcorrencias(itens: Tiroteio[] | undefined, cidade: string, periodoDias: number, categorias: string[]): Ocorrencia[] {
  if (!itens?.length) return [];
  const d = new Date(Date.now() - periodoDias * 86400000);
  const limite = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const lista: Ocorrencia[] = [];
  for (const t of itens) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(t.d || '');
    if (!m || !isFinite(t.lat) || !isFinite(t.lng)) continue;
    const ts = Number(m[3] + m[2] + m[1]);
    const cat = t.mortos ? 'CVLI' : 'CONFRONTO';
    if (ts < limite || (categorias.length && !categorias.includes(cat))) continue;
    lista.push({
      id: 'fc' + t.id, data: t.d, ts, cidade, bairro: t.bairro || '', cat, titulo: 'Tiroteio (Fogo Cruzado)',
      veiculo: 'Fogo Cruzado', link: '', lat: t.lat, lng: t.lng, precisao: 'ENDERECO', precisa: true, orgaos: [], local: false,
    });
  }
  return lista;
}

async function montarReferencia(): Promise<ReferenciaNacional | null> {
  const [bruta, sim, rb] = await Promise.all([carregarReferencia(), carregarSim().catch(() => null), carregarRoubos().catch(() => null)]);
  if (!bruta?.ufs) return null;
  const ufs = Object.keys(bruta.ufs);
  // População: a do arquivo do SIM (IBGE, todos os municípios) e, se faltar, a API do IBGE por estado
  const popSim = sim?.populacao?.municipios;
  const pops = popSim ? [] : await Promise.all(ufs.map((uf) => carregarPopulacao(uf).catch(() => null)));
  type Bruto = { ibge: string; uf: string; hab: number; mortes: number; anos: number; tent: number; roubo: number | null; d: number[]; dSim: number };
  const brutos: Bruto[] = [];
  let mortesBr = 0, popBr = 0, ufsOk = 0;
  ufs.forEach((uf, k) => {
    const p = pops[k];
    if (!popSim && !p) return;
    ufsOk++;
    const nomes = bruta.ufs[uf].municipios, det = bruta.ufs[uf].detalhe || {};
    for (const m of municipiosUf(uf)) {
      const c6 = String(m.ibge).slice(0, 6);
      const hab = popSim ? popSim[c6] : p!.porCodigo[m.ibge];
      if (!hab) continue;
      const d = det[m.norm] || [nomes[m.norm] || 0, 0, 0, 0, 0];
      const s = sim?.municipios[c6];
      const dSim = s ? s[0] + s[1] : 0;
      // Abaixo de 100 mil hab.: média anual de 3 anos do Sinesp, para um caso isolado não distorcer a taxa
      const anos = hab < CIDADE_GRANDE && d[2] > 0 ? 3 : 1;
      const cvli = anos === 3 ? d[2] / 3 : d[0];
      // Cada fonte deixa de contar casos em lugares diferentes (o Sinesp depende do envio de cada estado; o SIM
      // tem óbitos ainda sem causa definida). A maior das duas é a contagem mais completa, sem somar o mesmo caso.
      const mortes = Math.max(cvli, dSim);
      const tent = anos === 3 ? d[4] / 3 : d[3];
      const r = rb?.municipios[c6];
      brutos.push({ ibge: m.ibge, uf, hab, mortes, anos, tent, roubo: r ? r[0] : null, d, dSim });
      mortesBr += Math.max(d[0], dSim); popBr += hab;
    }
  });
  if (ufsOk < 20) return null;  // sem população da maior parte do país, não compara

  // Ajuste para cidades pequenas (Bayes empírico, como em saúde pública): com poucos casos, a taxa é puxada
  // para a média das cidades com menos de 100 mil hab. do mesmo estado, na proporção do tamanho da cidade.
  const media: Record<string, number[]> = {};
  for (const b of brutos) {
    if (b.hab >= CIDADE_GRANDE) continue;
    const a = (media[b.uf] ??= [0, 0, 0, 0, 0]);
    a[0] += b.mortes; a[1] += b.hab; a[2] += b.tent;
    if (b.roubo != null) { a[3] += b.roubo; a[4] += b.hab; }
  }
  const ajustar = (casos: number, hab: number, anos: number, mu: number) =>
    hab >= CIDADE_GRANDE || !(mu >= 0) ? (casos / hab) * 1e5 : ((casos * anos + mu * FORCA_AJUSTE) / (hab * anos + FORCA_AJUSTE)) * 1e5;
  const r1 = (x: number) => Math.round(x * 10) / 10;
  const municipios: Record<string, number[]> = {};
  const taxas: number[] = [], taxasTent: number[] = [], taxasRoubo: number[] = [], totais: number[] = [];
  for (const b of brutos) {
    const a = media[b.uf];
    const mu = (i: number, h = 1) => (a && a[h] ? a[i] / a[h] : NaN);
    const tx = ajustar(b.mortes, b.hab, b.anos, mu(0));
    const tt = ajustar(b.tent, b.hab, b.anos, mu(2));
    const tr = b.roubo == null ? -1 : ajustar(b.roubo, b.hab, 1, mu(3, 4));
    const linha = [r1(b.mortes), b.hab, r1(tx), b.d[0], b.dSim, r1(tt), b.d[1], b.anos === 3 ? 1 : 0, r1(tr),
      r1((b.mortes / b.hab) * 1e5), Math.round(b.mortes * b.anos), Math.round(b.roubo ?? 0)];
    municipios[b.ibge] = linha;
    if (b.hab >= 20000) { taxas.push(linha[2]); taxasTent.push(linha[5]); totais.push(linha[0]); if (tr >= 0) taxasRoubo.push(linha[8]); }
  }
  const ord = (l: number[]) => l.sort((x, y) => x - y);
  return {
    periodo: bruta.periodo, brasil: { cvli: mortesBr, pop: popBr, taxa: Math.round((mortesBr / popBr) * 1e6) / 10 },
    taxas: ord(taxas), taxasTent: ord(taxasTent), taxasRoubo: ord(taxasRoubo), totais: ord(totais), municipios,
    sim: sim ? { ano: sim.ano, preliminar: !!sim.preliminar } : null,
    roubos: rb?.estados || {},
  };
}

/** Cidades abaixo disto usam média de 3 anos e taxa ajustada pela média do estado. */
const CIDADE_GRANDE = 100000;
/** Peso da média do estado no ajuste, em habitantes-ano (equivale a somar 30 mil habitantes "médios"). */
const FORCA_AJUSTE = 30000;
