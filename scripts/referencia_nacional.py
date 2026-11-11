"""
Referência nacional para comparar qualquer município com o Brasil inteiro.

Soma, para os últimos 12 meses publicados do Sinesp, as mortes violentas (CVLI =
homicídio doloso + latrocínio + lesão corporal seguida de morte) de cada município
e de cada estado. A população fica a cargo do painel (IBGE pelo navegador, que o
robô do GitHub nem sempre alcança), que então calcula as taxas e o percentil.

Saída: dados/referencia_nacional.json
  { periodo, fonte, ufs: { UF: { cvli, municipios: { nome_normalizado: cvli12 } } } }
"""
import json
import os
import re
import unicodedata

DADOS = 'dados'
CVLI = ('homicidio doloso', 'roubo seguido de morte latrocinio', 'latrocinio', 'lesao corporal seguida de morte')
UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
       'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']


def normalizar(texto):
    """Mesma regra de atualizar_sinesp.py, do Apps Script e do painel."""
    s = unicodedata.normalize('NFD', str(texto or '').lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def eh_cvli(nome):
    n = normalizar(nome)
    return any(n.startswith(c) for c in CVLI)


def main():
    manifesto = json.load(open(os.path.join(DADOS, 'manifesto.json')))
    ult = max(int(a) for a in manifesto['anos'])
    ate = manifesto['anos'][str(ult)]['publicadoAte']
    janela = [(ult, m) for m in range(1, ate + 1)] + [(ult - 1, m) for m in range(ate + 1, 13)]
    meses_ano = {}
    for a, m in janela:
        meses_ano.setdefault(a, []).append(m - 1)

    ufs = {}
    for uf in UFS:
        tot, porNome = 0, {}
        for a, idx in meses_ano.items():
            caminho = os.path.join(DADOS, f'sinesp_{a}_{uf}.json')
            if not os.path.exists(caminho):
                continue
            d = json.load(open(caminho, encoding='utf-8'))
            for k, v in (d.get('estado') or {}).items():
                if eh_cvli(k):
                    tot += sum(v[i] or 0 for i in idx if i < len(v))
            for chave, mun in (d.get('municipios') or {}).items():
                s = sum(sum(v[i] or 0 for i in idx if i < len(v)) for k, v in (mun.get('e') or {}).items() if eh_cvli(k))
                porNome[normalizar(mun.get('n') or chave)] = porNome.get(normalizar(mun.get('n') or chave), 0) + s
        ufs[uf] = {'cvli': tot, 'municipios': porNome}
        print(uf, tot, len(porNome), flush=True)

    saida = {
        'periodo': f'{ate + 1:02d}/{ult - 1} a {ate:02d}/{ult}' if ate < 12 else f'01/{ult} a 12/{ult}',
        'fonte': 'Sinesp VDE (MJSP); CVLI = homicídio doloso + latrocínio + lesão corporal seguida de morte',
        'ufs': ufs,
    }
    with open(os.path.join(DADOS, 'referencia_nacional.json'), 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, separators=(',', ':'))
    print('Brasil:', sum(u['cvli'] for u in ufs.values()), 'mortes violentas em', saida['periodo'])


if __name__ == '__main__':
    main()
