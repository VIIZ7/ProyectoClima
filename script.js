// Reemplaza 'YOUR_API_KEY' con tu API key de OpenWeatherMap
const API_KEY = 'e1d9b8bc0d1d84aa0e9edcf766716576';

// Elementos
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const msg = document.getElementById('msg');
const result = document.getElementById('result');
const locName = document.getElementById('locName');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const weatherIcon = document.getElementById('weatherIcon');

async function fetchWeather(city) {
    if (!city || city.trim().length === 0) {
        showMessage('Escribe el nombre de una ciudad (ej: "Monterrey, MX")');
        return;
    }

    showMessage('Buscando...', false);
    result.classList.add('hidden');

    try {
        const base = 'https://api.openweathermap.org/data/2.5/weather';
        const url = `${base}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;

        const resp = await fetch(url);
        if (!resp.ok) {
            if (resp.status === 404) throw new Error('Ciudad no encontrada.');
            throw new Error(`Error al consultar la API (status ${resp.status})`);
        }

        const data = await resp.json();
        const name = `${data.name}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
        const temperature = data.main ? Math.round(data.main.temp) + '°C' : '—';
        const description = data.weather && data.weather[0] ? data.weather[0].description : '—';
        const humidity = data.main ? data.main.humidity + '%' : '—';
        const wind = data.wind ? (data.wind.speed + ' m/s') : '—';
        const iconCode = data.weather && data.weather[0] ? data.weather[0].icon : null;

        locName.textContent = name;
        tempEl.textContent = temperature;
        descEl.textContent = description;
        humidityEl.textContent = humidity;
        windEl.textContent = wind;

        if (iconCode) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = description;
            weatherIcon.style.display = '';
        } else {
            weatherIcon.style.display = 'none';
        }

        result.classList.remove('hidden');
        showMessage('', false);
    } catch (err) {
        showMessage(err.message || 'Ocurrió un error.');
    }
}

function showMessage(text, isError = true) {
    msg.textContent = text;
    msg.style.color = isError ? '#b03a2e' : '#2b7a2b';
}

// Eventos
searchBtn.addEventListener('click', () => fetchWeather(cityInput.value));
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fetchWeather(cityInput.value);
});

// 🔹 Mostrar una ciudad inicial al cargar
window.addEventListener('DOMContentLoaded', () => {
    fetchWeather('Monterrey, MX');
});
