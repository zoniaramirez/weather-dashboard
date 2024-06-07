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
    const url =
}