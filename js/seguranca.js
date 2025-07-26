// seguranca.js – valida autenticação antes de carregar página restrita

(function validarAutenticacao() {
  const token = localStorage.getItem('token');

  // Caso não exista token válido, redireciona para a página de login
  if (!token) {
    const ehLocal = location.protocol === 'file:';
    window.location.href = ehLocal ? '../../index.html' : '/index.html';
    return;
  }

  // Opcional: Validar formato básico do token antes de prosseguir
  const formatoValido = /^[a-zA-Z0-9-]{36}$/.test(token);
  if (!formatoValido) {
    localStorage.clear();
    window.location.href = ehLocal ? '../../index.html' : '/index.html';
    return;
  }

  // Adicione mais verificações de segurança aqui, se necessário
})();