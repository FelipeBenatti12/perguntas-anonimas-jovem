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
//
// ANTI-SPAM: honeypot + rate limit via CacheService
// ============================================

const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const SHEET_NAME = PropertiesService.getScriptProperties().getProperty('SHEET_NAME');

// ⏱ Rate limit: quantos segundos entre submissões do mesmo usuário
const RATE_LIMIT_SECONDS = 30;

function doPost(e) {
  try {
    // ================================================
    // 🍯 HONEYPOT — campo invisível que bots preenchem
    // Se o campo _hp veio preenchido, é BOT — 
    // retorna sucesso falso pra não desconfiar
    // ================================================
    if (e.parameter._hp && e.parameter._hp.trim() !== '') {
      return respond({ status: 'ok', note: 'honeypot' });
    }

    // ================================================
    // ⏱ RATE LIMIT — CacheService (expira em 2 min)
    // Cada session_id só pode enviar 1 vez a cada 30s
    // ================================================
    const sessionId = e.parameter._sid;
    if (sessionId) {
      const cache = CacheService.getScriptCache();
      const lastSubmission = cache.get('rl:' + sessionId);
      if (lastSubmission) {
        const elapsed = (Date.now() - parseInt(lastSubmission, 10)) / 1000;
        if (elapsed < RATE_LIMIT_SECONDS) {
          return respond({ 
            status: 'rate_limited', 
            message: 'Aguarde alguns segundos antes de enviar novamente.' 
          });
        }
      }
      // Marca submissão
      cache.put('rl:' + sessionId, Date.now().toString(), 120);
    }

    // ================================================
    // ✅ VALIDAÇÃO — SHEET_ID configurado?
    // ================================================
    if (!SHEET_ID || !SHEET_NAME) {
      return respond({ 
        status: 'error', 
        message: 'SHEET_ID ou SHEET_NAME não configurados nas Propriedades do Script.' 
      });
    }

    // ================================================
    // 📝 ESCREVE NA PLANILHA
    // ================================================
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

    return respond({ status: 'ok' });

  } catch (error) {
    return respond({ status: 'error', message: error.toString() });
  }
}

// Helper pra responder JSON
function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
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
