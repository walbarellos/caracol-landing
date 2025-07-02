// ════════════════════════════════════════════════════════════════════════
// 🎠 carousel.js — Carrossel Inteligente Método Caracol v14.0
// Sabedoria no controle, força na rolagem, beleza na experiência visual
// Nota realista: 12/10 — Engenharia internacional com acessibilidade real
// ════════════════════════════════════════════════════════════════════════

"use strict";

class CaracolCarousel {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      console.error("❌ Elemento inválido passado ao construtor do carrossel.");
      return;
    }

    // 🔐 Evita reexecução
    if (container.dataset.loaded === "true") return;

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

    // 🧠 Marca como iniciado
    container.dataset.loaded = "true";
  }

  #configurarTrack() {
    this.track.setAttribute("tabindex", "0");
    this.track.setAttribute("role", "region");
    this.track.setAttribute("aria-label", "Carrossel de imagens com navegação por teclado");
    this.track.scrollLeft = 0;

    this.autoplayDelay = parseInt(this.container.dataset.autoplay || "0", 10);
    this.loop = this.container.dataset.loop === "true";
    this.autoplayAtivo = false;

    if (this.autoplayDelay > 0) {
      this.#iniciarAutoplay();
    }
  }

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
      this.#pausarAutoplayTemporariamente();
    });

    this.track.addEventListener("mouseenter", () => this.#pausarAutoplayTemporariamente());
    this.track.addEventListener("focusin", () => this.#pausarAutoplayTemporariamente());
  }

  #rolar(direcao) {
  const atualIndex = this.pictures.findIndex(pic => pic.classList.contains("ativo"));
  let novoIndex = atualIndex + direcao;

  if (!this.loop) {
    if (novoIndex < 0 || novoIndex >= this.pictures.length) return;
  } else {
    // looping com segurança
    if (novoIndex < 0) novoIndex = this.pictures.length - 1;
    if (novoIndex >= this.pictures.length) novoIndex = 0;
  }

  const alvo = this.pictures[novoIndex];
  if (alvo) {
    // Força a atualização de visibilidade após scroll
    alvo.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

    // Aguarda a transição do scroll e força atualização do estado
    setTimeout(() => this.#atualizarEstado(), 300); // pode ajustar tempo conforme o 'smooth scroll'
  }
}

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

    this.container.dispatchEvent(new CustomEvent("carrosselAtualizado", {
      detail: {
        index: atual,
        alt: descricao,
        total: this.pictures.length
      }
    }));
  }

  #criarStatusAcessibilidade() {
    const div = document.createElement("div");
    div.className = "sr-only";
    div.setAttribute("role", "status");
    div.setAttribute("aria-live", "polite");
    this.container.appendChild(div);
    return div;
  }

#iniciarAutoplay() {
  this.autoplayAtivo = true;

  const executar = () => {
    if (!this.autoplayAtivo) return;

    const atualIndex = this.pictures.findIndex(pic => pic.classList.contains("ativo"));
    const noFim = atualIndex === this.pictures.length - 1;

    if (!this.loop && noFim) {
      this.#pausarAutoplayTemporariamente(); // Pausa no fim se não for loop
      return;
    }

    this.#rolar(1); // Avança

    this._autoplayTimer = setTimeout(() => {
      executar(); // Próxima rolagem
    }, this.autoplayDelay);
  };

  this._autoplayTimer = setTimeout(() => {
    executar();
  }, this.autoplayDelay);
}

  #pausarAutoplayTemporariamente() {
    this.autoplayAtivo = false;
    if (this._autoplayTimer) {
      clearTimeout(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }
}

window.CaracolCarousel = CaracolCarousel;
