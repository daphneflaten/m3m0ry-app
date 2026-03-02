// Fade in page wrapper
window.addEventListener("load", () => {
  document.getElementById("page").classList.add("visible");
});

document.addEventListener("DOMContentLoaded", async () => {

  // Load JSON
  const response = await fetch("data.json");
  const data = await response.json();

  const emotions = Object.keys(data.emotions);

  const picker = document.getElementById("picker");
  const confirmBtn = document.getElementById("confirmBtn");
  const overlay = document.getElementById("emotionOverlay");
  const reflectionSection = document.getElementById("reflectionSection");
  const pickerContainer = document.querySelector(".picker-container");
  const topText = document.querySelector(".top-text");
  const confirmSection = document.querySelector(".confirm-section");

  const itemHeight = 60;
  let selectedEmotion = null;

  /* =========================
     BUILD INFINITE PICKER
  ========================== */

  const looped = [...emotions, ...emotions, ...emotions];

  looped.forEach(emotion => {
    const div = document.createElement("div");
    div.classList.add("picker-item");
    div.textContent = emotion;
    picker.appendChild(div);
  });

  const total = emotions.length;
  const items = document.querySelectorAll(".picker-item");

  // Start centered in middle copy
  picker.scrollTop = itemHeight * total;

  function updateActive() {

    const center = picker.scrollTop + picker.offsetHeight / 2;
    const index = Math.round(center / itemHeight) - 1;

    items.forEach(item => item.classList.remove("active"));

    if (items[index]) {
      items[index].classList.add("active");
      selectedEmotion = items[index].textContent;
      confirmBtn.disabled = false;
    }

    // Infinite reset illusion
    if (picker.scrollTop <= itemHeight * 5) {
      picker.scrollTop += itemHeight * total;
    }

    if (picker.scrollTop >= itemHeight * total * 2.5) {
      picker.scrollTop -= itemHeight * total;
    }
  }

  picker.addEventListener("scroll", updateActive);

  updateActive();

  /* =========================
     CONFIRM TRANSITION
  ========================== */

  confirmBtn.addEventListener("click", () => {

    if (!selectedEmotion) return;

    const emotionColor = data.emotions[selectedEmotion].color;

    /* 1️⃣ Set gradient background instantly */
    overlay.style.background = `
      radial-gradient(
        circle at center,
        rgba(255,255,255,0) 45%,
        ${emotionColor} 120%
      )
    `;

    /* 2️⃣ Force reflow to trigger transition */
    overlay.offsetHeight;

    /* 3️⃣ Fade gradient in */
    overlay.style.opacity = "1";

    /* 4️⃣ Fade picker out */
    pickerContainer.style.opacity = "0";
    topText.style.opacity = "0";
    confirmSection.style.opacity = "0";

    pickerContainer.style.pointerEvents = "none";
    confirmSection.style.pointerEvents = "none";

    /* 5️⃣ After fade, reveal reflection */
    setTimeout(() => {
      reflectionSection.classList.remove("hidden");
      reflectionSection.classList.add("visible");
    }, 800);

  });

});

pickerContainer.style.opacity = "0";

setTimeout(() => {
  topText.style.opacity = "0";
  confirmSection.style.opacity = "0";
}, 150);