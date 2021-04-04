const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
require('dotenv').config();

/* API key for the OpenWeatherMap API, injects the key
   as an environment variable at run time.
*/
const OWM_API_KEY = process.env.OWM_API_KEY || 'invalid_key';

/* Calls the configurration map, controls if the weather forecast
   is displayed in metric(degree Celsius) or imperial units(fahrenheit)
*/
const UNITS = process.env.UNITS || 'metric';

/* GET home page. 
   All HTTP GET Requests to the '/' URL are 
   redirected to a page with an HTML form that allows you to enter
   a city name for which you want the weather forecast */
router.get('/', function(req, res) {
  res.render('index', { weather: null, err: null });
});


/*
    Handles HTTP POST requests from the HTML form 
    by invoking the OpenWeatherMap API, then passes the resulting
    JSON response to the HTML front end:
*/
router.post('/get_weather', async function (req,res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${UNITS}&appid=${OWM_API_KEY}`;

  try {
    let data = await fetch(url);
    let weather = await data.json();
    console.log(weather);
    if(weather.cod == '404' && weather.main == undefined) {
      res.render('index', {weather: null, error: 'Error: Unknown city'});
    }
    else if (weather.cod == '401' && weather.main == undefined) {
      res.render('index', {weather: null, error: 'Error: Invalid API Key. Please see http://openweathermap.org/faq#error401 for more info.'});
    }
    else {
      let unit_hex = (UNITS == 'imperial') ? '&#8457' : '&#8451';
      res.render('index', {weather: weather, error: null, units: unit_hex});
    }
  }
  catch (err) {
    console.log(err);
    res.render('index', {weather: null, error: 'Error: Unable to invoke OpenWeatherMap API'});
  }

});

module.exports = router;
