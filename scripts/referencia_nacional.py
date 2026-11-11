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
TENT = ('tentativa de homicidio', 'tentativa de feminicidio')
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


def eh_tent(nome):
    n = normalizar(nome)
    return any(n.startswith(c) for c in TENT)


def main():
    manifesto = json.load(open(os.path.join(DADOS, 'manifesto.json')))
    ult = max(int(a) for a in manifesto['anos'])
    ate = manifesto['anos'][str(ult)]['publicadoAte']
    janela = [(ult, m) for m in range(1, ate + 1)] + [(ult - 1, m) for m in range(ate + 1, 13)]
    meses_ano = {}
    for a, m in janela:
        meses_ano.setdefault(a, []).append(m - 1)

    # janelas: 12 meses atuais, 12 anteriores e 36 meses (média de 3 anos para cidades pequenas)
    def janela_de(inicio_ano, inicio_mes_exclusivo, meses):
        out, a, m = [], ult, ate
        for _ in range(meses):
            out.append((a, m)); m -= 1
            if m == 0: a, m = a - 1, 12
        return out
    j12 = janela_de(ult, ate, 12)
    j24 = janela_de(ult, ate, 24)[12:]
    j36 = janela_de(ult, ate, 36)
    cache = {}
    def arq(a, uf):
        k = (a, uf)
        if k not in cache:
            c = os.path.join(DADOS, f'sinesp_{a}_{uf}.json')
            cache[k] = json.load(open(c, encoding='utf-8')) if os.path.exists(c) else None
        return cache[k]
    def soma_mun(uf, jan, filtro):
        tot = {}
        for a, m in jan:
            d = arq(a, uf)
            if not d: continue
            for chave, mun in (d.get('municipios') or {}).items():
                nome = normalizar(mun.get('n') or chave)
                s_ = sum((v[m - 1] or 0) for k, v in (mun.get('e') or {}).items() if filtro(k) and m - 1 < len(v))
                tot[nome] = tot.get(nome, 0) + s_
        return tot
    ufs = {}
    for uf in UFS:
        tot = 0
        for a, m in j12:
            d = arq(a, uf)
            if d:
                tot += sum((v[m - 1] or 0) for k, v in (d.get('estado') or {}).items() if eh_cvli(k) and m - 1 < len(v))
        c12, c_ant, c36 = soma_mun(uf, j12, eh_cvli), soma_mun(uf, j24, eh_cvli), soma_mun(uf, j36, eh_cvli)
        t12, t36 = soma_mun(uf, j12, eh_tent), soma_mun(uf, j36, eh_tent)
        ufs[uf] = {'cvli': tot, 'municipios': c12,
                   # nome -> [cvli 12m, cvli 12m anteriores, cvli 36m, tentativas 12m, tentativas 36m]
                   'detalhe': {n: [c12.get(n, 0), c_ant.get(n, 0), c36.get(n, 0), t12.get(n, 0), t36.get(n, 0)] for n in c12}}
        print(uf, tot, len(c12), flush=True)
        for k in list(cache):
            if k[1] == uf: cache.pop(k)

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
