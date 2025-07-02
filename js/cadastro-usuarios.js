// preenche nome do usuário
const spanNome = document.getElementById('nome-usuario');
const nomeLocal = localStorage.getItem('nome_usuario');
if (spanNome && nomeLocal) {
  spanNome.innerHTML = `<strong>${nomeLocal}</strong>`;
}

// exibe/oculta menu
function toggleMenu() {
  const dd = document.getElementById('dropdown');
  dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
}

// logout
function logout() {
  localStorage.clear();
  window.location.href = '../../index.html';
}

document.addEventListener('click', e => {
  const um = document.querySelector('.user-menu'),
        dd = document.getElementById('dropdown');
  if (!um.contains(e.target)) dd.style.display = 'none';
});

// hierarquia de perfis
(function(){
  const hierarquia = { BASICO:1, INTERMEDIARIO:2, AVANCADO:3, MASTER:4 };
  const nivelAtual = localStorage.getItem('nivel');
  const select = document.getElementById('nivel');
  if (nivelAtual && select) {
    const max = hierarquia[nivelAtual] || 0;
    for (let i = select.options.length - 1; i >= 0; i--) {
      const opt = select.options[i];
      if (opt.value && hierarquia[opt.value] > max) {
        select.remove(i);
      }
    }
  }
})();

// envio do formulário
document.getElementById('frmCadastroUsuarios')
  .addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const nivel = e.target.nivel.value;
    // aqui você chamaria o Apps Script via fetch...
    alert(`Simulado: Cadastrou ${email} como ${nivel}`);
  });