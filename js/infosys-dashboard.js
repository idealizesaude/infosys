// assets/js/infosys-dashboard.js
const URL_API = 'https://script.google.com/macros/s/AKfycbzC8tQ3bTO2a69FyImqQu5WLF8Nj_y0xWzQ6oRURB1WlVHWX_bTVX-ENwvCBstEYsxE/exec';

function checkAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = '../../index.html';
  }
}

function initNomeUsuario() {
  // atualiza o nome no header já injetado
  const nomeCache = localStorage.getItem('nome_usuario') || '';
  document.querySelectorAll('#nome-usuario').forEach(el => {
    el.innerHTML =
      nomeCache
        ? `<strong>${nomeCache}</strong>`
        : `<strong>Carregando...</strong>`;
  });
}

// quando o sidebar for injetado e um módulo for carregado, reaplica o nome no header
window.addEventListener('sidebar:loaded', initNomeUsuario);

// fecha o dropdown do header ao clicar fora
document.addEventListener('click', e => {
  const um = document.querySelector('.user-menu');
  if (um && !um.contains(e.target)) {
    const dd = document.getElementById('dropdown');
    if (dd) dd.style.display = 'none';
  }
});

// inicialização geral
window.addEventListener('load', () => {
  checkAuth();
  initNomeUsuario();
  // dispara o evento para, caso o sidebar já tenha carregado antes do load, 
  // forçar a inicialização do nome
  window.dispatchEvent(new Event('sidebar:loaded'));
});