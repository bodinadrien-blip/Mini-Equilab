<script>
function calculate() {
  const hero = document.getElementById("hero").value;
  const villain = document.getElementById("villain").value;

  if (!hero || !villain) return;

  // Simulation simple (placeholder logique)
  const equityHero = (Math.random() * 20 + 40).toFixed(1);
  const equityVillain = (100 - equityHero).toFixed(1);

  document.getElementById("result").innerHTML = 
    `Hero : ${equityHero}%<br>Vilain : ${equityVillain}%`;
}
</script>
