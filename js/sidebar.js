// sidebar.js – carrega o sidebar e marca o link da página atual

const sidebarPath = "../../assets/fragments/sidebar.html";

fetch(sidebarPath)
  .then(res => {
    if (!res.ok) throw new Error(`Falha ao carregar sidebar (${res.status})`);
    return res.text();
  })
  .then(html => {
    const container = document.getElementById("site-sidebar");
    container.innerHTML = html;

    // 1. Destacar link ativo automaticamente
    const pagePath = location.pathname.split("/").pop(); // ex: configuracoes.html
    const links = container.querySelectorAll(".sidebar a");
    links.forEach(a => {
      if (a.getAttribute("href").endsWith(pagePath)) {
        a.classList.add("active");
      }
    });

    // 2. Função global para o botão hambúrguer (mobile)
    window.toggleSidebarMobile = () => {
      const sidebar = container.querySelector(".sidebar");
      sidebar?.classList.toggle("open");
    };

    // 3. Delegated listener para capturar clique no hambúrguer
    document.addEventListener("click", e => {
      // se clicou no botão hambúrguer (ou em algum span dentro dele)
      if (e.target.closest(".hamburger")) {
        window.toggleSidebarMobile();
      }
    });
  })
  .catch(err => console.error(err));