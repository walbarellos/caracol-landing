"use strict";

class CaracolCarousel {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      console.error("❌ Elemento inválido passado ao construtor do carrossel.");
      return;
    }

    if (container.dataset.loaded === "true") return;

    this.container = container;
    this.track = container.querySelector(".carrossel-itens");
    this.pictures = Array.from(this.track?.querySelectorAll("picture") || []);
    this.setaEsquerda = container.querySelector(".carrossel-seta.esquerda");
    this.setaDireita = container.querySelector(".carrossel-seta.direita");
    this.status = this.#criarStatusAcessibilidade();

    this.raf = null;
    this.autoplayDelay = parseInt(this.container.dataset.autoplay || "0", 10);
    this.loop = this.container.dataset.loop === "true";
    this.autoplayAtivo = false;

    this.#configurarTrack();
    this.#vincularEventos();
    this.#atualizarEstado();

    container.dataset.loaded = "true";

    if (this.autoplayDelay > 0) {
      this.#iniciarAutoplay();
    }
  }

  #configurarTrack() {
    this.track.setAttribute("tabindex", "0");
    this.track.setAttribute("role", "region");
    this.track.setAttribute("aria-label", "Carrossel de imagens com navegação por teclado");
    this.track.scrollLeft = 0;
  }

  #vincularEventos() {
    // Atualiza estado no scroll
    this.track.addEventListener("scroll", () => {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => this.#atualizarEstado());
    });

    // Clique nas setas sempre funcionam
    this.setaEsquerda?.addEventListener("click", () => this.#rolar(-1));
    this.setaDireita?.addEventListener("click", () => this.#rolar(1));

    // Teclado funciona após foco no track (melhor para acessibilidade)
    this.track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.#rolar(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.#rolar(1);
      }
    });

    // Ao clicar em qualquer lugar do container, foca no track para ativar teclado
    this.container.addEventListener("click", () => {
      this.track.focus();
    });
  }

  #rolar(direcao) {
    // Índice da imagem atualmente ativa
    const ativoIndex = this.pictures.findIndex(pic => pic.classList.contains("ativo"));
    let novoIndex = ativoIndex + direcao;

    // Loop ou limites
    if (novoIndex < 0) {
      if (this.loop) novoIndex = this.pictures.length - 1;
      else novoIndex = 0;
    } else if (novoIndex >= this.pictures.length) {
      if (this.loop) novoIndex = 0;
      else novoIndex = this.pictures.length - 1;
    }

    const pic = this.pictures[novoIndex];
    if (pic) {
      // Scroll para posição exata da imagem dentro do container
      this.track.scrollTo({
        left: pic.offsetLeft - this.track.offsetLeft,
        behavior: "smooth"
      });
    }
  }

  #atualizarEstado() {
    // Calcula qual imagem está mais centralizada
    const containerCenter = this.track.scrollLeft + this.track.clientWidth / 2;

    let maisProximo = { i: 0, distancia: Infinity };

    this.pictures.forEach((pic, i) => {
      const picCenter = pic.offsetLeft + pic.clientWidth / 2;
      const distancia = Math.abs(containerCenter - picCenter);
      if (distancia < maisProximo.distancia) {
        maisProximo = { i, distancia };
      }
    });

    const atual = maisProximo.i;

    this.pictures.forEach((pic, i) => {
      pic.classList.toggle("ativo", i === atual);
    });

    const imagemAtual = this.pictures[atual]?.querySelector("img");
    const descricao = imagemAtual?.alt || "imagem sem descrição";
    this.status.textContent = `Imagem ${atual + 1} de ${this.pictures.length}: ${descricao}`;

    // Atualiza estado das setas
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;
    this.setaEsquerda.disabled = !this.loop && this.track.scrollLeft <= 10;
    this.setaDireita.disabled = !this.loop && this.track.scrollLeft >= maxScroll - 10;

    // Evento custom para integração externa
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

    const repetir = () => {
      if (!this.autoplayAtivo) return;

      this.#rolar(1);

      this._autoplayTimer = setTimeout(() => {
        repetir();
      }, this.autoplayDelay);
    };

    repetir();
  }

  #pausarAutoplayTemporariamente() {
    this.autoplayAtivo = false;
    if (this._autoplayTimer) {
      clearTimeout(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }
}

// Registro global para múltiplas instâncias
window.CaracolCarousel = CaracolCarousel;
