// ─── API Configuration ────────────────────────────────────────────────────
// Using OpenWeatherMap API (https://openweathermap.org/api)
const API_KEY = "ff183aa07ed49d8c1b65d908c99c0bc7";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ─── DOM References ───────────────────────────────────────────────────────
const weatherForm    = document.querySelector("#weatherForm");
const cityInput      = document.querySelector("#cityInput");
const inputError     = document.querySelector("#inputError");
const weatherCard    = document.querySelector("#weatherCard");
const loadingSpinner = document.querySelector("#loadingSpinner");
const errorMsg       = document.querySelector("#errorMsg");

// ─── Event Listener: form submit (rubric: at least one event listener) ────
weatherForm.addEventListener("submit", function(event) {
    event.preventDefault();
    fetchWeather();
});

// ─── JS Validation (rubric: validation for at least one form element) ─────
function validateInput() {
    let city = cityInput.value.trim();

    // Must not be empty
    if (city.length === 0) {
        inputError.innerHTML = "⚠️ Please enter a city name.";
        return false;
    }

    // Must be at least 2 characters
    if (city.length < 2) {
        inputError.innerHTML = "⚠️ City name must be at least 2 characters.";
        return false;
    }

    // Must not contain numbers
    if (/\d/.test(city)) {
        inputError.innerHTML = "⚠️ City name should not contain numbers.";
        return false;
    }

    inputError.innerHTML = "";
    return true;
} // validateInput

// ─── Fetch Weather from OpenWeatherMap API ─────────────────────────────────
// (rubric: at least one fetch call + data retrieved from existing Web API)
async function fetchWeather() {
    if (!validateInput()) return;

    let city = cityInput.value.trim();

    // Show spinner, hide old results/errors
    showSpinner();
    hideCard();
    hideError();

    try {
        // Fetch current weather — units=imperial for Fahrenheit
        let url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`;
        let response = await fetch(url);
        let data = await response.json();

        // OpenWeatherMap returns cod 200 on success, "404" on city not found
        if (data.cod !== 200) {
            showError(`City "${city}" not found. Please check the spelling and try again.`);
            return;
        }

        // Display the data (rubric: data displayed in user-friendly format)
        displayWeather(data);

    } catch (err) {
        showError("Could not connect to the weather service. Please check your internet connection.");
        console.error("Fetch error:", err);
    } finally {
        hideSpinner();
    }
} // fetchWeather

// ─── Display Weather Data ──────────────────────────────────────────────────
function displayWeather(data) {
    let tempF       = Math.round(data.main.temp);
    let feelsLikeF  = Math.round(data.main.feels_like);
    let humidity    = data.main.humidity;
    let windMph     = Math.round(data.wind.speed);
    let visibilityMi = data.visibility ? (data.visibility / 1609).toFixed(1) : "N/A";
    let pressureHpa = data.main.pressure;
    let description = data.weather[0].description;
    let weatherId   = data.weather[0].id;
    let city        = data.name;
    let country     = data.sys.country;

    // Populate text fields
    document.querySelector("#cityName").innerHTML    = city;
    document.querySelector("#countryName").innerHTML = country;
    document.querySelector("#tempDisplay").innerHTML = `${tempF}°F`;
    document.querySelector("#weatherDesc").innerHTML = description;
    document.querySelector("#feelsLike").innerHTML   = `${feelsLikeF}°F`;
    document.querySelector("#humidity").innerHTML    = `${humidity}%`;
    document.querySelector("#windSpeed").innerHTML   = `${windMph} mph`;
    document.querySelector("#visibility").innerHTML  = `${visibilityMi} mi`;
    document.querySelector("#pressure").innerHTML    = `${pressureHpa} hPa`;
    document.querySelector("#conditionCode").innerHTML = weatherId;

    // Set weather emoji icon based on condition ID
    document.querySelector("#weatherIcon").innerHTML = getWeatherEmoji(weatherId, data.weather[0].icon);

    // Set temperature-based banner (rubric: different images based on temperature)
    setTemperatureBanner(tempF);

    // Update background gradient based on temperature
    updateBackground(tempF);

    showCard();
} // displayWeather

// ─── Temperature Banner (rubric: display different images based on temp) ──
function setTemperatureBanner(tempF) {
    let banner = document.querySelector("#tempBanner");

    if (tempF <= 32) {
        banner.className = "temp-banner freezing";
        banner.innerHTML = "🧊 Freezing — Bundle up with your heaviest coat!";
    } else if (tempF <= 50) {
        banner.className = "temp-banner cold";
        banner.innerHTML = "🧥 Cold — A warm jacket is a must.";
    } else if (tempF <= 68) {
        banner.className = "temp-banner mild";
        banner.innerHTML = "🌿 Mild — Great weather for a light layer.";
    } else if (tempF <= 85) {
        banner.className = "temp-banner warm";
        banner.innerHTML = "☀️ Warm — T-shirt weather, enjoy it!";
    } else {
        banner.className = "temp-banner hot";
        banner.innerHTML = "🔥 Hot — Stay hydrated and seek shade!";
    }
} // setTemperatureBanner

// ─── Weather Emoji Icon ────────────────────────────────────────────────────
function getWeatherEmoji(id, iconCode) {
    let isNight = iconCode && iconCode.includes("n");

    if (id >= 200 && id < 300) return "⛈️";           // Thunderstorm
    if (id >= 300 && id < 400) return "🌦️";           // Drizzle
    if (id >= 500 && id < 600) return "🌧️";           // Rain
    if (id >= 600 && id < 700) return "❄️";            // Snow
    if (id >= 700 && id < 800) return "🌫️";           // Atmosphere (fog, mist)
    if (id === 800) return isNight ? "🌙" : "☀️";     // Clear
    if (id === 801) return isNight ? "🌙" : "🌤️";    // Few clouds
    if (id === 802) return "⛅";                        // Scattered clouds
    if (id >= 803) return "☁️";                        // Broken / overcast
    return "🌡️";
} // getWeatherEmoji

// ─── Background gradient changes based on temperature ─────────────────────
function updateBackground(tempF) {
    let bg = document.querySelector("#bgLayer");

    if (tempF <= 32) {
        bg.style.background = "radial-gradient(ellipse at 20% 30%, #0c1f4a 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, #0a2040 0%, transparent 60%), #070d1e";
    } else if (tempF <= 50) {
        bg.style.background = "radial-gradient(ellipse at 20% 30%, #0c2a4a 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, #0f1f3d 0%, transparent 60%), #0a0f1e";
    } else if (tempF <= 68) {
        bg.style.background = "radial-gradient(ellipse at 20% 30%, #0a2e1a 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, #0d2b10 0%, transparent 60%), #080f0a";
    } else if (tempF <= 85) {
        bg.style.background = "radial-gradient(ellipse at 20% 30%, #2e1a0a 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, #2b1a06 0%, transparent 60%), #0f0a04";
    } else {
        bg.style.background = "radial-gradient(ellipse at 20% 30%, #3a0a0a 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, #2b0808 0%, transparent 60%), #100404";
    }
} // updateBackground

// ─── UI Helpers ───────────────────────────────────────────────────────────
function showSpinner() {
    loadingSpinner.classList.remove("hidden");
}

function hideSpinner() {
    loadingSpinner.classList.add("hidden");
}

function showCard() {
    weatherCard.classList.remove("hidden");
}

function hideCard() {
    weatherCard.classList.add("hidden");
}

function showError(message) {
    errorMsg.innerHTML = message;
    errorMsg.classList.remove("hidden");
}

function hideError() {
    errorMsg.classList.add("hidden");
}