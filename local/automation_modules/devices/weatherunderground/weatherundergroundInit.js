var util = require('util');
var events = require('events');
var http = require('http');

var WEATHER_UNDERGROUND_KEY;

var WeatherUnderground = function(weather_underground_key_input){
  // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
  // using `this` in the setTimeout functions will refer to those funtions, not the class
  var self = this;

  WEATHER_UNDERGROUND_KEY = weather_underground_key_input;
  // EventEmitters inherit a single event listener, see it in action
  this.on('newListener', function(listener) {
      //console.log('Event Listener: ' + listener);
  });
}

// extend the EventEmitter class using our Radio class
WeatherUnderground.prototype = new events.EventEmitter;
util.inherits(WeatherUnderground, events.EventEmitter);

WeatherUnderground.prototype.getWeatherUndergroundData = function() {
  var self = this;
  http.get("http://api.wunderground.com/api/"+WEATHER_UNDERGROUND_KEY+"/astronomy/forecast/conditions/q/autoip.json", function(res) {
    var data = '';
    //console.log("Got response: " + res.statusCode);
    res.on('data', function (chunk){
      data += chunk;
    });
    res.on('end', function(){
      var response = data; // This transfers data from the chunked version of Bytes to a JSON type
      var result = JSON.parse(response); // parses it into Object
      // console.log(result);

      self.emit("result", result); // this gives an immediate result

      //console.log(result.current_observation.temp_f);
      // for(var i=0;i<3;i++)
      // {
      //   console.log(result.forecast.txt_forecast.forecastday[i].title);
      //   console.log(result.forecast.txt_forecast.forecastday[i].fcttext);
      // }
    });
  }).on('error', function(e) {
     console.log("HTTP Request got error: " + e.message);
  });
}

exports.WeatherUnderground = WeatherUnderground;