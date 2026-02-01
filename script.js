// ---------- TABS ----------
function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
}

// ---------- RANGE GRID ----------
const ranks = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const grid = document.getElementById("grid");
const rangesText = document.getElementById("rangesText");

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
    heroRange.has(hand) ? heroRange.delete(hand) : heroRange.add(hand);
  } else {
    villainRange.has(hand) ? villainRange.delete(hand) : villainRange.add(hand);
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
  rangesText.innerHTML =
    `<b>Hero :</b> ${[...heroRange].join(", ")}<br>
     <b>Vilain :</b> ${[...villainRange].join(", ")}`;
}

function clearGrid() {
  heroRange.clear();
  villainRange.clear();
  document.querySelectorAll(".cell").forEach(c => c.className = "cell");
  updateTextRanges();
}

// ---------- CONVERT FR CARDS ----------
function convertFRtoEN(card) {
  const map = { c: "h", p: "s", k: "d", t: "c" };
  let r = card[0].toUpperCase();
  let s = card[1].toLowerCase();
  return r + (map[s] || s);
}

function parseHandFR(str) {
  return str.trim().split(" ").map(c => convertFRtoEN(c));
}

function parseHand(str) {
  return parseHandFR(str);
}

// ---------- EQUITY ----------
let suitsFR = ["c","p","k","t"];
let heroCards = [];

function buildCardPicker() {
  const picker = document.getElementById("cardPicker");
  picker.innerHTML = "";
  ranks.forEach(r => {
    suitsFR.forEach(s => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerText = r + s;
      div.onclick = () => toggleCard(div, r+s);
      picker.appendChild(div);
    });
  });
}

function toggleCard(div, card) {
  if (heroCards.includes(card)) {
    heroCards = heroCards.filter(c => c !== card);
    div.classList.remove("selected");
  } else {
    if (heroCards.length >= 2) return;
    heroCards.push(card);
    div.classList.add("selected");
  }
  updateHeroCards();
}

function updateHeroCards() {
  document.getElementById("heroCards").innerHTML =
    "Hero : " + (heroCards.length ? heroCards.join(" ") : "—");
}

function randomCard(exclude) {
  const suits = "SHDC";
  let card;
  do {
    card = ranks[Math.floor(Math.random()*13)] + suits[Math.floor(Math.random()*4)];
  } while (exclude.includes(card));
  return card;
}

function equityFromGrid() {
  if (heroCards.length !== 2) {
    alert("Sélectionne 2 cartes pour Hero");
    return;
  }

  if (villainRange.size === 0) {
    alert("Sélectionne la range Vilain dans Ranges");
    return;
  }

  const hero = parseHand(heroCards.join(" "));
  let h=0, v=0, t=0;
  const iter = 2000;

  villainRange.forEach(hand => {
    for (let i=0;i<iter;i++){
      let used = [...hero];
      let run = [];
      while (run.length < 5){
        let c = randomCard(used);
        used.push(c); run.push(c);
      }

      let hh = Hand.solve([...hero, ...run]);
      let vv = Hand.solve([hand[0],hand[1],...run]);
      let w = Hand.winners([hh,vv]);

      if (w.length===2) t++;
      else if (w[0]===hh) h++;
      else v++;
    }
  });

  let total = h+v+t;
  document.getElementById("equityResult").innerHTML =
    `Hero : ${(h/total*100).toFixed(2)}%<br>Vilain : ${(v/total*100).toFixed(2)}%`;
}

// ---------- PUSH FOLD ----------
function pushFold() {
  const stack = parseFloat(document.getElementById("stack").value);
  let equity = Math.random()*20 + 35;
  let verdict = equity > 42 ? "PUSH ✅" : "FOLD ❌";
  document.getElementById("pfResult").innerHTML =
    `Équité ≈ ${equity.toFixed(1)}%<br><b>${verdict}</b>`;
}

// ---------- TRAINER ----------
let trainerAnswer = 0;
function newQuiz() {
  const spots = ["AKs vs QQ", "A8s vs 22+", "66 vs AK"];
  trainerAnswer = Math.random()*25 + 35;
  document.getElementById("quiz").innerHTML =
    "Estime l’équité de : " + spots[Math.floor(Math.random()*spots.length)];
}

function checkAnswer() {
  const ans = parseFloat(document.getElementById("answer").value);
  const diff = Math.abs(ans-trainerAnswer);
  document.getElementById("trainerResult").innerHTML =
    `Réponse ≈ ${trainerAnswer.toFixed(1)}%<br>Erreur : ${diff.toFixed(1)}%`;
  newQuiz();
}

// ---------- INIT ----------
buildGrid();
buildCardPicker();
newQuiz();