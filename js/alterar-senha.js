const URL = 'https://script.google.com/macros/s/AKfycbzC8tQ3bTO2a69FyImqQu5WLF8Nj_y0xWzQ6oRURB1WlVHWX_bTVX-ENwvCBstEYsxE/exec';

function togglePassword(button, input) {
  let visible = false;
  button.addEventListener('click', () => {
    visible = !visible;
    input.type = visible ? 'text' : 'password';
    button.querySelector('svg').style.opacity = visible ? 0.4 : 1;
  });
}

const novaInput = document.getElementById('nova');
const confInput = document.getElementById('conf');
const strengthEl = document.getElementById('strength');
const form = document.getElementById('f');
const msg = document.getElementById('msg');

togglePassword(document.getElementById('tog1'), novaInput);
togglePassword(document.getElementById('tog2'), confInput);

// Medidor de força da senha
novaInput.addEventListener('input', () => {
  const v = novaInput.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[a-z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[\W_]/.test(v)) score++;

  strengthEl.style.color = score >= 4 ? 'green' : score === 3 ? '#d49d00' : '#c00';
  strengthEl.textContent = score >= 4 ? 'Senha forte' : score === 3 ? 'Senha média' : 'Senha fraca';
});

// Submissão do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';

  if (novaInput.value !== confInput.value) {
    msg.textContent = 'Senhas não coincidem';
    return;
  }

  const fd = new FormData();
  fd.append('action', 'trocar');
  fd.append('token', localStorage.getItem('token'));
  fd.append('nova', novaInput.value);

  try {
    const r = await fetch(URL, { method: 'POST', body: fd });
    const txt = await r.text();
    if (txt.startsWith('{')) {
      const { status, forca } = JSON.parse(txt);
      if (status === 'OK') {
        alert(`Senha alterada (${forca.toLowerCase()}). Faça login novamente.`);
        localStorage.clear();
        window.location.href = '../public/index.html';
        return;
      }
      msg.textContent = status.replace(/_/g, ' ');
    } else {
      msg.textContent = txt.replace(/_/g, ' ');
    }
  } catch {
    msg.textContent = 'Erro de rede';
  }
});
