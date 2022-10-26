function showDate() {
  let date = new Date();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Sunday",
  ];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let currentDay = date.getDate();
  let year = date.getFullYear();
  let actualDate = document.querySelector("#date-today");
  actualDate.innerHTML = `${day}, ${currentDay}. ${month} ${year}`;
  let actualTime = document.querySelector("#time-today");
  actualTime.innerHTML = `${hours}:${minutes}`;
}
showDate();

function getForecastDay(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let day = forecastDate.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let dailyForecast = response.data.daily;

  let forcastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="forecast-date">${getForecastDay(
                  forecastDay.time
                )}</div>
                <img
                  src="${forecastDay.condition.icon_url}"
                  alt=""
                  class="forecast-icon"
                  width="50px"
                />
                <div class="forecast-temp">
                  <span class="forecast-min">${Math.round(
                    forecastDay.temperature.minimum
                  )}</span> |
                  <span class="forecast-max">${Math.round(
                    forecastDay.temperature.maximum
                  )}</span>
                </div>
              </div>   
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forcastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  apiKey = "02060cacd430ctof7d20b656741fc18d";
  apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  console.log(response.data);
  let temperature = document.querySelector(".actualTemp");
  let currentCity = document.querySelector("#city");
  let feelsLike = document.querySelector("#feels-like-temp");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let icon = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.temperature.current;

  temperature.innerHTML = Math.round(response.data.temperature.current);
  currentCity.innerHTML = response.data.city;
  feelsLike.innerHTML = Math.round(response.data.temperature.feels_like);
  description.innerHTML = response.data.condition.description;
  humidity.innerHTML = response.data.temperature.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "02060cacd430ctof7d20b656741fc18d";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#input-city");
  console.log(cityElement.value);
  search(cityElement.value);
}

function displayFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  let temperature = document.querySelector(".actualTemp");
  temperature.innerHTML = Math.round(fahrenheitTemp);
}
function displayCelsius(event) {
  event.preventDefault();
  let celsiusTemp = document.querySelector(".actualTemp");
  celsiusTemp.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searching = document.querySelector("#search-form");
searching.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusLink = document.querySelector("#celcius");
celsiusLink.addEventListener("click", displayCelsius);

search("Munich");
