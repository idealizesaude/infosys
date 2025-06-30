// seguranca.js

(function validarAutenticacao() {
  const token = localStorage.getItem('token');

  // Se não estiver autenticado, redireciona pro login
  if (!token) {
    window.location.href = '/pages/public/index.html';
  }
})();
