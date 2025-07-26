import { API_URL } from './config.js';
import { obterIP, esqueciSenha } from './utils.js';

const frm        = document.getElementById('frmLogin');
const msg        = document.getElementById('msg');
const passInput  = document.getElementById('senha');
const toggleBtn  = document.getElementById('togglePass');
const loading    = document.getElementById('loading');
const submitBtn  = document.getElementById('submitBtn');
const forgotLink = document.getElementById('forgotLink');

let mostrando = false;

function toggleSenha() {
  mostrando = !mostrando;
  passInput.type = mostrando ? 'text' : 'password';
  toggleBtn.querySelector('svg').style.opacity = mostrando ? 0.4 : 1;
}

async function handleSubmit(e) {
  e.preventDefault();
  msg.textContent = '';
  loading.style.display = 'block';
  submitBtn.disabled = true;

  const fd = new FormData(frm);
  fd.append('action', 'login');

  try {
    const res = await fetch(API_URL, { method: 'POST', body: fd });
    loading.style.display = 'none';
    submitBtn.disabled = false;

    if (!res.ok) {
      msg.textContent = `Erro HTTP ${res.status}`;
      return;
    }

    const txt = await res.text();
    if (txt.startsWith('{')) {
      const data = JSON.parse(txt);

      // 💾 usa localStorage novamente  
      localStorage.setItem('token', data.token);
      localStorage.setItem('nivel', data.nivel);
      localStorage.setItem('nome_usuario', data.nome || 'Usuário');

      const redirectTo = data.precisaTrocar
        ? './pages/public/alterar-senha.html'
        : './pages/app/infosys-dashboard.html';

      window.location.assign(redirectTo);
    } else {
      msg.textContent = txt.replace(/_/g, ' ');
    }
  } catch (err) {
    loading.style.display = 'none';
    submitBtn.disabled = false;
    msg.textContent = 'Erro de rede';
  }
}

toggleBtn.addEventListener('click', toggleSenha);
frm.addEventListener('submit', handleSubmit);
forgotLink.addEventListener('click', e => { e.preventDefault(); esqueciSenha(); });
window.addEventListener('DOMContentLoaded', () => document.getElementById('email').focus());