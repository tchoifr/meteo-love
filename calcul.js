// Ajout d'un écouteur d'événement pour s'assurer que le DOM est chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {
  // Récupération des éléments du DOM
  const jourSelect = document.getElementById("day");
  const moisSelect = document.getElementById("month");
  const anneeSelect = document.getElementById("year");
  const boutonCalculer = document.getElementById("calculate-button");
  const conteneurCarousel = document.getElementById("carousel-container");
  const chargeur = document.getElementById("loader");
  const inputLongueurCycle = document.getElementById("cycle-length");

  // Noms des mois en français
  const nomsMois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // Fonction pour remplir la liste des années
  function remplirAnnees() {
    const anneeActuelle = new Date().getFullYear();
    anneeSelect.innerHTML = "";
    for (let i = anneeActuelle; i <= anneeActuelle + 10; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      anneeSelect.appendChild(option);
    }
  }

  // Fonction pour mettre à jour les jours en fonction du mois et de l'année sélectionnés
  function mettreAJourJours() {
    const moisSelectionne = parseInt(moisSelect.value);
    const anneeSelectionnee = parseInt(anneeSelect.value);
    const joursDansMois = new Date(
      anneeSelectionnee,
      moisSelectionne + 1,
      0
    ).getDate();

    jourSelect.innerHTML = "";
    for (let jour = 1; jour <= joursDansMois; jour++) {
      const option = document.createElement("option");
      option.value = jour;
      option.textContent = jour;
      jourSelect.appendChild(option);
    }
  }

  // Mise à jour des jours lorsqu'un mois ou une année est sélectionné
  moisSelect.addEventListener("change", mettreAJourJours);
  anneeSelect.addEventListener("change", mettreAJourJours);

  // Fonction pour calculer les périodes à risque, modérées, et les jours de règles
  function calculerPeriode(dateDebut, longueurCycle) {
    const joursPeriode = new Set();
    const joursCyclePeriode = new Set(); // Ensemble pour les jours du cycle
    const joursRisque = new Set();
    const joursRisqueModere = new Set();
    const dateDernieresRegles = new Date(dateDebut);
    const dateOvulation = new Date(dateDernieresRegles);
    const debutPeriodeFertile = new Date(dateOvulation);
    const finPeriodeFertile = new Date(dateOvulation);
    const dateNidation = new Date(dateOvulation);

    dateOvulation.setDate(dateDernieresRegles.getDate() + longueurCycle - 14);
    debutPeriodeFertile.setDate(dateOvulation.getDate() - 6);
    finPeriodeFertile.setDate(dateOvulation.getDate() + 6);
    dateNidation.setDate(dateOvulation.getDate() + 5);
    // Ajouter uniquement le premier jour des règles
    joursPeriode.add(dateDernieresRegles.getDate());
    // Ajouter le jour du cycle correspondant
    joursCyclePeriode.add(dateDernieresRegles.getDate() + longueurCycle);

    // Ajouter les jours de fertilité
    for (
      let d = debutPeriodeFertile.getDate();
      d <= finPeriodeFertile.getDate();
      d++
    ) {
      if (d < dateOvulation.getDate()) {
        joursRisqueModere.add(d);
      } else {
        joursRisque.add(d);
      }
    }

    return {
      joursPeriode,
      joursCyclePeriode, // Retour du nouvel ensemble
      joursRisqueModere,
      joursRisque,
      dateOvulation,
      dateNidation,
    };
  }

  // Fonction pour créer les cartes de chaque jour du mois
  function creerCartes() {
    chargeur.style.display = "flex"; // Afficher le loader pendant le calcul
    conteneurCarousel.innerHTML = ""; // Réinitialiser le contenu du carousel

    setTimeout(() => {
      const jourSelectionne = parseInt(jourSelect.value);
      const moisSelectionne = parseInt(moisSelect.value);
      const anneeSelectionnee = parseInt(anneeSelect.value);
      const longueurCycle = parseInt(inputLongueurCycle.value);

      const dateDebut = new Date(
        anneeSelectionnee,
        moisSelectionne,
        jourSelectionne
      );

      const {
        joursPeriode,
        joursCyclePeriode,
        joursRisqueModere,
        joursRisque,
      } = calculerPeriode(dateDebut, longueurCycle);

      const joursDansMois = new Date(
        anneeSelectionnee,
        moisSelectionne + 1,
        0
      ).getDate();

      // Générer les cartes pour chaque jour du mois
      for (let jour = 1; jour <= joursDansMois; jour++) {
        const carte = document.createElement("div");
        carte.classList.add("card");

        const blocImg = document.createElement("div");
        const img = document.createElement("img");

        // Appliquer les classes selon la logique de risque
        if (joursPeriode.has(jour) || joursCyclePeriode.has(jour)) {
          carte.classList.add("card-period");
        } else if (joursRisque.has(jour)) {
          carte.classList.add("card-risk");
        } else if (joursRisqueModere.has(jour)) {
          carte.classList.add("card-moderate-risk");
        } else {
          carte.classList.add("card-safe");
        }

        blocImg.appendChild(img);
        carte.appendChild(blocImg);

        const blocTexte = document.createElement("div");
        blocTexte.classList.add("card-date-container");

        const texte = document.createElement("p");
        texte.classList.add("card-date");

        const mois = nomsMois[moisSelectionne];
        texte.textContent = `${jour} ${mois} ${anneeSelectionnee}`;

        blocTexte.appendChild(texte);

        carte.appendChild(blocTexte);
        conteneurCarousel.appendChild(carte);
      }

      chargeur.style.display = "none";
    }, 1500);
  }

  boutonCalculer.addEventListener("click", creerCartes);

  remplirAnnees();
  mettreAJourJours();
});
