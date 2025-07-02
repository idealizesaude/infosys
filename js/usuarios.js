// assets/js/usuarios.js
const URL_API = 'https://script.google.com/macros/s/AKfycbzC8tQ3bTO2a69FyImqQu5WLF8Nj_y0xWzQ6oRURB1WlVHWX_bTVX-ENwvCBstEYsxE/exec';
const hierarquia = { BASICO: 1, INTERMEDIARIO: 2, AVANCADO: 3, MASTER: 4 };

function formatarData(val) {
  if (!val) return "--";
  const d = new Date(val), pad = n => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function abrirModal(email) {
  const modal = document.getElementById('modal-edicao');
  modal.dataset.email = email;
  modal.style.display = 'flex';

  const select = document.getElementById('modal-nivel');
  const nivelAtual = localStorage.getItem('nivel');
  select.innerHTML = '';

  Object.keys(hierarquia).forEach(nivel => {
    if (hierarquia[nivelAtual] >= hierarquia[nivel]) {
      const option = document.createElement('option');
      option.value = nivel;
      option.textContent = nivel;
      select.appendChild(option);
    }
  });
}

function fecharModal() {
  document.getElementById('modal-edicao').style.display = 'none';
}

function fecharModalSucesso() {
  document.getElementById('modal-sucesso').style.display = 'none';
  carregarUsuarios();
}

function fecharModalPermissao() {
  document.getElementById('modal-permissao').style.display = 'none';
}

async function salvarAlteracoes() {
  const modal = document.getElementById('modal-edicao');
  const email = modal.dataset.email;
  const nivel = document.getElementById('modal-nivel').value;
  const status = document.getElementById('modal-status').value;
  const ativo = (status === 'Ativo');

  try {
    const res = await fetch(URL_API, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'atualizar_usuario',
        email,
        nivel,
        ativo
      })
    });

    const txt = await res.text();
    if (txt === 'OK') {
      fecharModal();
      document.querySelector('#modal-sucesso .email').textContent = email;
      document.querySelector('#modal-sucesso .nivel').textContent = nivel;
      document.querySelector('#modal-sucesso .status').textContent = status;
      document.getElementById('modal-sucesso').style.display = 'flex';
    } else {
      alert('Erro ao salvar: ' + txt);
    }
  } catch (e) {
    console.error('Erro na requisição:', e);
    alert('Erro ao comunicar com o servidor.');
  }
}

async function carregarUsuarios() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";

  try {
    const res = await fetch(URL_API, {
      method: 'POST',
      body: new URLSearchParams({ action: 'listar' })
    });
    const dados = await res.json();
    const nivelAtual = localStorage.getItem('nivel');
    corpo.innerHTML = '';

    dados.forEach(u => {
      const tr = document.createElement('tr');
      let botoes = '';

      if (hierarquia[nivelAtual] >= hierarquia[u.nivel]) {
        botoes += `<span class="btn-editar" data-email="${u.email}">✏️</span>`;
      } else {
        botoes += `<span class="btn-editar-disabled">✏️</span>`;
      }

      if (nivelAtual === 'MASTER') {
        botoes += `<span class="btn-excluir" data-email="${u.email}">🗑️</span>`;
      }

      tr.innerHTML = `
        <td>${u.email}</td>
        <td>${u.nivel}</td>
        <td>${u.ativo ? 'Ativo' : 'Inativo'}</td>
        <td>${formatarData(u.ultimoLogin)}</td>
        <td class="acoes">${botoes}</td>
      `;
      corpo.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar').forEach(el => {
      el.addEventListener('click', () => abrirModal(el.dataset.email));
    });

    document.querySelectorAll('.btn-editar-disabled').forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('modal-permissao').style.display = 'flex';
      });
    });

    document.querySelectorAll('.btn-excluir').forEach(el => {
      el.addEventListener('click', () => excluirUsuario(el.dataset.email));
    });

  } catch (e) {
    corpo.innerHTML = "<tr><td colspan='5'>Erro ao carregar usuários.</td></tr>";
    console.error(e);
  }
}

document.addEventListener('click', e => {
  const menu = document.querySelector('.user-menu');
  const dd = document.getElementById('dropdown');
  if (menu && dd && !menu.contains(e.target)) {
    dd.style.display = 'none';
  }
});

window.addEventListener('load', () => {
  if (!localStorage.getItem('token')) {
    const ehLocal = location.protocol === 'file:';
    window.location.href = ehLocal ? '../../index.html' : '/infosys/pages/public/index.html';
    return;
  }

  document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
  document.getElementById('btn-salvar').addEventListener('click', salvarAlteracoes);
  document.getElementById('btn-fechar-sucesso').addEventListener('click', fecharModalSucesso);
  document.getElementById('btn-fechar-permissao').addEventListener('click', fecharModalPermissao);

  carregarUsuarios();
});