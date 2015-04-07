// Require HTTP module (to start server) and Socket.IO
var http = require('http');
var io = require('socket.io');
var port = process.env.port || 8080;

// Start the server
var server = http.createServer(function(req, res){ 
  // Send HTML headers and message
  res.writeHead(200,{ 'Content-Type': 'text/html' });
  res.end('<h1>Hello Open Source Home Hub User!</h1>' + JSON.stringify(storedWeatherData));
});

server.listen(port);
console.log('socket.io server started on port: ' + port + '\n');

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 
  console.log("connection established");

  // Success!  Now listen to messages to be received
  client.on('message',function(event){ 
    console.log('Received message from client!',event);
    socket.emit('message', { user: 'online-hub', msg: 'hello?' });
  });

  client.on('disconnect',function(){
    console.log('client has disconnected');
  });

});

// Required for Scripts
var config = require('./config.js');
var sparkInit = require('./automation_modules/devices/spark/sparkInit.js');
var WeatherUnderground = require('./automation_modules/devices/weatherunderground/weatherundergroundInit.js').WeatherUnderground;
// var WemoControlPoint = require('./automation_modules/devices/wemo/wemoInit.js').cp; // needed to initialize the upnp module for WeMo support

// Scripts
var SparkButtonToSparkRGB = require('./automation_modules/sparkButtonToSparkRGB.js').SparkButtonToSparkRGB;
// var SparkButtonToWemoSwitch = require('./automation_modules/sparkButtonToWemoSwitch.js').SparkButtonToWemoSwitch;
// var TimedWemoSwitch = require('./automation_modules/timedWemoSwitch.js').TimedWemoSwitch;
// var SparkMotionToWemoSwitch = require('./automation_modules/sparkMotionToWemoSwitch.js').SparkMotionToWemoSwitch;

// Global Hub Variables
var storedWeatherData = {
  data: '',
  currentOutsideTemp: '',
  sunriseHour: '',
  sunriseMinute: '',
  sunsetHour: '',
  sunsetMinute: ''
};

// Initializations
var spark = sparkInit.init(config.SPARK_USERNAME, config.SPARK_PASSWORD);
var weatherUnderground = new WeatherUnderground(config.WEATHER_UNDERGROUND_KEY);
weatherUnderground.on("result", function(result){ // on the 'result' event, it will store the result
  storedWeatherData.data = result;
  storedWeatherData.currentOutsideTemp = result.current_observation.temp_f;
  storedWeatherData.sunriseHour = result.moon_phase.sunrise.hour;
  storedWeatherData.sunriseMinute = result.moon_phase.sunrise.minute;
  storedWeatherData.sunsetHour = result.moon_phase.sunset.hour;
  storedWeatherData.sunsetMinute = result.moon_phase.sunset.minute;
  // console.log(storedWeatherData);
});

// Scripts
weatherUnderground.getWeatherUndergroundData(); // Polls for the Weather from WeatherUnderground at the time of start
setInterval(function() { // Polls for the Weather from WeatherUnderground every 15 minutes
  weatherUnderground.getWeatherUndergroundData();
}, 900000);
// var sparkMotionToWemoSwitch1 = new SparkMotionToWemoSwitch(WemoControlPoint, spark, 1, config.WEMO_SWITCH_NAME1);
// var sparkButtonToSparkRGB1 = new SparkButtonToSparkRGB(spark, 1, 0);
// var sparkButtonToWemoSwitch1 = new SparkButtonToWemoSwitch(WemoControlPoint, spark, 1, config.WEMO_SWITCH_NAME1);
// var timedWemoSwitch1 = new TimedWemoSwitch(WemoControlPoint, config.WEMO_SWITCH_NAME1, 1000);
// var timedWemoSwitch2 = new TimedWemoSwitch(WemoControlPoint, config.WEMO_SWITCH_NAME2, 1000);