document.addEventListener("DOMContentLoaded", async () => {

  // Load JSON
  const response = await fetch("data.json");
  const data = await response.json();

  const carousel = document.getElementById("carousel");
  const carouselWrapper = document.querySelector(".carousel-wrapper");
  const overlay = document.querySelector(".emotion-overlay");

  const emotionTitle = document.getElementById("emotion-title");
  const emotionDefinition = document.getElementById("emotion-definition");
  const emotionInterpretation = document.getElementById("emotion-interpretation");

  const confirmSection = document.getElementById("confirmSection");
  const confirmBtn = document.getElementById("confirmEmotion");
  const lockInBtn = document.getElementById("lockIn");
  const reflectionSection = document.getElementById("reflectionSection");

  const emotions = Object.keys(data.emotions);

  const radius = 650; // KEEP — dramatic bottom-peek look
  const angleStep = 360 / emotions.length;

  let rotation = 0;
  let isDragging = false;
  let startX = 0;
  let selectedEmotion = null;

  // Build carousel
  emotions.forEach((emotion, index) => {

    const btn = document.createElement("button");
    btn.classList.add("emotion");

    const label = document.createElement("span");
    label.innerText = emotion;
    btn.appendChild(label);

    const angle = index * angleStep;
    const radians = angle * (Math.PI / 180);

    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    // 125px button → half ≈ 62 → use whole number
    btn.style.left = `calc(50% + ${x}px - 63px)`;
    btn.style.top  = `calc(50% + ${y}px - 63px)`;

    btn.addEventListener("click", (e) => {
      selectEmotion(emotion, e);
    });

    carousel.appendChild(btn);
  });

  const buttons = document.querySelectorAll(".emotion");

  function selectEmotion(emotion, e) {
    selectedEmotion = emotion;

    buttons.forEach(btn => btn.classList.remove("active"));
    e.currentTarget.classList.add("active");

    emotionTitle.innerText = emotion;
    emotionDefinition.innerText = data.emotions[emotion].definition;
    emotionInterpretation.innerText = "";

    confirmSection.classList.remove("hidden");
    reflectionSection.classList.add("hidden");
  }

  // Rotate carousel
  carousel.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const delta = e.clientX - startX;
    rotation += delta * 0.3;
    startX = e.clientX;

    carousel.style.transform = `rotate(${rotation}deg)`;

    // Keep labels upright
    buttons.forEach(btn => {
      btn.querySelector("span").style.transform = `rotate(${-rotation}deg)`;
    });
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  // CONFIRM EMOTION → BLEED COLOR
  confirmBtn.addEventListener("click", () => {

    if (!selectedEmotion) return;

    const emotionData = data.emotions[selectedEmotion];
    const scent = data.scents["scent1"];
    const color = emotionData.color;

    emotionInterpretation.innerText =
      emotionData.meaning +
      " notes detected: " + scent.notes.join(", ") + ".";

    // Fade carousel out
    carouselWrapper.classList.add("fade-out");

    // BLEED EFFECT — rises from bottom / carousel area
    overlay.style.background =
      `radial-gradient(
        circle at 50% 85%,
        ${color} 0%,
        ${color} 35%,
        rgba(255,255,255,0.85) 70%,
        rgba(255,255,255,1) 100%
      )`;

    // Swap buttons
    confirmBtn.classList.add("hidden");

    setTimeout(() => {
      lockInBtn.classList.remove("hidden");
    }, 500);

    reflectionSection.classList.remove("hidden");
  });

  // LOCK IN
  lockInBtn.addEventListener("click", () => {

    if (!selectedEmotion) return;

    const intensity = document.getElementById("intensity").value;
    const reflection = document.getElementById("reflection").value;

    console.log({
      scent: "scent1",
      emotion: selectedEmotion,
      intensity,
      reflection
    });

    // Later: transition to next scent + reset overlay
  });

});

document.getElementById("intensity").style.background =
  `linear-gradient(to right, ${emotionColor} ${value*10}%, black ${value*10}%)`;