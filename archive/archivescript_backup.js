// Toggle month open
document.querySelectorAll('.month-label').forEach(label => {
  label.addEventListener('click', (e) => {
    const month = e.target.closest('.month');
    month.classList.toggle('active');
  });
});

// Toggle entry open
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('time')) {
    const item = e.target.closest('.timestamp');
    item.classList.toggle('active');
  }
});
fetch('linestimestamped.txt')
  .then(res => res.text())
  .then(data => {

    const lines = data.trim().split('\n');

    const entries = lines.map(line => {
      const [timestamp, text] = line.split('|');
      return { timestamp, text };
    });

    // SORT NEWEST FIRST
    entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // GROUP BY MONTH
    const grouped = {};

    entries.forEach(entry => {
      const month = entry.timestamp.slice(0, 7); // "2026-01"
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(entry);
    });

    // RENDER
    Object.keys(grouped).forEach(monthKey => {
      const monthEl = document.querySelector(`[data-month="${monthKey.split('-')[1]}"]`);
      if (!monthEl) return;

      const container = monthEl.querySelector('.month-content');

      const grid = document.createElement('div');
      grid.className = 'timestamp-grid';

      grouped[monthKey].forEach(entry => {
        const item = document.createElement('div');
        item.className = 'timestamp';

        const time = document.createElement('div');
        time.className = 'time';
        time.textContent = entry.timestamp.replace('T',' — ');

        const text = document.createElement('div');
        text.className = 'entry';
        text.textContent = entry.text;

        item.appendChild(time);
        item.appendChild(text);
        grid.appendChild(item);
      });

      container.appendChild(grid);
    });

  });