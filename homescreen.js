window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-visible");
});

let currentSlide = 0;
let isAnimating = false;

function startCalibration() {
  const landing = document.querySelector(".landing");
  const onboarding = document.querySelector(".onboarding");

  landing.classList.remove("active");

  setTimeout(() => {
    onboarding.classList.add("active");
  }, 400);
}

function nextSlide() {
  if (isAnimating) return;

  const slides = document.querySelectorAll(".slide");

  if (currentSlide >= slides.length - 1) return;

  isAnimating = true;

  slides[currentSlide].classList.remove("active-slide");

  setTimeout(() => {
    currentSlide++;
    slides[currentSlide].classList.add("active-slide");
    isAnimating = false;
  }, 500);
}

function releaseScent(event) {
  event.stopPropagation();
  if (isAnimating) return;

  isAnimating = true;

  const screen = document.querySelector(".onboarding");
  const overlay = document.querySelector(".scent-overlay");

  screen.classList.add("fade-out");

  setTimeout(() => {
    overlay.classList.add("active");
  }, 600);

  setTimeout(() => {
    window.location.href = "scent1.html";
  }, 2800);
}