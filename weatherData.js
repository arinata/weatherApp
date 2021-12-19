async function getCityWeatherData(city) {
    let apiCommand1 = 'http://api.openweathermap.org/data/2.5/weather?q=';
    let apiCommand2 = '&units=metric&appid=aa5e56383cb2aaca5fa26bcf40a270da';
    let apiCommand = apiCommand1+city+apiCommand2;
    try {
        let response = await fetch(apiCommand, {mode: 'cors'});
        let weatherData = await response.json();
        if(response.status == 404){
            console.log("tetot");
        }
        return weatherData;
    } catch (error){
        console.log(error.message);
    }
}

async function updateWeather(city){
    console.log("meminta data");
    try{
        let weatherData = await getCityWeatherData(city);
        let lat = weatherData.coord.lat;
        let lon = weatherData.coord.lon;
        let forecast = await getWeatherForecast(lat,lon);
        updateIcon(weatherData.weather[0],'weatherIcon');
        updateIcon(forecast.daily[0].weather[0],'iconToday');
        updateIcon(forecast.daily[1].weather[0],'iconTomorrow');
        updateIcon(forecast.daily[2].weather[0],'icon2Days');
        document.getElementById('temperature').textContent = weatherData.main.temp.toFixed(0);
        updateTemp('today',forecast.daily[0].temp);
        updateTemp('tomorrow',forecast.daily[1].temp);
        updateTemp('2Days',forecast.daily[2].temp);
        updateDays();
        console.log(weatherData);
        console.log(forecast);
    } catch (error){
        console.log(ErrorEvent);
    }
}

async function getWeatherForecast(lat,lon){
    let apiCommand1 = 'http://api.openweathermap.org/data/2.5/onecall?lat=';
    let apiCommand2 = '&lon=';
    let apiCommand3 = '&units=metric&exclude=current,minutely,hourly,alerts&appid=aa5e56383cb2aaca5fa26bcf40a270da';
    let apiCommand = apiCommand1 + lat + apiCommand2 + lon +apiCommand3;
    try{
        let response = await fetch(apiCommand, {mode: 'cors'});
        let forecastData = await response.json();
        return forecastData;
    } catch(error){
        console.log(ErrorEvent);
    }
}

const   updateIcon = (weatherData,idIcon) => {
    let weather = weatherData.main;
    let description = weatherData.description;
    let weatherId = weatherData.id;
    document.getElementById(idIcon).className = '';
    if(weather=='Clear'){
        document.getElementById(idIcon).className = 'fas fa-sun';
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

updateWeather('bandung');
