"""
Homicídios por município pelo SIM/DATASUS (declarações de óbito), mesma metodologia nos 5.570 municípios.
É a base do Atlas da Violência (IPEA/FBSP). Conta pelo município de OCORRÊNCIA:
  agressão (CID-10 X85–Y09), intervenção legal/policial (Y35–Y36) e intenção indeterminada (Y10–Y34).
Tenta o ano mais recente: CSV do OpenDataSUS, depois DBC do FTP do DATASUS (definitivo e preliminar).
Também tenta a estimativa de população do IBGE (FTP) para gravar a taxa.
Saída: dados/sim_homicidios.json
"""
import csv, io, json, os, re, sys, urllib.request, ftplib, tempfile, datetime

UFS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']
UA = {'User-Agent': 'Mozilla/5.0 (mapa-seguranca robo)'}

def classe(cid):
    c = (cid or '').strip().upper()
    if len(c) < 3: return None
    l, n = c[0], int(c[1:3]) if c[1:3].isdigit() else -1
    if (l == 'X' and n >= 85) or (l == 'Y' and n <= 9): return 0
    if l == 'Y' and 35 <= n <= 36: return 1
    if l == 'Y' and 10 <= n <= 34: return 2
    return None

def somar(cont, mun, cid):
    k = classe(cid)
    if k is None or not mun: return
    m = str(mun).strip()[:6]
    if not m.isdigit(): return
    cont.setdefault(m, [0, 0, 0])[k] += 1

def baixar(url, timeout=900):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def via_csv(ano):
    for url in [f'https://diaad.s3.sa-east-1.amazonaws.com/sim/Mortalidade_Geral_{ano}.csv',
                f'https://diaad.s3.sa-east-1.amazonaws.com/sim/DO{str(ano)[2:]}OPEN.csv']:
        try:
            b = baixar(url)
            print('CSV', url, len(b) // 1_000_000, 'MB', flush=True)
            txt = b.decode('latin-1')
            sep = ';' if txt[:2000].count(';') > txt[:2000].count(',') else ','
            rd = csv.DictReader(io.StringIO(txt), delimiter=sep)
            cont, ufs = {}, set()
            for row in rd:
                row = {k.strip().strip('"').upper(): v for k, v in row.items() if k}
                mun = row.get('CODMUNOCOR') or ''
                if mun: ufs.add(mun[:2])
                somar(cont, mun, row.get('CAUSABAS'))
            if len(ufs) >= 27: return cont, url
            print('  incompleto:', len(ufs), 'UFs', flush=True)
        except Exception as e:
            print('CSV falhou', url, e, flush=True)
    return None

def via_dbc(ano, prelim):
    try:
        from pyreaddbc import dbc2dbf
        from dbfread import DBF
    except Exception as e:
        print('sem pyreaddbc/dbfread', e); return None
    pasta = '/dissemin/publicos/SIM/PRELIM/DORES' if prelim else '/dissemin/publicos/SIM/CID10/DORES'
    cont, achou = {}, 0
    try:
        ftp = ftplib.FTP('ftp.datasus.gov.br', timeout=120); ftp.login(); ftp.cwd(pasta)
        nomes = set(n.upper() for n in ftp.nlst())
    except Exception as e:
        print('FTP falhou', pasta, e, flush=True); return None
    for uf in UFS:
        nome = f'DO{uf}{ano}.DBC'
        if nome not in nomes: continue
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, nome); q = p[:-4] + '.dbf'
            with open(p, 'wb') as f: ftp.retrbinary('RETR ' + nome, f.write)
            dbc2dbf(p, q)
            for r in DBF(q, encoding='latin-1', char_decode_errors='ignore'):
                somar(cont, r.get('CODMUNOCOR'), r.get('CAUSABAS'))
        achou += 1
        print('  DBC', pasta, nome, flush=True)
    ftp.quit()
    return (cont, f'ftp://ftp.datasus.gov.br{pasta}') if achou >= 27 else None

def populacao():
    for ano in (2025, 2024):
        for nome in (f'estimativa_dou_{ano}.xls', f'estimativa_TCU_{ano}_20{str(ano)[2:]}0826.xls', f'estimativa_dou_{ano}.xlsx'):
            url = f'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_{ano}/{nome}'
            try:
                b = baixar(url, 120)
                import pandas as pd
                df = pd.read_excel(io.BytesIO(b), sheet_name=None, header=None)
                pop = {}
                for _, t in df.items():
                    for row in t.itertuples(index=False):
                        v = [x for x in row]
                        # linhas: UF, COD. UF, COD. MUNIC, NOME, POPULAÇÃO
                        try:
                            cu, cm, hab = int(v[1]), int(v[2]), v[4]
                            hab = int(re.sub(r'\D', '', str(hab).split('(')[0]))
                            pop[f'{cu:02d}{cm:05d}'[:6]] = hab
                        except Exception:
                            pass
                if len(pop) > 5000:
                    print('população', url, len(pop), flush=True)
                    return pop, ano
            except Exception as e:
                print('pop falhou', url, e, flush=True)
    return None, None

def main():
    hoje = datetime.date.today().year
    res = None
    for ano in range(hoje - 1, hoje - 5, -1):
        for prelim in (False, True):
            r = via_dbc(ano, prelim)
            if r: res = (ano, prelim, *r); break
        if res: break
        r = via_csv(ano)
        if r: res = (ano, False, *r); break
    if not res:
        print('nenhuma fonte do SIM disponível'); sys.exit(1)
    ano, prelim, cont, fonte = res
    pop, anoPop = populacao()
    saida = {'ano': ano, 'preliminar': prelim, 'fonte': 'SIM/DATASUS (Ministério da Saúde), município de ocorrência; ' + fonte,
             'campos': ['agressao X85-Y09', 'intervencao legal Y35-Y36', 'intencao indeterminada Y10-Y34'],
             'municipios': cont}
    if pop: saida['populacao'] = {'ano': anoPop, 'municipios': pop}
    json.dump(saida, open('dados/sim_homicidios.json', 'w'), separators=(',', ':'))
    tot = [sum(v[i] for v in cont.values()) for i in range(3)]
    print('SIM', ano, 'prelim' if prelim else 'definitivo', 'agressão', tot[0], 'intervenção', tot[1], 'indeterminada', tot[2])
    for cod, nome in [('355030','São Paulo'),('330455','Rio'),('292740','Salvador'),('230440','Fortaleza'),('431490','Porto Alegre'),('430060','Alvorada'),('261160','Recife'),('150140','Belém')]:
        v = cont.get(cod); h = pop.get(cod) if pop else None
        print(nome, v, h, round((v[0]+v[1]) / h * 1e5, 1) if v and h else '')

if __name__ == '__main__':
    main()
