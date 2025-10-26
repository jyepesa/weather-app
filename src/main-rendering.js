import { getCityData } from "./fetch-logic";
import { getConditionImagePath } from "./conditions";

const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const main = document.getElementById("main");

export async function renderCards(idArray, parentNode) {
  loadingText.innerText = "Loading main menu...";
  try {
    idArray.forEach(async (id, index) => {
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
      cityDiv.setAttribute("data-id", idArray[index]);

      deleteCity.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;
      cityCard.classList.add("city-card__card");
      cityCard.addEventListener("click", () => {
        localStorage.setItem("idToRender", idArray[index]);
        localStorage.setItem("cityName", cityData.location.name);
        window.location.href = "../city.html";
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
    });
  } catch (e) {
    console.log(e);
    alert(e);
  }
}
