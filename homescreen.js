let currentSlide = 0;
let isAnimating = false;

// Start calibration (fade landing → onboarding)
function startCalibration() {
  const landing = document.querySelector(".landing");
  const onboarding = document.querySelector(".onboarding");

  landing.classList.remove("active");
  onboarding.classList.add("active");
}

// Advance slides when tapping screen
function nextSlide() {
  if (isAnimating) return;

  const slides = document.querySelectorAll(".slide");

  // Stop advancing if on last slide
  if (currentSlide >= slides.length - 1) return;

  slides[currentSlide].classList.remove("active-slide");
  currentSlide++;
  slides[currentSlide].classList.add("active-slide");
}

// Release scent animation
function releaseScent(event) {
  event.stopPropagation(); // Prevent slide advancing
  if (isAnimating) return;

  isAnimating = true;

  const screen = document.querySelector(".onboarding");
  const overlay = document.querySelector(".scent-overlay");

  // Step 1: Fade out text gently
  screen.classList.add("fade-out");

  // Step 2: Start bloom slightly after fade begins
  setTimeout(() => {
    overlay.classList.add("active");
  }, 800);

  // Step 3: Move to next page after diffusion completes
  setTimeout(() => {
    window.location.href = "scent1.html";
  }, 3000);
}