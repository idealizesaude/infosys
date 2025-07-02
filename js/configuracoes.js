// Redireciona se não autenticado
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '../../index.html';
}

// Preenche o nome do usuário no header (depois de header.js carregar)
document.addEventListener('header:loaded', () => {
  const nome = localStorage.getItem('nome_usuario');
  const nomeUsuarioEl = document.getElementById('nome-usuario');
  if (nome && nomeUsuarioEl) {
    nomeUsuarioEl.innerHTML = `<strong>${nome}</strong>`;
  }
});
