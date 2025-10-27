import { getConditionImagePath } from "./conditions";
import { getCityData } from "./fetch-logic";
import { renderCards } from "./main-menu-rendering";

const main = document.getElementById("main");
const cityCards = document.getElementById("city-cards");
const app = document.getElementById("app");
const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const backBtn = document.getElementById("back");
const favoriteBtn = document.getElementById("favorite");
const cityName = document.getElementById("city-name");
const currentTemp = document.getElementById("current-temp");
const currentStatus = document.getElementById("current-status");
const highestTemp = document.getElementById("highest");
const lowestTemp = document.getElementById("lowest");
const hourlyText = document.getElementById("hourly-text");
const hourlyPredictions = document.getElementById("hourly-predictions");
const dailyDiv = document.getElementById("daily");
const humidity = document.getElementById("humidity");
const feltTemp = document.getElementById("felt");
const sunriseHour = document.getElementById("sunrise");
const sunsetHour = document.getElementById("sunset");
const rainfall = document.getElementById("rainfall");
const uvIndex = document.getElementById("uv-index");

const favorites = JSON.parse(localStorage.getItem("favorites"));

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
    const weatherCode = cityData.current.condition.code;
    const isnight = cityData.current.is_day === 1 ? false : true;
    renderHourly(cityData);
    renderDaily(cityData);
    renderExtras(cityData);
    app.style.background = `linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(
      ${getConditionImagePath(weatherCode, isnight)}
    ) center no-repeat`;
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

    hourlyTemp.innerText = `${Math.floor(
      cityData.forecast.forecastday[currentDay].hour[initHourNumber].temp_c
    )}°`;
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

function renderDaily(cityData) {
  const date = new Date();
  let dayIndex = date.getDay();
  const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = dailyDiv.querySelectorAll("div");

  let counter = 0;
  days.forEach((node) => {
    const dayElements = node.querySelectorAll("p");
    const dayIcon = node.querySelector("img");
    if (counter === 0) {
      dayElements[0].innerText = "Today";
    } else {
      if (dayIndex > 6) {
        dayIndex = 0;
      }
      const dayToRender = daysArr[dayIndex];
      dayElements[0].innerText = dayToRender;
    }
    dayIcon.setAttribute(
      "src",
      cityData.forecast.forecastday[counter].day.condition.icon
    );
    dayElements[1].innerText = `H:${Math.floor(
      cityData.forecast.forecastday[counter].day.maxtemp_c
    )}°`;
    dayElements[2].innerText = `H:${Math.floor(
      cityData.forecast.forecastday[counter].day.mintemp_c
    )}°`;
    dayElements[3].innerText = `Wind: ${cityData.forecast.forecastday[counter].day.maxwind_kph} km/h`;

    dayIndex++;
    counter++;
  });
}

function renderExtras(cityData) {
  humidity.innerText = cityData.current.humidity + "%";
  feltTemp.innerText = cityData.current.feelslike_c + "°";
  sunriseHour.innerText = cityData.forecast.forecastday[0].astro.sunrise;
  sunsetHour.innerText = cityData.forecast.forecastday[0].astro.sunset;
  rainfall.innerText = cityData.current.precip_mm + "mm";
  uvIndex.innerText = cityData.current.uv;
}

function setFavorite() {
  const newFavoriteId = localStorage.getItem("idToRender");
  if (favorites === null || favorites.length < 1) {
    const favoritesUpdated = [newFavoriteId];
    localStorage.setItem("favorites", JSON.stringify(favoritesUpdated));
  } else {
    if (favorites.some((id) => id === newFavoriteId)) {
      return;
    }
    favorites.push(newFavoriteId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  favoriteBtn.classList.add("hidden");
}

if (window.location.pathname === "/weather-app/city.html") {
  const city = localStorage.getItem("cityName");
  const id = localStorage.getItem("idToRender");
  renderCity(id, city);
  if (favorites !== null && favorites.some((element) => element === id)) {
    favoriteBtn.classList.add("hidden");
  }
} else {
  if (favorites !== null && favorites.length > 0) {
    renderCards(favorites, cityCards);
  } else {
    loadingScreen.classList.add("hidden");
    main.classList.remove("hidden");
  }
}

backBtn?.addEventListener("click", () => {
  window.location.href = "./index.html";
});

favoriteBtn?.addEventListener("click", setFavorite);
