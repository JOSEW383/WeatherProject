require('dotenv').config()
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  let city = String(req.body.cityInput);
  getWeather(res, city);
});


function getWeather(res, city){
  let appid = process.env.API_KEY
  let unit = "metric"
  let url = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&units='+unit+'&appid='+appid;

  https.get(url, (response) => {
    // console.log('statusCode:', res.statusCode);
    // console.log('headers:', res.headers);

    response.on('data', (data) => {
      let weatherData = JSON.parse(data);
      if(weatherData.cod=='200'){
        let weatherTemperature = weatherData.main.temp;
        let weatherDescription = weatherData.weather[0].description;
        let iconCode = weatherData.weather[0].icon
        let iconURL = 'https://openweathermap.org/img/wn/'+iconCode+'@2x.png';
        // console.log('weatherData:', weatherData);
        console.log('weatherTemperature:', weatherTemperature);
        console.log('weatherDescription:', weatherDescription);
  
        res.write('<h1>The temperature in '+city+' is '+weatherTemperature+' degrees celsius</h1>');
        res.write('<p1>The weather is currently '+weatherDescription+'</p1>' + '<img src="'+iconURL+'" width="30" height="30">');
      }else{
        res.write('<h1>Please enter a valid city</h1>');
      }

      res.send();
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

module.exports = app;