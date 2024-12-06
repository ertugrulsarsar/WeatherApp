const cityInput = document.getElementById("city_input");
const searchBtn = document.getElementById("searchBtn");
const api_key = "777b5f48d997639e538d0d2d2fd2678a";

const weatherData = document.getElementById("weather-data");
const currentTemp = document.getElementById("currentTemp");
const currentDesc = document.getElementById("currentDesc");
const currentIcon = document.getElementById("currentIcon");
const currentDate = document.getElementById("currentDate");
const currentLocation = document.getElementById("currentLocation");

const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecastGrid = document.getElementById("forecast-grid"); // 5 günlük hava durumu gridi
const hourlyGrid = document.getElementById("hourly-grid"); // Saatlik hava durumu gridi

const weatherDescriptions = {
  "clear sky": "Açık",
  "few clouds": "Az Bulutlu",
  "scattered clouds": "Dağınık Bulutlu",
  "broken clouds": "Parçalı Bulutlu",
  "shower rain": "Sağanak Yağış",
  rain: "Yağmurlu",
  thunderstorm: "Fırtına",
  snow: "Karlı",
  mist: "Sisli",
};

function getWeatherDetails(name, lat, lon, country) {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      weatherData.style.display = "block";

      const temp = (data.main.temp - 273.15).toFixed(1);
      const feels = (data.main.feels_like - 273.15).toFixed(1);
      const desc = weatherDescriptions[data.weather[0].description] || data.weather[0].description;
      const icon = data.weather[0].icon;
      const humidityVal = data.main.humidity;
      const pressureVal = data.main.pressure;
      const visibilityVal = (data.visibility / 1000).toFixed(1);
      const windSpeedVal = data.wind.speed;
      const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      currentTemp.innerHTML = `${temp}&deg;C`;
      currentDesc.innerHTML = desc;
      currentIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      currentDate.innerHTML = new Date().toLocaleDateString();
      currentLocation.innerHTML = `${name}, ${country}`;

      humidity.innerHTML = `Nem: ${humidityVal}%`;
      pressure.innerHTML = `Basınç: ${pressureVal} hPa`;
      visibility.innerHTML = `Görünürlük: ${visibilityVal} km`;
      windSpeed.innerHTML = `Rüzgar: ${windSpeedVal} m/s`;
      feelsLike.innerHTML = `Hissedilen: ${feels}&deg;C`;

      sunrise.innerHTML = `Gün Doğumu: ${sunriseTime}`;
      sunset.innerHTML = `Gün Batışı: ${sunsetTime}`;
    })
    .catch(() => alert("Hava durumu verisi alınırken bir hata oluştu."));
}

function get5DayForecast(lat, lon) {
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      forecastGrid.innerHTML = "";

      const dailyForecast = data.list.filter((_, index) => index % 8 === 0); // Her günün ilk tahmini

      dailyForecast.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString("tr-TR");
        const temp = (forecast.main.temp - 273.15).toFixed(1);
        const icon = forecast.weather[0].icon;
        const description = weatherDescriptions[forecast.weather[0].description] || forecast.weather[0].description;

        const forecastCard = `
          <div class="forecast-card">
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Hava İkonu">
            <p>${temp}&deg;C</p>
            <p>${description}</p>
          </div>
        `;

        forecastGrid.innerHTML += forecastCard;
      });
    })
    .catch(() => alert("5 günlük hava durumu verisi alınırken bir hata oluştu."));
}

function getHourlyForecast(lat, lon) {
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      hourlyGrid.innerHTML = "";

      const hourlyForecast = data.list.slice(0, 8); // İlk 8 saatlik tahmin (her 3 saatte bir)

      hourlyForecast.forEach((forecast) => {
        const time = new Date(forecast.dt * 1000).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const temp = (forecast.main.temp - 273.15).toFixed(1);
        const feelsLike = (forecast.main.feels_like - 273.15).toFixed(1);
        const windSpeed = forecast.wind.speed;
        const icon = forecast.weather[0].icon;
        const description = weatherDescriptions[forecast.weather[0].description] || forecast.weather[0].description;

        const hourlyCard = `
          <div class="hourly-card">
            <h4>${time}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Hava İkonu">
            <p>${description}</p>
            <p>Sıcaklık: ${temp}&deg;C</p>
            <p>Hissedilen: ${feelsLike}&deg;C</p>
            <p>Rüzgar: ${windSpeed} m/s</p>
          </div>
        `;

        hourlyGrid.innerHTML += hourlyCard;
      });
    })
    .catch(() => alert("Saatlik hava durumu verisi alınırken bir hata oluştu."));
}

function getCityCoordinates() {
  const cityName = cityInput.value.trim();
  cityInput.value = "";

  if (!cityName) {
    alert("Lütfen bir şehir adı girin.");
    return;
  }

  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        alert("Şehir bulunamadı. Lütfen geçerli bir şehir adı girin.");
        return;
      }

      const { name, lat, lon, country } = data[0];
      getWeatherDetails(name, lat, lon, country);
      get5DayForecast(lat, lon); // 5 günlük hava durumu verisi burada çağrılır
      getHourlyForecast(lat, lon); // Saatlik hava durumu verisi burada çağrılır
    })
    .catch(() => alert("Koordinatlar alınamadı. Lütfen tekrar deneyin."));
}

searchBtn.addEventListener("click", getCityCoordinates);
