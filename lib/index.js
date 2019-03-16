const initialVisit = () => {
  if(document.cookie) {
    let cookies = document.cookie.split('; ');
    apiKey = cookies[0].split('=')[1];
    let username = cookies[1].split('=')[1];
    if(apiKey != '') {
      let usernameElementParent = document.getElementById('hello-user');
      let usernameElement = document.createElement('p');
      let usernameText = document.createTextNode(`Welcome, ${username}`);
      usernameElement.appendChild(usernameText);
      usernameElementParent.appendChild(usernameElement);
      document.getElementById('login-link').classList.add('hidden');
      document.getElementById('register-link').classList.add('hidden');
      document.getElementById('see-favorites-link').classList.remove('hidden');
      document.getElementById('logout-link').classList.remove('hidden');
    } else {
      document.getElementById('login-link').classList.remove('hidden');
      document.getElementById('register-link').classList.remove('hidden');
      document.getElementById('see-favorites-link').classList.add('hidden');
      document.getElementById('logout-link').classList.add('hidden');
    }
  }
}

let apiKey = '';
initialVisit();

function updateWeather(cityState, cityStateName) {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=${cityState}`, function(response){
    let weatherData = response.data;
    clearDOM();
    updateCurrentWeather(weatherData, cityStateName);
    updateHourly(weatherData);
    updateFiveDay(weatherData);
    if(apiKey !== '') {
      addFavoriteOption();
    }
  })
}

function addFavoriteOption() {

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

function updateCurrentWeather(data, cityStateName) {
  // let cityState = data.currently.city_state;
  let temp = data.currently.temperature;
  let humidity = data.currently.humidity;
  let high = data.daily[0].high;
  let low = data.daily[0].low;
  let description = data.currently.description;

  document.getElementById('current-city-state').textContent = cityStateName;
  if(apiKey != '') {
    let addFavorite = document.createElement('div');
    addFavorite.innerHTML = '<p id="add-favorite">Add as favorite</p>';
    document.querySelector('.city-state').appendChild(addFavorite);
  }
  document.getElementById('current-temp').innerHTML = "Currently: <span class='red'>" + Math.round(temp * 10) / 10 + "°F</span>";
  document.getElementById('current-humidity').innerHTML = "Humidity: <span class='red'>" + Math.round(humidity * 100) + "%</span>";
  document.getElementById('current-high').innerHTML = "High: <span class='red'>" + Math.round(high * 10) / 10 + "°F</span>";
  document.getElementById('current-low').innerHTML = "Low: <span class='red'>" + Math.round(low * 10) / 10 + "°F</span>";
  document.getElementById('current-description').innerHTML = '' + description + '';
  if(apiKey != '') {
    document.getElementById('add-favorite').addEventListener('click', () => {
      document.getElementById('add-favorite').classList.add('hidden');
      let cityState = document.getElementById('current-city-state').textContent;
      $.post(`https://sweater-weather-1810.herokuapp.com/api/v1/favorites?location=${cityState}&api_key=${apiKey}`, (response) => {
        if (response.data) {
          alert(`Favorite city ${response.data[0].location} added successfully`);
        } else {
          alert(`Favorite city ${cityState} not added successfully`);
        }
      })
    })
  }
}

function updateHourly(data) {
  let hours = data.hourly;
  hours.forEach((hour, i) => {
    if(i%2 === 0 && i < 24) {
      const hourWeather = document.createElement('div');
      hourWeather.classList.add('weather-hour');
      hourWeather.id = `hour-${i}`;
      hourWeather.style.gridColumnStart = i / 2 + 1;
      hourWeather.style.gridColumnEnd = i / 2 + 2;
      document.getElementById('hourly-weather').appendChild(hourWeather);
      addHourTime(hour, i);
      addHourTemp(hour, i);
      addHourDescription(hour, i);
      if(i >= 12) {
        hourWeather.classList.add('hidden');
        hourWeather.style.gridColumnStart = i / 2 + 1 - 6;
        hourWeather.style.gridColumnEnd = i / 2 + 2 - 6;
        hourWeather.style.gridRowStart = 2;
        hourWeather.style.gridRowEnd = 3;
      }
    };
  });
  document.getElementById('see-more-hours').classList.remove('hidden');
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
  let cityState = document.getElementById('city-state').value.replace(/ /g, '');
  let cityStateName = document.getElementById('city-state').value;
  cityStateName = cityStateName.split(',')[0].trim() + ', ' + cityStateName.split(',')[1].trim();
  updateWeather(cityState, cityStateName);
  addImage(cityState);
}, false);

document.getElementById('login-link').addEventListener('click', (e) => {
  let loginElement = document.querySelector('#login');
  let registerElement = document.querySelector('#register');
  loginElement.classList.toggle('hidden');
  registerElement.classList.add('hidden');
})

document.getElementById('register-link').addEventListener('click', (e) => {
  let loginElement = document.querySelector('#login');
  let registerElement = document.querySelector('#register');
  registerElement.classList.toggle('hidden');
  loginElement.classList.add('hidden');
})



document.getElementById('see-favorites-link').addEventListener('click', (e) => {
  let currentFavorites = '';
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/favorites?api_key=${apiKey}`, function (response) {
    response.data.forEach( city => {
      currentFavorites += `${city.location}; `;
    })
    currentFavorites = currentFavorites.slice(0, currentFavorites.length - 2);
    alert(`Current favorites: ${currentFavorites}`);
  })
})

document.getElementById('logout-link').addEventListener('click', (e) => {
  document.querySelector('#login').classList.add('hidden');
  document.querySelector('#register').classList.add('hidden');;
  document.getElementById('hello-user').innerHTML = '';
  document.cookie = "apiKey=";
  document.cookie = "username=";
  initialVisit();
})

document.getElementById('submit-register').addEventListener('click', (e) => {
  e.preventDefault();
  let username = document.getElementById('register-username').value
  let password = document.getElementById('register-password').value
  let passwordConfirmation = document.getElementById('register-password-confirmation').value
  $.post(`https://sweater-weather-1810.herokuapp.com/api/v1/users?email=${username}&password=${password}&password_confirmation=${passwordConfirmation}`, (response) => {
    if(response.api_key) {
      let apiKey = response.api_key;
      document.cookie = `apiKey=${apiKey}`;
      document.cookie = `username=${username}`;
    } else {
      alert('Registration not successful');
    }
    document.getElementById('register').classList.add('hidden');
    initialVisit();
  })
  .fail(() => { 
    alert('Registration not successful');
  });
});

document.getElementById('submit-login').addEventListener('click', (e) => {
  e.preventDefault();
  let username = document.getElementById('login-username').value
  let password = document.getElementById('login-password').value
  $.post(`https://sweater-weather-1810.herokuapp.com/api/v1/sessions?email=${username}&password=${password}`, (response) => {
    if(response.api_key) {  
      let apiKey = response.api_key;
      document.cookie = `apiKey=${apiKey}`;
      document.cookie = `username=${username}`;
      document.getElementById('login').classList.add('hidden');
    } else {
      alert('Login not successful');
    }
    initialVisit();
  })
  .fail(() => {
    alert('Login not successful');
  });
});

document.getElementById('see-more-hours').addEventListener('click', () => {
  const hourWeather = document.getElementsByClassName('weather-hour');
  Array.prototype.forEach.call(hourWeather, function (hW) {
    hW.classList.remove('hidden');
  });
  document.getElementById('see-more-hours').classList.add('hidden');
})

var loading = document.querySelector('.loader-container');
$(document)
  .ajaxStart(function () {
    loading.classList.remove('hidden');
  })
  .ajaxStop(function () {
    loading.classList.add('hidden');
  });