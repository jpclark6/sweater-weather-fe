function updateWeather(cityState) {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=${cityState}`, function(response){
    let weatherData = response.data;
    updateCurrentWeather(weatherData);
    updateFiveDay(weatherData);
    updateHourly(weatherData);
  })
}

function updateHourly(data) {
  let hours = data.hourly;
  hours.forEach((hour, i) => {
    if(i%2 === 0 && i < 13) {
      const hourWeather = document.createElement('div');
      hourWeather.classList.add('weather-hour');
      hourWeather.id = `hour-${i}`;
      document.getElementById('hourly-weather').appendChild(hourWeather);
      
    };
  });
  debugger;
}

function updateFiveDay(data) {
  let days = data.daily.slice(0, 5);
  days.forEach((day, i) => {
    const dailyWeather = document.createElement('div');
    dailyWeather.classList.add('weather-day');
    dailyWeather.id = `day-${i}`;
    document.getElementById('daily-weather').appendChild(dailyWeather);
    addDailyTime(day, i);
    addDailyDescription(day, i);
    addDailyHighTemp(day, i);
    addDailyLowTemp(day, i); 
  });
}

function addDailyTime(day, i) {
  let dailyTime = document.createElement('p');
  let date = new Date(day.time * 1000);
  let dateWrapper = moment(date).format("dddd, MMMM Do YYYY");
  let dailyTimeText = document.createTextNode(dateWrapper);
  dailyTime.appendChild(dailyTimeText);
  document.getElementById(`day-${i}`).appendChild(dailyTime);
}

function addDailyDescription(day, i) {
  let description = document.createElement('p');
  let descriptionText = document.createTextNode(day.status);
  description.appendChild(descriptionText);
  document.getElementById(`day-${i}`).appendChild(description);
}

function addDailyHighTemp(day, i) {
  let high = document.createElement('p');
  let highText = document.createTextNode('High: ' + Math.round(day.high * 10) / 10);
  high.appendChild(highText);
  document.getElementById(`day-${i}`).appendChild(high);
}

function addDailyLowTemp(day, i) {
  let low = document.createElement('p');
  let lowText = document.createTextNode('Low: ' + Math.round(day.low * 10) / 10);
  low.appendChild(lowText);
  document.getElementById(`day-${i}`).appendChild(low);
}

function updateCurrentWeather(data) {
  let cityState = data.currently.city_state;
  let temp = data.currently.temperature;
  let humidity = data.currently.humidity;
  let high = data.daily[0].high;
  let low = data.daily[0].low;
  let description = data.currently.description;

  document.getElementById('current-city-state').textContent = cityState;
  document.getElementById('current-temp').textContent = "Currently " + Math.round(temp * 10) / 10 + "°F";
  document.getElementById('current-humidity').textContent = "Humidity " + Math.round(humidity * 100) + "%";
  document.getElementById('current-high').textContent = "High " + Math.round(high * 10) / 10 + "°F";
  document.getElementById('current-low').textContent = "Low " + Math.round(low * 10) / 10 + "°F";
  document.getElementById('current-description').textContent = description;
}

function addImage(cityState) {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/backgrounds?location=${cityState}`, function(response){
    let imageURL = response.url;
    document.getElementById('background-image').innerHTML = `<img src=${imageURL} alt='City' >`
    // document.body.style.background = `url('${imageURL}')`;

    // -webkit - filter: grayscale(100 %); /* Chrome, Safari, Opera */
    // filter: grayscale(100 %);
  })
}

document.getElementById('submit-city-state').addEventListener('click', (e) => {
  e.preventDefault();
  let cityState = document.getElementById('city-state').value.trim();
  updateWeather(cityState);
  addImage(cityState);
}, false);
