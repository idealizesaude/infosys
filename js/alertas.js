// alertas.js – Módulo para alertas personalizados do InfoSys

// Exibe alerta simples com botão de confirmação
export function showAlert({
  title = '',
  message = '',
  okLabel = 'OK',
  onOk = () => {},
} = {}) {
  removerOverlayAnterior();
  travarRolagem();

  const overlay = document.createElement('div');
  overlay.className = 'alert-overlay';

  const box = document.createElement('div');
  box.className = 'alert-box';
  box.innerHTML = `
    ${title ? `<h3 id="alert-title">${title}</h3>` : ''}
    <p id="alert-msg">${message}</p>
    <div class="alert-btn-row">
      <button class="alert-btn alert-btn-ok">${okLabel}</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.setAttribute('role', 'alertdialog');
  if (title) box.setAttribute('aria-labelledby', 'alert-title');
  box.setAttribute('aria-describedby', 'alert-msg');

  const okBtn = box.querySelector('.alert-btn-ok');
  okBtn.focus();

  const close = () => {
    overlay.remove();
    destravarRolagem();
    onOk();
  };

  okBtn.onclick = close;
  overlay.onclick = e => { if (e.target === overlay) close(); };
  window.addEventListener('keydown', function esc(ev) {
    if (ev.key === 'Escape') { close(); window.removeEventListener('keydown', esc); }
  });
}

// Exibe confirmação com botões Sim/Não
export function showConfirm({
  title = '',
  message = '',
  yesLabel = 'Sim',
  noLabel = 'Não',
  onYes = () => {},
  onNo = () => {},
} = {}) {
  removerOverlayAnterior();

  const overlay = document.createElement('div');
  overlay.className = 'alert-overlay';

  const box = document.createElement('div');
  box.className = 'alert-box';
  box.innerHTML = `
    ${title ? `<h3 id="alert-title">${title}</h3>` : ''}
    <p id="alert-msg">${message}</p>
    <div class="alert-btn-row">
      <button class="alert-btn alert-btn-yes">${yesLabel}</button>
      <button class="alert-btn alert-btn-no">${noLabel}</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.setAttribute('role', 'alertdialog');
  if (title) box.setAttribute('aria-labelledby', 'alert-title');
  box.setAttribute('aria-describedby', 'alert-msg');

  const yes = box.querySelector('.alert-btn-yes');
  const no = box.querySelector('.alert-btn-no');
  yes.focus();

  const close = () => overlay.remove();

  yes.onclick = () => { onYes(); close(); };
  no.onclick = () => { onNo(); close(); };
  overlay.onclick = e => { if (e.target === overlay) { onNo(); close(); } };
  window.addEventListener('keydown', function esc(ev) {
    if (ev.key === 'Escape') { onNo(); close(); window.removeEventListener('keydown', esc); }
  });
}

// Wrappers auxiliares (sucesso, erro e informativo)
export const showSuccess = (title, message = '', cb) =>
  showAlert({ title, message, okLabel: 'OK', onOk: cb });

export const showError = (title, message = '', cb) =>
  showAlert({ title, message, okLabel: 'OK', onOk: cb });

export const showInfo = (title, message = '', cb) =>
  showAlert({ title, message, okLabel: 'OK', onOk: cb });

// Funções auxiliares internas
function removerOverlayAnterior() {
  document.querySelector('.alert-overlay')?.remove();
}

function travarRolagem() {
  const scrollPos = window.scrollY || document.documentElement.scrollTop;
  document.body.style.top = `-${scrollPos}px`;
  document.body.style.position = 'fixed';
  document.body.style.left = '0';
  document.body.style.right = '0';
}

function destravarRolagem() {
  const scrollPos = -parseInt(document.body.style.top || '0');
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo({ top: scrollPos });
}