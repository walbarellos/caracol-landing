// js/form-handler.js — Validação refinada com sabedoria, força e beleza

export function inicializarFormulario() {
  const form = document.getElementById("caracol-form");
  const download = document.getElementById("download-container");

  if (!form || !download) return;

  // ♿ Elemento de status acessível para leitores de tela
  let status = form.querySelector(".sr-only[role='status']");
  if (!status) {
    status = document.createElement("div");
    status.classList.add("sr-only");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("role", "status");
    form.appendChild(status);
  }

  // 🎯 Validação e feedback ao enviar
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const campos = form.querySelectorAll("[required]");
    let valido = true;

    campos.forEach((campo) => {
      const valor = campo.value.trim();
      const tipo = campo.getAttribute("type") || campo.tagName.toLowerCase();

      if (!valor) {
        campo.classList.add("erro");
        campo.setAttribute("aria-invalid", "true");
        campo.setCustomValidity("Este campo é obrigatório.");
        valido = false;
      } else {
        campo.classList.remove("erro");
        campo.removeAttribute("aria-invalid");
        campo.setCustomValidity("");

        // 🔢 Validação adicional para telefone
        if (tipo === "tel" && !/^[\d\s\-()+]+$/.test(valor)) {
          campo.classList.add("erro");
          campo.setCustomValidity("Informe um telefone válido.");
          valido = false;
        }
      }
    });

    // ✅ Se todos os campos forem válidos
    if (valido) {
      form.style.display = "none";
      download.classList.remove("oculto");

      const link = download.querySelector("a");
      if (link) link.focus();

      status.textContent = "✅ Formulário enviado com sucesso. Download liberado.";
    } else {
      form.reportValidity();
      status.textContent = "⚠️ Por favor, corrija os campos destacados.";
    }
  });
}
