import { API_URL } from './config.js';

// Obtém IP do usuário via serviço externo
export async function obterIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) return 'desconhecido';
    const data = await res.json();
    return data.ip || 'desconhecido';
  } catch {
    return 'desconhecido';
  }
}

// Fluxo "Esqueci minha senha"
export async function esqueciSenha() {
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();
  if (!email) {
    emailInput.reportValidity();
    return;
  }

  const ip = await obterIP();
  const params = new URLSearchParams({ action: 'esqueci', email, ip });

  try {
    const res = await fetch(API_URL, { method: 'POST', body: params });
    const resposta = await res.text();
    switch (resposta) {
      case 'ENVIADO':
        alert('Uma nova senha foi enviada para o seu e-mail.');
        break;
      case 'LIMITE_EXCEDIDO':
        alert('Você excedeu o número de tentativas. Tente novamente mais tarde.');
        break;
      case 'EMAIL_NAO_ENCONTRADO':
        alert('E-mail não encontrado na base de dados.');
        break;
      default:
        alert('Erro: ' + resposta);
    }
  } catch {
    alert('Erro de rede. Tente novamente.');
  }
}