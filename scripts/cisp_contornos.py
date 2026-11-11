"""
Converte o GeoJSON das CISPs (gerado por scripts/cisp_rj.R) no formato leve do painel:

  dados/cisp_rj_contornos.json  { fonte, cisps: { "<numero>": { aisp, lat, lng, aneis: [[[lat, lng], ...]] } } }

Uso: python scripts/cisp_contornos.py cisp_rj.geojson
"""
import json
import re
import sys


def numero(props):
    for k in ('cisp', 'CISP', 'dp', 'DP', 'id number', 'id_number', 'id', 'num', 'numero'):
        v = props.get(k)
        if v is None:
            continue
        m = re.search(r'\d+', str(v))
        if m:
            return int(m.group())
    return None


def aneis(geom):
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']] if geom['type'] == 'Polygon' else []
    return [[[round(y, 5), round(x, 5)] for x, y in p[0]] for p in polys if p and len(p[0]) > 3]


def main():
    entrada = sys.argv[1] if len(sys.argv) > 1 else 'cisp_rj.geojson'
    saida = sys.argv[2] if len(sys.argv) > 2 else 'dados/cisp_rj_contornos.json'
    gj = json.load(open(entrada, encoding='utf-8'))
    print('campos:', list(gj['features'][0]['properties'].keys()) if gj['features'] else [])
    cisps = {}
    for f in gj['features']:
        n = numero(f['properties'] or {})
        if n is None or not f.get('geometry'):
            continue
        a = aneis(f['geometry'])
        if not a:
            continue
        maior = max(a, key=len)
        lat = sum(p[0] for p in maior) / len(maior)
        lng = sum(p[1] for p in maior) / len(maior)
        aisp = f['properties'].get('aisp')
        cisps.setdefault(str(n), {'aisp': aisp, 'lat': round(lat, 5), 'lng': round(lng, 5), 'aneis': []})['aneis'].extend(a)
    json.dump({'fonte': 'ISP-RJ, Circunscrições Integradas de Segurança Pública (pacote ispdata)', 'cisps': cisps},
              open(saida, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(len(cisps), 'CISPs com contorno em', saida)


if __name__ == '__main__':
    main()
