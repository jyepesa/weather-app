import { getCityData, showCities } from "./fetch-logic";

const main = document.getElementById("main");
const app = document.getElementById("app");
const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const testLink = document.getElementById("test-link");
const backBtn = document.getElementById("back");
const favoriteBtn = document.getElementById("favorite");
const cityName = document.getElementById("city-name");
const currentTemp = document.getElementById("current-temp");
const currentStatus = document.getElementById("current-status");
const highestTemp = document.getElementById("highest");
const lowestTemp = document.getElementById("lowest");
const hourlyText = document.getElementById("hourly-text");
const hourlyPredictions = document.getElementById("hourly-predictions");

async function renderCity(id, city) {
  loadingText.innerText = `Loading weather data for ${city}...`;
  try {
    const cityData = await getCityData(id);
    console.log(cityData);
    loadingScreen.classList.add("hidden");
    app.classList.remove("hidden");
    cityName.innerText = cityData.location.name;
    currentTemp.innerText = `${Math.floor(cityData.current.temp_c)}°`;
    currentStatus.innerText = cityData.current.condition.text;
    highestTemp.innerText = `H:${Math.floor(
      cityData.forecast.forecastday[0].day.maxtemp_c
    )}°`;
    lowestTemp.innerText = `L:${Math.floor(
      cityData.forecast.forecastday[0].day.mintemp_c
    )}°`;
    renderHourly(cityData);
  } catch (e) {
    console.log(e);
  }
}

function renderHourly(cityData) {
  hourlyText.innerText = `Today ${cityData.forecast.forecastday[0].day.condition.text.toLowerCase()}. Wind up to ${
    cityData.forecast.forecastday[0].day.maxwind_kph
  } km/h`;
  const currentHour = cityData.location.localtime;
  let initHourNumber = parseInt(
    currentHour.slice(currentHour.length - 5, currentHour.length - 3)
  );
  let currentDay = 0;
  hourlyPredictions.innerHTML = "";
  for (let i = 1; i <= 24; i++) {
    const hourlyPrediction = document.createElement("div");
    const hourlyTime = document.createElement("p");
    const hourlyIcon = document.createElement("img");
    const hourlyTemp = document.createElement("p");

    hourlyPrediction.classList.add("hourly__prediction");

    if (i === 1) {
      hourlyTime.innerText = "Now";
    } else {
      hourlyTime.innerText = initHourNumber;
    }
    hourlyTime.classList.add("hourly__time");

    hourlyIcon.setAttribute(
      "src",
      cityData.forecast.forecastday[currentDay].hour[initHourNumber].condition
        .icon
    );
    hourlyIcon.classList.add("hourly__icon");

    hourlyTemp.innerText = `${cityData.forecast.forecastday[currentDay].hour[initHourNumber].temp_c}°`;
    hourlyTemp.classList.add("hourly__temp");

    hourlyPrediction.appendChild(hourlyTime);
    hourlyPrediction.appendChild(hourlyIcon);
    hourlyPrediction.appendChild(hourlyTemp);

    hourlyPredictions.appendChild(hourlyPrediction);

    initHourNumber++;
    if (initHourNumber > 23) {
      currentDay++;
      initHourNumber = 0;
    }
  }
}

async function renderDaily(id) {
  const cityData = await getCityData(id);
  const date = new Date();
  const dayIndex = date.getDay();
  const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = daysArr[dayIndex];
}

if (window.location.pathname === "/city.html") {
  document.addEventListener("DOMContentLoaded", () =>
    renderCity(581346, "Gera")
  );
}

testLink?.addEventListener("click", () => {
  window.location.href = "../city.html";
});
