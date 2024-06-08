// Define variables to store references to HTML elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const historyList = document.getElementById('history');
const currentWeather = document.querySelector('.current-weather');
const forecastSection = document.querySelector('.weather-data section');

// Event listener for the search button
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    
// Get the value entered in the search input
 const city = searchInput.value.trim();

  // Call a function to fetch weather data based on the city
  getWeatherData(city);
});

// Function to fetch weather data from the API
function getWeatherData(city) {
    // Make a fetch request to the API using the city name
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=9aedc875bc1e04894c9dc14f15bfb8e5`)
        .then(response => response.json())
        .then(data => {
            // Process the data and update the UI with weather information
            updateWeatherUI(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to update the UI with weather information
function updateWeatherUI(data) {
    // Update the current weather section with data
    const cityName = data.city.name;
    const currentDate = new Date(data.list[0].dt * 1000); // Convert timestamp to date
    const iconCode = data.list[0].weather[0].icon;
    const temperature = data.list[0].main.temp;
    const windSpeed = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;

       const currentWeatherElement = document.querySelector('.current-weather');
    currentWeatherElement.innerHTML = `
        <div class="details">
            <h2>${cityName} (${currentDate.toLocaleDateString()})</h2>
            <img class="icon ms-2 mt-2" src="http://openweathermap.org/img/w/${iconCode}.png" alt="weather icon">
            <p class="mt-2 ms-2">Temp: ${temperature} K</p>
            <p class="ms-2">Wind: ${windSpeed} m/s</p>
            <p class="ms-2">Humidity: ${humidity}%</p>
        </div>
    `;

    