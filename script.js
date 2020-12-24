

var apiKey = "98e7da6ba47e6e46bbb4c11d566fa749"

var searchButton = $("#search-button");
console.log(searchButton)
// var inputEl = $(".searchInput").val();
// console.log(inputEl)

var keyCount = 0;

// For loop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    // console.log(localStorage.getItem("City"));
    var cityName = $("#history").addClass("history-list");

    cityName.append("<li>" + city + "</li>");
}

// searchButton click function to make AJAX calls to weather api and utilize response
searchButton.click(function() {
    // Take the input of the city-input text field
    var inputEl = $("#city-input").val();
    console.log('initial call to city-input', inputEl)

    // Variable for current weather
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl + "&Appid=" + apiKey + "&units=imperial";
    // console.log(urlCurrent)
    // Variable for 5 day forecast
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputEl + "&Appid=" + apiKey + "&units=imperial";
    
    // TODO: Try to send a response of invalid when logging 404
    if (inputEl == "") {
        alert('Must type in a valid city name');
        console.log('This is the empty input', inputEl);
    } else {
        console.log('The city-input is ', inputEl)
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function(response){
            console.log(response)
            console.log(response.name)
            var cityName = $("#history").addClass("history-list");
            cityName.prepend("<li>" + response.name + "</li>");

            // Local storage is setting the keycount and response.name as the key/value pair
            var local = localStorage.setItem(keyCount, response.name);
            // Incrementing keyCount to store and retrieve a full list of key/value pairs from localStorage
            keyCount = keyCount + 1;

            // Call city-name into Current Weather
            var currentWeather = $("#city-name");
            console.log(currentWeather)
            currentWeather.empty();

            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentWeather.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentWeather.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);


            })
    }
})
