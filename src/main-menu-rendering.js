import { getCityData, showCities } from "./fetch-logic";
import { getConditionImagePath } from "./conditions";

const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const main = document.getElementById("main");
const editBtn = document.getElementById("edit-button");
const searchBar = document.getElementById("city-search");
const message = document.getElementById("search-message");
const searchResults = document.getElementById("search-results");
const cityCards = document.getElementById("city-cards");

export async function renderCards(idArray, parentNode) {
  loadingText.innerText = "Loading main menu...";
  let counter = 0;
  try {
    for (let id of idArray) {
      const cityData = await getCityData(id);
      loadingScreen.classList.add("hidden");
      main.classList.remove("hidden");

      const cityDiv = document.createElement("div");
      const deleteCity = document.createElement("div");
      const cityCard = document.createElement("div");
      const upperDiv = document.createElement("div");
      const geoNames = document.createElement("div");
      const cityName = document.createElement("p");
      const country = document.createElement("p");
      const temperature = document.createElement("p");
      const lowerDiv = document.createElement("div");
      const weather = document.createElement("p");
      const extremes = document.createElement("div");
      const highest = document.createElement("span");
      const lowest = document.createElement("span");

      cityDiv.classList.add("city-card");
      cityDiv.setAttribute("data-id", id);

      deleteCity.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 city-card--delete hidden">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;
      deleteCity.addEventListener("click", () => removeCard(id));

      cityCard.classList.add("city-card__card");
      cityCard.addEventListener("click", () => {
        localStorage.setItem("idToRender", id);
        localStorage.setItem("cityName", cityData.location.name);
        window.location.href = "./city.html";
      });

      upperDiv.classList.add("city-card__upper");
      geoNames.classList.add("city-card__names");
      cityName.classList.add("city-card__city");
      temperature.classList.add("city-card__temperature");
      lowerDiv.classList.add("city-card__lower");
      extremes.classList.add("city-card__extremes");

      parentNode.append(cityDiv);
      cityDiv.append(deleteCity, cityCard);
      cityCard.append(upperDiv, lowerDiv);
      upperDiv.append(geoNames, temperature);
      geoNames.append(cityName, country);
      lowerDiv.append(weather, extremes);
      extremes.append(highest, lowest);

      cityName.innerText = cityData.location.name;
      country.innerText = cityData.location.country;
      temperature.innerText = `${Math.floor(cityData.current.temp_c)}°`;
      weather.innerText = cityData.current.condition.text;
      highest.innerText = `H:${Math.floor(
        cityData.forecast.forecastday[0].day.maxtemp_c
      )}°`;
      lowest.innerText = `L:${Math.floor(
        cityData.forecast.forecastday[0].day.mintemp_c
      )}°`;

      const weatherCode = cityData.current.condition.code;
      const isnight = cityData.current.is_day === 1 ? false : true;
      cityCard.style.background = `linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(
      ${getConditionImagePath(weatherCode, isnight)}
    ) center no-repeat`;

      counter++;
    }
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

function showDeleteBtn() {
  const delBtns = cityCards.querySelectorAll(".city-card--delete");
  delBtns.forEach((button) => {
    button.classList.toggle("hidden");
  });
  if (editBtn.innerText === "Edit") {
    editBtn.innerText = "Done";
  } else {
    editBtn.innerText = "Edit";
  }
}

function removeCard(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites === null || favorites.length < 1) {
    return;
  } else {
    const index = favorites.findIndex((element) => element === id);
    if (index === -1) {
      return;
    } else {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
  const cards = cityCards.querySelectorAll(".city-card");
  cards.forEach((card) => {
    const dataId = card.getAttribute("data-id");
    console.log(dataId, id);
    if (dataId === id) {
      cityCards.removeChild(card);
    }
  });
}

async function renderSearchResults(query) {
  searchResults.innerHTML = "";
  if (query.length < 2) {
    return;
  }
  message.classList.remove("hidden");
  const citiesArr = await showCities(query);
  if (typeof citiesArr !== "object") {
    message.innerText = citiesArr;
    return;
  }
  message.classList.add("hidden");
  for (let city of citiesArr) {
    const result = document.createElement("li");
    const cityName = document.createElement("p");
    const country = document.createElement("p");

    result.classList.add("main__search-element");
    result.addEventListener("click", () => {
      localStorage.setItem("idToRender", city.id);
      localStorage.setItem("cityName", city.name);
      window.location.href = "./city.html";
    });

    cityName.classList.add("main__search-city");
    cityName.innerText = city.name;

    country.innerText = city.country;

    result.append(cityName, country);
    searchResults.appendChild(result);
  }
}

if (window.location.pathname !== "/weather-app/city.html") {
  editBtn.addEventListener("click", showDeleteBtn);

  document.addEventListener("click", () => {
    if (!message.classList.contains("hidden")) {
      message.classList.add("hidden");
    }
    searchResults.innerHTML = "";
  });

  let timeoutId;
  searchBar.addEventListener("input", () => {
    message.innerText = "Loading results...";
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      renderSearchResults(searchBar.value);
    }, 800);
  });

  searchBar.addEventListener("click", () => {
    if (searchBar.value.length > 1) {
      renderSearchResults(searchBar.value);
    } else {
      return;
    }
  });
}
