"""
Malha oficial de bairros do IBGE (Censo Demográfico 2022) cortada por município.

Baixa o GeoPackage nacional (~53 MB), simplifica os contornos (~15 m) e grava
um arquivo pequeno por município, no mesmo formato que o painel já usa:

  dados/bairros/<CD_MUN>.json   [ { n, lat, lng, aneis: [[[lat, lng], ...], ...] }, ... ]
  dados/bairros/indice.json     { atualizadoEm, fonte, municipios: { CD_MUN: qtd_bairros } }

Só existem arquivos para os municípios que têm bairros oficiais cadastrados no
IBGE. Para os demais, o painel continua usando o OpenStreetMap.

Uso: python scripts/bairros_ibge.py [--arquivo caminho.gpkg] [--saida dados/bairros]
"""
import argparse
import datetime as dt
import json
import os
import sys
import tempfile
import urllib.request

import geopandas as gpd
from shapely.geometry import MultiPolygon, Polygon

URL = ('https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/'
       'malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/bairros/gpkg/BR/BR_bairros_CD2022.gpkg')
TOLERANCIA = 0.00015  # graus (~15 m): contorno leve sem perder a forma do bairro


def coluna(df, *opcoes):
    mapa = {c.upper(): c for c in df.columns}
    for o in opcoes:
        if o in mapa:
            return mapa[o]
    raise SystemExit(f'Coluna não encontrada ({opcoes}). Colunas: {list(df.columns)}')


def aneis(geom):
    partes = geom.geoms if isinstance(geom, MultiPolygon) else [geom] if isinstance(geom, Polygon) else []
    saida = []
    for p in partes:
        if p.is_empty or p.area < 1e-9:
            continue
        saida.append([[round(y, 5), round(x, 5)] for x, y in p.exterior.coords])
    return saida


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--arquivo')
    ap.add_argument('--saida', default='dados/bairros')
    args = ap.parse_args()

    caminho = args.arquivo
    if not caminho:
        caminho = os.path.join(tempfile.gettempdir(), 'BR_bairros_CD2022.gpkg')
        if not os.path.exists(caminho):
            print('Baixando', URL)
            req = urllib.request.Request(URL, headers={'User-Agent': 'mapa-seguranca-robo'})
            with urllib.request.urlopen(req, timeout=600) as r, open(caminho, 'wb') as f:
                while True:
                    bloco = r.read(1 << 20)
                    if not bloco:
                        break
                    f.write(bloco)

    df = gpd.read_file(caminho)
    if df.crs and df.crs.to_epsg() != 4326:
        df = df.to_crs(4326)
    c_mun = coluna(df, 'CD_MUN')
    c_nome = coluna(df, 'NM_BAIRRO', 'NM_BAI', 'NOME')
    print(len(df), 'bairros;', df[c_mun].nunique(), 'municípios')

    os.makedirs(args.saida, exist_ok=True)
    indice = {}
    for cd_mun, grupo in df.groupby(c_mun):
        cd_mun = str(cd_mun)
        # Simplifica o município inteiro de uma vez para os bairros vizinhos continuarem encostados
        geoms = grupo.geometry.simplify(TOLERANCIA, preserve_topology=True)
        itens = {}
        for nome, geom, original in zip(grupo[c_nome], geoms, grupo.geometry):
            nome = str(nome or '').strip()
            if not nome or geom is None or geom.is_empty:
                continue
            ponto = original.representative_point()
            lista = aneis(geom)
            if not lista:
                continue
            if nome in itens:  # mesmo bairro em mais de um pedaço
                itens[nome]['aneis'].extend(lista)
                continue
            itens[nome] = {'n': nome, 'lat': round(ponto.y, 5), 'lng': round(ponto.x, 5), 'aneis': lista}
        if not itens:
            continue
        with open(os.path.join(args.saida, cd_mun + '.json'), 'w', encoding='utf-8') as f:
            json.dump(list(itens.values()), f, ensure_ascii=False, separators=(',', ':'))
        indice[cd_mun] = len(itens)

    with open(os.path.join(args.saida, 'indice.json'), 'w', encoding='utf-8') as f:
        json.dump({'atualizadoEm': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d'),
                   'fonte': 'IBGE, Malha de Bairros do Censo Demográfico 2022',
                   'municipios': indice}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(indice), 'municípios gravados em', args.saida)


if __name__ == '__main__':
    sys.exit(main())
