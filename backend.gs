// ============================================
// Apps Script Backend — Perguntas Anônimas
// ============================================
// 1. Crie uma planilha no Google Sheets
// 2. Extensões > Apps Script, cole este código
// 3. Salve e implante como Web App
// 4. Configure: "Qualquer pessoa" pode acessar
// ============================================

// ID da planilha onde as respostas serão salvas
// (depois de criar a planilha, cole o ID aqui)
const SHEET_ID = '1fS0DCbte3PRyzObJcRA0ZrrjNwQb6fBCJ0N1erg0Ltg';
const SHEET_NAME = 'Página1';

function doPost(e) {
  try {
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
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  const existing = sheet.getSheetByName(SHEET_NAME);
  if (existing) {
    Logger.log('Aba já existe!');
    return;
  }
  const newSheet = sheet.insertSheet(SHEET_NAME);
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
