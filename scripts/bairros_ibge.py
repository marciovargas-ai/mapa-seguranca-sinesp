"""
Malha oficial de bairros do IBGE (Censo Demográfico 2022) cortada por município.

Baixa o GeoPackage nacional (~53 MB), simplifica os contornos (~15 m) e grava
um arquivo pequeno por município, no mesmo formato que o painel já usa:

  dados/bairros/<CD_MUN>.json   [ { n, lat, lng, aneis: [[[lat, lng], ...], ...] }, ... ]
  dados/bairros/indice.json     { atualizadoEm, fonte, municipios: { CD_MUN: qtd_bairros } }

Municípios sem bairros oficiais mas divididos em 4 ou mais distritos (São Paulo
capital, por exemplo, com 96 distritos) recebem os distritos do IBGE no lugar.
Para os demais, o painel continua usando o OpenStreetMap.

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
URL_DISTRITOS = URL.replace('/bairros/', '/distritos/').replace('BR_bairros_CD2022', 'BR_distritos_CD2022')
MIN_DISTRITOS = 4
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

    df = ler(args.arquivo or baixar(URL))
    c_mun = coluna(df, 'CD_MUN')
    c_nome = coluna(df, 'NM_BAIRRO', 'NM_BAI', 'NOME')
    print(len(df), 'bairros;', df[c_mun].nunique(), 'municípios')
    os.makedirs(args.saida, exist_ok=True)
    indice = {}
    gravar(df, c_mun, c_nome, args.saida, indice)

    # Distritos onde não há bairros (São Paulo capital e outros municípios grandes)
    if not args.arquivo:
        try:
            dd = ler(baixar(URL_DISTRITOS))
            d_mun = coluna(dd, 'CD_MUN')
            d_nome = coluna(dd, 'NM_DIST', 'NM_DISTRIT', 'NOME')
            qtd = dd.groupby(d_mun)[d_nome].count()
            alvo = [str(c) for c, q in qtd.items() if q >= MIN_DISTRITOS and str(c) not in indice]
            dd = dd[dd[d_mun].astype(str).isin(alvo)]
            antes = len(indice)
            gravar(dd, d_mun, d_nome, args.saida, indice)
            print(len(indice) - antes, 'municípios com distritos no lugar dos bairros')
        except Exception as e:  # distritos são complemento: falha não derruba os bairros
            print('Distritos indisponíveis:', e)

    with open(os.path.join(args.saida, 'indice.json'), 'w', encoding='utf-8') as f:
        json.dump({'atualizadoEm': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d'),
                   'fonte': 'IBGE, Malha de Bairros (e de Distritos) do Censo Demográfico 2022',
                   'municipios': indice}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(indice), 'municípios gravados em', args.saida)


def baixar(url):
    caminho = os.path.join(tempfile.gettempdir(), url.rsplit('/', 1)[1])
    if not os.path.exists(caminho):
        print('Baixando', url)
        req = urllib.request.Request(url, headers={'User-Agent': 'mapa-seguranca-robo'})
        with urllib.request.urlopen(req, timeout=600) as r, open(caminho + '.parcial', 'wb') as f:
            while True:
                bloco = r.read(1 << 20)
                if not bloco:
                    break
                f.write(bloco)
        os.replace(caminho + '.parcial', caminho)
    return caminho


def ler(caminho):
    df = gpd.read_file(caminho)
    if df.crs and df.crs.to_epsg() != 4326:
        df = df.to_crs(4326)
    return df


def gravar(df, c_mun, c_nome, saida, indice):
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
        with open(os.path.join(saida, cd_mun + '.json'), 'w', encoding='utf-8') as f:
            json.dump(list(itens.values()), f, ensure_ascii=False, separators=(',', ':'))
        indice[cd_mun] = len(itens)


if __name__ == '__main__':
    sys.exit(main())
