

function updateWeather(cityState) {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=${cityState}`, function(response){
    let weatherData = response.data;
    updateCurrentWeather(weatherData);
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
  let cityState = document.getElementById('city-state').value;
  updateWeather(cityState);
  addImage(cityState);
}, false);
