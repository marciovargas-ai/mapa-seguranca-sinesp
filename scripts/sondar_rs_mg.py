"""Sonda temporária: estrutura das planilhas de RS (SSP-RS) e MG (Sejusp) e da página de microdados da BA."""
import csv, io, re, sys, collections, urllib.request, urllib.parse
sys.path.insert(0, 'scripts')
from sondar_fontes import get, pagina

def rs():
    _, _, b = get('https://www.ssp.rs.gov.br/indicadores-criminais', timeout=60)
    links = re.findall(r'href="([^"]*site-geral-e-munic[^"]*\.xlsx)"', b.decode('utf-8', 'ignore'), re.I)
    links = sorted(set(urllib.parse.urljoin('https://www.ssp.rs.gov.br/', l) for l in links), key=lambda u: re.search(r'/(\d{6})/', u).group(1))[-2:]
    import openpyxl
    for u in links:
        _, _, x = get(u, timeout=300)
        wb = openpyxl.load_workbook(io.BytesIO(x), read_only=True, data_only=True)
        print('\n### RS', u, len(x), 'bytes; abas:', [w.title for w in wb.worksheets])
        for ws in wb.worksheets[:4]:
            print('  aba', ws.title, ws.max_row, ws.max_column)
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                if i < 12 or i in (100, 300): print('   ', i, row[:30])
                if i > 300: break

def mg():
    for u in ['https://dados.mg.gov.br/dataset/29d89d80-8aaf-438b-a80f-70bb64d10f6f/resource/476f959e-e4bc-4960-b5c4-b3c22fc6fefb/download/crimes_violentos_2026.csv',
              'https://dados.mg.gov.br/dataset/36350775-2812-4c83-a30f-6ad548403100/resource/ed016a05-7b1f-4284-950e-4f3c11620258/download/furto_consumado.csv']:
        try:
            _, ct, b = get(u, timeout=600)
            t = b.decode('utf-8-sig', 'ignore')
            linhas = t.splitlines()
            print('\n### MG', u, len(b), 'bytes', len(linhas), 'linhas')
            for l in linhas[:6]: print('   ', l[:300])
            sep = ';' if linhas[0].count(';') > linhas[0].count(',') else ','
            r = list(csv.reader(linhas, delimiter=sep))
            cab = r[0]
            for j, c in enumerate(cab):
                vals = collections.Counter(x[j] for x in r[1:] if len(x) > j)
                print('   col', j, c, len(vals), 'valores;', vals.most_common(12) if len(vals) < 60 else list(vals)[:5])
        except Exception as e:
            print('\n### MG', u, 'ERRO', e)

def ba():
    for u in ['https://www.ba.gov.br/ssp/informacoes-criminais-0', 'https://www.ba.gov.br/ssp/estatisticas', 'https://www.ssp.ba.gov.br/modules/conteudo/conteudo.php?conteudo=19']:
        pagina(u)
        try:
            _, _, b = get(u, timeout=60)
            t = b.decode('utf-8', 'ignore')
            for m in sorted(set(re.findall(r'href="([^"]*(?:files/|drive|sharepoint|dados)[^"]*)"[^>]*>([^<]{0,120})<', t, re.I)))[:80]: print('   ', m)
        except Exception as e:
            print('   ERRO', e)

if __name__ == '__main__':
    for f in (rs, ba):
        try: f()
        except Exception as e: print('ERRO', f.__name__, e)
