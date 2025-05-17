const container = document.getElementById("scroll-container");
const screens = document.querySelectorAll(".screen");
const dotNav = document.getElementById("dot-nav");
const backToTopBtn = document.getElementById("back-to-top");

let currentIndex = 0;
let isScrolling = false;
let touchStartY = 0;

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

function updateSlideTags(currentIndex) {
  const tags = document.querySelectorAll(".slide-tag");
  tags.forEach(tag => {
    const slideNumber = parseInt(tag.getAttribute("slide"));
    if (slideNumber === currentIndex) {
      tag.classList.add("visible");
      tag.classList.remove("hidden");
    } else {
      tag.classList.remove("visible");
      tag.classList.add("hidden");
    }
  });
}


function scrollToIndex(index) {
  if (index < 0 || index >= screens.length) return;
  currentIndex = index;
  const offset = -index * window.innerHeight;
  container.style.transform = `translateY(${offset}px)`;
  updateDots();
  updateSlideTags(currentIndex);
}


function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
  backToTopBtn.style.display = currentIndex !== 0 ? "block" : "none";
}

function isInsideModelViewer(element) {
  return element.closest('model-viewer') !== null;
}

function handleWheel(e) {
  if (isInsideModelViewer(e.target)) return;

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

function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  if (isInsideModelViewer(e.target)) return;

  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaY) > 50 && !isScrolling) {
    const currentScreen = screens[currentIndex];
    const atTop = currentScreen.scrollTop === 0;
    const atBottom = Math.abs(currentScreen.scrollHeight - currentScreen.clientHeight - currentScreen.scrollTop) < 2;

    if (deltaY < 0 && atBottom && currentIndex < screens.length - 1) {
      isScrolling = true;
      scrollToIndex(currentIndex + 1);
      setTimeout(() => isScrolling = false, 1000);
    } else if (deltaY > 0 && atTop && currentIndex > 0) {
      isScrolling = true;
      scrollToIndex(currentIndex - 1);
      setTimeout(() => isScrolling = false, 1000);
    }
  }
}

function init() {
  createDots();
  updateSlideTags(currentIndex);
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
}

const toSecondSlideBtn = document.getElementById("to-second-slide");

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });

  backToTopBtn.style.display = currentIndex !== 0 ? "block" : "none";
  toSecondSlideBtn.style.display = currentIndex === 0 ? "block" : "none";
}

toSecondSlideBtn.addEventListener("click", () => {
  scrollToIndex(1);
});


backToTopBtn.addEventListener("click", () => {
  scrollToIndex(0);
});

init();
