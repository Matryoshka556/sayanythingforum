// Example text lines
const rowLines = {
    row1: ["ace", "Your response can be displayed here", "Your response can be displayed here, Your response can be displayed here"],
    row2: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row3: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row4: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row5: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row6: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row7: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row8: ["Your response can be displayed here", "Your response can be displayed here", "Y our response can be displayed here"],
    row9: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row10: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row11: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row12: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row13: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
    row14: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
  row15: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"],
  row16: ["Your response can be displayed here", "Your response can be displayed here", "Your response can be displayed here"]
};

// Row IDs
const rows = [
  'row1', 'row2', 'row3', 'row4',
  'row5', 'row6', 'row7', 'row8',
  'row9', 'row10', 'row11', 'row12',
  'row13', 'row14', 'row15', 'row16'
];

rows.forEach((rowId) => {
  const row = document.getElementById(rowId);
  const lines = rowLines[rowId]; // get the specific array for this row

  // Shuffle lines
  const shuffled = [...lines].sort(() => Math.random() - 0.5);
  const content = shuffled.join(' • ');

  // Create ticker track
  const track = document.createElement('div');
  track.className = 'ticker-track';
  track.innerHTML = content + ' • ' + content;

  // Random duration per row
  const duration = 30 + Math.random() * 10; // 10-20s
  track.style.animationDuration = duration + 's';

  // Randomize direction
  const direction = Math.random() < 0.5 ? 'normal' : 'reverse';
  track.style.animationName = direction === 'normal' ? 'scrollText' : 'scrollTextReverse';

  row.appendChild(track);
});