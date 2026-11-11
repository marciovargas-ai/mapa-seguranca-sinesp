"""
Dados oficiais por bairro e por ponto: SSP-SP (boletins de ocorrência, todos os 645 municípios).
Fonte: https://www.ssp.sp.gov.br/assets/estatistica/transparencia/spDados/SPDadosCriminais_<ANO>.xlsx
Saída por município: dados/oficial/<ibge7>.json
  { fonte, orgao, periodo, atualizado, cats:{cat:n}, bairros:{nome:{cat:n}}, pontos:[[lat,lng,cat,yyyymmdd,rubrica]],
    grade:{cat:[[lat,lng,n]]} }   pontos = crimes contra a vida (todos); grade = roubos/furtos/veículos em células de ~200 m
e dados/oficial/indice.json { ibge: {uf, orgao, periodo, total} }
"""
import datetime, io, json, os, re, sys, urllib.request, unicodedata
from collections import Counter, defaultdict

BASE = 'https://www.ssp.sp.gov.br/assets/estatistica/transparencia/spDados/SPDadosCriminais_{}.xlsx'
SAIDA = 'dados/oficial'
CELULA = 0.002  # graus (~200 m)

CATS = [  # ordem importa
    ('cvli', re.compile(r'homic[ií]dio (simples|qualificado|doloso)|feminic|latroc|roubo seguido de morte|les[aã]o corporal seguida de morte', re.I)),
    ('tentativa', re.compile(r'tentativa de homic|homic[ií]dio.*tentad', re.I)),
    ('estupro', re.compile(r'estupro', re.I)),
    ('veiculo', re.compile(r'(roubo|furto).{0,20}ve[ií]culo|ve[ií]culo.{0,20}(roubo|furto)', re.I)),
    ('carga', re.compile(r'roubo.{0,10}carga', re.I)),
    ('roubo', re.compile(r'\broubo', re.I)),
    ('furto', re.compile(r'\bfurto', re.I)),
    ('trafico', re.compile(r'tr[aá]fico|entorpecente|drogas', re.I)),
]
GRADE = {'roubo', 'furto', 'veiculo', 'carga'}

def categoria(*textos):
    t = ' '.join(str(x or '') for x in textos)
    if re.search(r'culposo|culposa', t, re.I): return None
    for c, rx in CATS:
        if rx.search(t): return c
    return None

def num(v):
    if v in (None, '', 'NULL'): return None
    try:
        x = float(str(v).replace(',', '.'))
        return x if x != 0 else None
    except ValueError:
        return None

def data(v):
    if isinstance(v, datetime.datetime): return v.date()
    if isinstance(v, datetime.date): return v
    s = str(v or '').strip()
    if isinstance(v, (int, float)) and 20000 < v < 80000:  # número de série do Excel
        return datetime.date(1899, 12, 30) + datetime.timedelta(days=int(v))
    s = s.split(' ')[0].split('T')[0]
    for f in ('%Y-%m-%d', '%d/%m/%Y', '%d/%m/%y', '%d-%m-%Y', '%Y/%m/%d'):
        try: return datetime.datetime.strptime(s, f).date()
        except ValueError: pass
    return None

def titulo(s):
    s = re.sub(r'\s+', ' ', str(s or '')).strip()
    return s.title() if s and s.upper() not in ('NULL', 'NAO INFORMADO', 'NÃO INFORMADO') else ''

def baixar(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (mapa-seguranca robo)'})
    with urllib.request.urlopen(req, timeout=1200) as r:
        return r.read()

def main():
    import openpyxl
    hoje = datetime.date.today()
    inicio = hoje - datetime.timedelta(days=372)
    mun = defaultdict(lambda: {'cats': Counter(), 'bairros': defaultdict(Counter), 'pontos': [], 'grade': defaultdict(Counter)})
    vistos, rubricas, minimo, maximo = set(), Counter(), None, None
    for ano in (hoje.year, hoje.year - 1):
        try:
            b = baixar(BASE.format(ano))
        except Exception as e:
            print('sem arquivo', ano, e, flush=True); continue
        print('baixado', ano, len(b) // 1_000_000, 'MB', flush=True)
        wb = openpyxl.load_workbook(io.BytesIO(b), read_only=True)
        for ws in wb.worksheets:
            it = ws.iter_rows(values_only=True)
            cab = next(it, None)
            if not cab or 'RUBRICA' not in cab: continue
            ix = {str(c).strip().upper(): i for i, c in enumerate(cab) if c}
            g = lambda row, c: row[ix[c]] if c in ix and ix[c] < len(row) else None
            col_data = next((c for c in ('DATA_OCORRENCIA_BO', 'DATA_OCORRENCIA', 'DATA_FATO', 'DATA_REGISTRO') if c in ix), None)
            print('  colunas', ws.title, list(ix)[:32], '| data em', col_data, flush=True)
            n, amostra = 0, 0
            for row in it:
                bruto = g(row, col_data)
                d = data(bruto)
                if amostra < 3: print('    exemplo de data:', repr(bruto), '->', d, flush=True); amostra += 1
                if not d or d < inicio or d > hoje: continue
                rub, nat = g(row, 'RUBRICA'), g(row, 'NATUREZA_APURADA')
                rubricas[str(rub)] += 1
                cat = categoria(rub, nat)
                if not cat: continue
                chave = (g(row, 'NUM_BO'), g(row, 'ANO_BO'), g(row, 'NOME_DELEGACIA'), cat)
                if chave in vistos: continue
                vistos.add(chave)
                ibge = str(g(row, 'COD IBGE') or '').split('.')[0]
                if not ibge.isdigit(): continue
                m = mun[ibge]
                m['cats'][cat] += 1
                bai = titulo(g(row, 'BAIRRO'))
                if bai: m['bairros'][bai][cat] += 1
                lat, lng = num(g(row, 'LATITUDE')), num(g(row, 'LONGITUDE'))
                if lat and lng and -26 < lat < -19 and -54 < lng < -44:
                    if cat in GRADE:
                        m['grade'][cat][(round(lat / CELULA) * CELULA, round(lng / CELULA) * CELULA)] += 1
                    else:
                        m['pontos'].append([round(lat, 5), round(lng, 5), cat, int(d.strftime('%Y%m%d')), titulo(rub)[:60]])
                minimo = d if not minimo or d < minimo else minimo
                maximo = d if not maximo or d > maximo else maximo
                n += 1
            print('  aba', ws.title, n, 'ocorrências no período', flush=True)
        del b, wb
    if not mun:
        print('nada processado'); sys.exit(1)
    print('rubricas mais comuns:', rubricas.most_common(40))
    os.makedirs(SAIDA, exist_ok=True)
    periodo = f'{minimo:%d/%m/%Y} a {maximo:%d/%m/%Y}'
    idx_path = os.path.join(SAIDA, 'indice.json')
    indice = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for ibge, m in mun.items():
        saida = {
            'fonte': 'SSP-SP, boletins de ocorrência (dados abertos)', 'orgao': 'SSP-SP', 'periodo': periodo,
            'atualizado': hoje.isoformat(), 'cats': dict(m['cats']),
            'bairros': {k: dict(v) for k, v in sorted(m['bairros'].items(), key=lambda kv: -sum(kv[1].values()))[:400]},
            'pontos': sorted(m['pontos'], key=lambda p: -p[3])[:3000],
            'grade': {c: [[round(k[0], 4), round(k[1], 4), n] for k, n in v.most_common(4000)] for c, v in m['grade'].items()},
        }
        json.dump(saida, open(os.path.join(SAIDA, f'{ibge}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
        indice[ibge] = {'uf': 'SP', 'orgao': 'SSP-SP', 'periodo': periodo, 'total': sum(m['cats'].values())}
    json.dump(indice, open(idx_path, 'w'), ensure_ascii=False, separators=(',', ':'))
    cap = mun.get('3550308')
    print('municípios:', len(mun), 'período', periodo, '| capital:', dict(cap['cats']) if cap else None)

if __name__ == '__main__':
    main()
