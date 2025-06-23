import { API_URL } from './config.js';
import { obterIP, esqueciSenha } from './utils.js';

// Elementos do DOM
const frm       = document.getElementById('frmLogin');
const msg       = document.getElementById('msg');
const passInput = document.getElementById('senha');
const toggleBtn = document.getElementById('togglePass');
const loading   = document.getElementById('loading');
const submitBtn = document.getElementById('submitBtn');
const forgotLink= document.getElementById('forgotLink');
let mostrando   = false;

// Toggle da visibilidade da senha
function toggleSenha() {
  mostrando = !mostrando;
  passInput.type = mostrando ? 'text' : 'password';
  toggleBtn.querySelector('svg').style.opacity = mostrando ? 0.4 : 1;
}

// Submissão do formulário de login
async function handleSubmit(e) {
  e.preventDefault();
  msg.textContent = '';
  loading.style.display = 'block';
  loading.setAttribute('aria-hidden', 'false');
  loading.setAttribute('aria-busy', 'true');
  submitBtn.disabled = true;

  const fd = new FormData(frm);
  fd.append('action', 'login');

  try {
    const res = await fetch(API_URL, { method: 'POST', body: fd });
    loading.style.display = 'none';
    loading.setAttribute('aria-hidden', 'true');
    loading.removeAttribute('aria-busy');
    submitBtn.disabled = false;

    if (!res.ok) {
      msg.textContent = `Erro HTTP ${res.status}`;
      return;
    }

    const txt = await res.text();
    if (txt.startsWith('{')) {
      const data = JSON.parse(txt);
      localStorage.setItem('token', data.token);
      localStorage.setItem('nivel', data.nivel);
      window.location.assign(
        data.precisaTrocar
          ? 'alterar-senha.html'
          : 'infosys_dashboard.html'
      );
    } else {
      msg.textContent = txt.replace(/_/g, ' ');
    }
  } catch (err) {
    loading.style.display = 'none';
    loading.setAttribute('aria-hidden', 'true');
    loading.removeAttribute('aria-busy');
    submitBtn.disabled = false;
    msg.textContent = 'Erro de rede';
  }
}

// Event listeners
toggleBtn.addEventListener('click', toggleSenha);
frm.addEventListener('submit', handleSubmit);
forgotLink.addEventListener('click', e => {
  e.preventDefault();
  esqueciSenha();
});

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('email').focus();
});