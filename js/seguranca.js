// seguranca.js

(function validarAutenticacao() {
  const token = localStorage.getItem('token');

  // Se não estiver autenticado, redireciona pro login
  if (!token) {
    const ehLocal = location.protocol === 'file:';
    window.location.href = ehLocal ? '../../index.html' : '/infosys/index.html';
  }
})();
