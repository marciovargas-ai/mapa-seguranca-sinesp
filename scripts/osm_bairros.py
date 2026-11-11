"""
Bairros do OpenStreetMap para todos os municípios que o IBGE não cobre.

O IBGE publica malha de bairros (ou distritos) para ~1.300 municípios. Para os
outros ~4.200, o painel dependia do Overpass pelo navegador, que falha com
frequência (limite de uso e tempo). Aqui o robô processa o Brasil inteiro de uma
vez, a partir do extrato do Geofabrik:

1. Contornos de bairro do OSM (place=suburb/neighbourhood/quarter como área, ou
   limite administrativo nível 9/10) dentro de cada município: f = "OSM".
2. Onde o OSM só tem o ponto do bairro (3 ou mais), a área é aproximada por
   Voronoi: cada pedaço da cidade vai para o bairro mais próximo, limitado a
   ~1,5 km do ponto e ao contorno do município: f = "OSM~" (aproximado).

Saída no mesmo formato do IBGE (não sobrescreve arquivos do IBGE):
  dados/bairros/<CD_MUN>.json      [ { n, lat, lng, aneis, f } ]
  dados/bairros/indice_osm.json    { atualizadoEm, fonte, municipios: { CD_MUN: [qtd, "OSM"|"OSM~"] } }

Uso: python scripts/osm_bairros.py [--pbf brasil.osm.pbf] [--saida dados/bairros]
Precisa do osmium-tool (apt install osmium-tool).
"""
import argparse
import datetime as dt
import json
import os
import subprocess
import sys
import tempfile

import geopandas as gpd
from shapely.geometry import MultiPoint, MultiPolygon, Point, Polygon, shape
from shapely.ops import voronoi_diagram

sys.path.insert(0, os.path.dirname(__file__))
from bairros_ibge import aneis, baixar, ler  # noqa: E402

URL_PBF = 'https://download.geofabrik.de/south-america/brazil-latest.osm.pbf'
URL_MUN = ('https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/'
           'municipio_2022/Brasil/BR/BR_Municipios_2022.zip')
LUGARES = {'suburb', 'neighbourhood', 'quarter'}
TOLERANCIA = 0.0002
RAIO_APROX = 0.014  # graus (~1,5 km): área máxima atribuída a um bairro que só tem ponto
MIN_BAIRROS = 3


def filtrar_osm(pbf):
    tmp = tempfile.gettempdir()
    filtrado = os.path.join(tmp, 'bairros_osm.pbf')
    seq = os.path.join(tmp, 'bairros_osm.geojsonseq')
    subprocess.run(['osmium', 'tags-filter', '--overwrite', pbf,
                    'nwr/place=suburb,neighbourhood,quarter', 'r/admin_level=9,10', '-o', filtrado], check=True)
    subprocess.run(['osmium', 'export', '--overwrite', filtrado, '-f', 'geojsonseq', '-o', seq,
                    '--geometry-types=point,polygon'], check=True)
    return seq


def ler_feicoes(seq):
    nomes, geoms, tipos = [], [], []
    with open(seq, encoding='utf-8') as f:
        for linha in f:
            linha = linha.strip().lstrip('\x1e')
            if not linha:
                continue
            try:
                ft = json.loads(linha)
            except ValueError:
                continue
            p = ft.get('properties') or {}
            nome = (p.get('name') or '').strip()
            if not nome:
                continue
            eh_lugar = p.get('place') in LUGARES
            eh_limite = p.get('boundary') == 'administrative' and str(p.get('admin_level')) in ('9', '10')
            if not (eh_lugar or eh_limite):
                continue
            try:
                g = shape(ft['geometry'])
            except Exception:
                continue
            if g.is_empty:
                continue
            if not g.is_valid:
                g = g.buffer(0)
            nomes.append(nome)
            geoms.append(g)
            tipos.append('area' if g.geom_type in ('Polygon', 'MultiPolygon') else 'ponto')
    print(len(nomes), 'feições de bairro no OSM')
    return gpd.GeoDataFrame({'n': nomes, 'tipo': tipos}, geometry=geoms, crs=4326)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pbf')
    ap.add_argument('--saida', default='dados/bairros')
    args = ap.parse_args()

    ibge = {}
    try:
        with open(os.path.join(args.saida, 'indice.json'), encoding='utf-8') as f:
            ibge = json.load(f).get('municipios', {})
    except FileNotFoundError:
        pass

    mun = ler(baixar(URL_MUN))
    c_mun = [c for c in mun.columns if c.upper() == 'CD_MUN'][0]
    mun = mun[[c_mun, 'geometry']].rename(columns={c_mun: 'cd'})
    mun['cd'] = mun['cd'].astype(str)
    mun = mun[~mun['cd'].isin(ibge.keys())]
    print(len(mun), 'municípios sem malha do IBGE')

    osm = ler_feicoes(filtrar_osm(args.pbf or baixar(URL_PBF)))
    osm['ponto'] = osm.geometry.representative_point()
    pts = osm.set_geometry('ponto')
    junto = gpd.sjoin(pts, mun, how='inner', predicate='within')
    print(len(junto), 'feições dentro de municípios sem malha do IBGE')

    geom_mun = dict(zip(mun['cd'], mun.geometry))
    indice = {}
    for cd, grupo in junto.groupby('cd'):
        contorno = geom_mun[cd]
        area_mun = contorno.area
        areas, pontos = {}, {}
        for nome, tipo, g in zip(grupo['n'], grupo['tipo'], osm.geometry.loc[grupo.index]):
            if tipo == 'area':
                if g.area >= area_mun * 0.6 or g.area < 1e-8:
                    continue  # a cidade inteira ou um polígono degenerado
                g = g.intersection(contorno)
                if g.is_empty:
                    continue
                if nome not in areas or g.area > areas[nome].area:
                    areas[nome] = g
            else:
                pontos.setdefault(nome, g)
        itens, fonte = [], ''
        if len(areas) >= MIN_BAIRROS:
            fonte = 'OSM'
            for nome, g in areas.items():
                itens.append((nome, g, g.representative_point()))
        else:
            todos = dict(pontos)
            for nome, g in areas.items():
                todos.setdefault(nome, g.representative_point())
            if len(todos) >= MIN_BAIRROS:
                fonte = 'OSM~'
                nomes = list(todos)
                celulas = voronoi_diagram(MultiPoint([todos[n] for n in nomes]), envelope=contorno.envelope)
                for cel in celulas.geoms:
                    dono = next((n for n in nomes if cel.contains(todos[n])), None)
                    if not dono:
                        continue
                    g = cel.intersection(contorno).intersection(todos[dono].buffer(RAIO_APROX))
                    if dono in areas:
                        g = areas[dono]
                    if not g.is_empty:
                        itens.append((dono, g, todos[dono]))
        if not itens:
            continue
        saida = []
        for nome, g, p in itens:
            lista = aneis(g.simplify(TOLERANCIA, preserve_topology=True))
            if lista:
                saida.append({'n': nome, 'lat': round(p.y, 5), 'lng': round(p.x, 5), 'aneis': lista, 'f': fonte})
        if len(saida) < MIN_BAIRROS:
            continue
        with open(os.path.join(args.saida, cd + '.json'), 'w', encoding='utf-8') as f:
            json.dump(saida, f, ensure_ascii=False, separators=(',', ':'))
        indice[cd] = [len(saida), fonte]

    with open(os.path.join(args.saida, 'indice_osm.json'), 'w', encoding='utf-8') as f:
        json.dump({'atualizadoEm': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d'),
                   'fonte': 'OpenStreetMap (ODbL), extrato Geofabrik; OSM~ = área aproximada pelo ponto do bairro',
                   'municipios': indice}, f, ensure_ascii=False, separators=(',', ':'))
    com = sum(1 for v in indice.values() if v[1] == 'OSM')
    print(len(indice), 'municípios gravados:', com, 'com contornos do OSM,', len(indice) - com, 'com áreas aproximadas')


if __name__ == '__main__':
    sys.exit(main())
