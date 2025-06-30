const URL_API = "https://script.google.com/macros/s/AKfycbzC8tQ3bTO2a69FyImqQu5WLF8Nj_y0xWzQ6oRURB1WlVHWX_bTVX-ENwvCBstEYsxE/exec";

// Função para carregar dados do usuário
async function carregarUsuario() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const nomeEl = document.getElementById("nome");
  const emailEl = document.getElementById("email");
  const topbarNome = document.getElementById("nome-usuario");

  // Pré-preenche com dados locais
  const nomeLocal = localStorage.getItem("nome_usuario");
  const emailLocal = localStorage.getItem("email_usuario");

  if (nomeLocal) {
    nomeEl.value = nomeLocal;
    if (topbarNome) topbarNome.innerHTML = `<strong>${nomeLocal}</strong>`;
  }
  if (emailLocal) emailEl.value = emailLocal;

  try {
    const resposta = await fetch(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "usuario", token })
    });

    const texto = await resposta.text();
    if (texto.startsWith("{")) {
      const dados = JSON.parse(texto);
      nomeEl.value = dados.nome || "";
      emailEl.value = dados.email || "";

      localStorage.setItem("nome_usuario", dados.nome || "");
      localStorage.setItem("email_usuario", dados.email || "");
    } else {
      console.warn("Erro ao carregar dados:", texto);
    }
  } catch (erro) {
    console.error("Erro de rede ao carregar usuário:", erro);
  }
}

// Função para atualizar o nome
async function atualizarNome() {
  const token = localStorage.getItem("token");
  const nome = document.getElementById("nome").value.trim();

  if (!nome) {
    alert("O nome não pode estar vazio.");
    return;
  }

  try {
    const resposta = await fetch(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "atualizar_nome", token, nome })
    });

    const resultado = await resposta.text();
    if (resultado === "OK") {
      alert("Nome atualizado com sucesso!");
      localStorage.setItem("nome_usuario", nome);
    } else {
      alert("Erro ao atualizar nome: " + resultado);
    }
  } catch (erro) {
    console.error("Erro ao atualizar nome:", erro);
    alert("Erro de rede ao atualizar nome.");
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();

  document.getElementById("btn-atualizar").addEventListener("click", atualizarNome);

  document.getElementById("btn-alterar-senha").addEventListener("click", () => {
    window.location.href = "../public/alterar-senha.html"; // Corrigido!
  });
});