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
        cell.style.transition = "opacity 0.3s ease";

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
        }, fIndex * 70 + i * 4);
      });
    });
  }

  function exhale() {
    fragments.forEach((cells, fIndex) => {
      cells.slice().reverse().forEach((obj, i) => {
        setTimeout(() => {
          obj.cell.style.opacity = "0";
        }, fIndex * 70 + i * 4);
      });
    });
  }

  setTimeout(() => inhale(), 200);
  setTimeout(() => exhale(), 900);
  setTimeout(() => inhale(), 1600);
  setTimeout(() => exhale(), 2300);

  setTimeout(() => {
    overlay.style.transition = "opacity 1s ease";
    overlay.style.opacity = "0";
  }, 3000);

  setTimeout(() => {
    page.classList.add("visible");
  }, 3600);
}


/* ===================================================== */
/* ================= MAIN APP =========================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  const response = await fetch("data.json");
  const data = await response.json();

  const emotions = Object.keys(data.emotions);

  const picker = document.getElementById("picker");
  const confirmBtn = document.getElementById("confirmBtn");
  const definitionEl = document.getElementById("emotionDefinition");
  const reflectionSection = document.getElementById("reflectionSection");
  const pixelOverlay = document.getElementById("pixelOverlay");

  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const controls = document.querySelector(".reflection-controls");

  const memoryInput = document.getElementById("reflectionInput");

  let selectedEmotion = null;
  let vividnessValue = 0;
  let currentSlide = 0;

  /* ================= BUILD PICKER ================= */

  const looped = [...emotions, ...emotions, ...emotions];
  const itemHeight = 60;

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

  function renderPixelGradient(colorHex) {

    pixelOverlay.innerHTML = "";

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

          cell.style.backgroundColor =
            `rgba(${parseInt(colorHex.substr(1,2),16)},
                  ${parseInt(colorHex.substr(3,2),16)},
                  ${parseInt(colorHex.substr(5,2),16)},
                  ${opacity})`;

          cell.style.opacity = "0";
          cell.style.transition = "opacity 0.25s ease";

          fragment.appendChild(cell);
          cells.push({ cell, distance });
        }
      }

      cells.sort((a, b) => a.distance - b.distance);

      cells.forEach((obj, i) => {
        setTimeout(() => {
          obj.cell.style.opacity = "1";
        }, s * 120 + i * 5);
      });
    }
  }


  /* ================= CONFIRM ================= */

  confirmBtn.addEventListener("click", () => {

    if (!selectedEmotion) return;

    const emotionColor = data.emotions[selectedEmotion].color;

    document.querySelector(".picker-container").style.opacity = "0";
    document.querySelector(".top-text").style.opacity = "0";
    confirmBtn.style.opacity = "0";
    definitionEl.style.opacity = "0";

    renderPixelGradient(emotionColor);

    setTimeout(() => {
      reflectionSection.classList.add("visible");
      showSlide(0);
    }, 900);
  });


  /* ================= SLIDES ================= */

  const slides = document.querySelectorAll(".reflection-slide");

  function showSlide(index) {

    slides.forEach((slide, i) => {
      slide.classList.remove("active", "previous");

      if (i === index) slide.classList.add("active");
      if (i < index) slide.classList.add("previous");
    });

    currentSlide = index;

    if (currentSlide === 0) {
      controls.classList.add("centered");
      nextBtn.textContent = "next";
    } else {
      controls.classList.remove("centered");
      nextBtn.textContent = "lock in";
    }
  }

  backBtn.addEventListener("click", () => {
    if (currentSlide > 0) showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener("click", () => {

    if (currentSlide === 0) {

      showSlide(1);

    } else {

      const entry = {
        scentId: "scent1",
        emotion: selectedEmotion,
        reflection: memoryInput.value,
        vividness: vividnessValue,
        timestamp: Date.now()
      };

      let archive =
        JSON.parse(localStorage.getItem("m3m0ryArchive")) || [];

      archive.push(entry);
      localStorage.setItem("m3m0ryArchive", JSON.stringify(archive));

const page = document.getElementById("page");

// trigger fade out
page.classList.add("exit");

// wait for animation to finish
setTimeout(() => {
const page = document.getElementById("page");
const pixelOverlay = document.getElementById("pixelOverlay");

// fade page + blots
page.classList.add("exit");
pixelOverlay.style.opacity = "0";

setTimeout(() => {
  window.location.href = "home.html";
}, 800);}, 800);    }
  });

  showSlide(0);


  /* ================= VIVIDNESS ================= */

  const vividBlocks = document.querySelectorAll(".vivid-block");

  vividBlocks.forEach(block => {
    block.addEventListener("click", () => {

      vividnessValue = parseInt(block.dataset.value);

      vividBlocks.forEach(b => {
        const value = parseInt(b.dataset.value);
        b.classList.toggle("active", value <= vividnessValue);
      });
    });
  });

});