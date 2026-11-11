"""
ISP-RJ (Instituto de Segurança Pública do Rio de Janeiro): ocorrências por área
de delegacia (CISP), mês a mês. Resume os últimos 12 meses publicados e os 12
anteriores, por CISP, e grava:

  dados/isp_rj_cisp.json
  { atualizadoEm, fonte, periodo: { de, ate }, campos: { chave: rótulo },
    municipios: { CD_MUN: [ { cisp, aisp, u12: { chave: n }, a12: { chave: n } }, ... ] } }

Uso: python scripts/isp_rj.py [--arquivo caminho.csv]
"""
import argparse
import csv
import datetime as dt
import io
import json
import sys
import urllib.request

URL = 'https://www.ispdados.rj.gov.br/Arquivos/BaseDPEvolucaoMensalCisp.csv'
CAMPOS = {
    'letalidade_violenta': 'Letalidade violenta',
    'hom_doloso': 'Homicídio doloso',
    'hom_por_interv_policial': 'Morte por intervenção de agente do Estado',
    'latrocinio': 'Latrocínio',
    'tentat_hom': 'Tentativa de homicídio',
    'feminicidio': 'Feminicídio',
    'estupro': 'Estupro',
    'roubo_transeunte': 'Roubo a transeunte',
    'roubo_celular': 'Roubo de celular',
    'roubo_veiculo': 'Roubo de veículo',
    'roubo_carga': 'Roubo de carga',
    'roubo_rua': 'Roubos de rua',
    'furto_veiculos': 'Furto de veículo',
    'apreensao_drogas': 'Apreensão de drogas',
    'apf': 'Prisões em flagrante',
    'pessoas_desaparecidas': 'Pessoas desaparecidas',
}


def numero(v):
    try:
        return int(float(str(v).replace(',', '.') or 0))
    except ValueError:
        return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--arquivo')
    ap.add_argument('--saida', default='dados/isp_rj_cisp.json')
    args = ap.parse_args()

    if args.arquivo:
        bruto = open(args.arquivo, 'rb').read()
    else:
        req = urllib.request.Request(URL, headers={'User-Agent': 'mapa-seguranca-robo'})
        bruto = urllib.request.urlopen(req, timeout=300).read()
    for cod in ('utf-8-sig', 'latin-1'):
        try:
            texto = bruto.decode(cod)
            break
        except UnicodeDecodeError:
            continue
    sep = ';' if texto.split('\n', 1)[0].count(';') > texto.split('\n', 1)[0].count(',') else ','
    linhas = list(csv.DictReader(io.StringIO(texto), delimiter=sep))
    if not linhas:
        raise SystemExit('CSV vazio')
    cols = {c.lower().strip(): c for c in linhas[0].keys()}
    campos = {k: v for k, v in CAMPOS.items() if k in cols}
    c_mun = cols.get('mcirc') or cols.get('fmun_cod')

    def mes_indice(l):
        return numero(l[cols['ano']]) * 12 + numero(l[cols['mes']]) - 1

    ultimo = max(mes_indice(l) for l in linhas)
    # Último mês só conta se tiver dado de verdade (o ISP às vezes publica o mês zerado)
    while ultimo > 0 and sum(numero(l[cols['letalidade_violenta']]) for l in linhas if mes_indice(l) == ultimo) == 0:
        ultimo -= 1
    inicio = ultimo - 11

    por_cisp = {}
    for l in linhas:
        m = mes_indice(l)
        if m < inicio - 12 or m > ultimo:
            continue
        cisp = numero(l[cols['cisp']])
        mun = str(numero(l[c_mun])) if c_mun else ''
        r = por_cisp.setdefault(cisp, {'cisp': cisp, 'aisp': numero(l.get(cols.get('aisp', ''), 0)), 'mun': mun,
                                       'u12': {k: 0 for k in campos}, 'a12': {k: 0 for k in campos}})
        alvo = r['u12'] if m >= inicio else r['a12']
        for k in campos:
            alvo[k] += numero(l[cols[k]])

    municipios = {}
    for r in sorted(por_cisp.values(), key=lambda x: x['cisp']):
        mun = r.pop('mun')
        # mcirc vem com 7 dígitos (código IBGE completo) ou 6; o painel compara pelos 6 primeiros
        municipios.setdefault(mun[:6], []).append(r)

    def rotulo(i):
        return f'{i % 12 + 1:02d}/{i // 12}'

    with open(args.saida, 'w', encoding='utf-8') as f:
        json.dump({'atualizadoEm': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d'),
                   'fonte': 'ISP-RJ, ocorrências por área de delegacia (CISP)',
                   'periodo': {'de': rotulo(inicio), 'ate': rotulo(ultimo)},
                   'campos': campos, 'municipios': municipios}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(por_cisp), 'CISPs;', len(municipios), 'municípios; período', rotulo(inicio), 'a', rotulo(ultimo))


if __name__ == '__main__':
    sys.exit(main())
