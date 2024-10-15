document.getElementById("risk-logo").addEventListener("click", function () {
  // Faire pivoter la carte
  document.querySelector(".flip-card").classList.toggle("rotated");

  // Masquer l'image 1 et afficher l'image 2
  this.style.display = "none"; // Cela cache le premier logo
  document.getElementById("risk-logo2").style.display = "block"; // Affiche le second logo
});

document.getElementById("risk-logo2").addEventListener("click", function () {
  // Faire pivoter la carte
  document.querySelector(".flip-card").classList.toggle("rotated");

  // Masquer l'image 2 et afficher l'image 1
  this.style.display = "none"; // Cela cache le second logo
  document.getElementById("risk-logo").style.display = "block"; // Affiche le premier logo
});
