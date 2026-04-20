document.addEventListener("DOMContentLoaded", () => {


  fetch("data/atext_4_17.txt")
    .then(response => response.text())
    .then(text => {

      const lines = text.split("\n").filter(line => line.trim() !== "");

      const rows = [
        'row1','row2','row3','row4',
        'row5','row6','row7','row8',
        'row9','row10','row11','row12',
        'row13','row14','row15','row16'
      ];

      rows.forEach((rowId) => {
        const row = document.getElementById(rowId);
        if (!row) return;


        const shuffled = [...lines].sort(() => Math.random() - 0.5);
        const content = shuffled.join(' • ');

        const track = document.createElement('div');
        track.className = 'ticker-track';
        track.innerHTML = content + ' • ' + content;


        const duration = 1500 + Math.random() * 10;
        track.style.animationDuration = duration + 's';


        const direction = Math.random() < 0.5 ? 'normal' : 'reverse';
        track.style.animationName =
          direction === 'normal' ? 'scrollText' : 'scrollTextReverse';

        const delay = Math.random() * 5;
        track.style.animationDelay = delay + 's';

        row.appendChild(track);
      });

    });


const form = document.getElementById("response-form");
const status = document.getElementById("status-message");
const iframe = document.querySelector('iframe[name="hidden_iframe"]');

if (form && iframe) {

  form.addEventListener("submit", () => {

    if (status) {
      status.textContent = "Submitting...";
      status.style.color = "black";
    }

  });

  iframe.onload = () => {


    if (status) {
      status.textContent = "Submission successful ✔";
      status.style.color = "green";
    }

    form.reset();
  };
}

});
