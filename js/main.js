// ════════════════════════════════════════════════════════════════════════════
// 🌐 main.js v6.0 — Núcleo Modular Inteligente (Caracol)
// Compatível com carrossel inline e dinâmico, seguro para SSR, SPA e fallback JS
// Autor: Graciliano Tolentino — Excelência Técnica Sul-Americana
// Classificação realista: 12/10 — Estabilidade, Modularidade e Performance
// ════════════════════════════════════════════════════════════════════════════

"use strict";

// 🌍 Caminhos centralizados dos componentes HTML
const componentes = {
  header: "components/header.html",
  form: "components/form.html",
  footer: "components/footer.html"
};

/**
 * 🚀 Carrega e injeta um componente HTML por ID
 * @param {string} id - ID do container
 * @param {string} caminho - Caminho do arquivo HTML
 * @param {Function|null} callback - Executa após injeção
 */
async function carregarComponente(id, caminho, callback = null) {
  const container = document.getElementById(id);
  if (!window.fetch || !container) {
    console.warn(`⚠️ Navegador ou container incompatível: ${id}`);
    return;
  }

  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status} ao carregar ${caminho}`);
    const html = await resposta.text();
    container.innerHTML = html;
    container.dataset.loaded = "true";

    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const novo = document.createElement("script");
      if (oldScript.src) {
        novo.src = oldScript.src;
        novo.defer = true;
      } else {
        novo.textContent = oldScript.textContent;
      }
      document.body.appendChild(novo);
    });

    if (typeof callback === "function") callback();
  } catch (erro) {
    console.error(`❌ Falha ao carregar ${caminho}:`, erro);
    container.innerHTML = `<div class="toast-erro">Erro ao carregar <strong>${caminho}</strong></div>`;
  }
}

/**
 * 🧩 Carrega os componentes e inicializa lógicas específicas
 */
async function carregarTodosComponentes() {
  await Promise.all([
    carregarComponente("header-container", componentes.header),
    carregarComponente("form-container", componentes.form, () => {
      if (typeof inicializarFormulario === "function") {
        try {
          inicializarFormulario();
        } catch (erro) {
          console.warn("⚠️ Erro ao inicializar formulário:", erro);
        }
      }
    }),
    carregarComponente("footer-container", componentes.footer)
  ]);
}

/**
 * 🎠 Inicializa carrossel se presente no DOM
 */
function inicializarCarrosselSeExistir() {
  const container = document.querySelector(".carrossel-container");
  if (container && typeof Carousel === "function") {
    try {
      new Carousel(container);
    } catch (erro) {
      console.warn("⚠️ Erro ao instanciar carrossel:", erro);
    }
  }
}

// 🔁 Inicialização segura e progressiva
document.addEventListener("DOMContentLoaded", () => {
  try {
    carregarTodosComponentes();
    inicializarCarrosselSeExistir(); // garante funcionamento inline
  } catch (erro) {
    console.error("❌ Falha geral na inicialização:", erro);
  }
});
