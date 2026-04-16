(() => {
  const rowImages = {
    "image-row1": ["img/a.jpg","img/b.jpg","img/c.jpg"],
    "image-row2": ["img/d.jpg","img/e.jpg","img/f.jpg"],
    "image-row3": ["img/g.jpg","img/h.jpg","img/i.jpg"],
    "image-row4": ["img/j.jpg","img/k.jpg","img/l.jpg"],
    "image-row5": ["img/m.jpg","img/n.jpg","img/o.jpg"],
    "image-row6": ["img/p.jpg","img/q.jpg","img/r.jpg"]
    // ...add more rows as needed
  };

  Object.keys(rowImages).forEach(rowId => {
    const row = document.getElementById(rowId);
    const track = document.createElement('div');
    track.className = 'ticker-track-image';
    const sequence = [...rowImages[rowId], ...rowImages[rowId]]; // duplicate for seamless loop
    sequence.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'ticker-image';
      track.appendChild(img);
    });
    track.style.animationDuration = (25 + Math.random()*10)+'s';
    const direction = Math.random() < 0.5 ? 'normal' : 'reverse';
    track.style.animationName = direction === 'normal' ? 'scrollImages' : 'scrollImagesReverse';
    row.appendChild(track);
  });
})();