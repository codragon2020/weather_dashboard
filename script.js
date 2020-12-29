// Initiate page 
function initPage() {
    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");4
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
  
    // Personal API key - Do not use
    const APIKey = "98e7da6ba47e6e46bbb4c11d566fa749";

    // Get Weather function for Current and Forecast 
    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            // Uses the Date constructor to return the date timestamp * 1000 ms
            const currentDate = new Date(response.dt*1000);
            const day = currentDate.getDate();
            // Returns the month of the year in numerical value of 0-11, so add 1
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
            // Calls the weather icon object
            let weatherPic = response.weather[0].icon;
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt",response.weather[0].description);
            // Calls the temp, humidity, and wind speed objects
            currentTempEl.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
        
        // Getting longitude and latitude for the one-call-api
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        $.ajax({
            url: UVQueryURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            console.log(response.daily[0].uvi)
            // Creating a span to contain the uv index
            let UVIndex = document.createElement("span");
            // Most acccurate uv index is currently available from the daily object
            UVIndex.innerHTML = response.daily[0].uvi;
            // Used UV Index table to determine favorable, moderate, or severe conditions
            // https://en.wikipedia.org/wiki/Ultraviolet_index
            if (UVIndex.innerHTML > 6) {
                UVIndex.setAttribute("class","badge badge-danger");
            } else if (UVIndex.innerHTML > 3) {
                UVIndex.setAttribute("class","badge badge-warning");
            } else {
                UVIndex.setAttribute("class","badge badge-success");
            }
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);
        });

        // 5-Day forecast call
        let cityID = response.id;
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            // Grab all elements with forecast class
            const forecastEls = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                // Index created to pull from the response.list and set the date time stamp  and other attributes appropriately
                const forecastIndex = i*8 + 4;
                const forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt",response.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F";
                forecastEls[i].append(forecastTempEl);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);
                }
            })
        });
    }

    // Search event listener takes city, runs getWeather function, and pushes the searchHistory and runs renderSearchHistory
    searchEl.addEventListener("click",function() {
        const searchTerm = inputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clears the searchHistory array on page and localStorage on computer
    clearEl.addEventListener("click",function() {
        searchHistory = [];
        localStorage.clear();
        renderSearchHistory();  // Renders the empty results
    })

    // Converts Kelvin to Farenheit 
    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    // Append search history to history form
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            // Input element is created so the search history is clickable
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            // When the listed item is click, run the getWeather function
            historyItem.addEventListener("click",function() {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    // Uses the last item in the search history array to run getWeather and render the results 
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }

    // Identifies the geolocation of the computer
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat+" "+lon);
            getCurWeather();
          });
        } 
      }

      // Call for current weather based on coordinates
      function getCurWeather() {
        // Variable for current weather
        var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&Appid=" + APIKey + "&units=imperial";
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function(response){
            var cityName = response.name;
            getWeather(cityName);
            // Adds the search history functionality
            searchHistory.push(cityName);
            localStorage.setItem("search",JSON.stringify(searchHistory));
            renderSearchHistory();
        });
    }

    getLocation();

}

initPage();