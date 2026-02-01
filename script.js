const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const grid = document.getElementById("grid");
const rangesDiv = document.getElementById("ranges");

let heroRange = new Set();
let villainRange = new Set();
let mode = "hero";

function setMode(m) {
  mode = m;
  document.getElementById("heroBtn").classList.remove("active");
  document.getElementById("villainBtn").classList.remove("active");

  if (m === "hero") document.getElementById("heroBtn").classList.add("active");
  else document.getElementById("villainBtn").classList.add("active");
}

function buildGrid() {
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      let hand;
      if (r === c) hand = ranks[r] + ranks[c];
      else if (r < c) hand = ranks[r] + ranks[c] + "s";
      else hand = ranks[c] + ranks[r] + "o";

      const div = document.createElement("div");
      div.className = "cell";
      div.innerText = hand;
      div.dataset.hand = hand;
      div.onclick = () => toggleHand(div, hand);

      grid.appendChild(div);
    }
  }
}

function toggleHand(div, hand) {
  if (mode === "hero") {
    if (heroRange.has(hand)) heroRange.delete(hand);
    else heroRange.add(hand);
  }

  if (mode === "villain") {
    if (villainRange.has(hand)) villainRange.delete(hand);
    else villainRange.add(hand);
  }

  updateCell(div, hand);
  updateTextRanges();
}

function updateCell(div, hand) {
  const h = heroRange.has(hand);
  const v = villainRange.has(hand);

  if (h && v) div.className = "cell both";
  else if (h) div.className = "cell hero";
  else if (v) div.className = "cell villain";
  else div.className = "cell";
}

function updateTextRanges() {
  rangesDiv.innerHTML =
    `<b>Hero :</b> ${[...heroRange].join(", ")}<br>
     <b>Vilain :</b> ${[...villainRange].join(", ")}`;
}

function clearGrid() {
  heroRange.clear();
  villainRange.clear();
  document.querySelectorAll(".cell").forEach(c => c.className = "cell");
  updateTextRanges();
}

buildGrid();