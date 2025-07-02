"use strict";

class CaracolCarousel {
  constructor(container) {
    if (!(container instanceof HTMLElement)) return;

    if (container.dataset.loaded === "true") return;
    container.dataset.loaded = "true";

    this.container = container;
    this.track = container.querySelector(".carrossel-itens");
    this.pictures = Array.from(this.track.querySelectorAll("picture"));
    this.prevBtn = container.querySelector(".carrossel-seta.esquerda");
    this.nextBtn = container.querySelector(".carrossel-seta.direita");
    this.autoplay = parseInt(container.dataset.autoplay, 10) || 0;
    this.loop = container.dataset.loop === "true";
    this.current = 0;
    this._timer = null;

    this.#setup();
    this.#bindEvents();
    this.#update();
    if (this.autoplay > 0) this.#startAutoplay();
  }

  #setup() {
    this.track.setAttribute("tabindex", "0");
    this.track.setAttribute("role", "list");
  }

  #bindEvents() {
    this.prevBtn.addEventListener("click", () => { this.#go(-1); });
    this.nextBtn.addEventListener("click", () => { this.#go(1); });

    this.track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.#go(-1);
      if (e.key === "ArrowRight") this.#go(1);
    });

    this.container.addEventListener("click", () => {
      this.track.focus();
    });
  }

  #go(delta) {
    this.#stopAutoplay();

    let idx = this.current + delta;
    if (this.loop) {
      if (idx < 0) idx = this.pictures.length - 1;
      if (idx >= this.pictures.length) idx = 0;
    } else {
      idx = Math.max(0, Math.min(idx, this.pictures.length - 1));
    }

    this.current = idx;
    this.#scrollTo(idx);
    this.#update();
  }

  #scrollTo(idx) {
    const pic = this.pictures[idx];
    const offset = pic.offsetLeft - (this.track.clientWidth / 2 - pic.clientWidth / 2);
    this.track.scrollTo({ left: offset, behavior: "smooth" });
  }

  #update() {
    this.pictures.forEach((p, i) => p.classList.toggle("ativo", i === this.current));
    this.prevBtn.disabled = !this.loop && this.current === 0;
    this.nextBtn.disabled = !this.loop && this.current === this.pictures.length - 1;
  }

  #startAutoplay() {
    this._timer = setInterval(() => this.#go(1), this.autoplay * 1000);
  }

  #stopAutoplay() {
    clearInterval(this._timer);
  }
}

window.CaracolCarousel = CaracolCarousel;

// Inicialização após DOM pronto
document.addEventListener("DOMContentLoaded", () => {
  const c = document.querySelector(".carrossel-container");
  if (c) new CaracolCarousel(c);
});
