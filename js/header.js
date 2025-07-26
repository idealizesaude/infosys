// assets/js/header.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1) injeta o HTML do header
  try {
    const resp = await fetch('../../assets/fragments/header.html');
    if (!resp.ok) throw new Error(`Erro ${resp.status}`);
    const html = await resp.text();
    document.getElementById('site-header').innerHTML = html;
  } catch (e) {
    console.error('Não carregou header:', e);
    return;
  }

  // 1.1) injeta CSS do FontAwesome para exibir os ícones do sidebar
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(faLink);

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
    window.location.href = '../../index.html';
  });

  // 5) fecha dropdown ao clicar fora
  window.addEventListener('click', e => {
    if (!userMenu.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
});