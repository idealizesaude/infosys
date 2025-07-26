// assets/js/cadastro-usuarios.js
import { showSuccess, showError } from './alertas.js';
import { API_URL } from './config.js';
import { hierarquia } from './perfis.js';

// 1. Preenche nome na top-bar e carrega perfis compatíveis
document.addEventListener('DOMContentLoaded', () => {
  const span = document.getElementById('nome-usuario');
  const nome = localStorage.getItem('nome_usuario');
  if (span && nome) span.innerHTML = `<strong>${nome}</strong>`;

  const select = document.getElementById('nivel');
  const nivelAtual = localStorage.getItem('nivel');
  const nivelMaximo = hierarquiaPerfis[nivelAtual] ?? 0;

  Object.entries(hierarquiaPerfis).forEach(([perfil, ordem]) => {
    if (ordem <= nivelMaximo) {
      const opt = document.createElement('option');
      opt.value = perfil;
      opt.textContent = perfil;
      select.appendChild(opt);
    }
  });
});

// 2. Cadastro
document
  .getElementById('frmCadastroUsuarios')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const nivel = e.target.nivel.value;

    if (!email || !nivel) {
      showError('Campos vazios', 'Preencha e-mail e nível.');
      return;
    }

    const fd = new FormData(e.target);
    fd.append('action', 'novo');

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const txt = await res.text();

      if (txt === 'OK') {
        showSuccess(
          'Usuário cadastrado!',
          `Usuário ${email} foi criado com perfil de acesso ${nivel}.`,
          () => e.target.reset()               // callback: limpa formulário
        );
      } else if (txt === 'JA_EXISTE') {
        showError('Já existe', 'Este e-mail já está cadastrado.');
      } else {
        showError('Erro', txt.replace(/_/g, ' '));
      }
    } catch (err) {
      console.error(err);
      showError('Erro de rede', 'Não foi possível contatar o servidor.');
    }
  });
