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

      const {
        periodDays,
        moderateRiskDays,
        riskDays,
        ovulationDate,
        nidationDate,
      } = calculatePeriod(startDate, cycleLength);

      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      ).getDate();

      // Générer les cartes
      for (let day = 1; day <= daysInMonth; day++) {
        const card = document.createElement("div");
        card.classList.add("card");

        const imgBloc = document.createElement("div");

        const img = document.createElement("img");

        let windSpeed, humidity;

        if (periodDays.has(day)) {
          card.classList.add("card-period");

          windSpeed = "20 km/h";
          humidity = "50%";
        } else if (riskDays.has(day)) {
          card.classList.add("card-risk");
          windSpeed = "90 km/h";
          humidity = "0%";
        } else if (moderateRiskDays.has(day)) {
          card.classList.add("card-moderate-risk");
          windSpeed = "50 km/h";
          humidity = "30%";
        } else {
          card.classList.add("card-safe");
          windSpeed = "0 km/h";
          humidity = "90%";
        }

        imgBloc.appendChild(img);
        card.appendChild(imgBloc);

        const h2Bloc = document.createElement("div");
        h2Bloc.classList.add("card-title-container");

        const h2 = document.createElement("h2");
        h2.classList.add("card-title");

        h2.textContent = riskDays.has(day) ? "-10°" : "35°";

        h2Bloc.appendChild(h2);
        card.appendChild(h2Bloc);

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

        const windIcon = document.createElement("img");
        windIcon.src = "/assets/vent.png";
        windIcon.alt = "Vent";

        const windText = document.createElement("span");
        windText.textContent = `Vent: ${windSpeed}`;

        windDiv.appendChild(windIcon);
        windDiv.appendChild(windText);

        const humidityDiv = document.createElement("div");
        humidityDiv.classList.add("humidity-info");

        const humidityIcon = document.createElement("img");
        humidityIcon.src = "/assets/pluie.png";
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

      loader.style.display = "none";
    }, 1500);
  }

  calculateButton.addEventListener("click", createCards);

  populateYears();
  updateDays();
});
