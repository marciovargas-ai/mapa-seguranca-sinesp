"""
Referência nacional para comparar qualquer município com o Brasil inteiro.

Junta os arquivos do Sinesp (dados/sinesp_<ANO>_<UF>.json) com a população do
IBGE e calcula, para os últimos 12 meses publicados:
- a taxa de mortes violentas (CVLI = homicídio doloso + latrocínio + lesão corporal
  seguida de morte) de cada município com 20 mil habitantes ou mais;
- a taxa do Brasil e de cada estado.

Saída: dados/referencia_nacional.json
  { periodo, minPop, brasil: {cvli, pop, taxa}, ufs: {UF: {cvli, pop, taxa}},
    taxas: [taxas ordenadas], totais: [totais ordenados],
    municipios: { IBGE: [cvli12, pop, taxa] } }

O painel usa as listas ordenadas para dizer em que percentil nacional o município está.
"""
import json
import os
import sys
import time
import urllib.request

import re
import unicodedata


def normalizar(texto):
    """Mesma regra de atualizar_sinesp.py e do Apps Script."""
    s = unicodedata.normalize('NFD', str(texto or '').lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

DADOS = 'dados'
MIN_POP = 20000
CVLI = ('homicidio doloso', 'roubo seguido de morte latrocinio', 'latrocinio', 'lesao corporal seguida de morte')
FONTES_POP = [
    'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-1/variaveis/9324?localidades=N6[all]',
    'https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/-1/variaveis/93?localidades=N6[all]',
]
UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
       'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']


def baixar_json(url):
    for tentativa in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'mapa-seguranca-robo'})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except Exception as e:  # IBGE oscila: tenta de novo
            print('Falha', url[:80], e)
            time.sleep(10 * (tentativa + 1))
    return None


def populacao():
    for url in FONTES_POP:
        j = baixar_json(url)
        if not j:
            continue
        saida = {}
        for s in j[0]['resultados'][0]['series']:
            v = list(s['serie'].values())[0]
            if str(v).isdigit():
                nome, _, uf = s['localidade']['nome'].rpartition(' - ')
                saida[(uf, normalizar(nome))] = (s['localidade']['id'], int(v))
        if len(saida) > 5000:
            return saida
    raise SystemExit('População do IBGE indisponível')


def eh_cvli(nome):
    n = normalizar(nome)
    return any(n.startswith(c) for c in CVLI)


def main():
    manifesto = json.load(open(os.path.join(DADOS, 'manifesto.json')))
    anos = sorted(int(a) for a in manifesto['anos'])
    ult = anos[-1]
    ate = manifesto['anos'][str(ult)]['publicadoAte']
    # 12 meses: meses 1..ate do último ano + meses ate+1..12 do ano anterior
    janela = [(ult, m) for m in range(1, ate + 1)] + [(ult - 1, m) for m in range(ate + 1, 13)]
    meses_ano = {}
    for a, m in janela:
        meses_ano.setdefault(a, []).append(m - 1)

    pop = populacao()
    municipios, ufs = {}, {}
    for uf in UFS:
        tot_uf = 0
        porNome = {}
        for a, idx in meses_ano.items():
            caminho = os.path.join(DADOS, f'sinesp_{a}_{uf}.json')
            if not os.path.exists(caminho):
                continue
            d = json.load(open(caminho, encoding='utf-8'))
            for k, v in (d.get('estado') or {}).items():
                if eh_cvli(k):
                    tot_uf += sum(v[i] or 0 for i in idx if i < len(v))
            for chave, mun in (d.get('municipios') or {}).items():
                s = 0
                for k, v in (mun.get('e') or {}).items():
                    if eh_cvli(k):
                        s += sum(v[i] or 0 for i in idx if i < len(v))
                porNome[chave] = porNome.get(chave, 0) + s
        pop_uf = 0
        for (u, nome), (cod, hab) in pop.items():
            if u != uf:
                continue
            pop_uf += hab
            if hab >= MIN_POP:
                c = porNome.get(nome, 0)
                municipios[cod] = [c, hab, round(c / hab * 1e5, 1)]
        ufs[uf] = {'cvli': tot_uf, 'pop': pop_uf, 'taxa': round(tot_uf / pop_uf * 1e5, 1) if pop_uf else None}

    cvli_br = sum(u['cvli'] for u in ufs.values())
    pop_br = sum(u['pop'] for u in ufs.values())
    saida = {
        'periodo': f'{ate + 1:02d}/{ult - 1} a {ate:02d}/{ult}' if ate < 12 else f'01/{ult} a 12/{ult}',
        'fonte': 'Sinesp VDE (MJSP) + população IBGE; CVLI = homicídio doloso + latrocínio + lesão corporal seguida de morte',
        'minPop': MIN_POP,
        'brasil': {'cvli': cvli_br, 'pop': pop_br, 'taxa': round(cvli_br / pop_br * 1e5, 1)},
        'ufs': ufs,
        'taxas': sorted(v[2] for v in municipios.values()),
        'totais': sorted(v[0] for v in municipios.values()),
        'municipios': municipios,
    }
    with open(os.path.join(DADOS, 'referencia_nacional.json'), 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, separators=(',', ':'))
    print('Brasil:', saida['brasil'], '| municípios comparáveis:', len(municipios))
    for cod in ('3304557', '4300604', '2927408', '4314902', '3550308'):
        print(cod, municipios.get(cod))


if __name__ == '__main__':
    main()
