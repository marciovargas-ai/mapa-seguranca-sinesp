"""
Roubos e furtos por município de RS e MG, direto das secretarias estaduais (últimos 12 meses publicados).
Grava dados/roubos_rs_mg.json no mesmo formato que roubos_municipais.py junta:
  { estados: { UF: { fonte, periodo, definicao } }, municipios: { ibge6: [roubos_12m, furtos_12m] } }

RS: SSP-RS, "Indicadores criminais geral e por município" (planilha do ano corrente e do anterior, uma aba por mês).
    Roubos = Roubos + Roubo de veículo; furtos = Furtos + Furto de veículo. Fato consumado.
MG: Sejusp-MG, dados abertos (dados.mg.gov.br): "Crimes violentos" (natureza ROUBO CONSUMADO) e "Furtos consumados".
Se uma fonte falhar, mantém o que já havia no arquivo para aquele estado.
"""
import csv, io, json, os, re, sys, unicodedata, urllib.parse, urllib.request

SAIDA = 'dados/roubos_rs_mg.json'
UA = {'User-Agent': 'Mozilla/5.0 (mapa-seguranca robo)'}
MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
NOME_MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
MG_CKAN = 'https://dados.mg.gov.br/api/3/action/package_show?id='


def get(url, timeout=300):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


def norm(t):
    t = unicodedata.normalize('NFKD', str(t or '')).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9]+', ' ', t)).strip()


def periodo_txt(meses):
    (a1, m1), (a2, m2) = meses[0], meses[-1]
    return f'{NOME_MES[m1 - 1]}/{a1} a {NOME_MES[m2 - 1]}/{a2}'


def rs():
    import openpyxl
    pagina = get('https://www.ssp.rs.gov.br/indicadores-criminais', 60).decode('utf-8', 'ignore')
    links = re.findall(r'href="([^"]*(?:site-geral-e-munic|indicadores-criminais-geral-e-por-munic)[^"]*\.xlsx)"', pagina, re.I)
    links = sorted({urllib.parse.urljoin('https://www.ssp.rs.gov.br/', l) for l in links},
                   key=lambda u: (re.search(r'/(\d{6})/', u) or re.search(r'()', u)).group(1))
    pop = json.load(open('dados/populacao.json', encoding='utf-8'))['ufs']['RS']
    por_nome = {norm(k): v[0][:6] for k, v in pop.items()}
    # Planilhas por ano (a mais recente de cada ano vence)
    por_ano = {}
    for u in links:
        anos = re.findall(r'20\d\d', re.sub(r'^\d+-', '', u.split('/')[-1]))
        ano = int(anos[0]) if anos else None
        if ano: por_ano[ano] = u
    meses = {}  # (ano, mes) -> {ibge6: [roubos, furtos]}
    for ano in sorted(por_ano)[-2:]:
        wb = openpyxl.load_workbook(io.BytesIO(get(por_ano[ano])), read_only=True, data_only=True)
        for ws in wb.worksheets:
            if ws.title.strip().upper() not in MESES: continue
            mes = MESES.index(ws.title.strip().upper()) + 1
            cab, dados, sem = None, {}, []
            for row in ws.iter_rows(values_only=True):
                if cab is None:
                    if row and norm(row[0]) == 'municipios': cab = [norm(c) for c in row]
                    continue
                nome = norm(row[0])
                if not nome: continue
                col = lambda n: cab.index(n) if n in cab else None
                vals = lambda n: (row[col(n)] or 0) if col(n) is not None and isinstance(row[col(n)], (int, float)) else 0
                ibge = por_nome.get(nome)
                if not ibge:
                    if not nome.startswith('total'): sem.append(nome)
                    continue
                dados[ibge] = [vals('roubos') + vals('roubo de veiculo'), vals('furtos') + vals('furto de veiculo')]
            if len(dados) > 400:
                meses[(ano, mes)] = dados
                if sem: print(f'RS {ano}/{mes}: sem código IBGE para', sem[:8])
    chaves = sorted(meses)[-12:]
    if len(chaves) < 6: raise RuntimeError(f'RS: só {len(chaves)} meses lidos')
    soma = {}
    for k in chaves:
        for ibge, (r, f) in meses[k].items():
            s = soma.setdefault(ibge, [0, 0]); s[0] += r; s[1] += f
    fator = 12 / len(chaves)
    mun = {k: [round(v[0] * fator, 1), round(v[1] * fator, 1)] for k, v in soma.items()}
    print('RS:', len(mun), 'municípios,', periodo_txt(chaves), '; Porto Alegre', mun.get('431490'))
    return {'fonte': 'SSP-RS, indicadores criminais por município (fato consumado)', 'periodo': periodo_txt(chaves),
            'definicao': 'roubos (inclui roubo de veículo); furtos incluem furto de veículo'}, mun


def mg_recursos(pacote):
    r = json.loads(get(MG_CKAN + pacote, 60))['result']['resources']
    return [x['url'] for x in r if (x.get('format') or '').upper() == 'CSV' or x['url'].lower().endswith('.csv')]


def ler_csv(url):
    t = get(url, 900).decode('utf-8-sig', 'ignore')
    linhas = t.splitlines()
    sep = ';' if linhas[0].count(';') >= linhas[0].count(',') else ','
    r = csv.DictReader(linhas, delimiter=sep)
    r.fieldnames = [norm(c).replace(' ', '_') for c in r.fieldnames]
    return list(r)


def mg():
    urls = mg_recursos('crimes-violentos')
    por_ano = {}
    for u in urls:
        m = re.search(r'(20\d\d)\.csv', u)
        if m: por_ano[int(m.group(1))] = u
    roubos = {}  # (ano, mes) -> {ibge6: n}
    for ano in sorted(por_ano)[-2:]:
        for l in ler_csv(por_ano[ano]):
            if norm(l.get('natureza')) != 'roubo consumado': continue
            k = (int(l['ano']), int(l['mes']))
            cod = str(l.get('cod_municipio') or l.get('cod_ibge') or '')[:6]
            roubos.setdefault(k, {})[cod] = roubos.get(k, {}).get(cod, 0) + int(float(l['registros'] or 0))
    chaves = sorted(k for k, v in roubos.items() if sum(v.values()) > 0)[-12:]
    if len(chaves) < 6: raise RuntimeError(f'MG: só {len(chaves)} meses de roubo')
    furtos = {}
    try:
        u = mg_recursos('sejusp_furto_consumado')[0]
        alvo = set(chaves)
        for l in ler_csv(u):
            k = (int(l.get('ano_fato') or l.get('ano')), int(l['mes']))
            if k not in alvo: continue
            cod = str(l.get('cod_ibge') or l.get('cod_municipio') or '')[:6]
            furtos[cod] = furtos.get(cod, 0) + int(float(l['registros'] or 0))
    except Exception as e:
        print('MG furtos indisponível:', e)
    fator = 12 / len(chaves)
    soma = {}
    for k in chaves:
        for cod, n in roubos[k].items(): soma[cod] = soma.get(cod, 0) + n
    mun = {c: [round(n * fator, 1), round(furtos[c] * fator, 1) if c in furtos else None] for c, n in soma.items()}
    print('MG:', len(mun), 'municípios,', periodo_txt(chaves), '; BH', mun.get('310620'))
    return {'fonte': 'Sejusp-MG, dados abertos (crimes violentos e furtos consumados)', 'periodo': periodo_txt(chaves),
            'definicao': 'roubos consumados (todas as modalidades)'}, mun


def main():
    atual = json.load(open(SAIDA, encoding='utf-8')) if os.path.exists(SAIDA) else {'estados': {}, 'municipios': {}}
    prefixo = {'RS': '43', 'MG': '31'}
    ok = 0
    for uf, f in (('RS', rs), ('MG', mg)):
        try:
            est, mun = f()
            atual['estados'][uf] = est
            atual['municipios'] = {k: v for k, v in atual['municipios'].items() if not k.startswith(prefixo[uf])}
            atual['municipios'].update(mun)
            ok += 1
        except Exception as e:
            print(f'{uf} indisponível hoje ({e}); mantém o anterior', file=sys.stderr)
    with open(SAIDA, 'w', encoding='utf-8') as fh:
        json.dump(atual, fh, ensure_ascii=False, separators=(',', ':'))
    print(ok, 'estados atualizados')


if __name__ == '__main__':
    main()
