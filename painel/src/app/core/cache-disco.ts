import { CFG } from './dados';

/**
 * Cache em disco (IndexedDB): contornos do IBGE ('kv') e pacotes de dados das
 * cidades ('pacotes', até CFG.CACHE_PACOTES_MB, apagando os menos usados).
 */
class CacheDiscoImpl {
  private db: IDBDatabase | null = null;
  private abrindo: Promise<IDBDatabase | null> | null = null;
  private memoria = new Map<string, unknown>();

  private abrir(): Promise<IDBDatabase | null> {
    if (this.db) return Promise.resolve(this.db);
    if (this.abrindo) return this.abrindo;
    this.abrindo = new Promise((resolve) => {
      try {
        const req = indexedDB.open('mapa_seguranca_v4', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
          if (!db.objectStoreNames.contains('pacotes')) db.createObjectStore('pacotes');
        };
        req.onsuccess = () => { this.db = req.result; resolve(this.db); };
        req.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
    return this.abrindo;
  }

  async obter<T>(chave: string, dias = CFG.DIAS_CACHE_FRONTEIRAS): Promise<T | null> {
    if (this.memoria.has(chave)) return this.memoria.get(chave) as T;
    const db = await this.abrir();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const req = db.transaction('kv', 'readonly').objectStore('kv').get(chave);
        req.onsuccess = () => {
          const v = req.result;
          if (v && v.em > Date.now() - dias * 86400000) { this.memoria.set(chave, v.dado); resolve(v.dado); }
          else resolve(null);
        };
        req.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }

  async salvar(chave: string, dado: unknown): Promise<void> {
    this.memoria.set(chave, dado);
    const db = await this.abrir();
    if (!db) return;
    try { db.transaction('kv', 'readwrite').objectStore('kv').put({ em: Date.now(), dado }, chave); } catch { /* cota cheia */ }
  }

  async obterPacote<T>(chave: string): Promise<{ em: number; dado: T } | null> {
    const db = await this.abrir();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const store = db.transaction('pacotes', 'readwrite').objectStore('pacotes');
        const req = store.get(chave);
        req.onsuccess = () => {
          const v = req.result;
          if (!v) return resolve(null);
          v.usado = Date.now();
          store.put(v, chave);
          try { resolve({ em: v.em, dado: JSON.parse(v.texto) }); } catch { resolve(null); }
        };
        req.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }

  async salvarPacote(chave: string, dado: unknown): Promise<void> {
    let texto: string;
    try { texto = JSON.stringify(dado); } catch { return; }
    const db = await this.abrir();
    if (!db) return;
    try {
      const tx = db.transaction('pacotes', 'readwrite');
      tx.objectStore('pacotes').put({ em: Date.now(), usado: Date.now(), tamanho: texto.length, texto }, chave);
      tx.oncomplete = () => this.limitarPacotes(db);
    } catch { /* cota cheia */ }
  }

  /** Mantém o total abaixo do orçamento, apagando primeiro os pacotes usados há mais tempo. */
  private limitarPacotes(db: IDBDatabase): void {
    const limite = CFG.CACHE_PACOTES_MB * 1024 * 1024;
    const itens: { chave: IDBValidKey; usado: number; tamanho: number }[] = [];
    let total = 0;
    try {
      const store = db.transaction('pacotes', 'readwrite').objectStore('pacotes');
      store.openCursor().onsuccess = (ev) => {
        const c = (ev.target as IDBRequest<IDBCursorWithValue>).result;
        if (c) {
          itens.push({ chave: c.key, usado: c.value.usado || 0, tamanho: c.value.tamanho || 0 });
          total += c.value.tamanho || 0;
          c.continue();
          return;
        }
        if (total <= limite) return;
        itens.sort((a, b) => a.usado - b.usado);
        for (let i = 0; i < itens.length && total > limite; i++) { store.delete(itens[i].chave); total -= itens[i].tamanho; }
      };
    } catch { /* ignora */ }
  }
}

export const CacheDisco = new CacheDiscoImpl();
