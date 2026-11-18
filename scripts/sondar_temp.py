"""Sonda temporária: página de dados abertos da PRF e API do GDELT."""
import json, re, sys, urllib.request, urllib.parse
sys.path.insert(0, 'scripts')
from sondar_fontes import get

for u in ['https://www.gov.br/prf/pt-br/acesso-a-informacao/dados-abertos/dados-abertos-da-prf',
          'https://www.gov.br/prf/pt-br/acesso-a-informacao/dados-abertos/dados-abertos-acidentes']:
    try:
        st, ct, b = get(u, timeout=60)
        t = b.decode('utf-8', 'ignore')
        print('###', u, st, len(t))
        for m in re.finditer(r'(?i)(datatran|acidentes|agrupad|ocorr[eê]ncia)', t):
            pass
        for m in re.finditer(r'<a [^>]*href="([^"]+)"[^>]*>(.{0,120}?)</a>', t, re.S):
            href, txt = m.group(1), re.sub(r'<[^>]+>|\s+', ' ', m.group(2)).strip()
            ctx = re.sub(r'<[^>]+>|\s+', ' ', t[max(0, m.start() - 300):m.start()])[-120:]
            if re.search(r'drive|datatran|\.zip|\.csv', href, re.I): print('  ', txt[:60], '|', href, '| ctx:', ctx)
    except Exception as e:
        print('###', u, 'ERRO', e)

q = '"Porto Alegre" (assalto OR roubo OR homicídio OR tiroteio) sourcecountry:brazil sourcelang:portuguese'
url = 'https://api.gdeltproject.org/api/v2/doc/doc?mode=artlist&format=json&sort=datedesc&maxrecords=10&timespan=7d&query=' + urllib.parse.quote(q)
try:
    st, ct, b = get(url, timeout=60)
    print('### GDELT', st, ct, b[:300])
    d = json.loads(b)
    for a in d.get('articles', [])[:5]: print('  ', a)
except Exception as e:
    print('### GDELT ERRO', e)
