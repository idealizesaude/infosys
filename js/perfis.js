// js/perfis.js
export const hierarquia = {
  "Atendimento": 1,
  "Atendimento Digital": 2,
  "Administrativo": 3,
  "Supervisor": 4,
  "Gerente": 5,
  "Proprietário": 6,
  "Master": 7
};

// Preenchimento automático do select#nivel ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("nivel");
  if (!select) return;

  const nivelAtual = localStorage.getItem("nivel");
  const nivelAtualNum = hierarquia[nivelAtual] ?? 0;

  // Limpa o select
  select.innerHTML = '<option value="">Selecione...</option>';

  // Adiciona apenas os perfis permitidos
  Object.keys(hierarquia).forEach(perfil => {
    const nivel = hierarquia[perfil];
    if (nivel <= nivelAtualNum || nivelAtual === 'Master') {
      const opt = document.createElement('option');
      opt.value = perfil;
      opt.textContent = perfil;
      select.appendChild(opt);
    }
  });
});
