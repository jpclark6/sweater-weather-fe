function updateWeather(cityState) {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=${cityState}`, function(response){
    let weatherData = response.data;
    clearDOM();
    updateCurrentWeather(weatherData);
    updateHourly(weatherData);
    updateFiveDay(weatherData);
  })
}

function clearDOM() {
  let nodes = [];
  nodes.push(document.getElementById('hourly-weather'))
  nodes.push(document.getElementById('daily-weather'))
  nodes.forEach(node => {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  })
}

function updateCurrentWeather(data) {
  let cityState = data.currently.city_state;
  let temp = data.currently.temperature;
  let humidity = data.currently.humidity;
  let high = data.daily[0].high;
  let low = data.daily[0].low;
  let description = data.currently.description;

  document.getElementById('current-city-state').textContent = cityState;
  document.getElementById('current-temp').innerHTML = "Currently: <span class='red'>" + Math.round(temp * 10) / 10 + "°F</span>";
  document.getElementById('current-humidity').innerHTML = "Humidity: <span class='red'>" + Math.round(humidity * 100) + "%</span>";
  document.getElementById('current-high').innerHTML = "High: <span class='red'>" + Math.round(high * 10) / 10 + "°F</span>";
  document.getElementById('current-low').innerHTML = "Low: <span class='red'>" + Math.round(low * 10) / 10 + "°F</span>";
  document.getElementById('current-description').innerHTML = '' + description + '';
}


function updateHourly(data) {
  let hours = data.hourly;
  hours.forEach((hour, i) => {
    if(i%2 === 0 && i < 12) {
      const hourWeather = document.createElement('div');
      hourWeather.classList.add('weather-hour');
      hourWeather.id = `hour-${i}`;
      hourWeather.style.gridColumnStart = i / 2 + 1;
      hourWeather.style.gridColumnEnd = i / 2 + 2;
      document.getElementById('hourly-weather').appendChild(hourWeather);
      addHourTime(hour, i);
      addHourTemp(hour, i);
      addHourDescription(hour, i);
    };
  });
}

function updateFiveDay(data) {
  let days = data.daily.slice(0, 5);
  days.forEach((day, i) => {
    const dailyWeather = document.createElement('div');
    dailyWeather.classList.add('weather-day');
    dailyWeather.id = `day-${i}`;
    document.getElementById('daily-weather').appendChild(dailyWeather);
    addDailyTime(day, i);
    addDailyHighTemp(day, i);
    addDailyLowTemp(day, i);
    addDailyDescription(day, i);
  });
}

function addHourTemp(hour, i) {
  let tempElement = document.createElement('p');
  tempElement.classList.add('temp');
  let tempText = document.createTextNode(Math.round(hour.temperature * 10) / 10 + "°F");
  tempElement.appendChild(tempText);
  document.getElementById(`hour-${i}`).appendChild(tempElement);
}

function addHourDescription(hour, i) {
  let descriptionElement = document.createElement('p');
  descriptionElement.style.textTransform = 'uppercase';
  let descriptionText = document.createTextNode(hour.icon);
  descriptionElement.appendChild(descriptionText);
  document.getElementById(`hour-${i}`).appendChild(descriptionElement);
}

function addHourTime(hour, i) {
  let timeElement = document.createElement('p');
  timeElement.classList.add('time');
  let time = new Date(hour.time * 1000);
  let timeWrapper = moment(time).format("ddd, hA");
  let timeText = document.createTextNode(timeWrapper);
  timeElement.appendChild(timeText);
  document.getElementById(`hour-${i}`).appendChild(timeElement);
}



function addDailyTime(day, i) {
  let dailyTime = document.createElement('p');
  dailyTime.classList.add('daily-time-day');
  let date = new Date(day.time * 1000);
  let dateWrapper = moment(date).format("dddd");
  let dailyTimeText = document.createTextNode(dateWrapper);
  dailyTime.appendChild(dailyTimeText);
  document.getElementById(`day-${i}`).appendChild(dailyTime);

  dailyTime = document.createElement('p');
  dailyTime.classList.add('daily-time-date');
  dateWrapper = moment(date).format("MMMM Do, YYYY");
  dailyTimeText = document.createTextNode(dateWrapper);
  dailyTime.appendChild(dailyTimeText);
  document.getElementById(`day-${i}`).appendChild(dailyTime);
}

function addDailyDescription(day, i) {
  let description = document.createElement('p');
  description.classList.add('daily-description');
  let descriptionText = document.createTextNode(day.status);
  description.appendChild(descriptionText);
  document.getElementById(`day-${i}`).appendChild(description);
}

function addDailyHighTemp(day, i) {
  let high = document.createElement('p');
  high.classList.add('daily-temp');
  let highText = document.createTextNode('High: ' + Math.round(day.high * 10) / 10 + "°F");
  high.appendChild(highText);
  document.getElementById(`day-${i}`).appendChild(high);
}

function addDailyLowTemp(day, i) {
  let low = document.createElement('p');
  low.classList.add('daily-temp');
  let lowText = document.createTextNode('Low:   ' + Math.round(day.low * 10) / 10 + "°F");
  low.appendChild(lowText);
  document.getElementById(`day-${i}`).appendChild(low);
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
