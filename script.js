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
    // let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    // console.log(searchHistory);
  
    const APIKey = "98e7da6ba47e6e46bbb4c11d566fa749";

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response.dt);
            console.log(response);
            const currentDate = new Date(response.dt*1000);
            // console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.weather[0].icon;
            console.log(weatherPic);
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt",response.weather[0].description);

        
        })
    }

    searchEl.addEventListener("click",function() {
        const searchTerm = inputEl.value;
        getWeather(searchTerm);
        // searchHistory.push(searchTerm);
        // localStorage.setItem("search",JSON.stringify(searchHistory));
        // renderSearchHistory();
    })

}
initPage();