let tempoInatividade = 20 * 60 * 1000; // 20 minutos
let tempoAviso = 1 * 60 * 1000; // 1 minuto
let timeoutInatividade;
let countdownInterval;
let tempoRestante = 60;
let modalAberta = false;

// Inicializa o temporizador de inatividade
function iniciarMonitoramento() {
  document.addEventListener('click', resetarInatividade);
  document.addEventListener('keydown', resetarInatividade);
  document.addEventListener('mousemove', resetarInatividade);
  document.addEventListener('scroll', resetarInatividade);

  resetarInatividade();
}

// Reinicia o temporizador de inatividade se não estiver com modal aberta
function resetarInatividade() {
  if (modalAberta) return;

  clearTimeout(timeoutInatividade);
  timeoutInatividade = setTimeout(mostrarModalAviso, tempoInatividade - tempoAviso);
}

// Exibe modal de aviso com contagem
function mostrarModalAviso() {
  modalAberta = true;
  criarModal();
  iniciarContagemRegressiva();
}

// Cria e exibe a modal
function criarModal() {
  if (document.getElementById('modal-inatividade')) return;

  const div = document.createElement('div');
  div.id = 'modal-inatividade';
  div.innerHTML = `
    <div class="modal-box">
      <p>Você será desconectado por inatividade em <span id="contador-modal">60</span> segundos.</p>
      <button id="btn-continuar">Continuar Logado</button>
    </div>
  `;
  document.body.appendChild(div);
  aplicarEstilosModal();

  document.getElementById('btn-continuar').addEventListener('click', () => {
    pararContagem();
    fecharModal();
    modalAberta = false;
    resetarInatividade();
  });
}

// Aplica CSS inline para modal
function aplicarEstilosModal() {
  const estilo = document.createElement('style');
  estilo.innerHTML = `
    #modal-inatividade {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .modal-box {
      background: white;
      padding: 2rem 2.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      font-size: 1.1rem;
      color: #333;
      text-align: center;
    }

    .modal-box span {
      font-weight: bold;
      font-size: 1.4rem;
      color: red;
    }

    .modal-box button {
      margin-top: 1rem;
      padding: 0.6rem 1.4rem;
      font-size: 1rem;
      font-weight: bold;
      color: white;
      background: #38b6ff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .modal-box button:hover {
      background: #1595e6;
    }
  `;
  document.head.appendChild(estilo);
}

// Começa contagem de 60 segundos
function iniciarContagemRegressiva() {
  tempoRestante = 60;
  const contador = document.getElementById('contador-modal');
  contador.textContent = tempoRestante;

  countdownInterval = setInterval(() => {
    tempoRestante--;
    contador.textContent = tempoRestante;
    if (tempoRestante <= 0) {
      pararContagem();
      logout();
    }
  }, 1000);
}

// Para a contagem e limpa intervalo
function pararContagem() {
  clearInterval(countdownInterval);
}

// Fecha a modal visualmente
function fecharModal() {
  const modal = document.getElementById('modal-inatividade');
  if (modal) modal.remove();
}

// Executa logout e redireciona
function logout() {
  localStorage.clear();
  window.location.href = '../../pages/public/index.html';
}

// Iniciar ao carregar o script
iniciarMonitoramento();