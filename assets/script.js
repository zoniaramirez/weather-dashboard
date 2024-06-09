// Define variables to store references to HTML elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const historyList = document.getElementById('history');
const currentWeather = document.querySelector('.current-weather');
const forecastSection = document.querySelector('.weather-data section');

// Retrieve last searched cities from localStorage
let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

// Function to create a button for each city in the searched and add it to the history list
function renderCityButtons() {
    // Get the container where the buttons should be added
    const historyContainer = document.getElementById('history-container');

    // Clear the container
    historyContainer.innerHTML = '';

    // Iterate over the array of searched cities
    searchedCities.forEach(city => {
        // Create a new button
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.classList.add('history-button');

        // Add an event listener to the button to load the weather data when clicked
        cityButton.addEventListener('click', () => {
            getWeatherData(city);
        });

        // Add the button to the container
        historyContainer.appendChild(cityButton);
    });
}
    window.renderCityButtons = renderCityButtons;


// Call the function when the page loads
// loadWeatherDataForCities();

// Event listener for the search button
searchButton.addEventListener('click', function (event) {
    event.preventDefault();

    // Get the value entered in the search input
    const city = searchInput.value.trim();

    // Call a function to fetch weather data based on the city
    getWeatherData(city);

    searchInput.value = '';

});

// Function to fetch weather data from the API
function getWeatherData(city) {
    // Make a fetch request to the API using the city name
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=9aedc875bc1e04894c9dc14f15bfb8e5&units=imperial`)
        .then(response => response.json())
        .then(data => {
            // Process the data and update weather information
            updateWeather(data);
            updateForecast(data);

            // Save the searched city to lastSearchedCities
            searchedCities.push(city);
            localStorage.setItem('searchedCities', JSON.stringify(searchedCities));


            // Call loadWeatherDataForCities to update the history list buttons
            renderCityButtons();

        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to update weather information
function updateWeather(data) {
    if (data.city && data.list && data.list[0] && data.list[0].dt && data.list[0].weather && data.list[0].weather[0]) {
        // Update the current weather section with data
        const cityName = data.city.name;
        const currentDate = new Date;
        const iconCode = data.list[0].weather[0].icon;
        const temperature = data.list[0].main.temp;
        const windSpeed = data.list[0].wind.speed;
        const humidity = data.list[0].main.humidity;

        const currentWeatherElement = document.querySelector('.current-weather');
        currentWeatherElement.innerHTML = `
        <div class="details">
            <h2>${cityName} (${currentDate.toLocaleDateString()})</h2>
            <img class="icon ms-2 mt-2" src="http://openweathermap.org/img/w/${iconCode}.png" alt="weather icon">
            <p class="mt-2 ms-2">Temp: ${temperature} °F</p>
            <p class="ms-2">Wind: ${windSpeed} MPH</p>
            <p class="ms-2">Humidity: ${humidity}%</p>
        </div>
    `;

    
    // Store weather data in localStorage
    localStorage.setItem('currentWeatherData', JSON.stringify(data.list[0]));

    } else {
        console.error('Error: Data structure from API response is not as expected');
    }
}

// Update the 5-day forecast section with data
function updateForecast(data) {
    const forecastSection = document.querySelector('.weather-data section');
    forecastSection.innerHTML = `<h2 class="fw-bolder pt-2 pb-2">5-Day Forecast:</h2>`;

    for (let i = 1; i <= 5; i++) {
        const forecastIndex = i * 8 - 1;

        // Check if forecast data is available for the current day
        if (data.list.length > forecastIndex) {
            const forecastData = data.list[forecastIndex];

            if (forecastData && forecastData.dt && forecastData.weather && forecastData.weather[0]) {
                const forecastDate = new Date(forecastData.dt * 1000);
                const forecastIconCode = forecastData.weather[0].icon;
                const forecastTemp = forecastData.main.temp;
                const forecastWindSpeed = forecastData.wind.speed;
                const forecastHumidity = forecastData.main.humidity;

                const forecastCard = document.createElement('div');
                forecastCard.classList.add('col-lg-2', 'm-2', 'cards');
                forecastCard.innerHTML = `
                            <h3>${forecastDate.toLocaleDateString()}</h3>
                            <img src="http://openweathermap.org/img/w/${forecastIconCode}.png" alt="weather icon">
                            <p>Temp: ${forecastTemp} °F</p>
                            <p>Wind: ${forecastWindSpeed} MPH</p>
                            <p>Humidity: ${forecastHumidity}%</p>`;

                forecastSection.appendChild(forecastCard);
            } else {
                console.error('Error: Forecast data is not as expected for day ' + i);

                // Store forecast data in localStorage
                localStorage.setItem('forecastData', JSON.stringify(data.list));

                // Call loadWeatherDataForCities when the page loads to render history list buttons
                loadWeatherDataForCities();

                // Retrieve and display weather data from localStorage when the page loads
                const currentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
                const forecastData = JSON.parse(localStorage.getItem('forecastData'));

                if (currentWeatherData && forecastData) {
                    updateWeather(currentWeatherData);
                    updateForecast({ list: forecastData });
                }
            }
        }
    }
}