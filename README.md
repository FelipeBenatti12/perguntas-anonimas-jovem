# 🙈 Perguntas Anônimas · Ministério Jovem

Formulário anônimo para perguntas bíblicas, perguntas polêmicas, críticas e sugestões — sem coleta de e-mail, sem identificação.

### Stack
- **Front-end:** HTML + CSS + JS puro (GitHub Pages)
- **Back-end:** Google Apps Script (web app) + Google Sheets
- **Hospedagem:** GitHub Pages (grátis)

### Como usar

1. **Crie uma planilha** no Google Drive
2. **Abra Extensões > Apps Script**, cole o código do `backend.gs`
3. No editor do Apps Script, vá em **Configurar projeto > Propriedades do script** e adicione:
   - `SHEET_ID` = ID da sua planilha
   - `SHEET_NAME` = Página1
4. **Publique > Implantar > Novo > Web App**
   - Executar como: `eu` (seu e-mail)
   - Quem pode acessar: `Qualquer pessoa`
5. **Copie a URL** gerada e cole no `config.js` (constante `APPS_SCRIPT_URL`)
6. Execute `setup()` uma vez no editor do Apps Script pra criar a aba
7. **Suba** o projeto no GitHub (não esqueça de manter `config.js` no `.gitignore`!)
8. **Compartilhe o link** com a galera!

### 🔒 Segurança

- `SHEET_ID` fica nas **Propriedades do Script** do Apps Script, não no código
- `APPS_SCRIPT_URL` fica no `config.js`, que está no `.gitignore`
- O repositório público contém apenas `config.example.js` com valores placeholder
- Para configurar do zero: copie `config.example.js` → `config.js` e edite a URL
