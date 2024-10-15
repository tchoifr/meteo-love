document.addEventListener("DOMContentLoaded", function () {
  const daySelect = document.getElementById("day");
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");
  const calculateButton = document.getElementById("calculate-button");
  const carouselContainer = document.getElementById("carousel-container");
  const loader = document.getElementById("loader");
  const cycleLengthInput = document.getElementById("cycle-length");

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
    yearSelect.innerHTML = "";
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

    daySelect.innerHTML = "";
    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }

  monthSelect.addEventListener("change", updateDays);
  yearSelect.addEventListener("change", updateDays);

  function calculatePeriod(startDate, cycleLength) {
    const periodDays = new Set();
    const periodDaysCycle = new Set(); // Nouveau Set pour les jours de cycle
    const riskDays = new Set();
    const moderateRiskDays = new Set();

    const lastPeriodDate = new Date(startDate);
    const ovulationDate = new Date(lastPeriodDate);
    ovulationDate.setDate(lastPeriodDate.getDate() + cycleLength - 14);

    const startFertilePeriod = new Date(ovulationDate);
    startFertilePeriod.setDate(ovulationDate.getDate() - 4);

    const endFertilePeriod = new Date(ovulationDate);
    endFertilePeriod.setDate(ovulationDate.getDate() + 4);

    const nidationDate = new Date(ovulationDate);
    nidationDate.setDate(ovulationDate.getDate() + 5);

    // Ajouter uniquement le premier jour de la période des règles
    periodDays.add(lastPeriodDate.getDate());
    // Ajouter le jour du cycle correspondant
    periodDaysCycle.add((lastPeriodDate.getDate() + cycleLength) % 30); // Par exemple, 30 jours dans un mois

    // Ajouter les jours de fertilité
    for (
      let d = startFertilePeriod.getDate();
      d <= endFertilePeriod.getDate();
      d++
    ) {
      if (d < ovulationDate.getDate()) {
        moderateRiskDays.add(d);
      } else {
        riskDays.add(d);
      }
    }

    return {
      periodDays,
      periodDaysCycle, // Retourner le nouvel ensemble
      moderateRiskDays,
      riskDays,
      ovulationDate,
      nidationDate,
    };
  }

  function createCards() {
    loader.style.display = "flex";
    carouselContainer.innerHTML = "";

    setTimeout(() => {
      const selectedDay = parseInt(daySelect.value);
      const selectedMonth = parseInt(monthSelect.value);
      const selectedYear = parseInt(yearSelect.value);
      const cycleLength = parseInt(cycleLengthInput.value);

      const startDate = new Date(selectedYear, selectedMonth, selectedDay);

      const { periodDays, periodDaysCycle, moderateRiskDays, riskDays } =
        calculatePeriod(startDate, cycleLength);

      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      ).getDate();

      // Générer les cartes pour chaque jour du mois
      for (let day = 1; day <= daysInMonth; day++) {
        const card = document.createElement("div");
        card.classList.add("card");

        const imgBloc = document.createElement("div");
        const img = document.createElement("img");

        let humidity;

        // Appliquer les classes selon la logique donnée
        if (periodDays.has(day) || periodDaysCycle.has(day)) {
          card.classList.add("card-period");
        } else if (riskDays.has(day)) {
          card.classList.add("card-risk");
        } else if (moderateRiskDays.has(day)) {
          card.classList.add("card-moderate-risk");
        } else {
          card.classList.add("card-safe");
        }

        imgBloc.appendChild(img);
        card.appendChild(imgBloc);

        const pBloc = document.createElement("div");
        pBloc.classList.add("card-date-container");

        const p = document.createElement("p");
        p.classList.add("card-date");

        const month = monthNames[selectedMonth];
        p.textContent = `${day} ${month} ${selectedYear}`;

        const weatherInfo = document.createElement("div");
        weatherInfo.classList.add("weather-info");

        const windDiv = document.createElement("div");
        windDiv.classList.add("wind-info");

        const humidityText = document.createElement("span");
        humidityText.textContent = `Humidité: ${humidity}`;

        pBloc.appendChild(weatherInfo);
        pBloc.appendChild(p);

        card.appendChild(pBloc);
        carouselContainer.appendChild(card);
      }

      loader.style.display = "none";
    }, 1500);
  }

  calculateButton.addEventListener("click", createCards);

  populateYears();
  updateDays();
});
