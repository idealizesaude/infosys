/**
 * inatividade.js
 * Monitoramento de inatividade via timestamp e polling,
 * com aviso e logout automático.
 * A janela só pode ser fechada clicando em 'Continuar logado'.
 */
(() => {
  // Configurações de tempo (ajuste conforme necessário)
  const SEGUNDOS_TOTAL    = 20 * 60;   // Tempo total de inatividade 20 minutos
  const SEGUNDOS_DE_AVISO = 1 * 60;   // Tempo de aviso em segundos

  const TOTAL_MS   = SEGUNDOS_TOTAL * 1000;
  const WARNING_MS = SEGUNDOS_DE_AVISO * 1000;

  let lastActivity   = Date.now();
  let modalVisible   = false;
  let countdownTimer = null;

  /**
   * Cria o modal singleton, se ainda não existir
   */
  function createModal() {
    if (document.getElementById('modal-inatividade')) return;

    const overlay = document.createElement('div');
    overlay.id = 'modal-inatividade';
    overlay.className = 'alert-overlay';
    // Garantindo que comece oculto
    overlay.style.setProperty('display', 'none', 'important');
    overlay.innerHTML = `
      <div class="alert-box" role="alertdialog" aria-labelledby="modal-title" aria-describedby="modal-desc">
        <h3 id="modal-title">Você ainda está aí?</h3>
        <p id="modal-desc">
          Seu acesso será encerrado por inatividade em <span id="modal-count">${SEGUNDOS_DE_AVISO}</span> segundos.
        </p>
        <div class="alert-btn-row">
          <button id="btn-stay" class="alert-btn">Continuar logado</button>
        </div>
      </div>`;

    // Apenas o botão encerra o modal e reinicia o contador
    overlay.querySelector('#btn-stay').addEventListener('click', () => {
      lastActivity = Date.now();
      hideModal();
    });

    document.body.appendChild(overlay);
  }

  /**
   * Exibe o modal de aviso e inicia contagem regressiva
   */
  function showModal() {
    const overlay = document.getElementById('modal-inatividade');
    if (!overlay) return;

    modalVisible = true;
    document.getElementById('modal-count').textContent = SEGUNDOS_DE_AVISO;
    overlay.style.setProperty('display', 'flex', 'important');

    let remaining = SEGUNDOS_DE_AVISO;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      remaining--;
      document.getElementById('modal-count').textContent = remaining;
      if (remaining <= 0) clearInterval(countdownTimer);
    }, 1000);
  }

  /**
   * Oculta o modal e limpa contagem
   */
  function hideModal() {
    const overlay = document.getElementById('modal-inatividade');
    if (overlay) {
      overlay.style.setProperty('display', 'none', 'important');
    }
    clearInterval(countdownTimer);
    modalVisible = false;
  }

  /**
   * Executa logout e redireciona para a página de login
   */
  function logout() {
    localStorage.clear();
    window.location.href = '../../index.html';
  }

  /**
   * Atualiza timestamp de última atividade
   * Ignora eventos enquanto o modal estiver visível
   */
  function refreshActivity() {
    if (!modalVisible) {
      lastActivity = Date.now();
    }
  }

  /**
   * Verifica periodicamente o tempo de inatividade
   */
  function startPolling() {
    setInterval(() => {
      const diff = Date.now() - lastActivity;
      // Exibe o modal apenas uma vez, ao atingir o tempo de aviso
      if (!modalVisible && diff >= (TOTAL_MS - WARNING_MS)) {
        showModal();
      }
      // Logout após tempo total de inatividade
      if (diff >= TOTAL_MS) {
        logout();
      }
    }, 1000);
  }

  // Inicialização após DOM carregado
  document.addEventListener('DOMContentLoaded', () => {
    createModal();
    // Eventos de atividade do usuário (sem fechar modal)
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, refreshActivity, { passive: true })
    );
    startPolling();
  });
})();