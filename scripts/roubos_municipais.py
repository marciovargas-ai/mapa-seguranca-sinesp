"""
Roubos por município, onde a secretaria estadual publica o dado (o Sinesp só publica roubo por estado).
Junta as bases estaduais já baixadas pelos outros robôs e grava dados/roubos_municipios.json:
  { atualizado, estados: { UF: { fonte, periodo, definicao } },
    municipios: { ibge6: [roubos_por_ano, furtos_por_ano] } }
Os números são anualizados (12 meses) para comparar estados com períodos diferentes.

SP: dados/oficial/<ibge7>.json (SSP-SP, boletins): roubo + roubo de veículo + roubo de carga.
RJ: dados/isp_rj_cisp.json (ISP-RJ): total de roubos (ou, se faltar, roubos de rua + veículo + carga).
"""
import datetime, glob, json, os

SAIDA = 'dados/roubos_municipios.json'


def dias_periodo(txt):
    try:
        a, b = [datetime.datetime.strptime(x.strip(), '%d/%m/%Y').date() for x in txt.split(' a ')]
        return max(30, (b - a).days + 1)
    except Exception:
        return 365


def main():
    estados, municipios = {}, {}
    arquivos = [a for a in glob.glob('dados/oficial/*.json') if not a.endswith('indice.json')]
    periodo_sp = ''
    for arq in arquivos:
        d = json.load(open(arq, encoding='utf-8'))
        c = d.get('cats') or {}
        fator = 365 / dias_periodo(d.get('periodo', ''))
        roubos = (c.get('roubo', 0) + c.get('veiculo', 0) + c.get('carga', 0)) * fator
        furtos = c.get('furto', 0) * fator
        municipios[os.path.basename(arq)[:6]] = [round(roubos, 1), round(furtos, 1)]
        periodo_sp = d.get('periodo', periodo_sp)
    if arquivos:
        estados['SP'] = {'fonte': 'SSP-SP, boletins de ocorrência (dados abertos)', 'periodo': periodo_sp,
                         'definicao': 'roubos (inclui roubo de veículo e de carga), por boletim de ocorrência'}

    if os.path.exists('dados/isp_rj_cisp.json'):
        isp = json.load(open('dados/isp_rj_cisp.json', encoding='utf-8'))
        for mun, areas in isp.get('municipios', {}).items():
            def soma(campo):
                return sum(a['u12'].get(campo, 0) for a in areas)
            tem_total = any('total_roubos' in a['u12'] for a in areas)
            roubos = soma('total_roubos') if tem_total else soma('roubo_rua') + soma('roubo_veiculo') + soma('roubo_carga')
            furtos = soma('total_furtos') if any('total_furtos' in a['u12'] for a in areas) else None
            municipios[mun[:6]] = [roubos, furtos]
        p = isp.get('periodo', {})
        estados['RJ'] = {'fonte': 'ISP-RJ, ocorrências registradas por delegacia', 'periodo': f"{p.get('de', '')} a {p.get('ate', '')}",
                         'definicao': 'total de roubos registrados' if any('total_roubos' in a['u12'] for v in isp['municipios'].values() for a in v)
                         else 'roubos de rua, de veículo e de carga'}

    with open(SAIDA, 'w', encoding='utf-8') as f:
        json.dump({'atualizado': datetime.date.today().isoformat(), 'estados': estados, 'municipios': municipios},
                  f, ensure_ascii=False, separators=(',', ':'))
    print(len(municipios), 'municípios;', ', '.join(estados))


if __name__ == '__main__':
    main()
