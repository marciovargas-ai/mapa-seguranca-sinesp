"""
Trechos críticos das rodovias federais: acidentes registrados pela PRF (DATATRAN, agrupados por ocorrência)
nos últimos 12 meses, somados em trechos de 5 km de cada BR em cada estado.
Grava dados/prf_trechos.json:
  { atualizado, periodo, fonte, campos, trechos: [[uf, br, km_inicial, lat, lng, acidentes, mortos, feridos_graves], ...] }
Ficam os trechos com morte ou com pelo menos 8 acidentes, até 120 por estado (os de maior gravidade).
"""
import csv, datetime, io, json, re, sys, urllib.request, zipfile

SAIDA = 'dados/prf_trechos.json'
PAGINA = 'https://www.gov.br/prf/pt-br/acesso-a-informacao/dados-abertos/dados-abertos-da-prf'
UA = {'User-Agent': 'Mozilla/5.0 (mapa-seguranca robo)'}
TRECHO_KM = 5
POR_UF = 120


def get(url, timeout=600):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


def links_por_ano(html):
    """Ano -> id do arquivo no Google Drive do CSV 'Agrupados por ocorrência'."""
    rotulos = [(m.start(), int(m.group(1)), m.group(2).lower()) for m in
               re.finditer(r'Documento CSV de Acidentes (\d{4})\s*\(([^)]*)\)', html)]
    saida = {}
    for m in re.finditer(r'<a [^>]*href="(https://drive\.google\.com/file/d/([\w-]+)[^"]*)"[^>]*>(.*?)</a>', html, re.S):
        if 'baixar' not in re.sub(r'<[^>]+>', '', m.group(3)).lower(): continue
        antes = [r for r in rotulos if r[0] < m.start()]
        if not antes: continue
        _, ano, tipo = antes[-1]
        if 'ocorr' in tipo and ano not in saida: saida[ano] = m.group(2)
    return saida


def baixar_drive(id_):
    for url in (f'https://drive.usercontent.google.com/download?id={id_}&export=download&confirm=t',
                f'https://drive.google.com/uc?export=download&id={id_}&confirm=t'):
        try:
            b = get(url)
            if b[:2] == b'PK' or b[:200].count(b';') > 5: return b
            print('Drive devolveu outra coisa em', url, b[:120])
        except Exception as e:
            print('Drive falhou em', url, e)
    raise RuntimeError('não consegui baixar ' + id_)


def linhas_csv(b):
    if b[:2] == b'PK':
        z = zipfile.ZipFile(io.BytesIO(b))
        nome = next(n for n in z.namelist() if n.lower().endswith('.csv'))
        b = z.read(nome)
    for cod in ('utf-8', 'latin-1'):
        try: t = b.decode(cod); break
        except UnicodeDecodeError: continue
    return csv.DictReader(io.StringIO(t), delimiter=';')


def num(v):
    try: return float(str(v).replace(',', '.'))
    except Exception: return None


def main():
    html = get(PAGINA, 60).decode('utf-8', 'ignore')
    ids = links_por_ano(html)
    hoje = datetime.date.today()
    anos = [a for a in (hoje.year - 1, hoje.year) if a in ids]
    print('Arquivos por ano:', {a: ids[a] for a in anos})
    if not anos: sys.exit('Nenhum arquivo do DATATRAN encontrado na página da PRF')
    registros, datas = [], []
    for ano in anos:
        for l in linhas_csv(baixar_drive(ids[ano])):
            d = l.get('data_inversa') or ''
            try: dt = datetime.date.fromisoformat(d) if '-' in d else datetime.datetime.strptime(d, '%d/%m/%Y').date()
            except ValueError: continue
            registros.append((dt, l)); datas.append(dt)
    if not registros: sys.exit('DATATRAN vazio')
    fim = max(datas)
    inicio = fim - datetime.timedelta(days=364)
    trechos = {}
    for dt, l in registros:
        if dt < inicio: continue
        km, lat, lng = num(l.get('km')), num(l.get('latitude')), num(l.get('longitude'))
        uf, br = (l.get('uf') or '').strip().upper(), (l.get('br') or '').strip()
        if km is None or not uf or not br or br in ('0', 'NA'): continue
        chave = (uf, int(float(br)) if re.fullmatch(r'[\d.]+', br) else br, int(km // TRECHO_KM) * TRECHO_KM)
        t = trechos.setdefault(chave, {'n': 0, 'm': 0, 'g': 0, 'lat': [], 'lng': []})
        t['n'] += 1; t['m'] += int(num(l.get('mortos')) or 0); t['g'] += int(num(l.get('feridos_graves')) or 0)
        if lat and lng and -34 < lat < 6 and -75 < lng < -28: t['lat'].append(lat); t['lng'].append(lng)
    por_uf = {}
    for (uf, br, km), t in trechos.items():
        if not t['lat'] or (t['m'] == 0 and t['n'] < 8): continue
        lat = sorted(t['lat'])[len(t['lat']) // 2]; lng = sorted(t['lng'])[len(t['lng']) // 2]
        por_uf.setdefault(uf, []).append([uf, br, km, round(lat, 5), round(lng, 5), t['n'], t['m'], t['g']])
    saida = []
    for uf, lista in por_uf.items():
        lista.sort(key=lambda x: -(x[6] * 10 + x[7] * 3 + x[5]))
        saida += lista[:POR_UF]
    dado = {'atualizado': hoje.isoformat(), 'periodo': f'{inicio.strftime("%d/%m/%Y")} a {fim.strftime("%d/%m/%Y")}',
            'fonte': 'PRF, dados abertos de acidentes (DATATRAN, agrupados por ocorrência)', 'trecho_km': TRECHO_KM,
            'campos': ['uf', 'br', 'km_inicial', 'lat', 'lng', 'acidentes', 'mortos', 'feridos_graves'], 'trechos': saida}
    with open(SAIDA, 'w', encoding='utf-8') as f:
        json.dump(dado, f, ensure_ascii=False, separators=(',', ':'))
    print(len(saida), 'trechos;', dado['periodo'], '; mais grave:', max(saida, key=lambda x: x[6]) if saida else None)


if __name__ == '__main__':
    main()
