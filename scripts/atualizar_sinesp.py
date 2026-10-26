"""
Baixa a base pública do Sinesp VDE (Ministério da Justiça e Segurança Pública),
resume por UF, município, evento e mês e grava um JSON pequeno por ano e UF:

  dados/sinesp_<ANO>_<UF>.json
  { v, ano, uf, importadoEm, fonte,
    estado:     { evento: [12 meses] },                 (todos os órgãos)
    orgaos:     { PRF|PF: { evento: [12 meses] } },     (registros dos órgãos federais)
    municipios: { nome_normalizado: { n: nome, e: { evento: [12] }, o: { PRF|PF: { evento: [12] } } } } }
  dados/manifesto.json  { atualizadoEm, anos: { "<ANO>": { publicadoAte, ufs } } }

O Apps Script do Mapa da Segurança lê esses arquivos pelo endereço "raw" do
GitHub. Os arquivos de cada ano têm ~26 MB e ~750 mil linhas, grandes demais
para o Google Sheets e para o tempo de execução do Apps Script.

Uso: python scripts/atualizar_sinesp.py [--anos 2024 2025 2026] [--arquivo ano=caminho.xlsx]
"""
import argparse
import datetime as dt
import io
import json
import os
import re
import sys
import time
import unicodedata
import urllib.request
import zipfile

from openpyxl import load_workbook

URL_VDE = ('https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/estatistica/'
           'download/dnsp-base-de-dados/bancovde-{ano}.xlsx/@@download/file')
PASTA_SAIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dados')

UFS = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 'CE': 'Ceará',
    'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso',
    'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
    'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
    'SE': 'Sergipe', 'TO': 'Tocantins'
}
# Órgãos federais que aparecem na coluna "abrangencia" (cruzamento por fonte no painel)
ORGAO_POR_ABRANGENCIA = {'policia rodoviaria federal': 'PRF', 'policia federal': 'PF'}
MESES = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro',
         'outubro', 'novembro', 'dezembro']


def normalizar(texto):
    """Mesma regra de normalizarTexto_ no Apps Script (4_Utils_Gatilhos.gs)."""
    s = unicodedata.normalize('NFD', str(texto or '').lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


UF_POR_NOME = {}
for sigla, nome in UFS.items():
    UF_POR_NOME[normalizar(nome)] = sigla
    UF_POR_NOME[sigla.lower()] = sigla


def baixar(ano, tentativas=4):
    """Baixa o .xlsx do ano. O gov.br às vezes corta o arquivo com HTTP 200: valida o zip."""
    url = URL_VDE.format(ano=ano)
    for i in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (mapa-da-seguranca)'})
            with urllib.request.urlopen(req, timeout=300) as resp:
                dados = resp.read()
            with zipfile.ZipFile(io.BytesIO(dados)) as z:
                if z.testzip() is None:
                    return dados
            print(f'{ano}: arquivo corrompido, nova tentativa')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                print(f'{ano}: ainda não publicado')
                return None
            print(f'{ano}: HTTP {e.code}, nova tentativa')
        except Exception as e:  # noqa: BLE001 - rede instável: tenta de novo
            print(f'{ano}: {e}, nova tentativa')
        time.sleep(10 * (i + 1))
    return None


def indice_mes(valor, ano):
    if isinstance(valor, (dt.datetime, dt.date)):
        return valor.month - 1 if valor.year == ano else -1
    s = str(valor or '').strip()
    m = re.match(r'^(\d{4})-(\d{1,2})', s)
    if m:
        return int(m.group(2)) - 1 if int(m.group(1)) == ano else -1
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})', s)
    if m:
        return int(m.group(2)) - 1 if int(m.group(3)) == ano else -1
    m = re.match(r'^(\d{1,2})/(\d{4})', s)
    if m:
        return int(m.group(1)) - 1 if int(m.group(2)) == ano else -1
    t = normalizar(s)
    if t.isdigit() and 1 <= int(t) <= 12:
        return int(t) - 1
    for i, nome in enumerate(MESES):
        if t.startswith(nome) or (len(t) >= 3 and nome.startswith(t[:3])):
            return i
    return -1


def achar_colunas(cabecalho):
    nomes = [normalizar(v).replace(' ', '_') for v in cabecalho]

    def achar(*alvos):
        for i, n in enumerate(nomes):
            if any(n == a or n.startswith(a) for a in alvos):
                return i
        return -1

    c = {
        'uf': achar('uf', 'sigla_uf', 'estado'),
        'mun': achar('municipio', 'nome_municipio', 'cidade'),
        'evento': achar('evento', 'tipo_crime', 'indicador', 'natureza'),
        'data': achar('data_referencia', 'data', 'mes_ano', 'referencia'),
        'total': next((i for i, n in enumerate(nomes) if n in ('total', 'quantidade', 'ocorrencias', 'qtd')), -1),
        'vitimas': next((i for i, n in enumerate(nomes) if n in ('total_vitima', 'total_vitimas', 'vitimas')), -1),
        'abrangencia': achar('abrangencia'),
    }
    ok = c['uf'] >= 0 and c['evento'] >= 0 and c['data'] >= 0 and (c['total'] >= 0 or c['vitimas'] >= 0)
    return c if ok else None


def doze():
    return [0] * 12


def processar(conteudo, ano):
    """Devolve {uf: {estado, municipios, publicadoAte}} e o número de linhas lidas."""
    wb = load_workbook(io.BytesIO(conteudo), read_only=True, data_only=True)
    estado, municipios, orgaos_estado = {}, {}, {}
    ultimo_mes = {}
    lidas = 0
    diag = {'abas': [], 'descartes': {}, 'abrangencias': {}, 'exemplos': []}

    def descartar(motivo):
        diag['descartes'][motivo] = diag['descartes'].get(motivo, 0) + 1

    for aba in wb.worksheets:
        col = None
        info = {'nome': aba.title, 'linhas': 0, 'cabecalho': None}
        diag['abas'].append(info)
        for linha in aba.iter_rows(values_only=True):
            info['linhas'] += 1
            if col is None:
                col = achar_colunas(linha)
                if col:
                    info['cabecalho'] = [str(v) for v in linha]
                continue
            if len(diag['exemplos']) < 8 and info['linhas'] % 50000 == 0:
                diag['exemplos'].append([str(v) for v in linha])
            uf = UF_POR_NOME.get(normalizar(linha[col['uf']]))
            evento = str(linha[col['evento']] or '').strip()
            if not uf or not evento:
                descartar('sem uf/evento')
                continue
            mes = indice_mes(linha[col['data']], ano)
            if mes < 0:
                descartar('data fora do ano')
                continue
            qtd = linha[col['total']] if col['total'] >= 0 else 0
            if not qtd and col['vitimas'] >= 0:
                qtd = linha[col['vitimas']]
            try:
                qtd = float(qtd or 0)
            except (TypeError, ValueError):
                qtd = 0
            if not qtd:
                descartar('quantidade zero')
                continue
            qtd = int(qtd) if qtd == int(qtd) else qtd
            lidas += 1
            ultimo_mes[uf] = max(ultimo_mes.get(uf, -1), mes)

            nome_mun = str(linha[col['mun']] or '').strip() if col['mun'] >= 0 else ''
            # "abrangencia" é o órgão que registrou (Estadual = polícias do estado, PRF, PF), não o nível geográfico
            abr = str(linha[col['abrangencia']] or '').strip() if col['abrangencia'] >= 0 else ''
            diag['abrangencias'][abr] = diag['abrangencias'].get(abr, 0) + 1
            orgao = ORGAO_POR_ABRANGENCIA.get(normalizar(abr))
            estado.setdefault(uf, {}).setdefault(evento, doze())[mes] += qtd
            if orgao:
                orgaos_estado.setdefault(uf, {}).setdefault(orgao, {}).setdefault(evento, doze())[mes] += qtd
            if nome_mun and not re.search(r'n[aã]o informado', nome_mun, re.I):
                chave = normalizar(nome_mun)
                m = municipios.setdefault(uf, {}).setdefault(chave, {'n': nome_mun.title(), 'e': {}})
                m['e'].setdefault(evento, doze())[mes] += qtd
                if orgao:
                    m.setdefault('o', {}).setdefault(orgao, {}).setdefault(evento, doze())[mes] += qtd
        if col is None:
            print(f'{ano}: aba "{aba.title}" sem as colunas esperadas')
    wb.close()

    saida = {}
    for uf in estado:
        saida[uf] = {'estado': estado[uf], 'orgaos': orgaos_estado.get(uf, {}), 'municipios': municipios.get(uf, {}),
                     'publicadoAte': ultimo_mes.get(uf, -1)}
    return saida, lidas, diag


URL_MUNICIPIOS_IBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'
# População residente estimada (tabela 6579, variável 9324); reserva: Censo 2022 (tabela 4709, variável 93)
URLS_POPULACAO_IBGE = [
    'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-1/variaveis/9324?localidades=N6[all]',
    'https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/-1/variaveis/93?localidades=N6[all]',
]


ERROS_IBGE = []


def baixar_json(url, tentativas=3):
    for i in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (mapa-da-seguranca)'})
            with urllib.request.urlopen(req, timeout=120) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:  # noqa: BLE001 - rede instável: tenta de novo
            print(f'IBGE: {e}, nova tentativa')
            ERROS_IBGE.append(f'{url[:90]}: {type(e).__name__}: {e}'[:300])
            time.sleep(5 * (i + 1))
    return None


def atualizar_populacao():
    """dados/populacao.json: { ano, fonte, ufs: { UF: { nome_normalizado: [ibge, populacao] } } } para taxas por 100 mil."""
    municipios = baixar_json(URL_MUNICIPIOS_IBGE)
    if not municipios:
        gravar(os.path.join(PASTA_SAIDA, 'diagnostico_populacao.json'), {'erros': ERROS_IBGE})
        print('População: lista de municípios do IBGE indisponível')
        return
    for url in URLS_POPULACAO_IBGE:
        dados = baixar_json(url)
        try:
            serie = dados[0]['resultados'][0]['series']
        except (TypeError, IndexError, KeyError):
            continue
        pop, ano = {}, ''
        for s in serie:
            ano, valor = next(iter(s['serie'].items()))
            if str(valor).isdigit():
                pop[str(s['localidade']['id'])] = int(valor)
        if len(pop) < 5000:
            continue
        ufs = {}
        for m in municipios:
            try:
                uf = m['microrregiao']['mesorregiao']['UF']['sigla']
            except (TypeError, KeyError):
                uf = (m.get('regiao-imediata') or {}).get('regiao-intermediaria', {}).get('UF', {}).get('sigla')
            cod = str(m['id'])
            if uf and cod in pop:
                ufs.setdefault(uf, {})[normalizar(m['nome'])] = [cod, pop[cod]]
        gravar(os.path.join(PASTA_SAIDA, 'populacao.json'), {'ano': ano, 'fonte': 'IBGE ' + url.split('/agregados/')[1].split('/')[0], 'ufs': ufs})
        print(f'População: {len(pop)} municípios ({ano})')
        return
    gravar(os.path.join(PASTA_SAIDA, 'diagnostico_populacao.json'), {'erros': ERROS_IBGE})
    print('População: não foi possível obter do IBGE')


def gravar(caminho, obj):
    with open(caminho, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))


def main():
    ap = argparse.ArgumentParser()
    hoje = dt.date.today()
    ap.add_argument('--anos', nargs='*', type=int, default=[hoje.year - 2, hoje.year - 1, hoje.year])
    ap.add_argument('--arquivo', action='append', default=[], help='ano=caminho.xlsx (usa um arquivo local)')
    args = ap.parse_args()
    locais = dict(a.split('=', 1) for a in args.arquivo)

    os.makedirs(PASTA_SAIDA, exist_ok=True)
    caminho_manifesto = os.path.join(PASTA_SAIDA, 'manifesto.json')
    manifesto = {'v': 1, 'anos': {}}
    if os.path.exists(caminho_manifesto):
        with open(caminho_manifesto, encoding='utf-8') as f:
            manifesto = json.load(f)

    agora = int(time.time() * 1000)
    mudou = False
    for ano in args.anos:
        if str(ano) in locais:
            with open(locais[str(ano)], 'rb') as f:
                conteudo = f.read()
        else:
            conteudo = baixar(ano)
        if not conteudo:
            continue  # mantém o que já foi publicado
        resumo, lidas, diag = processar(conteudo, ano)
        gravar(os.path.join(PASTA_SAIDA, f'diagnostico_{ano}.json'), diag)
        print(json.dumps(diag, ensure_ascii=False)[:3000])
        if not lidas:
            print(f'{ano}: nenhuma linha reconhecida; arquivos anteriores mantidos')
            continue
        for uf, a in resumo.items():
            gravar(os.path.join(PASTA_SAIDA, f'sinesp_{ano}_{uf}.json'), {
                'v': 3, 'ano': ano, 'uf': uf, 'importadoEm': agora, 'fonte': f'Sinesp VDE {ano} (gov.br)',
                'estado': a['estado'], 'orgaos': a['orgaos'], 'municipios': a['municipios']
            })
        manifesto['anos'][str(ano)] = {
            'publicadoAte': max(a['publicadoAte'] for a in resumo.values()) + 1,
            'ufs': sorted(resumo), 'linhas': lidas, 'importadoEm': agora
        }
        mudou = True
        print(f'{ano}: {lidas} linhas, {len(resumo)} UFs')

    atualizar_populacao()
    if mudou:
        manifesto['atualizadoEm'] = agora
        gravar(caminho_manifesto, manifesto)
    elif not manifesto['anos']:
        sys.exit('Nenhum ano foi processado.')


if __name__ == '__main__':
    main()
