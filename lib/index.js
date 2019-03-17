// FUNCTIONS

const initialVisit = () => {
  if(loggedIn) {
    let cookies = document.cookie.split('; ');
    apiKey = cookies[0].split('=')[1];
    let username = cookies[1].split('=')[1];
    if(apiKey != '') {
      addWelcomeMessage(username);
      showLinksUser();
    } else {
      showLinksGuest();
    }
  }
}

const loggedIn = () => {
  return document.cookie;
}

const addWelcomeMessage = (username) => {
  let usernameElementParent = document.getElementById('hello-user');
  let usernameElement = document.createElement('p');
  let usernameText = document.createTextNode(`Welcome, ${username}`);
  usernameElement.appendChild(usernameText);
  usernameElementParent.appendChild(usernameElement);
}

const showLinksUser = () => {
  document.getElementById('login-link').classList.add('hidden');
  document.getElementById('register-link').classList.add('hidden');
  document.getElementById('see-favorites-link').classList.remove('hidden');
  document.getElementById('logout-link').classList.remove('hidden');
}

const showLinksGuest = () => {
  document.getElementById('login-link').classList.remove('hidden');
  document.getElementById('register-link').classList.remove('hidden');
  document.getElementById('see-favorites-link').classList.add('hidden');
  document.getElementById('logout-link').classList.add('hidden');
}

const updateWeather = (cityState, cityStateName) => {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=${cityState}`, function(response){
    let weatherData = response.data;
    clearDOM();
    updateCurrentWeather(weatherData, cityStateName);
    updateHourly(weatherData);
    updateFiveDay(weatherData);
  })
}

const clearDOM = () => {
  let nodes = [];
  nodes.push(document.getElementById('hourly-weather'))
  nodes.push(document.getElementById('daily-weather'))
  nodes.forEach(node => {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  })
}

const updateCurrentWeather = (data, cityStateName) => {
  let temp = data.currently.temperature;
  let humidity = data.currently.humidity;
  let high = data.daily[0].high;
  let low = data.daily[0].low;
  let description = data.currently.description;

  document.getElementById('current-city-state').textContent = cityStateName;
  if(apiKey != '') {
    document.getElementById('add-favorite').classList.remove('hidden');
  }
  document.getElementById('current-temp').innerHTML = "Currently: <span class='red'>" + Math.round(temp * 10) / 10 + "°F</span>";
  document.getElementById('current-humidity').innerHTML = "Humidity: <span class='red'>" + Math.round(humidity * 100) + "%</span>";
  document.getElementById('current-high').innerHTML = "High: <span class='red'>" + Math.round(high * 10) / 10 + "°F</span>";
  document.getElementById('current-low').innerHTML = "Low: <span class='red'>" + Math.round(low * 10) / 10 + "°F</span>";
  document.getElementById('current-description').innerHTML = '' + description + '';
}

const updateHourly = data => {
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

const updateFiveDay = (data) => {
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

const addHourTemp = (hour, i) => {
  let tempElement = document.createElement('p');
  tempElement.classList.add('temp');
  let tempText = document.createTextNode(Math.round(hour.temperature * 10) / 10 + "°F");
  tempElement.appendChild(tempText);
  document.getElementById(`hour-${i}`).appendChild(tempElement);
}

const addHourDescription = (hour, i) => {
  let descriptionElement = document.createElement('p');
  descriptionElement.style.textTransform = 'uppercase';
  let descriptionText = document.createTextNode(hour.icon);
  descriptionElement.appendChild(descriptionText);
  document.getElementById(`hour-${i}`).appendChild(descriptionElement);
}

const addHourTime = (hour, i) => {
  let timeElement = document.createElement('p');
  timeElement.classList.add('time');
  let time = new Date(hour.time * 1000);
  let timeWrapper = moment(time).format("ddd, hA");
  let timeText = document.createTextNode(timeWrapper);
  timeElement.appendChild(timeText);
  document.getElementById(`hour-${i}`).appendChild(timeElement);
}

const addDailyTime = (day, i) => {
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

const addDailyDescription = (day, i) => {
  let description = document.createElement('p');
  description.classList.add('daily-description');
  let descriptionText = document.createTextNode(day.status);
  description.appendChild(descriptionText);
  document.getElementById(`day-${i}`).appendChild(description);
}

const addDailyHighTemp = (day, i) => {
  let high = document.createElement('p');
  high.classList.add('daily-temp');
  let highText = document.createTextNode('High: ' + Math.round(day.high * 10) / 10 + "°F");
  high.appendChild(highText);
  document.getElementById(`day-${i}`).appendChild(high);
}

const addDailyLowTemp = (day, i) => {
  let low = document.createElement('p');
  low.classList.add('daily-temp');
  let lowText = document.createTextNode('Low:   ' + Math.round(day.low * 10) / 10 + "°F");
  low.appendChild(lowText);
  document.getElementById(`day-${i}`).appendChild(low);
}

const addImage = cityState => {
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/backgrounds?location=${cityState}`, function(response){
    let imageURL = response.url;
    document.getElementById('background-image').innerHTML = `<img src=${imageURL} alt='City' >`
  })
}

// CREATE LOADER SPINNER BASED ON WHETHER NETWORK REQUEST IS OPEN

const loading = document.querySelector('.loader-container');
$(document)
  .ajaxStart(function () {
    loading.classList.remove('hidden');
  })
  .ajaxStop(function () {
    loading.classList.add('hidden');
  });

// INITIAL LOADING SEQUENCE

let apiKey = '';
initialVisit();

// EVENT LISTENERS

// submit button for city, state when finding weather
document.getElementById('submit-city-state').addEventListener('click', (e) => {
  e.preventDefault();
  let cityState = document.getElementById('city-state').value.replace(/ /g, '');
  let cityStateName = document.getElementById('city-state').value;
  cityStateName = cityStateName.split(',')[0].trim() + ', ' + cityStateName.split(',')[1].trim();
  updateWeather(cityState, cityStateName);
  addImage(cityState);
}, false);

// top link to log in
document.getElementById('login-link').addEventListener('click', (e) => {
  let loginElement = document.querySelector('#login');
  let registerElement = document.querySelector('#register');
  loginElement.classList.toggle('hidden');
  registerElement.classList.add('hidden');
})

// top link to register
document.getElementById('register-link').addEventListener('click', (e) => {
  let loginElement = document.querySelector('#login');
  let registerElement = document.querySelector('#register');
  registerElement.classList.toggle('hidden');
  loginElement.classList.add('hidden');
})

// top link to see favorites
document.getElementById('see-favorites-link').addEventListener('click', (e) => {
  let currentFavorites = '';
  $.getJSON(`https://sweater-weather-1810.herokuapp.com/api/v1/favorites?api_key=${apiKey}`, function (response) {
    response.data.forEach( city => {
      currentFavorites += `${city.location} - Currently ${city.current_weather.currently.temperature} °F; `;
    })
    currentFavorites = currentFavorites.slice(0, currentFavorites.length - 2);
    alert(`Current favorites: ${currentFavorites}`);
  })
})

// top link to log out
document.getElementById('logout-link').addEventListener('click', (e) => {
  document.querySelector('#login').classList.add('hidden');
  document.querySelector('#register').classList.add('hidden');;
  document.getElementById('hello-user').innerHTML = '';
  document.cookie = "apiKey=";
  document.cookie = "username=";
  initialVisit();
})

// button to submit registration info
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

// button to submit login info
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

// link to see more of the hourly forecast
document.getElementById('see-more-hours').addEventListener('click', () => {
  const hourWeather = document.getElementsByClassName('weather-hour');
  Array.prototype.forEach.call(hourWeather, function (hW) {
    hW.classList.remove('hidden');
  });
  document.getElementById('see-more-hours').classList.add('hidden');
})

// link to add favorite
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