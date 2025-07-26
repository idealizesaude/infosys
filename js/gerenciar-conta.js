// js/gerenciar-conta.js
import { API_URL } from './config.js';
import { showSpinner, hideSpinner } from './spinner.js';
import { showError, showSuccess } from './alertas.js';

const token = localStorage.getItem('token');

/**
 * Carrega os dados do usuário para o formulário
 */
async function carregarUsuario() {
  if (!token) return tokenInvalido();
  showSpinner();
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'usuario', token })
    });
    const txt = await res.text();
    if (txt === 'TOKEN_INVALIDO') return tokenInvalido();
    if (!txt.startsWith('{')) throw new Error(txt);
    const dados = JSON.parse(txt);
    preencherCampos(dados);
  } catch (e) {
    console.error('Erro ao carregar usuário:', e);
    showError('Erro', 'Falha ao carregar dados do usuário.');
  } finally {
    hideSpinner();
  }
}

/**
 * Preenche o formulário com nome e email
 */
function preencherCampos({ nome = '', email = '' }) {
  document.getElementById('nome').value  = nome;
  document.getElementById('email').value = email;
  localStorage.setItem('nome_usuario', nome);
  localStorage.setItem('email_usuario', email);
  const spanNome = document.getElementById('nome-usuario');
  if (spanNome) spanNome.innerHTML = `<strong>${nome}</strong>`;
}

/**
 * Envia atualização do nome para a API
 */
async function atualizarNome() {
  const novo = document.getElementById('nome').value.trim();
  if (!novo) return showError('Campo obrigatório', 'O nome não pode estar vazio.');

  showSpinner();
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'atualizar_nome', token, nome: novo })
    });
    const txt = await res.text();
    if (txt === 'TOKEN_INVALIDO') return tokenInvalido();
    if (txt !== 'OK') throw new Error(txt);
    localStorage.setItem('nome_usuario', novo);
    preencherCampos({ nome: novo, email: document.getElementById('email').value });
    showSuccess('Nome atualizado!', 'Seus dados foram salvos.');
  } catch (e) {
    console.error('Erro ao atualizar nome:', e);
    showError('Erro', 'Falha ao atualizar o nome.');
  } finally {
    hideSpinner();
  }
}

/**
 * Trata token inválido ou expirado
 */
function tokenInvalido() {
  localStorage.clear();
  showError('Sessão expirada', 'Faça login novamente.', () => {
    window.location.href = '../../index.html';
  });
}

/**
 * Inicializa listeners após DOM pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  document.getElementById('btn-atualizar').addEventListener('click', atualizarNome);
  document.getElementById('btn-alterar-senha').addEventListener('click', () => {
    window.location.href = '../../pages/public/alterar-senha.html';
  });
});