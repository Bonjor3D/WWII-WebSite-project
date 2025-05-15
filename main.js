const container = document.getElementById("scroll-container");
const screens = document.querySelectorAll(".screen");
const dotNav = document.getElementById("dot-nav");

let currentIndex = 0;
let isScrolling = false;

function createDots() {
  dotNav.innerHTML = "";
  screens.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => scrollToIndex(i));
    dotNav.appendChild(dot);
  });
}

function scrollToIndex(index) {
  if (index < 0 || index >= screens.length) return;
  currentIndex = index;
  const offset = -index * window.innerHeight;
  container.style.transform = `translateY(${offset}px)`;
  updateDots();
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function handleWheel(e) {
  const currentScreen = screens[currentIndex];
  const atTop = currentScreen.scrollTop === 0;
  const atBottom = Math.abs(currentScreen.scrollHeight - currentScreen.clientHeight - currentScreen.scrollTop) < 2;

  if (isScrolling) return;

  if (e.deltaY > 0 && atBottom && currentIndex < screens.length - 1) {
    e.preventDefault();
    isScrolling = true;
    scrollToIndex(currentIndex + 1);
    setTimeout(() => isScrolling = false, 1000);
  } else if (e.deltaY < 0 && atTop && currentIndex > 0) {
    e.preventDefault();
    isScrolling = true;
    scrollToIndex(currentIndex - 1);
    setTimeout(() => isScrolling = false, 1000);
  }
}

function init() {
  createDots();
  window.addEventListener("wheel", handleWheel, { passive: false });
}

init();
