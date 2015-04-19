var GetWeatherUndergroundDataOnInterval = function(weatherUnderground, interval)
{
  var timeoutId;
  
  GetWeatherUndergroundDataOnInterval.prototype.begin = function(){
    console.log("begin");
    weatherUnderground.getWeatherUndergroundData(); // Polls for the Weather from WeatherUnderground at the time of start
    timeoutId = setInterval(function() { // Polls for the Weather from WeatherUnderground every 15 minutes
      weatherUnderground.getWeatherUndergroundData();
    }, interval);
  };

  GetWeatherUndergroundDataOnInterval.prototype.close = function(){
    console.log("close");
    clearTimeout(timeoutId);
  };
};

exports.GetWeatherUndergroundDataOnInterval = GetWeatherUndergroundDataOnInterval;