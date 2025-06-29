// assets/js/header.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1) injeta o HTML do header
  try {
    const resp = await fetch('/assets/fragments/header.html');
    if (!resp.ok) throw new Error(`Erro ${resp.status}`);
    const html = await resp.text();
    document.getElementById('site-header').innerHTML = html;
  } catch (e) {
    console.error('Não carregou header:', e);
    return;
  }

  // 2) exibe nome do usuário já salvo no localStorage
  const spanNome = document.getElementById('nome-usuario');
  const nome     = localStorage.getItem('nome_usuario');
  if (spanNome && nome) {
    spanNome.innerHTML = `<strong>${nome}</strong>`;
  }

  // 3) abre e fecha menu dropdown
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('dropdown');
  userMenu.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // 4) logout
  document.getElementById('logout').addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '../public/index.html';
  });

  // 5) fecha dropdown ao clicar fora
  document.addEventListener('click', e => {
    if (!userMenu.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
});