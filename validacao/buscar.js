// Ajudante do simulador: recebe pedidos (JSON no stdin), busca em paralelo e devolve as respostas.
let entrada = '';
process.stdin.on('data', (d) => (entrada += d));
process.stdin.on('end', async () => {
  const pedidos = JSON.parse(entrada);
  const uma = async (p) => {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), Number(process.env.TEMPO_MS || 25000));
      const r = await fetch(p.url, {
        method: (p.method || 'get').toUpperCase(),
        headers: Object.assign({ 'User-Agent': 'Mozilla/5.0 (compatible; Google-Apps-Script)' }, p.headers || {},
          p.contentType ? { 'Content-Type': p.contentType } : {}),
        body: p.payload || undefined,
        redirect: p.followRedirects === false ? 'manual' : 'follow',
        signal: ctrl.signal,
      });
      const corpo = await r.text();
      clearTimeout(t);
      return { code: r.status, body: corpo.slice(0, 3000000) };
    } catch (e) {
      return { code: 0, body: '', erro: String(e.message || e) };
    }
  };
  const saida = [];
  for (let i = 0; i < pedidos.length; i += 20) saida.push(...(await Promise.all(pedidos.slice(i, i + 20).map(uma))));
  process.stdout.write(JSON.stringify(saida));
});
