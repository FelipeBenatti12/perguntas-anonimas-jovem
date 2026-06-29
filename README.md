# 🙈 Perguntas Anônimas · Ministério Jovem

Formulário anônimo para perguntas bíblicas, perguntas polêmicas, críticas e sugestões — sem coleta de e-mail, sem identificação.

### Stack
- **Front-end:** HTML + CSS + JS puro (GitHub Pages)
- **Back-end:** Google Apps Script (web app) + Google Sheets
- **Hospedagem:** GitHub Pages (grátis)

### Como usar

1. **Crie uma planilha** no Google Drive
2. **Abra Extensões > Apps Script**, cole o código do `backend.gs`
3. **Publique > Implantar > Novo > Web App**
   - Executar como: `eu` (seu e-mail)
   - Quem pode acessar: `Qualquer pessoa`
4. **Copie a URL** gerada e cole no `script.js` (constante `APPS_SCRIPT_URL`)
5. **Suba** o projeto no GitHub e ative o GitHub Pages
6. **Compartilhe o link** com a galera!
