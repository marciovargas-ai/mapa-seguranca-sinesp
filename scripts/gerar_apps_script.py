"""
Gera os arquivos HTML do Apps Script a partir do build do painel Angular.

  cd painel && npx ng build && cd .. && python3 scripts/gerar_apps_script.py [pasta_saida]

Saída (cada arquivo vira um arquivo HTML no editor do Apps Script):
  Painel.html          modelo da página (fontes, Leaflet, Chart.js e os includes)
  Painel_Estilos.html  CSS global (tema Material)
  Painel_App_N.html    o aplicativo, dividido em partes de até ~180 KB. O Apps Script
                       só aceita HTML válido em cada arquivo, então cada parte é um
                       <script> que guarda um pedaço do código como texto; a última
                       linha do modelo junta os pedaços e executa o aplicativo
"""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(RAIZ, 'painel', 'dist', 'painel', 'browser')
TAMANHO_PARTE = 180_000

MODELO = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Mapa da Segurança</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <?!= incluir('Painel_Estilos'); ?>
</head>
<body>
  <app-root></app-root>
  <script>var BASE_MUNICIPIOS_BR = <?!= obterBaseMunicipiosJson() ?>;</script>
  <!-- Aplicativo Angular (gerado por scripts/gerar_apps_script.py; não editar à mão) -->
  <script>window.__PAINEL_APP = [];</script>
  {INCLUDES}
  <script>(new Function(window.__PAINEL_APP.join('')))(); delete window.__PAINEL_APP;</script>
</body>
</html>
"""


def main():
    saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'apps-script')
    os.makedirs(saida, exist_ok=True)
    with open(os.path.join(DIST, 'main.js'), encoding='utf-8') as f:
        js = f.read()
    with open(os.path.join(DIST, 'styles.css'), encoding='utf-8') as f:
        css = f.read()

    # Partes cortadas em ';' ou '}' para cada arquivo terminar num ponto legível
    partes, inicio = [], 0
    while inicio < len(js):
        fim = min(len(js), inicio + TAMANHO_PARTE)
        if fim < len(js):
            corte = max(js.rfind(';', inicio, fim), js.rfind('}', inicio, fim))
            if corte > inicio + TAMANHO_PARTE // 2:
                fim = corte + 1
        partes.append(js[inicio:fim])
        inicio = fim

    for nome in os.listdir(saida):
        if nome.startswith('Painel_App_') and nome.endswith('.html'):
            os.remove(os.path.join(saida, nome))
    for i, parte in enumerate(partes, 1):
        with open(os.path.join(saida, f'Painel_App_{i}.html'), 'w', encoding='utf-8') as f:
            # Texto JSON com "<" escrito como \\u003c: nada dentro dele fecha ou confunde o <script>
            texto = json.dumps(parte, ensure_ascii=False).replace('<', '\\u003c')
            f.write(f'<script>window.__PAINEL_APP.push({texto});</script>\n')
    with open(os.path.join(saida, 'Painel_Estilos.html'), 'w', encoding='utf-8') as f:
        f.write('<style>\n' + css + '\n</style>\n')
    includes = '\n  '.join(f"<?!= incluir('Painel_App_{i}'); ?>" for i in range(1, len(partes) + 1))
    with open(os.path.join(saida, 'Painel.html'), 'w', encoding='utf-8') as f:
        f.write(MODELO.replace('{INCLUDES}', includes))
    print(f'{len(partes)} partes do aplicativo em {saida}')


if __name__ == '__main__':
    main()
