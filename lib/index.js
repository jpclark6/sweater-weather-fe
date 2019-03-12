// This file is in the entry point in your webpack config.

console.log('Loaded');
$.getJSON('https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=denver,co', function(response){
  console.log(response);
  $('p').text(response.data.currently.temperature + ' F in Denver, ' + response.data.currently.description);
})
  // .then(function (response) {
  //   console.log(response.json());
  //   return response.json()
  // })
  // .then(function (data) {
  //   console.log(data);
  //   $('p').text(data);
  // })