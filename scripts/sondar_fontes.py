"""Sonda fontes oficiais estaduais com dados abaixo do município (bairro/ponto). Só imprime o que achou."""
import io, json, re, sys, urllib.request, urllib.parse

UA = {'User-Agent': 'Mozilla/5.0 (mapa-seguranca robo)'}

def get(url, limite=None, timeout=60):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.headers.get('content-type', ''), (r.read(limite) if limite else r.read())

def ckan(base, termos):
    for q in termos:
        url = base + '/api/3/action/package_search?rows=30&q=' + urllib.parse.quote(q)
        try:
            _, _, b = get(url, timeout=40)
            res = json.loads(b)['result']['results']
            print(f'\n### {base} q={q}: {len(res)} pacotes')
            for p in res:
                print(' -', p.get('name'), '|', (p.get('title') or '')[:90])
                for r in p.get('resources', [])[:12]:
                    print('     ·', (r.get('format') or '').upper(), r.get('url'))
        except Exception as e:
            print(f'\n### {base} q={q}: ERRO {e}')

def pagina(url, padrao=r'href="([^"]+\.(?:xlsx|xls|csv|zip|ods)[^"]*)"'):
    try:
        st, ct, b = get(url, timeout=40)
        t = b.decode('utf-8', 'ignore')
        links = sorted(set(re.findall(padrao, t, re.I)))
        print(f'\n### {url}: {st} {ct} {len(b)} bytes, {len(links)} links de arquivo')
        for l in links[:60]: print(' -', urllib.parse.urljoin(url, l))
    except Exception as e:
        print(f'\n### {url}: ERRO {e}')

def planilha(url):
    try:
        import openpyxl
        st, ct, b = get(url, timeout=600)
        print(f'\n### {url}: {st} {ct} {len(b)/1e6:.1f} MB')
        wb = openpyxl.load_workbook(io.BytesIO(b), read_only=True)
        for ws in wb.worksheets[:3]:
            print('  aba', ws.title)
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                print('   ', row[:40])
                if i >= 3: break
    except Exception as e:
        print(f'\n### {url}: ERRO {e}')

if __name__ == '__main__':
    pagina('https://www.ssp.sp.gov.br/estatistica/consultas')
    planilha('https://www.ssp.sp.gov.br/assets/estatistica/transparencia/spDados/SPDadosCriminais_2026.xlsx')
    for base, termos in [
        ('https://dados.rs.gov.br', ['ocorrencias', 'seguranca publica', 'indicadores criminais']),
        ('https://dados.mg.gov.br', ['crimes violentos', 'homicidio', 'seguranca publica']),
        ('https://dados.pe.gov.br', ['cvli', 'seguranca', 'crimes']),
        ('https://dados.es.gov.br', ['crimes', 'homicidio', 'seguranca']),
        ('https://dados.ba.gov.br', ['seguranca publica', 'mortes violentas']),
        ('https://dados.pa.gov.br', ['seguranca', 'crimes', 'ocorrencias']),
        ('https://dados.ms.gov.br', ['seguranca', 'crimes']),
        ('https://dados.df.gov.br', ['seguranca', 'ocorrencias']),
        ('https://dados.ce.gov.br', ['cvli', 'seguranca']),
        ('https://dados.al.gov.br/catalogo', ['seguranca', 'cvli']),
        ('https://dados.gov.br/dados', ['ocorrencias criminais bairro']),
    ]:
        ckan(base, termos)
    for u in ['https://ssp.rs.gov.br/dados-abertos', 'https://www.ssp.rs.gov.br/indicadores-criminais',
              'https://www.sds.pe.gov.br/estatisticas/40-estatisticas/178-criminalidade-violenta-letal-e-intencional-cvli',
              'https://sesp.es.gov.br/estatisticas', 'https://www.segup.pa.gov.br/dados-abertos',
              'https://www.sejusp.ms.gov.br/dados-estatisticos/', 'https://www.ssp.df.gov.br/dados-por-regiao-administrativa/',
              'https://www.ba.gov.br/ssp/publicacoes?combine=2025&term_node_tid_depth=All',
              'https://www.sspds.ce.gov.br/estatisticas-2-3/', 'https://www.seguranca.mg.gov.br/index.php/transparencia/dados-abertos']:
        pagina(u)
