// ════════════════════════════════════════════════════════════════════════
// 🎠 carousel.js — Navegação inteligente com acessibilidade e elegância
// Método Caracol v13.0 — Sabedoria, Força e Beleza semântico-funcional
// Projeto internacional de engenharia front-end com padrão 12/10
// Autor: Graciliano Tolentino — O Engenheiro de Software da América do Sul
// ════════════════════════════════════════════════════════════════════════

"use strict";

class CaracolCarousel {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      console.error("❌ Elemento inválido passado ao construtor do carrossel.");
      return;
    }

    this.container = container;
    this.track = container.querySelector(".carrossel-itens");
    this.pictures = Array.from(this.track?.querySelectorAll("picture") || []);
    this.setaEsquerda = container.querySelector(".carrossel-seta.esquerda");
    this.setaDireita = container.querySelector(".carrossel-seta.direita");
    this.status = this.#criarStatusAcessibilidade();

    this.raf = null;
    this.#configurarTrack();
    this.#vincularEventos();
    this.#atualizarEstado();
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🔧 Configuração inicial do carrossel e seu comportamento de rolagem
  // ════════════════════════════════════════════════════════════════════════
  #configurarTrack() {
    this.track.setAttribute("tabindex", "0");
    this.track.setAttribute("role", "region");
    this.track.setAttribute("aria-label", "Carrossel de imagens com navegação por teclado");
    this.track.scrollLeft = 0;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🎮 Vincula eventos de clique, teclado e rolagem para navegação fluida
  // ════════════════════════════════════════════════════════════════════════
  #vincularEventos() {
    this.track.addEventListener("scroll", () => {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => this.#atualizarEstado());
    });

    this.setaEsquerda?.addEventListener("click", () => this.#rolar(-1));
    this.setaDireita?.addEventListener("click", () => this.#rolar(1));

    this.track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.#rolar(-1);
      if (e.key === "ArrowRight") this.#rolar(1);
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // 📐 Lógica de rolagem proporcional à largura visível da faixa
  // ════════════════════════════════════════════════════════════════════════
  #rolar(direcao) {
    const passo = this.track.clientWidth * 0.9;
    this.track.scrollBy({
      left: direcao * passo,
      behavior: "smooth"
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🔍 Atualiza visualmente o carrossel e o status de acessibilidade
  // ════════════════════════════════════════════════════════════════════════
  #atualizarEstado() {
    const visiveis = this.pictures.map((pic, i) => {
      const img = pic.querySelector("img");
      if (!img) return { i, visivel: 0 };
      const rect = img.getBoundingClientRect();
      const larguraVisivel = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      return { i, visivel: larguraVisivel };
    });

    const maisVisivel = visiveis.reduce((a, b) => (a.visivel > b.visivel ? a : b), { i: 0, visivel: 0 });
    const atual = maisVisivel.i;

    this.pictures.forEach((pic, i) => {
      pic.classList.toggle("ativo", i === atual);
    });

    const imagemAtual = this.pictures[atual]?.querySelector("img");
    const descricao = imagemAtual?.alt || "imagem sem descrição";
    this.status.textContent = `Imagem ${atual + 1} de ${this.pictures.length}: ${descricao}`;

    const maxScroll = this.track.scrollWidth - this.track.clientWidth;
    this.setaEsquerda.disabled = this.track.scrollLeft <= 10;
    this.setaDireita.disabled = this.track.scrollLeft >= maxScroll - 10;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🔊 Elemento invisível para leitores de tela com status dinâmico
  // ════════════════════════════════════════════════════════════════════════
  #criarStatusAcessibilidade() {
    const div = document.createElement("div");
    div.className = "sr-only";
    div.setAttribute("role", "status");
    div.setAttribute("aria-live", "polite");
    this.container.appendChild(div);
    return div;
  }
}

// 🌐 Registro global seguro para múltiplas instâncias futuras
window.CaracolCarousel = CaracolCarousel;
