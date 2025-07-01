// js/main.js — Montagem modular e liberação de download com sabedoria, força e beleza

// Função para carregar componentes HTML
async function carregarComponente(id, caminho) {
  try {
    const resposta = await fetch(caminho);
    const html = await resposta.text();
    document.getElementById(id).innerHTML = html;
  } catch (erro) {
    console.error(`Erro ao carregar ${caminho}:`, erro);
    document.getElementById(id).innerHTML = `
      <p class="erro">⚠️ Erro ao carregar o módulo <strong>${caminho}</strong>.</p>
    `;
  }
}

// Carregar todos os módulos
carregarComponente("header-container", "components/header.html");
carregarComponente("carousel-container", "components/carousel.html");
carregarComponente("form-container", "components/form.html");
carregarComponente("footer-container", "components/footer.html");

// Aguardar o DOM carregar completamente para aplicar a lógica do formulário
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const form = document.getElementById("caracol-form");
    const download = document.getElementById("download-container");

    if (form && download) {
      form.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede recarregamento

        // Valida todos os campos obrigatórios
        if (form.checkValidity()) {
          form.style.display = "none";
          download.classList.remove("oculto");
        } else {
          form.reportValidity(); // Exibe dicas nativas do navegador
        }
      });

      // Uma vez carregado, para de observar mudanças no DOM
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
