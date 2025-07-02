document.addEventListener('DOMContentLoaded', async () => {
  // 1) Injeta o HTML do sidebar
  const resp = await fetch('../../assets/fragments/sidebar.html');
  const html = await resp.text();
  document.getElementById('site-sidebar').innerHTML = html;

  // 2) Associa os eventos de module-loader
  document.querySelectorAll('.sidebar a[data-module]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      // Verifica autenticação
      if (!localStorage.getItem('token')) {
        const ehLocal = location.protocol === 'file:';
        window.location.href = ehLocal ? '../../index.html' : '/infosys/index.html';
        return;
      }

      // Carrega o conteúdo dinâmico
      fetch(link.dataset.module)
        .then(r => r.text())
        .then(html => {
          document.getElementById('app').innerHTML = html;
          window.dispatchEvent(new Event('sidebar:loaded'));
        })
        .catch(console.error);
    });
  });
});