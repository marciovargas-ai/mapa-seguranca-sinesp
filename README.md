# Sinesp para o Mapa da Segurança

Robô que baixa a base pública do Sinesp VDE (Ministério da Justiça e Segurança Pública) duas vezes por mês, resume por município e mês e publica em `dados/`. O Apps Script do painel lê esses arquivos pelo endereço "raw" do GitHub.

- Rodar agora: aba **Actions** → **Atualizar Sinesp** → **Run workflow**.
- Os arquivos do Ministério têm cerca de 26 MB por ano; o resumo por UF fica com poucos KB.
