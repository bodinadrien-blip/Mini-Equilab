function convertFRtoEN(card) {
  const map = { c: "h", p: "s", k: "d", t: "c" };
  let r = card[0].toUpperCase();
  let s = card[1].toLowerCase();
  return r + (map[s] || s);
}

function parseHandFR(str) {
  return str.trim().split(" ").map(c => convertFRtoEN(c));
}

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
}

// ===== RANGE ENGINE =====

const ranks = "23456789TJQKA";
const suits = "SHDC";

function parseHand(str) {
  return str.trim().split(" ");
}

function expandRange(range) {
  if (!range.includes("+")) return [range];

  let res = [];
  let base = range.replace("+", "");

  if (base.length === 2) {
    let start = ranks.indexOf(base[0]);
    for (let i = start; i < ranks.length; i++) {
      res.push(ranks[i] + ranks[i]);
    }
  }

  return res;
}

// ===== RANDOM CARD =====

function randomCard(exclude) {
  let card;
  do {
    card = ranks[Math.floor(Math.random()*13)] + suits[Math.floor(Math.random()*4)];
  } while (exclude.includes(card));
  return card;
}

// ===== EQUITY MAIN vs RANGE =====

function calculateRange() {
  const hero = parseHand(document.getElementById("hero").value.toUpperCase());
  const villainRange = document.getElementById("villain").value.split(",");
  const board = document.getElementById("board").value ? parseHand(document.getElementById("board").value.toUpperCase()) : [];

  let heroWins = 0, villainWins = 0, ties = 0;
  let total = 0;

  villainRange.forEach(r => {
    expandRange(r.trim()).forEach(hand => {
      simulate(hero, hand, board, 2000, res => {
        heroWins += res.h;
        villainWins += res.v;
        ties += res.t;
        total += res.total;
      });
    });
  });

  setTimeout(() => {
    document.getElementById("result").innerHTML =
      `Hero : ${(heroWins/total*100).toFixed(2)}%<br>
       Vilain : ${(villainWins/total*100).toFixed(2)}%`;
  }, 100);
}

function simulate(hero, villainHand, board, iter, cb) {
  let h=0,v=0,t=0;

  for(let i=0;i<iter;i++){
    let used=[...hero,...board];
    let v=[villainHand[0]+villainHand[0], villainHand[1]+villainHand[1]];
    let run=[...board];

    while(run.length<5){
      let c=randomCard(used);
      used.push(c); run.push(c);
    }

    let hh=Hand.solve([...hero,...run]);
    let vv=Hand.solve([...v,...run]);
    let w=Hand.winners([hh,vv]);

    if(w.length===2) t++;
    else if(w[0]===hh) h++;
    else v++;
  }

  cb({h,v,t,total:iter});
}

// ===== PUSH FOLD =====

function pushFold() {
  const stack = parseFloat(document.getElementById("stack").value);
  const equity = Math.random()*20+35;

  let verdict = equity > 40 ? "PUSH ✅" : "FOLD ❌";

  document.getElementById("pfResult").innerHTML =
    `Équité ≈ ${equity.toFixed(1)}%<br><b>${verdict}</b>`;
}

// ===== TRAINER =====

let trainerAnswer = 0;

function newQuiz() {
  const hands = ["AKs vs QQ", "A8s vs 22+", "66 vs AK"];
  trainerAnswer = Math.random()*25+35;

  document.getElementById("quiz").innerHTML =
    "Estime l’équité de : " + hands[Math.floor(Math.random()*hands.length)];
}

function checkAnswer() {
  const ans = parseFloat(document.getElementById("answer").value);
  const diff = Math.abs(ans - trainerAnswer);

  document.getElementById("trainerResult").innerHTML =
    `Réponse ≈ ${trainerAnswer.toFixed(1)}%<br>Erreur : ${diff.toFixed(1)}%`;

  newQuiz();
}

newQuiz();