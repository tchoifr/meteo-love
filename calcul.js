document.addEventListener("DOMContentLoaded", function () {
  const daySelect = document.getElementById("day");
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");
  const calculateButton = document.getElementById("calculate-button");
  const carouselContainer = document.getElementById("carousel-container");
  const loader = document.getElementById("loader");

  const monthNames = [
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

  function populateYears() {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = ""; // Réinitialiser les années
    for (let i = currentYear; i <= currentYear + 10; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }
  }

  function updateDays() {
    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearSelect.value);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    daySelect.innerHTML = ""; // Réinitialiser les jours

    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }

  monthSelect.addEventListener("change", updateDays);
  yearSelect.addEventListener("change", updateDays);

  function createCards() {
    loader.style.display = "flex"; // Afficher le loader
    carouselContainer.innerHTML = ""; // Réinitialiser les cartes

    // Démarrer un délai pour simuler le chargement
    setTimeout(() => {
      const selectedMonth = parseInt(monthSelect.value);
      const selectedYear = parseInt(yearSelect.value);
      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      ).getDate();

      const ovulationDay = daysInMonth - 14; // Calculer le jour d'ovulation
      const riskDays = new Set();

      // Période de fertilité : 5 jours avant l'ovulation et l'ovulation elle-même
      for (let i = 0; i <= 5; i++) {
        if (ovulationDay - i > 0) riskDays.add(ovulationDay - i);
      }

      // Jours de nidation : 6 jours après l'ovulation
      for (let i = 1; i <= 6; i++) {
        if (ovulationDay + i <= daysInMonth) riskDays.add(ovulationDay + i);
      }

      // Calcul des cartes
      for (let day = 1; day <= daysInMonth; day++) {
        const card = document.createElement("div");
        card.classList.add("card");

        const imgBloc = document.createElement("div");
        imgBloc.classList.add("card-image-container");

        const img = document.createElement("img");
        img.classList.add("card-image");

        let windSpeed, humidity;

        if (riskDays.has(day)) {
          card.classList.add("card-risk");
          img.src = "/assets/rain_small.webp";
          windSpeed = "90 km/h"; // Vent élevé pour jours à risque
          humidity = "0%"; // Humidité basse pour jours à risque
        } else {
          card.classList.add("card-safe");
          img.src = "/assets/sun_small.webp";
          windSpeed = "0 km/h"; // Pas de vent pour jours sans risque
          humidity = "90%"; // Humidité élevée pour jours sans risque
        }

        imgBloc.appendChild(img);
        card.appendChild(imgBloc);

        const h2Bloc = document.createElement("div");
        h2Bloc.classList.add("card-title-container");

        const h2 = document.createElement("h2");
        h2.classList.add("card-title");

        h2.textContent = riskDays.has(day) ? "-10°" : "35°"; // Température basée sur le risque

        h2Bloc.appendChild(h2);
        card.appendChild(h2Bloc);

        const pBloc = document.createElement("div");
        pBloc.classList.add("card-date-container");

        const p = document.createElement("p");
        p.classList.add("card-date");

        const month = monthNames[selectedMonth];
        p.textContent = `${day} ${month} ${selectedYear}`; // Afficher le jour, le mois et l'année

        const weatherInfo = document.createElement("div");
        weatherInfo.classList.add("weather-info");

        const windDiv = document.createElement("div");
        windDiv.classList.add("wind-info");

        const windIcon = document.createElement("img");
        windIcon.src = "/assets/vent.png"; // Chemin vers l'icône de vent
        windIcon.alt = "Vent";

        const windText = document.createElement("span");
        windText.textContent = `Vent: ${windSpeed}`;

        windDiv.appendChild(windIcon);
        windDiv.appendChild(windText);

        const humidityDiv = document.createElement("div");
        humidityDiv.classList.add("humidity-info");

        const humidityIcon = document.createElement("img");
        humidityIcon.src = "/assets/pluie.png"; // Chemin vers l'icône d'humidité
        humidityIcon.alt = "Humidité";

        const humidityText = document.createElement("span");
        humidityText.textContent = `Humidité: ${humidity}`;

        humidityDiv.appendChild(humidityIcon);
        humidityDiv.appendChild(humidityText);

        weatherInfo.appendChild(windDiv);
        weatherInfo.appendChild(humidityDiv);

        pBloc.appendChild(weatherInfo);
        pBloc.appendChild(p);

        card.appendChild(pBloc);
        carouselContainer.appendChild(card);
      }

      loader.style.display = "none"; // Masquer le loader après le chargement
    }, 1500); // Délai de 1,5 seconde pour simuler le chargement
  }

  calculateButton.addEventListener("click", createCards);

  populateYears();
  updateDays();
});
