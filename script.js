

var apiKey = "98e7da6ba47e6e46bbb4c11d566fa749"

var searchButton = $("#search-button");
console.log(searchButton)
// var inputEl = $(".searchInput").val();
// console.log(inputEl)
searchButton.click(function() {
    // Take the input of the city-input text field
    var inputEl = $("#city-input").val();
    console.log(inputEl)

    // Variable for current weather
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl + "&Appid=" + apiKey + "&units=imperial";
    console.log(urlCurrent)
    // Variable for 5 day forecast
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputEl + "&Appid=" + apiKey + "&units=imperial";
    
    if (inputEl == "") {
        console.log('This is the empty input', inputEl);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function(response){
            console.log(response)
            })
    }
})
