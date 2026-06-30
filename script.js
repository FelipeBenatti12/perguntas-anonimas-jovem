// ============================================
// Perguntas Anônimas · Ministério Jovem
// ============================================

// URL do Google Apps Script Web App
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzD6LONsGeHxh70J_I0ISe1SeTooivUEPhB79P01m8rlNowvpmayQYxv-31UzyGAGpw/exec';

const form = document.getElementById('question-form');
const formCard = document.getElementById('form-card');
const successCard = document.getElementById('success-card');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const textarea = document.getElementById('question');
const charCount = document.getElementById('char-count');

// Character counter
textarea.addEventListener('input', () => {
  const count = textarea.value.length;
  charCount.textContent = count;
  charCount.parentElement.classList.toggle('full', count >= 1900);
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const question = textarea.value.trim();

  if (!category || !question) return;

  // Loading state
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'flex';

  try {
    const payload = {
      category: category,
      question: question,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',  // Apps Script requires no-cors
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload)
    });

    // With no-cors, we can't read the response body,
    // but if fetch didn't throw, it was delivered.
    showSuccess();

  } catch (error) {
    console.error('Erro ao enviar:', error);
    alert('Ops! Algo deu errado ao enviar. Tenta de novo!');
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'flex';
    btnLoader.style.display = 'none';
  }
});

function showSuccess() {
  formCard.style.display = 'none';
  successCard.style.display = 'block';
  successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
  form.reset();
  charCount.textContent = '0';
  formCard.style.display = 'block';
  successCard.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
