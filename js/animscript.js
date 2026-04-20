let SETTINGS = {
  density: 200,
  driftEnabled: false,
  bg: "#000000",
  textColor: "#c9c9c9"
};

let GLOBAL_LINES = [];
const MAX_CAP = 300;

document.addEventListener("DOMContentLoaded", () => {

  const field = document.getElementById("tickerField");

  const bgPicker = document.getElementById("bgPicker");
  const textPicker = document.getElementById("textPicker");
  const densityInput = document.getElementById("densityInput");
  const driftToggle = document.getElementById("driftToggle");

  /* ================================
     BACKGROUND
  ================================= */
  bgPicker.addEventListener("input", (e) => {
    SETTINGS.bg = e.target.value;
    document.body.style.background = SETTINGS.bg;
    bgPicker.style.setProperty("--picker-color", SETTINGS.bg);
  });

  /* ================================
     TEXT COLOR
  ================================= */
  textPicker.addEventListener("input", (e) => {
    SETTINGS.textColor = e.target.value;
    textPicker.style.setProperty("--text-picker-color", SETTINGS.textColor);

    document.querySelectorAll(".track span").forEach(el => {
      el.style.color = SETTINGS.textColor;
    });
  });

  /* ================================
     DENSITY
  ================================= */
  densityInput.addEventListener("input", (e) => {

    const maxAllowed = Math.min(GLOBAL_LINES.length, MAX_CAP);

    let val = parseInt(e.target.value, 10) || 1;

    SETTINGS.density = Math.min(Math.max(val, 1), maxAllowed);

    regenerate(field);
  });

  /* ================================
     DRIFT TOGGLE
  ================================= */
  driftToggle.addEventListener("change", (e) => {

    SETTINGS.driftEnabled = e.target.checked;

    regenerate(field);
  });

  /* ================================
     LOAD TEXT
  ================================= */
  fetch("data/anim.txt")
    .then(res => res.text())
    .then(text => {

      GLOBAL_LINES = text.split("\n").filter(l => l.trim() !== "");

      const maxAllowed = Math.min(GLOBAL_LINES.length, MAX_CAP);

      const defaultDensity = Math.max(Math.floor(GLOBAL_LINES.length / 4), 50);

      SETTINGS.density = Math.min(defaultDensity, maxAllowed);

      densityInput.max = maxAllowed;
      densityInput.value = SETTINGS.density;

      regenerate(field);
    });
});

/* ================================
   REGENERATE FIELD
================================= */
function regenerate(field) {

  field.innerHTML = "";

  const max = Math.min(GLOBAL_LINES.length, MAX_CAP);
  const count = Math.min(SETTINGS.density, max);

  const pool = [...GLOBAL_LINES];

  for (let i = 0; i < count; i++) {

    if (pool.length === 0) break;

    const index = Math.floor(Math.random() * pool.length);
    const line = pool.splice(index, 1)[0];

    createTrack(field, line);
  }
}

/* ================================
   TRACK CREATION
================================= */
function createTrack(field, text) {

  const track = document.createElement("div");
  track.className = "track";

  const inner = document.createElement("div");
  inner.className = "track-inner";

  const chars = [];

  function makeChar(char) {
    const span = document.createElement("span");
    span.textContent = char;
    span.dataset.hue = Math.random() * 360;
    span.dataset.speed = 0.5 + Math.random() * 2;
    span.style.color = SETTINGS.textColor;
    chars.push(span);
    return span;
  }

  const spacer = document.createElement("span");
  spacer.textContent = " • ";

  text.split("").forEach(c => inner.appendChild(makeChar(c)));
  inner.appendChild(spacer);
  text.split("").forEach(c => inner.appendChild(makeChar(c)));

  track.appendChild(inner);
  field.appendChild(track);

  /* ================================
     POSITIONING
  ================================= */
  const bounds = field.getBoundingClientRect();

  const x = Math.random() * bounds.width;
  const y = Math.random() * bounds.height;

  const rotation = Math.random() * 360;
  const thickness = 14 + Math.random() * 18;

  track.style.position = "absolute";
  track.style.left = `${x}px`;
  track.style.top = `${y}px`;
  track.style.transform = `rotate(${rotation}deg)`;

  track.style.height = `${thickness}px`;
  track.style.width = `${420 + Math.random() * 300}px`;

  /* ================================
     INFINITE SCROLL
  ================================= */
  const speed = 12 + Math.random() * 25;
  inner.style.animationDuration = `${speed}s`;
  inner.style.animationIterationCount = "infinite";

  /* ================================
     RANDOMIZE COLORS
  ================================= */
  function animateColors(time) {

    if (!SETTINGS.driftEnabled) return;

    for (const el of chars) {

      const base = parseFloat(el.dataset.hue);
      const drift = parseFloat(el.dataset.speed);

      const hue = (base + time * 0.02 * drift) % 360;

      el.style.color = `hsl(${hue}, 100%, 65%)`;
    }

    requestAnimationFrame(animateColors);
  }

  if (SETTINGS.driftEnabled) {
    requestAnimationFrame(animateColors);
  }
}
