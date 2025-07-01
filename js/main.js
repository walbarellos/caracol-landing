// main.js — Montagem modular inteligente com sabedoria, força e beleza (v2.0)
// Arquitetura refinada, acessibilidade internacional, preparado para produção real

// 🌐 Configuração central de caminhos (evita repetição e facilita i18n)
const componentes = {
  header: "components/header.html",
  carousel: "components/carousel.html",
  form: "components/form.html",
  footer: "components/footer.html"
};

// 🚀 Carrega um componente HTML no container correspondente
async function carregarComponente(id, caminho, callback = null) {
  // Fallback para navegadores antigos sem fetch
  if (!window.fetch) {
    document.getElementById(id).innerHTML = `
      <div class="toast-erro">⚠️ Navegador incompatível com este site. Atualize seu navegador.</div>
    `;
    return;
  }

  try {
    const resposta = await fetch(caminho);
    const html = await resposta.text();
    const container = document.getElementById(id);
    container.innerHTML = html;
    container.dataset.loaded = "true"; // Marca como carregado
    if (callback && typeof callback === "function") callback(); // Pós-load individual
  } catch (erro) {
    console.error(`Erro ao carregar ${caminho}:`, erro);
    document.getElementById(id).innerHTML = `
      <div class="toast-erro">⚠️ Erro ao carregar o módulo <strong>${caminho}</strong>.</div>
    `;
  }
}

// 🚀 Carregamento paralelo de todos os componentes com alto desempenho
async function carregarTodosComponentes() {
  await Promise.all([
    carregarComponente("header-container", componentes.header),
    carregarComponente("carousel-container", componentes.carousel, () => {
      // 💡 Lógica pós-carregamento do carrossel (ex: ativar JS de navegação)
      if (typeof inicializarCarrossel === "function") {
        inicializarCarrossel(); // Suporte a função externa
      }
    }),
    carregarComponente("form-container", componentes.form, () => {
      if (typeof inicializarFormulario === "function") {
        inicializarFormulario(); // Suporte a função modular
      }
    }),
    carregarComponente("footer-container", componentes.footer)
  ]);
}

// form-handler.js — Validação refinada e liberação progressiva com acessibilidade total

function inicializarFormulario() {
  const form = document.getElementById("caracol-form");
  const download = document.getElementById("download-container");

  if (!form || !download) return;

  // 🔊 Aria-live para feedback acessível
  const status = document.createElement("div");
  status.classList.add("sr-only");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("role", "status");
  form.appendChild(status);

  // 🧠 Validação e feedback em tempo real
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

// 🔍 Observa especificamente o container do formulário para inicializá-lo no tempo certo
function observarFormulario() {
  const alvo = document.getElementById("form-container");

  if (!alvo) return;

  const observer = new MutationObserver((mutacoes) => {
    const form = document.getElementById("caracol-form");
    const download = document.getElementById("download-container");

    if (form && download) {
      // ✅ Confirma que os elementos existem, então para a observação
      observer.disconnect();

      // 🧠 Caso o carregamento falhe silenciosamente
      if (!form.querySelector("[type='submit']")) {
        const erro = document.createElement("div");
        erro.className = "toast-erro";
        erro.setAttribute("role", "alert");
        erro.innerText = "Erro ao montar o formulário. Tente atualizar a página.";
        form.appendChild(erro);
      }
    }
  });

  observer.observe(alvo, { childList: true, subtree: true });
}

