function parseHand(str) {
  return str.trim().split(" ").map(c => c.toUpperCase());
}

function randomCard(exclude) {
  const ranks = "23456789TJQKA";
  const suits = "SHDC";
  let card;
  do {
    card = ranks[Math.floor(Math.random() * 13)] +
           suits[Math.floor(Math.random() * 4)];
  } while (exclude.includes(card));
  return card;
}

function calculate() {
  const heroStr = document.getElementById("hero").value;
  const villainStr = document.getElementById("villain").value;
  const boardStr = document.getElementById("board").value;

  if (!heroStr || !villainStr) {
    alert("Entre une main Hero et Vilain");
    return;
  }

  const hero = parseHand(heroStr);
  const villain = parseHand(villainStr);
  const board = boardStr ? parseHand(boardStr) : [];

  let heroWins = 0, villainWins = 0, ties = 0;
  const iterations = 12000;

  for (let i = 0; i < iterations; i++) {
    let used = [...hero, ...villain, ...board];
    let runout = [...board];

    while (runout.length < 5) {
      let card = randomCard(used);
      runout.push(card);
      used.push(card);
    }

    const heroHand = Hand.solve([...hero, ...runout]);
    const villainHand = Hand.solve([...villain, ...runout]);

    const winners = Hand.winners([heroHand, villainHand]);

    if (winners.length === 2) ties++;
    else if (winners[0] === heroHand) heroWins++;
    else villainWins++;
  }

  const total = heroWins + villainWins + ties;

  document.getElementById("result").innerHTML = `
    Hero : ${(heroWins / total * 100).toFixed(2)}%<br>
    Vilain : ${(villainWins / total * 100).toFixed(2)}%<br>
    Split : ${(ties / total * 100).toFixed(2)}%
  `;
}
