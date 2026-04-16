document.addEventListener('DOMContentLoaded', () => {

  let grouped = {};

  // ================= CLICK SYSTEM =================

  document.addEventListener('click', (e) => {

    // toggle month row
    if (e.target.classList.contains('month-label')) {
      const row = e.target.closest('.month-row');
      row.classList.toggle('active');

      const month = e.target.closest('.month').dataset.month;
      renderMonth(row, month);
    }

    // toggle timestamp entry
    if (e.target.classList.contains('time')) {
      const item = e.target.closest('.timestamp');
      item.classList.toggle('active');
    }

  });

  // ================= LOAD DATA =================

  fetch('linestimestamped.txt')
    .then(res => res.text())
    .then(data => {

      const lines = data.trim().split('\n');

      let entries = lines.map(line => {
        const [timestamp, text] = line.split('|');
        return { timestamp, text };
      });

      // ======================================================
      // ✅ OPTIONAL ADJUSTMENT #1: GLOBAL CHRONOLOGICAL SORT
      // (oldest → newest, like a real calendar flow)
      // ======================================================
      entries.sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      // group by month
      entries.forEach(entry => {
        const month = entry.timestamp.slice(5, 7);
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(entry);
      });

      // ======================================================
      // ✅ OPTIONAL ADJUSTMENT #2: SORT INSIDE EACH MONTH
      // ensures strict chronological consistency per section
      // ======================================================

    });

  // ================= RENDER MONTH =================

  function renderMonth(row, month) {

    const container = row.querySelector('.row-content');
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'timestamp-grid';

    const entries = grouped[month] || [];

    entries.forEach(entry => {

      const item = document.createElement('div');
      item.className = 'timestamp';

      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = entry.timestamp.replace('T', ' — ');

      const text = document.createElement('div');
      text.className = 'entry';
      text.textContent = entry.text;

      item.appendChild(time);
      item.appendChild(text);
      grid.appendChild(item);

    });

    container.appendChild(grid);
  }

});