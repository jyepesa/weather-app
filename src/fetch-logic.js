const apiKey = "3ebd67a1b9214788ade121844252310";

export async function showCities(query) {
  const url = "https://api.weatherapi.com/v1/search.json";
  try {
    const response = await fetch(`${url}?key=${apiKey}&q=${query}`);
    if (!response.ok) {
      throw new Error(
        "Unable to get requested data... Your search isn't looking too sunny."
      );
    }
    const citiesArr = await response.json();
    if (citiesArr.length < 1) {
      return "No results found that match your search criteria";
    }
    return citiesArr;
  } catch (e) {
    alert(e);
  }
}

export async function getCityData(id) {
  const url = "https://api.weatherapi.com/v1/forecast.json";
  try {
    const response = await fetch(`${url}?key=${apiKey}&days=3&q=id:${id}`);
    if (!response.ok) {
      throw new Error("Rainy forecast... The app is on a break");
    }
    const cityData = await response.json();
    return cityData;
  } catch (e) {
    alert(e);
  }
}
