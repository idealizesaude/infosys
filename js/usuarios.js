// js/usuarios.js (ES Module)
import { API_URL }              from './config.js';
import { showSpinner, hideSpinner } from './spinner.js';
import { showError, showSuccess, showConfirm } from './alertas.js';
import { hierarquia }           from './perfis.js';

/** Formata data para "DD/MM/YYYY HH:MM" */
function formatarData(val) {
  if (!val) return "--";
  const d = new Date(val), pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Exclui usuário via confirmação */
function excluirUsuario(email) {
  showConfirm({
    title: 'Excluir usuário?',
    message: `Tem certeza que deseja excluir ${email}?`,
    onYes: async () => {
      showSpinner();
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          body: new URLSearchParams({ action: 'excluir_usuario', email })
        });
        const txt = await res.text();
        if (txt === 'OK') {
          document.querySelector(`.btn-excluir[data-email="${email}"]`)
                  .closest('tr').remove();
          showSuccess('Usuário excluído', 'Registro removido com sucesso.');
        } else {
          showError('Erro ao excluir', txt);
        }
      } catch (err) {
        console.error('Erro ao excluir:', err);
        showError('Erro', 'Falha de rede ou servidor.');
      } finally {
        hideSpinner();
      }
    },
    onNo: () => {}
  });
}

/** Abre modal de edição e popula nível */
function abrirModal(email) {
  const modal = document.getElementById('modal-edicao');
  modal.dataset.email = email;
  modal.style.display = 'flex';

  const select = document.getElementById('modal-nivel');
  const nivelAtual = localStorage.getItem('nivel');
  select.innerHTML = '';
  Object.keys(hierarquia).forEach(n => {
    if (hierarquia[nivelAtual] >= hierarquia[n]) {
      const opt = document.createElement('option');
      opt.value = n; opt.textContent = n;
      select.appendChild(opt);
    }
  });
}
function fecharModal()          { document.getElementById('modal-edicao').style.display = 'none'; }
function fecharModalSucesso()   { document.getElementById('modal-sucesso').style.display = 'none'; }
function fecharModalPermissao() { document.getElementById('modal-permissao').style.display = 'none'; }

/** Salva alterações do usuário */
async function salvarAlteracoes() {
  const modal  = document.getElementById('modal-edicao');
  const email  = modal.dataset.email;
  const nivel  = document.getElementById('modal-nivel').value;
  const status = document.getElementById('modal-status').value;
  const ativo  = (status === 'Ativo');

  showSpinner();
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: new URLSearchParams({ action: 'atualizar_usuario', email, nivel, ativo })
    });
    const txt = await res.text();
    if (txt === 'OK') {
      fecharModal();
      document.querySelector('#modal-sucesso .email').textContent  = email;
      document.querySelector('#modal-sucesso .nivel').textContent  = nivel;
      document.querySelector('#modal-sucesso .status').textContent = status;
      document.getElementById('modal-sucesso').style.display = 'flex';
    } else {
      showError('Erro', txt);
    }
  } catch (err) {
    console.error('Erro ao salvar alterações:', err);
    showError('Erro', 'Falha de comunicação.');
  } finally {
    hideSpinner();
  }
}

/** Carrega lista de usuários e renderiza tabela */
async function carregarUsuarios() {
  const tbody = document.getElementById('corpo-tabela');
  tbody.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";
  showSpinner();
  try {
    const res   = await fetch(API_URL, {
      method: 'POST',
      body: new URLSearchParams({ action: 'listar' })
    });
    const dados = await res.json();
    const nivelAtual = localStorage.getItem('nivel');
    tbody.innerHTML = '';
    dados.forEach(u => {
      const tr = document.createElement('tr');
      let btns = (hierarquia[nivelAtual] >= hierarquia[u.nivel])
        ? `<span class="btn-editar" data-email="${u.email}">✏️</span>`
        : `<span class="btn-editar-disabled">✏️</span>`;
      if (nivelAtual === 'Master')
        btns += `<span class="btn-excluir" data-email="${u.email}">🗑️</span>`;
      tr.innerHTML = `
        <td>${u.email}</td>
        <td>${u.nivel}</td>
        <td>${u.ativo ? 'Ativo' : 'Inativo'}</td>
        <td>${formatarData(u.ultimoLogin)}</td>
        <td class="acoes">${btns}</td>`;
      tbody.appendChild(tr);
    });
    // associações dos botões
    document.querySelectorAll('.btn-editar')
            .forEach(el => el.onclick = () => abrirModal(el.dataset.email));
    document.querySelectorAll('.btn-editar-disabled')
            .forEach(el => el.onclick = () => fecharModalPermissao());
    document.querySelectorAll('.btn-excluir')
            .forEach(el => el.onclick = () => excluirUsuario(el.dataset.email));
  } catch (err) {
    tbody.innerHTML = "<tr><td colspan='5'>Erro ao carregar usuários.</td></tr>";
    console.error('Erro ao carregar:', err);
  } finally {
    hideSpinner();
  }
}

// dispara no carregamento e ao voltar no histórico
document.addEventListener('DOMContentLoaded', carregarUsuarios);
window.addEventListener('pageshow', event => {
  if (event.persisted) carregarUsuarios();
});