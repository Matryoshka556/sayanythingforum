const rowImages = {
  row1: ["img/a.png", "img/b.png", "img/c.png"],
  row2: ["img/d.png", "img/e.png", "img/f.png"],
  row3: ["img/g.png", "img/h.png", "img/i.png"]
};
rows.forEach((rowId) => {
  const row = document.getElementById(rowId);
  const images = rowImages[rowId];

  // Shuffle images
  const shuffled = [...images].sort(() => Math.random() - 0.5);

  const track = document.createElement("div");
  track.className = "ticker-track";

  // duplicate sequence for seamless loop
  const sequence = [...shuffled, ...shuffled];

  sequence.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "ticker-image";
    track.appendChild(img);
  });

  // Random duration
  const duration = 30 + Math.random() * 10;
  track.style.animationDuration = duration + "s";

  // Random direction
  const direction = Math.random() < 0.5 ? "normal" : "reverse";
  track.style.animationName =
    direction === "normal" ? "scrollImages" : "scrollImagesReverse";

  row.appendChild(track);
});