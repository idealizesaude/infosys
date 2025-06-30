// js/sidebar.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Injeta o HTML do sidebar
  const resp = await fetch('/assets/fragments/sidebar.html');
  const html = await resp.text();
  document.getElementById('site-sidebar').innerHTML = html;

  // 2) Associa os eventos de module-loader
  document.querySelectorAll('.sidebar a[data-module]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      // reaproveita a lógica de infosys-dashboard:
      if (!localStorage.getItem('token')) {
        window.location.href = '/pages/public/index.html';
        return;
      }
      fetch(link.dataset.module)
        .then(r => r.text())
        .then(html => {
          document.getElementById('app').innerHTML = html;
          // atualiza nome do header depois de trocar conteúdo
          const ev = new Event('sidebar:loaded');
          window.dispatchEvent(ev);
        })
        .catch(console.error);
    });
  });
});
