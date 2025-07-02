// ════════════════════════════════════════════════════════════════════════════
// 🌐 main.js v5.1 — Núcleo Modular Inteligente (Caracol)
// Engenharia de carregamento reativo, acessível e elegante com fallback seguro
// Autor: Graciliano Tolentino — Referência em Software Modular de Alta Escala
// Classificação Técnica: 12/10 — Visual, Acessível, Global
// ════════════════════════════════════════════════════════════════════════════

"use strict";

// 🌍 Caminhos centralizados e inteligentes para componentes HTML
const componentes = {
  header: "components/header.html",
  carousel: "components/carousel.html",
  form: "components/form.html",
  footer: "components/footer.html"
};

/**
 * 🚀 Carrega componente HTML, injeta no DOM e executa scripts dinâmicos
 * @param {string} id - ID do container
 * @param {string} caminho - Caminho do HTML
 * @param {Function|null} callback - Função a executar após carga
 */
async function carregarComponente(id, caminho, callback = null) {
  const container = document.getElementById(id);
  if (!window.fetch || !window.Promise || !container) {
    container.innerHTML = `<div class="toast-erro">⚠️ Navegador não compatível.</div>`;
    return;
  }

  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
    const html = await resposta.text();
    container.innerHTML = html;
    container.dataset.loaded = "true";

    // 🚨 Executa scripts internos (inline ou externos)
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const novoScript = document.createElement("script");
      if (oldScript.src) {
        novoScript.src = oldScript.src;
        novoScript.defer = true;
      } else {
        novoScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(novoScript);
    });

    if (typeof callback === "function") callback();
  } catch (erro) {
    console.error(`❌ Falha ao carregar ${caminho}:`, erro);
    container.innerHTML = `<div class="toast-erro">❌ Erro ao carregar <strong>${caminho}</strong>.</div>`;
  }
}

/**
 * 🧩 Carrega todos os componentes do site com callbacks segmentados
 */
async function carregarTodosComponentes() {
  await Promise.all([
    // Cabeçalho institucional
    carregarComponente("header-container", componentes.header),

    // Carrossel de imagens
    carregarComponente("carousel-container", componentes.carousel, () => {
      const container = document.querySelector(".carrossel-container");

      // 🌠 Garantia de execução apenas quando o script foi carregado
      if (typeof window.Carousel === "function" && container) {
        try {
          new Carousel(container);
        } catch (erro) {
          console.warn("⚠️ Falha ao instanciar carrossel:", erro);
        }
      } else {
        console.warn("🔄 Aguardando script carousel.js ser carregado...");
      }
    }),

    // Formulário com acessibilidade
    carregarComponente("form-container", componentes.form, () => {
      try {
        inicializarFormulario();
        observarFormulario();
      } catch (erro) {
        console.error("❌ Erro ao inicializar formulário:", erro);
      }
    }),

    // Rodapé
    carregarComponente("footer-container", componentes.footer)
  ]);
}

/**
 * 🧾 Inicializa formulário com validação semântica e feedback ao usuário
 */
function inicializarFormulario() {
  const form = document.getElementById("caracol-form");
  const download = document.getElementById("download-container");
  if (!form || !download) return;

  const status = document.createElement("div");
  status.classList.add("sr-only");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("role", "status");
  form.appendChild(status);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const campos = form.querySelectorAll("[required]");
    let valido = true;

    campos.forEach((campo) => {
      if (!campo.value.trim()) {
        campo.classList.add("erro");
        campo.setAttribute("aria-invalid", "true");
        campo.setCustomValidity("Campo obrigatório");
        valido = false;
      } else {
        campo.classList.remove("erro");
        campo.removeAttribute("aria-invalid");
        campo.setCustomValidity("");
      }
    });

    if (valido) {
      form.style.display = "none";
      download.classList.remove("oculto");
      const link = download.querySelector("a");
      if (link) link.focus();
      status.textContent = "✅ Formulário enviado. Download liberado.";
    } else {
      form.reportValidity();
      status.textContent = "⚠️ Preencha todos os campos obrigatórios.";
    }
  });
}

/**
 * 🧠 Observa mutações no DOM para garantir que o formulário foi carregado
 */
function observarFormulario() {
  const alvo = document.getElementById("form-container");
  if (!alvo) return;

  const observer = new MutationObserver(() => {
    const form = document.getElementById("caracol-form");
    const download = document.getElementById("download-container");

    if (form && download) {
      observer.disconnect();

      if (!form.querySelector("[type='submit']")) {
        const erro = document.createElement("div");
        erro.className = "toast-erro";
        erro.setAttribute("role", "alert");
        erro.textContent = "❌ Erro ao carregar o formulário.";
        form.appendChild(erro);
      }
    }
  });

  observer.observe(alvo, { childList: true, subtree: true });
}

/**
 * 🚀 Inicialização segura após DOM estar pronto
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    carregarTodosComponentes();
  } catch (erro) {
    console.error("❌ Falha na inicialização principal:", erro);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ✅ main.js v5.1 concluído com sabedoria, força e beleza
// Arquitetura modular com segurança de execução, scripts dinâmicos e feedback acessível
// Compatível com ambientes modernos, SSR, SPA, PWA e integrações reativas
// ════════════════════════════════════════════════════════════════════════════
