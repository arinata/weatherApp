async function getCityWeatherData(city) {
    let apiCommand1 = 'https://api.openweathermap.org/data/2.5/weather?q=';
    let apiCommand2 = '&units=metric&appid=aa5e56383cb2aaca5fa26bcf40a270da';
    let apiCommand = apiCommand1+city+apiCommand2;
    try {
        let response = await fetch(apiCommand, {mode: "cors"});
        let weatherData = await response.json();
        if(response.status == 404){
            resetDisplay();
            document.getElementById('cityNotFound').style.display = 'block';
            return null;
        }
        return weatherData;
    } catch (error){
        return null;
    }
}

async function updateWeather(city){
    resetDisplay();
    try{
        let weatherData = await getCityWeatherData(city);
        let lat = weatherData.coord.lat;
        let lon = weatherData.coord.lon;
        let forecast = await getWeatherForecast(lat,lon);
        document.getElementById('cityNameBlock').textContent = weatherData.name;  
        updateIcon(weatherData.weather[0],'weatherIcon');
        updateIcon(forecast.daily[0].weather[0],'iconToday');
        updateIcon(forecast.daily[1].weather[0],'iconTomorrow');
        updateIcon(forecast.daily[2].weather[0],'icon2Days');
        document.getElementById('temperature').textContent = weatherData.main.temp.toFixed(0);
        updateTemp('today',forecast.daily[0].temp);
        updateTemp('tomorrow',forecast.daily[1].temp);
        updateTemp('2Days',forecast.daily[2].temp);
        updateDays();
        document.getElementById('todayForecastText').textContent = forecast.daily[0].weather[0].main;
        document.getElementById('tomorrowForecastText').textContent = forecast.daily[1].weather[0].main;
        document.getElementById('2DaysForecastText').textContent = forecast.daily[2].weather[0].main;
    } catch (error){

    }
}

async function getWeatherForecast(lat,lon){
    let apiCommand1 = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
    let apiCommand2 = '&lon=';
    let apiCommand3 = '&units=metric&exclude=current,minutely,hourly,alerts&appid=aa5e56383cb2aaca5fa26bcf40a270da';
    let apiCommand = apiCommand1 + lat + apiCommand2 + lon +apiCommand3;
    try{
        let response = await fetch(apiCommand, {mode: "cors"});
        let forecastData = await response.json();
        if(response.status == 404){
            resetDisplay();
            return null;
        }
        return forecastData;
    } catch(error){

    }
}

const resetDisplay = () => {
    document.getElementById('weatherIcon').className = '';
    document.getElementById('iconToday').className = '';
    document.getElementById('iconTomorrow').className = '';
    document.getElementById('icon2Days').className = '';
    document.getElementById('temperature').textContent = '--';
    document.getElementById('todayLowTemp').textContent = '--';
    document.getElementById('todayHiTemp').textContent = '--';
    document.getElementById('tomorrowLowTemp').textContent = '--';
    document.getElementById('tomorrowHiTemp').textContent = '--';
    document.getElementById('day2').textContent = '2 Days From Now';
    document.getElementById('2DaysLowTemp').textContent = '--';
    document.getElementById('2DaysHiTemp').textContent = '--';
    document.getElementById('todayForecastText').textContent = '';
    document.getElementById('tomorrowForecastText').textContent = '';
    document.getElementById('2DaysForecastText').textContent = '';
}

const   updateIcon = (weatherData,idIcon) => {
    let weather = weatherData.main;
    let description = weatherData.description;
    let weatherId = weatherData.id;
    if(weather=='Clear'){
        document.getElementById(idIcon).className = 'fas fa-sun';bangkalan
    }else if(weather=='Clouds'){
        if((description=='few clouds')||(description==' scattered clouds ')){
            document.getElementById(idIcon).className = 'fas fa-cloud-sun';
        }else{
            document.getElementById(idIcon).className = 'fas fa-cloud';
        }
    }else if(weather=='Drizzle'){
        document.getElementById(idIcon).className = 'fas fa-cloud-showers-heavy';
    }else if(weather=='Rain'){
        if((weatherId==511)||(weatherId==511)||(weatherId==520)||(weatherId==521)||(weatherId==522)||(weatherId==531)){
            document.getElementById(idIcon).className = 'fas fa-cloud-rain';
        }else{
            document.getElementById(idIcon).className = 'fas fa-cloud-sun-rain';
        }
    }else if(weather=='Snow'){
        document.getElementById(idIcon).className = 'fas fa-snowflake';
    }else if(weather=='Thunderstorm'){
        document.getElementById(idIcon).className = 'fas fa-poo-storm';
    }else if((weatherId==701)||(weatherId==721)||(weatherId==741)){
        document.getElementById(idIcon).className = 'fas fa-water';
    }else if((weatherId==711)||(weatherId==731)||(weatherId==751)||(weatherId==761)||(weatherId==762)){
        document.getElementById(idIcon).className = 'fas fa-smog';
    }else if((weatherId==771)||(weatherId==781)){
        document.getElementById(idIcon).className = 'fas fa-wind';
    }
}

const updateTemp = (day,forecast) =>{
    document.getElementById(day+'LowTemp').textContent = forecast.min.toFixed(0);
    document.getElementById(day+'HiTemp').textContent = forecast.max.toFixed(0);
}

const updateDays = () => {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let d = new Date();
    let dayName2 = weekday[d.getDay(d.setDate(d.getDate()+2))];
    document.getElementById('day2').textContent = dayName2;
}

document.getElementById('findCityButton').addEventListener('click',function(){
    document.getElementById('searchPage').style.display = 'block';
    document.getElementById('cityNotFound').style.display = 'none';
})

document.getElementById('checkButton').addEventListener('click',function(){
    let newCity = document.getElementById('cityName').value;
    updateWeather(newCity);
    //document.getElementById('cityNameBlock').textContent = newCity;  
    document.getElementById('searchPage').style.display = 'none';
})

window.addEventListener("keypress",function(e){
    if(document.getElementById('searchPage').style.display == 'block'){
        if(e.key == 'Enter'){
            let newCity = document.getElementById('cityName').value;
            updateWeather(newCity);
            //document.getElementById('cityNameBlock').textContent = newCity;  
            document.getElementById('searchPage').style.display = 'none';
        }
    }
})

let city = 'Bandung'

resetDisplay();
updateWeather(city);
document.getElementById('cityNameBlock').textContent = city;  
