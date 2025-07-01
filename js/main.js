// main.js — Montagem Modular Caracol v3.0
// Refinado para alto desempenho, acessibilidade total e escalabilidade internacional

"use strict";

// 🌐 Caminhos centralizados para fácil manutenção
const componentes = {
  header: "components/header.html",
  carousel: "components/carousel.html",
  form: "components/form.html",
  footer: "components/footer.html"
};

/**
 * 🚀 Carrega componente HTML em seu container
 * @param {string} id - ID do container
 * @param {string} caminho - Caminho do componente HTML
 * @param {Function} callback - Função pós-carregamento (opcional)
 */
async function carregarComponente(id, caminho, callback = null) {
  if (!window.fetch || !window.Promise) {
    document.getElementById(id).innerHTML = `
      <div class="toast-erro">⚠️ Navegador desatualizado. Atualize para uma experiência completa.</div>
    `;
    return;
  }

  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const html = await resposta.text();
    const container = document.getElementById(id);
    container.innerHTML = html;
    container.dataset.loaded = "true";
    if (typeof callback === "function") callback();
  } catch (erro) {
    console.error(`Erro ao carregar ${caminho}:`, erro);
    document.getElementById(id).innerHTML = `
      <div class="toast-erro">⚠️ Falha ao carregar <strong>${caminho}</strong>. Verifique sua conexão.</div>
    `;
  }
}

/**
 * 🚀 Carrega todos os componentes em paralelo
 */
async function carregarTodosComponentes() {
  await Promise.all([
    carregarComponente("header-container", componentes.header),
    carregarComponente("carousel-container", componentes.carousel, () => {
      inicializarTodosCarrosseis();
    }),
    carregarComponente("form-container", componentes.form, () => {
      inicializarFormulario();
      observarFormulario();
    }),
    carregarComponente("footer-container", componentes.footer)
  ]);
}

/**
 * 🌀 Instancia todos os carrosséis encontrados na página
 */
function inicializarTodosCarrosseis() {
  const containers = document.querySelectorAll(".carrossel-container");
  if (!window.Carousel || !containers.length) return;

  containers.forEach((container) => {
    try {
      new Carousel(container);
    } catch (erro) {
      console.warn("Falha ao inicializar carrossel:", erro);
    }
  });
}

/**
 * 🧾 Valida e libera formulário de forma acessível
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
        valido = false;
        campo.classList.add("erro");
        campo.setAttribute("aria-invalid", "true");
        campo.setCustomValidity("Campo obrigatório");
      } else {
        campo.classList.remove("erro");
        campo.removeAttribute("aria-invalid");
        campo.setCustomValidity("");
      }
    });

    if (valido) {
      form.style.display = "none";
      download.classList.remove("oculto");
      status.textContent = "Formulário enviado com sucesso. Download liberado.";
    } else {
      form.reportValidity();
      status.textContent = "Preencha todos os campos obrigatórios para continuar.";
    }
  });
}

/**
 * 🔍 Observa o formulário após injeção dinâmica
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
        erro.textContent = "Erro ao montar o formulário. Tente atualizar a página.";
        form.appendChild(erro);
      }
    }
  });

  observer.observe(alvo, { childList: true, subtree: true });
}

// 🚀 Início automático
document.addEventListener("DOMContentLoaded", carregarTodosComponentes);
