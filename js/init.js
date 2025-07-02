// ════════════════════════════════════════════════════════════════════════
// 🚀 init.js — Inicialização Modular Inteligente do Carrossel Caracol v13.0
// Método Caracol — Carregamento dinâmico, controle externo e reentrância segura
// Engenharia refinada com padrão internacional 12/10
// Autor: Graciliano Tolentino — O Engenheiro de Software da América do Sul
// ════════════════════════════════════════════════════════════════════════

"use strict";

/**
 * 🧠 Função principal para iniciar todos os carrosseis na página
 * • Idempotente (evita inicialização duplicada)
 * • Reutilizável após carregamento dinâmico (SPA, AJAX)
 * • Exporta instâncias para controle externo
 * • Suporte a hook de inicialização customizado (window.onCarrosselIniciado)
 */
function iniciarCarrosseis() {
  const carrosseis = document.querySelectorAll(".carrossel-container");
  const instancias = [];

  if (!carrosseis.length) {
    console.warn("⚠️ Nenhum elemento com classe '.carrossel-container' encontrado. Verifique se o componente foi carregado corretamente.");
    return instancias;
  }

  carrosseis.forEach(container => {
    if (!container.dataset.iniciado) {
      const instancia = new CaracolCarousel(container);
      container.dataset.iniciado = "true";
      instancias.push(instancia);

      // 🧪 Disparo de callback externo personalizado (opcional)
      if (typeof window.onCarrosselIniciado === "function") {
        try {
          window.onCarrosselIniciado(container, instancia);
        } catch (erro) {
          console.error("⚠️ Erro no hook externo 'onCarrosselIniciado':", erro);
        }
      }
    }
  });

  return instancias;
}

// ════════════════════════════════════════════════════════════════════════
// 🔁 Autoexecução inteligente no carregamento do DOM
// Compatível com carregadores dinâmicos como main.js, SPAs e SSR
// ════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrosseis();
});

// ════════════════════════════════════════════════════════════════════════
// 🌐 Exportação global para reutilização manual
// Ex: window.iniciarCarrosseis() após AJAX ou troca de view
// ════════════════════════════════════════════════════════════════════════

window.iniciarCarrosseis = iniciarCarrosseis;
