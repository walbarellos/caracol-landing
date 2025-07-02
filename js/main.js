// main.js — Montagem Modular Método Caracol v4.0
// Arquitetado com sabedoria, força e beleza

"use strict";

// 🌐 Caminhos centralizados
const componentes = {
  header: "components/header.html",
  carousel: "components/carousel.html",
  form: "components/form.html",
  footer: "components/footer.html"
};

/**
 * 🚀 Carrega um componente e executa callback após o carregamento
 */
async function carregarComponente(id, caminho, callback = null) {
  const container = document.getElementById(id);

  if (!window.fetch || !window.Promise || !container) {
    container.innerHTML = `<div class="toast-erro">⚠️ Navegador não suportado.</div>`;
    return;
  }

  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
    const html = await resposta.text();
    container.innerHTML = html;
    container.dataset.loaded = "true";
    if (typeof callback === "function") callback();
  } catch (erro) {
    console.error(`Erro ao carregar ${caminho}:`, erro);
    container.innerHTML = `<div class="toast-erro">❌ Falha ao carregar <strong>${caminho}</strong>.</div>`;
  }
}

/**
 * 🚀 Carrega todos os componentes principais
 */
async function carregarTodosComponentes() {
  await Promise.all([
    carregarComponente("header-container", componentes.header),
    carregarComponente("carousel-container", componentes.carousel, () => {
      if (typeof window.Carousel === "function") {
        const container = document.querySelector(".carrossel-container");
        if (container) new Carousel(container);
      }
    }),
    carregarComponente("form-container", componentes.form, () => {
      inicializarFormulario();
      observarFormulario();
    }),
    carregarComponente("footer-container", componentes.footer)
  ]);
}

/**
 * 🧾 Inicializa formulário com validação acessível
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
      status.textContent = "⚠️ Por favor, preencha todos os campos obrigatórios.";
    }
  });
}

/**
 * 🔍 Observa o contêiner de formulário para inicialização segura
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

// 🚀 Inicialização global segura
document.addEventListener("DOMContentLoaded", carregarTodosComponentes);
