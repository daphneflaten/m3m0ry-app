document.addEventListener("DOMContentLoaded", async () => {
console.log("HOME JS RUNNING");
  const drawer = document.getElementById("drawer");
  const newBtn = document.getElementById("newCalibrationBtn");

  const backdrop = document.getElementById("viewerBackdrop");
  const viewerTab = document.getElementById("viewerTab");
  const viewerBody = document.getElementById("viewerBody");
  const closeBtn = document.getElementById("closeViewer");

  // Load system data
  const response = await fetch("data.json");
  const data = await response.json();

  // Load archive
  let archive = JSON.parse(localStorage.getItem("m3m0ryArchive"));

  // Seed archive if empty
  if (!archive || archive.length === 0) {
    archive = data.seedArchive || [];
    localStorage.setItem("m3m0ryArchive", JSON.stringify(archive));
  }

  if (!archive || archive.length === 0) {
    drawer.innerHTML = "<p style='opacity:.5;text-align:center;'>no archived calibrations.</p>";
    return;
  }

  // Newest on top
  archive.reverse();

  archive.forEach((entry, index) => {

    const folder = document.createElement("div");
    folder.classList.add("folder");
folder.style.zIndex = index;
    const tab = document.createElement("div");
    tab.classList.add("folder-tab");
    tab.textContent = entry.emotion;

    // Slight random horizontal offset
const randomOffset = Math.floor(Math.random() * 120) - 60;
tab.style.left = `${80 + randomOffset}px`;
    const body = document.createElement("div");
    body.classList.add("folder-body");

const scentName = entry.scentId;
    body.innerHTML = `
      <h2>${scentName}</h2>
    `;

    folder.appendChild(tab);
    folder.appendChild(body);

    // OPEN VIEWER
    folder.addEventListener("click", () => {

      viewerTab.textContent = entry.emotion;

      viewerBody.innerHTML = `
        <h2>${scentName}</h2>
        <p style="margin-top:20px;">
          intensity ${entry.intensity}
        </p>
        <p style="margin-top:20px;">
          ${entry.reflection || "no reflection recorded."}
        </p>
        <p style="opacity:.5; margin-top:20px;">
          ${new Date(entry.timestamp).toLocaleDateString()}
        </p>
      `;

      backdrop.classList.add("visible");
    });

    drawer.appendChild(folder);

  });

  // Close viewer button
  closeBtn.addEventListener("click", () => {
    backdrop.classList.remove("visible");
  });

  // Click outside to close
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove("visible");
    }
  });

  // Begin new calibration
  newBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

});