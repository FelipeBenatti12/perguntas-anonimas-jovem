// ============================================
// Apps Script Backend — Perguntas Anônimas
// ============================================
// 1. Crie uma planilha no Google Sheets
// 2. Extensões > Apps Script, cole este código
// 3. No editor, vá em "Configurar projeto" > 
//    "Propriedades do script" e adicione:
//      SHEET_ID = ID da sua planilha
//      SHEET_NAME = Página1
// 4. Salve e implante como Web App
// 5. Configure: "Qualquer pessoa" pode acessar
// 6. Execute setup() uma vez manualmente
// ============================================
//
// SEGURANÇA: SHEET_ID NÃO fica hardcoded aqui!
// Os valores são lidos das Propriedades do Script
// (PropertiesService), que NÃO vão pro GitHub.
// ============================================

const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const SHEET_NAME = PropertiesService.getScriptProperties().getProperty('SHEET_NAME');

function doPost(e) {
  try {
    if (!SHEET_ID || !SHEET_NAME) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'error', 
          message: 'SHEET_ID ou SHEET_NAME não configurados nas Propriedades do Script.' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Se a planilha não existir, cria com cabeçalhos
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
      newSheet.appendRow(['Timestamp', 'Categoria', 'Pergunta']);
      return doPost(e); // tenta novamente
    }

    const params = e.parameter;
    const now = new Date();

    sheet.appendRow([
      now,
      params.category || '',
      params.question || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Roda uma vez manualmente para criar a aba
function setup() {
  const sid = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const sname = PropertiesService.getScriptProperties().getProperty('SHEET_NAME');
  if (!sid || !sname) {
    Logger.log('ERRO: Configure SHEET_ID e SHEET_NAME nas Propriedades do Script primeiro!');
    return;
  }
  const sheet = SpreadsheetApp.openById(sid);
  const existing = sheet.getSheetByName(sname);
  if (existing) {
    Logger.log('Aba já existe!');
    return;
  }
  const newSheet = sheet.insertSheet(sname);
  newSheet.appendRow(['Timestamp', 'Categoria', 'Pergunta']);
  Logger.log('Aba criada com sucesso!');
}

// Teste rápido — executa manualmente no editor
function test() {
  const mockEvent = {
    parameter: {
      category: 'pergunta-biblica',
      question: 'Teste automático — ignorar'
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
