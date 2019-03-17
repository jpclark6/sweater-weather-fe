# FiveCast - Weather Forecast

[FiveCast](https://sweater-weather-1810.surge.sh), or Sweater Weather front end, is a vanilla javascript (minus ajax requests) front end to consume the Sweater Weather back end API, [deployed API](https://sweater-weather-1810.herokuapp.com/api/v1/forecast?location=denver,co), [github](https://github.com/jpclark6/sweater-weather). It displays the current weather, up to 24 hours of hourly forecasts, and 5 days of daily forecasts, hence the name FiveCast. It allows for user registration and login, and the ability to favorite locations. In addition it displays a background image of the city you are viewing.

![Screenshot](./images/full_screen.png "Screenshot")
![Screenshot](./images/mobile.png "Screenshot")

## Getting Started

### Prerequsites

You must have npm and node.js installed to successfully run this project.

### Installing

To run on localhost clone the repo to an appropriate directory, install dependencies, and then start a live server.

```
git clone git@github.com:jpclark6/sweater-weather-fe.git
npm install
npm start
```

Visit localhost:3000, or whatever port you decide to run it on, and enter in a location to see the forecast. Note: back end may take up to 30 seconds to restart dynos if it hasn't run in a while.

## Deployment

It is currently deployed [here](https://sweater-weather-1810.surge.sh) using surge.

## Tech stack and tools

1. [waffle.io](waffle.io) was used for an agile board with user stories written before starting
2. JavaScript
3. jQuery (for http requests)
4. Webpack
5. node.js

## What's Next

I have a few ideas where to go next with this project.

1. Add icons for weather. I already have icons in the images folder that will work. It will require the filenames to be changed to match the API icon names for the current weather, and then use string interpolation to display the correct icon based on the weather. 

2. Automatic user location. When a user visits the page it asks to use the user location and then automatically displays the forecast. Currently the API takes city, state and then converts it to latitude and logitude all on the back end, so the back end would need to be updated to take latitude and logitude as inputs from the front end.

3. Currently the API key is stored in plain text as a cookie. Using web tokens would be a better idea, along with using web tokens for register and login. Currently the site is not very secure, minus that it uses https.

## Authors

The back end and front end were both solo project by [me](https://github.com/jpclark6).




