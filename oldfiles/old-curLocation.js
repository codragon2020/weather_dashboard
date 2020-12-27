function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(lat+" "+lon);
        getWeather();
      });
      
    } 
  }

function getWeather() {
    // Variable for current weather
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 day forecast
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&Appid=" + apiKey + "&units=imperial";
    
    $.ajax({
        url: urlCurrent,
        method: "GET"
    }).then(function(response){
        console.log(response)
        var cityName = $("#history").addClass("history-list");
            cityName.prepend("<li>" + response.name + "</li>");

            // Local storage is setting the keycount and response.name as the key/value pair
            var local = localStorage.setItem(keyCount, response.name);
            // Incrementing keyCount to store and retrieve a full list of key/value pairs from localStorage
            keyCount = keyCount + 1;

            // Empty the elements before every new call is made
            var currentWeather = $(".currentWeather");
            currentWeather.empty();

            // Call city-name into Current Weather
            var currentCity = $("#city-name");
            console.log(currentCity)

            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentCity.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentCity.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);

            // Add temperature
            var currentTemp = $("#temperature");
            currentTemp.append('Temperature: ' + (Math.trunc(response.main.temp)) + '\u00B0');

            // Add humidity
            var currentHumidity = $("#humidity");
            currentHumidity.append('Humidity: ' + response.main.humidity + '%')

            // Add wind speed
            var currentWind = $("#wind-speed");
            currentWind.append('Wind Speed: ' + response.wind.speed + ' MPH')
            
             // UV Index URL
             var oneCallUv = `https://api.openweathermap.org/data/2.5/onecall?appid=98e7da6ba47e6e46bbb4c11d566fa749&lat=${response.coord.lat}&lon=${response.coord.lon}`;

             // UV Index
             $.ajax({
                 url: oneCallUv,
                 method: "GET"
             }).then(function (response) {
                 var currentUv = $("#uv-index");
                 currentUv.append('UV Index: ' + response.current.uvi);
             });
    })
    $.ajax({
        url: urlFiveDay,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        // Array for 5-days 
        var day = [0, 8, 16, 24, 32];
        // var fiveDayCard = $(".forecast").addClass("card-body");
        var fiveDayDiv = $(".forecast").addClass("card-text");
        fiveDayDiv.empty();

        // For each for 5 days
        day.forEach(function (i) {
            var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
            FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

            fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temp: " + (Math.trunc(response.list[i].main.temp)) + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
        })
    })
}