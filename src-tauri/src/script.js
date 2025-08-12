let isCelsius = false;

document.getElementById('toC').addEventListener('click', () => {
  isCelsius = true;
  fetchWeather();
});

document.getElementById('toF').addEventListener('click', () => {
  isCelsius = false;
  fetchWeather();
});

let lat = 36.1627; // location (Nashville) if hardcoding
let lon =  -86.7816;

navigator.geolocation.getCurrentPosition( //get position to pass to api
  (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log("Your Lat:", latitude, "Your Lon:", longitude);
    fetchWeather(latitude, longitude);
  },
  error => {
    console.error(error);
    fetchWeather(); //default city
  }
);

async function fetchWeather() {
  const unit = isCelsius ? 'celsius' : 'fahrenheit';
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${unit}&timezone=auto`);
  const data = await response.json();

  const temp = Math.round(data.current_weather.temperature);
  const code = data.current_weather.weathercode;

  document.getElementById('temperature').textContent = `${temp}°`;
  document.getElementById('description').textContent = `It is currently ${getWeatherDescription(code)}!`;
  document.getElementById('castform-img').src = getPokemonImage(code);
  document.getElementById('tip').textContent = getCastformRecommendation(temp, code);
}

function toggleUnits() {
  isCelsius = !isCelsius;
  fetchWeather();
}

function getWeatherDescription(code) {
  const map = {
    0: "clear",
    1: "clear",
    2: "partly cloudy",
    3: "cloudy",
    45: "foggy",
    51: "drizzling",
    53: "drizzling",
    55: "drizzling",
    61: "rainy",
    63: "rainy",
    65: "rainy",
    71: "snowy",
    73: "snowy",
    75: "snowy",
    95: "stormy"
  };
  return map[code] || "unknown";
}

function getPokemonImage(code) {
  if ((code === 0) || (code === 1)) return "images/sunny.png"; //clear
  if (code === 2) return "images/partcloudy.png"; //partly cloudy
  if ((code === 51) || (code === 53) || (code === 55)) return "images/rainy.png"; //drizzle
  if ((code === 61) || (code === 63) || (code === 65)) return "images/rainy.png"; //rain
  if ((code === 71) || (code === 73) || (code === 75)) return "images/snowy.png"; //snow
  if ((code === 95)) return "images/rainy.png"; //storm
  return "images/cloudy.png"; //fog, cloudy
}

function getCastformRecommendation(temp, code) {
  if (code >= 61 && code <= 65) return "Castform says grab an umbrella!";
  if (code >= 71) return "Castform thinks it's a snow day!";

  if (isCelsius) {
    if (temp <= 5) return "Castform recommends bringing a coat.";
    if (temp >= 30) return "Castform suggests staying hydrated.";
  } else {
    if (temp <= 41) return "Castform recommends bringing a coat.";      // 5°C ≈ 41°F
    if (temp >= 86) return "Castform suggests staying hydrated."; // 30°C ≈ 86°F
  }
  return "Castform thinks the weather is great!";
}

fetchWeather();

setInterval(fetchWeather, 3600000);