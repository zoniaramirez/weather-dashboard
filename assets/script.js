const form = document.querySelector('#search-form');
const button = document.querySelector('#search-button');

form.addEventListener("submit", citySearch);
button.addEventListener("click", citySearch);

// function that handles the city searched when the form is submitted
function citySearch (event) {
    event.preventDefault();

    const input = document.querySelector('#search-input');
    const cityName = input.value.trim();
    if (cityName.length > 0) {
        location(cityName);

        input.value = "";
    }
}

// localStorage
function searchedCities () {
let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
let historyList = document.querySelector('#history');
let historyContent = "";

// loop for history array
for (let i = 0; i < cityHistory.length; i++) {
    const city = cityHistory[i];

    historyContent += `<button class="btn btn-secondary text-center mb-3" onclick="searchCity('${city}')">${city}</button>`;
}
    historyList.innerHTML = historyContent;
}
searchedCities();

// request API
function searchCity(cityName) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q={cityName}&appid=9aedc875bc1e04894c9dc14f15bfb8e5&units=imperial';

    fetch(url)
        .then(function (response) {
            if (response === 200) {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                weatherData(lat, lon, cityName);
            } else {
                alert('City Not Found');
            }
        })
}

// function to get data
function weatherData(lat, lon) {
    const url = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9aedc875bc1e04894c9dc14f15bfb8e5&units=imperial';

    fetch(url)
        .then(function (response) {
            if (response === 200) {
                updateWeather(response);
                searchedCities();
            } else {
                alert('Unable to get weather data!');
            }
        })
}

// cuurent forecast
function updateWeather(data) {
     const todayForecast = document.querySelector('#current-weather');
    const cityName = data.city.name;
    const date = new Date();
    const iconUrl = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
    const temp = data.list[0].main.temp;
    const wind = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;


    document.getElementById('cityName').textContent = `${cityName} (${date.toLocaleDateStrin()})`;
    document.getElementById('icon').src = iconUrl;
    document.getElementById('today-temp').textContent = `Temp: ${temp} °F`;
    document.getElementById('today-wind').textContent = `Wind: ${wind} MPH`;
    document.getElementById('today-humidity').textContent = `Humidity: ${humidity} %`;
}

// 5 day forecast

