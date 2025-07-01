// carousel.js — Galeria Inteligente Caracol v7.0
// Reestruturado como Classe Modular — Instanciável, acessível e refinado

"use strict";

class Carousel {
  /**
   * Cria uma nova instância do carrossel
   * @param {HTMLElement} container - Elemento DOM com id ou classe do carrossel
   */
  constructor(container) {
    if (!(container instanceof HTMLElement)) throw new Error("Container inválido");

    this.container = container;
    this.setaEsquerda = container.querySelector(".carrossel-seta.esquerda");
    this.setaDireita = container.querySelector(".carrossel-seta.direita");
    this.itens = container.querySelector(".carrossel-itens");
    this.imagens = this.itens?.querySelectorAll("picture img, img:not(picture img)") || [];
    this.autoplayDelay = parseInt(container.dataset.autoplay, 10) || null;
    this.loop = container.dataset.loop === "true";
    this.raf = null;
    this.autoplayId = null;

    if (!this.container || !this.itens || this.imagens.length === 0) return;

    this.statusSR = this.#criarStatusAriaLive();

    this.#configurar();
    this.#atualizar();
    this.#ativarEventos();

    if (this.autoplayDelay) this.#iniciarAutoplay();
  }

  /**
   * Configura atributos iniciais
   */
  #configurar() {
    this.itens.setAttribute("tabindex", "0");
    if (this.itens.scrollLeft === 0) {
      this.itens.focus({ preventScroll: true });
    }
  }

  /**
   * Atualiza status visual e acessível
   */
  #atualizar() {
    this.#atualizarSetas();
    this.#atualizarStatus();
  }

  /**
   * Ativa eventos de scroll, clique e teclado
   */
  #ativarEventos() {
    this.itens.addEventListener("scroll", () => {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => this.#atualizar());
    });

    this.setaEsquerda?.addEventListener("click", () => this.scroll(-1));
    this.setaDireita?.addEventListener("click", () => this.scroll(1));

    this.itens.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.scroll(-1);
      if (e.key === "ArrowRight") this.scroll(1);
    });

    this.container.addEventListener("mouseenter", () => this.#pararAutoplay());
    this.container.addEventListener("mouseleave", () => this.#iniciarAutoplay());
  }

  /**
   * Realiza rolagem suave em direção específica
   * @param {number} direcao -1 para esquerda, +1 para direita
   */
  scroll(direcao) {
    const largura = this.itens.clientWidth * 0.9;
    this.itens.scrollBy({
      left: direcao * largura,
      behavior: "smooth"
    });
  }

  /**
   * Atualiza texto de status e aplica classe visual .ativo
   */
  #atualizarStatus() {
    let maiorVisivel = 0;
    let imagemAtual = 0;

    this.imagens.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      const visivel = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      if (visivel > maiorVisivel) {
        maiorVisivel = visivel;
        imagemAtual = index;
      }
    });

    const alt = this.imagens[imagemAtual].alt || `Imagem ${imagemAtual + 1}`;
    this.statusSR.textContent = `Imagem ${imagemAtual + 1} de ${this.imagens.length}: ${alt}`;

    this.imagens.forEach((img, i) => {
      const alvo = img.closest("picture") || img;
      alvo.classList.toggle("ativo", i === imagemAtual);
    });

    if (window.__DEBUG__) {
      console.log(`[Carousel] Imagem ativa: ${imagemAtual + 1} (${alt})`);
    }
  }

  /**
   * Atualiza estado das setas esquerda e direita
   */
  #atualizarSetas() {
    const scrollMax = this.itens.scrollWidth - this.itens.clientWidth;
    if (this.setaEsquerda) {
      this.setaEsquerda.disabled = this.itens.scrollLeft <= 10;
    }
    if (this.setaDireita) {
      this.setaDireita.disabled = this.itens.scrollLeft >= scrollMax - 10;
    }
  }

  /**
   * Cria elemento aria-live oculto para status acessível
   */
  #criarStatusAriaLive() {
    const status = document.createElement("div");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.className = "sr-only";
    this.container.appendChild(status);
    return status;
  }

  /**
   * Inicia autoplay se definido no HTML
   */
  #iniciarAutoplay() {
    if (!this.autoplayDelay || this.autoplayId) return;
    this.autoplayId = setInterval(() => this.scroll(1), this.autoplayDelay);
  }

  /**
   * Para o autoplay manualmente ou ao interagir
   */
  #pararAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }
}

// 🌐 Permite inicialização manual via HTML ou JS externo
window.Carousel = Carousel;
