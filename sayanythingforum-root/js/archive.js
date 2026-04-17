document.addEventListener('DOMContentLoaded', () => {

  let grouped = {};
  let entries = [];

  const lookupInput = document.getElementById('iso-lookup');
  const lookupResult = document.getElementById('lookup-result');
  const dropdown = document.getElementById('lookup-dropdown');

  // ================= HELPERS =================

  function displayFormat(timestamp) {
    return (timestamp || '').replace('T', '-');
  }

  function getTwoWordSnippet(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 10)
      .join(' ');
  }

  function safeLower(v) {
    return (v || '').toLowerCase();
  }

  // ================= PLACEHOLDER =================

  if (lookupInput) {
    const originalPlaceholder = lookupInput.placeholder;

    lookupInput.addEventListener('focus', () => {
      lookupInput.placeholder = '';
    });

    lookupInput.addEventListener('blur', () => {
      if (!lookupInput.value) {
        lookupInput.placeholder = originalPlaceholder;
      }
    });
  }

  // ================= CLICK SYSTEM =================

  document.addEventListener('click', (e) => {

    if (e.target.classList.contains('month-label')) {
      const row = e.target.closest('.month-row');
      row.classList.toggle('active');

      const month = e.target.closest('.month').dataset.month;
      renderMonth(row, month);
    }

    if (e.target.classList.contains('time')) {
      e.target.closest('.timestamp').classList.toggle('active');
    }

    if (!e.target.closest('#lookup-container')) {
      if (dropdown) dropdown.innerHTML = '';
    }
  });

  // ================= INPUT =================

  if (lookupInput) {
    lookupInput.addEventListener('input', (e) => {
      const raw = e.target.value || '';
      const query = raw.trim();

      updateDropdown(query);
      runCommand(query);
    });
  }

  // ================= COMMAND ENGINE =================

  function runCommand(input) {
    if (!input) return;

    const q = safeLower(input);

    const exact = entries.find(e => e.timestamp === input);
    if (exact) return focusEntry(exact);

    return filterPartial(q);
  }

  function filterPartial(query) {

    const q = safeLower(query);

    const matches = entries.filter(e =>
      safeLower(e.timestamp).includes(q) ||
      safeLower(e.text).includes(q)
    );

    if (!matches.length) {
      lookupResult.textContent = 'No match';
      clearHighlights();
      return;
    }

    lookupResult.textContent = `${matches.length} result(s)`;
    highlightMatches(matches);
  }

  // ================= FOCUS =================

  function focusEntry(entry) {
    if (!entry) return;

    lookupResult.textContent = 'Match found';

    clearHighlights();
    highlightMatches([entry]);

    const month = (entry.timestamp || '').slice(5, 7);

    const monthRow = document.querySelector(
      `.month[data-month="${month}"]`
    )?.closest('.month-row');

    if (!monthRow) return;

    if (!monthRow.classList.contains('active')) {
      monthRow.classList.add('active');
      renderMonth(monthRow, month);
    }

    setTimeout(() => {

      const target = document.querySelector(
        `.timestamp[data-timestamp="${entry.timestamp}"]`
      );

      if (!target) return;

      document.querySelectorAll('.timestamp.active')
        .forEach(el => el.classList.remove('active'));

      target.classList.add('active');

      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      });

    }, 0);
  }

  // ================= HIGHLIGHT =================

  function highlightMatches(matches) {
    clearHighlights();

    const set = new Set(matches.map(m => m.timestamp));

    document.querySelectorAll('.timestamp').forEach(cell => {
      if (set.has(cell.dataset.timestamp)) {
        cell.classList.add('highlight');
      }
    });
  }

  function clearHighlights() {
    document.querySelectorAll('.timestamp')
      .forEach(c => c.classList.remove('highlight'));
  }

  // ================= DROPDOWN (SAFE + KEYWORD + PREVIEW) =================

  function updateDropdown(query) {

    if (!dropdown) return;
    if (!query) {
      dropdown.innerHTML = '';
      return;
    }

    const q = safeLower(query);

    const matches = entries
      .filter(e =>
        safeLower(e.timestamp).includes(q) ||
        safeLower(e.text).includes(q)
      )
      .slice(0, 10);

    dropdown.innerHTML = '';

    matches.forEach(entry => {

      const item = document.createElement('div');
      item.className = 'dropdown-item';

      const top = document.createElement('div');
      top.textContent = displayFormat(entry.timestamp);

      const bottom = document.createElement('div');
      bottom.textContent = getTwoWordSnippet(entry.text);
      bottom.style.fontSize = '0.8rem';
      bottom.style.opacity = '0.7';

      item.appendChild(top);
      item.appendChild(bottom);

      item.addEventListener('click', () => {
        lookupInput.value = displayFormat(entry.timestamp);
        dropdown.innerHTML = '';
        runCommand(entry.timestamp);
      });

      dropdown.appendChild(item);
    });
  }

  // ================= LOAD DATA (FIXED SAFE PARSE) =================

  fetch('data/timestampedtext_17_3_26.txt')
    .then(res => res.text())
    .then(data => {

      const lines = data.trim().split('\n');

      entries = lines
        .map(line => {
          const parts = line.split('|');

          return {
            timestamp: (parts[0] || '').trim(),
            text: (parts[1] || '').trim() || ''
          };
        })
        .filter(e => e.timestamp);

      entries.sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      entries.forEach(entry => {
        const month = (entry.timestamp || '').slice(5, 7);
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(entry);
      });

    });

  // ================= RENDER MONTH =================

  function renderMonth(row, month) {

    const container = row.querySelector('.row-content');
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'timestamp-grid';

    (grouped[month] || []).forEach(entry => {

      const item = document.createElement('div');
      item.className = 'timestamp';
      item.dataset.timestamp = entry.timestamp;

      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = displayFormat(entry.timestamp);

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