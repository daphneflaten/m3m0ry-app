/* ===================================================== */
/* ================= INTRO BUFFER ======================= */
/* ===================================================== */

window.addEventListener("load", () => {
  startScentBuffer();
});

function startScentBuffer() {

  const overlay = document.getElementById("diffusionOverlay");
  const page = document.getElementById("page");

overlay.innerHTML = "";
overlay.classList.add("active");

// Start pure white
overlay.style.background = "white";
overlay.style.opacity = "1";

  const fragmentCount = 8;
  const gridSize = 18;
  const squareSize = 220;
  const baseColor = "#333333";

  function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.substring(1,3), 16);
    const g = parseInt(hex.substring(3,5), 16);
    const b = parseInt(hex.substring(5,7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  let fragments = [];

  for (let s = 0; s < fragmentCount; s++) {

    const fragment = document.createElement("div");
    fragment.style.position = "absolute";
    fragment.style.width = squareSize + "px";
    fragment.style.height = squareSize + "px";
    fragment.style.display = "grid";
    fragment.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    fragment.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    fragment.style.pointerEvents = "none";

    fragment.style.left =
      Math.random() * (window.innerWidth - squareSize) + "px";

    fragment.style.top =
      Math.random() * (window.innerHeight - squareSize) + "px";

    overlay.appendChild(fragment);

    const cells = [];
    const center = gridSize / 2;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {

        const cell = document.createElement("div");

        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let opacity = 1 - (distance / center);
        opacity = Math.max(0, opacity);
        opacity = Math.round(opacity * 5) / 5;

        cell.style.backgroundColor = hexToRGBA(baseColor, opacity);
        cell.style.opacity = "0";
cell.style.transition = "opacity 0.35s ease";
        fragment.appendChild(cell);
        cells.push({ cell, distance });
      }
    }

    cells.sort((a, b) => a.distance - b.distance);
    fragments.push(cells);
  }

  function inhale() {
    fragments.forEach((cells, fIndex) => {
      cells.forEach((obj, i) => {
        setTimeout(() => {
          obj.cell.style.opacity = "1";
        }, fIndex * 120 + i * 6);
      });
    });
  }

  function exhale() {
    fragments.forEach((cells, fIndex) => {
      cells.slice().reverse().forEach((obj, i) => {
        setTimeout(() => {
          obj.cell.style.opacity = "0";
        }, fIndex * 120 + i * 6);
      });
    });
  }

  // breathing loop
// slight white pause before diffusion
setTimeout(() => {
  inhale();
}, 250);

setTimeout(() => {
  exhale();
}, 900);

setTimeout(() => {
  inhale();
}, 1700);

setTimeout(() => {
  exhale();
}, 2500);

setTimeout(() => {
  overlay.style.transition = "opacity 4s ease";
  overlay.style.opacity = "0";
}, 3300);

// Hold white screen before UI appears
setTimeout(() => {
  page.classList.add("visible");
}, 3900);
}


/* ===================================================== */
/* ================= MAIN APP LOGIC ===================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  const response = await fetch("data.json");
  const data = await response.json();

  const emotions = Object.keys(data.emotions);

  const picker = document.getElementById("picker");
  const confirmBtn = document.getElementById("confirmBtn");
  const reflectionSection = document.getElementById("reflectionSection");
  const lockInBtn = document.getElementById("lockInBtn");
  const definitionEl = document.getElementById("emotionDefinition");
  const pixelOverlay = document.getElementById("pixelOverlay");

  const topText = document.querySelector(".top-text");
  const pickerContainer = document.querySelector(".picker-container");

  const itemHeight = 60;
  let selectedEmotion = null;



  /* ================= BUILD PICKER ================= */

  const looped = [...emotions, ...emotions, ...emotions];

  looped.forEach(emotion => {
    const div = document.createElement("div");
    div.classList.add("picker-item");
    div.textContent = emotion;
    picker.appendChild(div);
  });

  const total = emotions.length;
  const items = document.querySelectorAll(".picker-item");

  picker.scrollTop = itemHeight * total;

  function updateActive() {

    const center = picker.scrollTop + picker.offsetHeight / 2;
    const index = Math.round(center / itemHeight) - 1;

    items.forEach(item => item.classList.remove("active"));

    if (items[index]) {
      items[index].classList.add("active");
      selectedEmotion = items[index].textContent;
      confirmBtn.disabled = false;

      definitionEl.textContent =
        data.emotions[selectedEmotion].definition;
    }

    if (picker.scrollTop <= itemHeight * 5)
      picker.scrollTop += itemHeight * total;

    if (picker.scrollTop >= itemHeight * total * 2.5)
      picker.scrollTop -= itemHeight * total;
  }

  picker.addEventListener("scroll", updateActive);
  updateActive();



  /* ================= CONFIRM BLOBS ================= */

  function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.substring(1,3), 16);
    const g = parseInt(hex.substring(3,5), 16);
    const b = parseInt(hex.substring(5,7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function renderPixelGradient(colorHex) {

    pixelOverlay.innerHTML = "";
    pixelOverlay.classList.add("visible");

    const fragmentCount = 8;
    const gridSize = 18;
    const squareSize = 220;

    for (let s = 0; s < fragmentCount; s++) {

      const fragment = document.createElement("div");
      fragment.style.position = "absolute";
      fragment.style.width = squareSize + "px";
      fragment.style.height = squareSize + "px";
      fragment.style.display = "grid";
      fragment.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      fragment.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
      fragment.style.pointerEvents = "none";

      fragment.style.left =
        Math.random() * (window.innerWidth - squareSize) + "px";

      fragment.style.top =
        Math.random() * (window.innerHeight - squareSize) + "px";

      pixelOverlay.appendChild(fragment);

      const cells = [];
      const center = gridSize / 2;

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {

          const cell = document.createElement("div");

          const dx = x - center;
          const dy = y - center;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let opacity = 1 - (distance / center);
          opacity = Math.max(0, opacity);
          opacity = Math.round(opacity * 5) / 5;

          cell.style.backgroundColor = hexToRGBA(colorHex, opacity);
          cell.style.opacity = "0";
          cell.style.transition = "opacity 0.25s ease";

          fragment.appendChild(cell);
          cells.push({ cell, distance });
        }
      }

      cells.sort((a, b) => a.distance - b.distance);

      const fragmentDelay = s * 150;

      cells.forEach((obj, i) => {
        setTimeout(() => {
          obj.cell.style.opacity = "1";
        }, fragmentDelay + i * 6);
      });
    }
  }



  /* ================= CONFIRM ================= */

  confirmBtn.addEventListener("click", () => {

    if (!selectedEmotion) return;

    const emotionColor = data.emotions[selectedEmotion].color;

    pickerContainer.style.opacity = "0";
    topText.style.opacity = "0";
    confirmBtn.style.opacity = "0";

    renderPixelGradient(emotionColor);

    setTimeout(() => {
      reflectionSection.classList.add("visible");
    }, 700);
  });



  /* ================= LOCK IN ================= */

  lockInBtn.addEventListener("click", () => {

    if (!selectedEmotion) return;

    const entry = {
      scentId: "scent1",
      emotion: selectedEmotion,
      intensity: document.getElementById("intensity").value,
      reflection: document.getElementById("reflectionInput").value,
      timestamp: Date.now()
    };

    let archive =
      JSON.parse(localStorage.getItem("m3m0ryArchive")) || [];

    archive.push(entry);
    localStorage.setItem("m3m0ryArchive", JSON.stringify(archive));

    window.location.href = "home.html";
  });

});