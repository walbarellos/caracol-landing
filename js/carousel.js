// carousel.js — Controle Inteligente da Galeria Caracol
// Criado com sabedoria, força e beleza | Refinado para nota 12/10

document.addEventListener("DOMContentLoaded", () => {
  const carrossel = document.getElementById("carrossel");
  const setaEsquerda = document.querySelector(".carrossel-seta.esquerda");
  const setaDireita = document.querySelector(".carrossel-seta.direita");

  // Cria container de status para leitores de tela
  const statusSR = document.createElement("div");
  statusSR.setAttribute("aria-live", "polite");
  statusSR.classList.add("sr-only");
  carrossel.parentElement.appendChild(statusSR);

  // Estado inicial
  atualizarSetas();
  anunciarSlideVisivel();

  // Observa mudanças de scroll
  carrossel.addEventListener("scroll", () => {
    atualizarSetas();
    anunciarSlideVisivel();
  });

  // Controle por clique nas setas
  setaEsquerda.addEventListener("click", () => {
    scrollCarrossel(-1);
  });

  setaDireita.addEventListener("click", () => {
    scrollCarrossel(1);
  });

  // Teclado ← →
  carrossel.setAttribute("tabindex", "0");
  carrossel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollCarrossel(-1);
    if (e.key === "ArrowRight") scrollCarrossel(1);
  });
});

function scrollCarrossel(direcao) {
  const carrossel = document.getElementById("carrossel");
  const larguraVisivel = carrossel.clientWidth;
  const passo = Math.round(larguraVisivel * 0.9); // rola 90% da área visível

  carrossel.scrollBy({
    left: direcao * passo,
    behavior: "smooth",
  });
}

function atualizarSetas() {
  const carrossel = document.getElementById("carrossel");
  const setaEsquerda = document.querySelector(".carrossel-seta.esquerda");
  const setaDireita = document.querySelector(".carrossel-seta.direita");

  const scrollLeft = carrossel.scrollLeft;
  const scrollMax = carrossel.scrollWidth - carrossel.clientWidth;

  setaEsquerda.disabled = scrollLeft <= 10;
  setaDireita.disabled = scrollLeft >= scrollMax - 10;
}

function anunciarSlideVisivel() {
  const carrossel = document.getElementById("carrossel");
  const imagens = carrossel.querySelectorAll("picture");
  const statusSR = carrossel.parentElement.querySelector("[aria-live]");

  let imagemAtual = 0;
  let maiorVisivel = 0;

  imagens.forEach((picture, index) => {
    const img = picture.querySelector("img");
    const rect = img.getBoundingClientRect();
    const visivel = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));

    if (visivel > maiorVisivel) {
      maiorVisivel = visivel;
      imagemAtual = index;
    }
  });

  statusSR.textContent = `Imagem ${imagemAtual + 1} de ${imagens.length}`;
}
