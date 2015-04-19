var io = require('socket.io-client');
var fs = require ('fs');

var deviceDictionary = {};
var scriptDictionary = {};
var activeDeviceDictionary = {};
var activeScriptDictionary = {};
var runningDeviceDictionary = {};
var runningScriptDictionary = {};

// Global Hub Variables
var storedWeatherData = {
  data: '',
  currentOutsideTemp: '',
  sunriseHour: '',
  sunriseMinute: '',
  sunsetHour: '',
  sunsetMinute: ''
};

// Loads the scripts/devices from the json file
var ReadData = function(){
  var fileData;
  fs.readFile('./storage.json', 'utf8', function (err, data) {
    if (err) throw err;
    fileData = JSON.parse(data);
    // console.log(fileData);
    deviceDictionary = fileData.devices;
    // console.log("deviceDictionary-----------------");
    // console.log(deviceDictionary);
    scriptDictionary = fileData.scripts;
    // console.log("scriptDictionary-----------------");
    // console.log(scriptDictionary);
    activeDeviceDictionary = fileData.activeDevices;
    // console.log("activeDeviceDictionary-----------------");
    // console.log(activeDeviceDictionary);
    activeScriptDictionary = fileData.activeScripts;
    // console.log("activeScriptDictionary-----------------");
    // console.log(activeScriptDictionary);
    PopulateRunningDictionaries();
    RunRunningDictionaries();
  });
};
ReadData();

socket = io.connect('http://localhost:3000'); // For local debug
//socket = io.connect('http://ohh.azurewebsites.net');
console.log("connection requested");

socket.on('connect', function () { 
  console.log("socket connected"); 
  socket.emit('message', { user: 'local-hub', msg: 'hello?' });
});

socket.on('message',function(event){ 
  console.log('Received message from server!',event);
});

socket.on('data', function(data){
  fs.writeFile('./storage.json', data, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
    ClearRunningDictionaries();
    ReadData();
  });
});

// Required for Scripts
var config = require('./config.js');
var sparkInit = require('./automation_modules/devices/spark/sparkInit.js');
var WeatherUnderground = require('./automation_modules/devices/weatherunderground/weatherundergroundInit.js').WeatherUnderground;
var WemoControlPoint = require('./automation_modules/devices/wemo/wemoInit.js').cp; // needed to initialize the upnp module for WeMo support

// Scripts
var SparkButtonToSparkRGB = require('./automation_modules/sparkButtonToSparkRGB.js').SparkButtonToSparkRGB;
var SparkButtonToWemoSwitch = require('./automation_modules/sparkButtonToWemoSwitch.js').SparkButtonToWemoSwitch;
var TimedWemoSwitch = require('./automation_modules/timedWemoSwitch.js').TimedWemoSwitch;
var SparkMotionToWemoSwitch = require('./automation_modules/sparkMotionToWemoSwitch.js').SparkMotionToWemoSwitch;
var GetWeatherUndergroundDataOnInterval = require('./automation_modules/getWeatherUndergroundDataOnInterval.js').GetWeatherUndergroundDataOnInterval;

// Helper Functions for parsing the Params
var ParseParamForDevice = function(identifier, value){
  if(identifier.indexOf("config-") !=-1)
  {
    return config.configDictionary[identifier.substring(7)]; // returns the string minus the config-
  }else if(identifier.indexOf("int-") !=-1){
    return parseInt(value);
  }else if(identifier.indexOf("string-") !=-1){
    return value;
  }else{
    console.log("Could not parse the parameter.");
    return null;
  }
}
var ParseParamForScript = function(identifier, value){
  var device = runningDeviceDictionary[value];
  if(typeof device != "undefined")
  {
    return device;
  }else{
    if(identifier.indexOf("int-") !=-1)
    {
      return parseInt(value);
    }else if(identifier.indexOf("string-") !=-1){
      return value;
    }else{
      console.log("Could not parse the parameter.");
      return null;
    }
  }
}

var RunRunningDictionaries = function(){
  for(kvp in runningScriptDictionary)
  {
    runningScriptDictionary[kvp].begin();
  }
}

var ClearRunningDictionaries = function(){
  for(kvp in runningScriptDictionary)
  {
    runningScriptDictionary[kvp].close();
  }

  deviceDictionary = {};
  scriptDictionary = {};
  activeDeviceDictionary = {};
  activeScriptDictionary = {};
  runningDeviceDictionary = {};
  runningScriptDictionary = {};
};

// Populate the Running Dictionaries and make sure it works
// Populate the Running Device Dictionary
var PopulateRunningDictionaries = function()
{
  for (kvp in activeDeviceDictionary)
  {
    // Must be found in the default dictionary, if not, it is not added
    // console.log("--------------------------------")
    // console.log("kvp");
    // console.log(kvp);
    var type = activeDeviceDictionary[kvp]["type"]
    var defaultDevice = deviceDictionary[type];
    console.log("Default Device");
    console.log(defaultDevice);
    if(defaultDevice)
    {
      // If init is null
      if(defaultDevice["init"] == "null")
      {
        // console.log("defaultDeviceParam");
        // console.log(defaultDevice["params"][0]);
        // console.log("activeDeviceParam");
        // console.log(activeDeviceDictionary[kvp]["params"][0]);
        runningDeviceDictionary[kvp] = ParseParamForDevice(defaultDevice["params"][0], activeDeviceDictionary[kvp]["params"][0]);
      }else{
        // Else, create the object
        // if params are null then just call the creation
        // console.log(defaultDevice.params);
        if(defaultDevice.params.indexOf("null") != -1)
        {
          // console.log("null params "+kvp);
          // Specialized for WemoControlPoint
          runningDeviceDictionary[kvp] = WemoControlPoint;
        }else{
          switch(type) {
            case "SparkInit":
            // if params are not null, then parse them and place them in the right order in the creation function
            // Specialized for Spark Init
            // console.log("not null params " + kvp);
            // these actually don't use the activeDevice params since there are none and the choice to put them in the configDictionary locally
            runningDeviceDictionary[kvp] = sparkInit.init(
              ParseParamForDevice(defaultDevice.params[0], activeDeviceDictionary[kvp]["params"][0]),
              ParseParamForDevice(defaultDevice.params[1], activeDeviceDictionary[kvp]["params"][1]));
              break;
            case "WeatherUnderground":
              runningDeviceDictionary[kvp] = new WeatherUnderground(ParseParamForDevice(defaultDevice.params[0], activeDeviceDictionary[kvp]["params"][0]));
              runningDeviceDictionary[kvp].on("result", function(result){ // on the 'result' event, it will store the result
                storedWeatherData.data = result;
                storedWeatherData.currentOutsideTemp = result.current_observation.temp_f;
                storedWeatherData.sunriseHour = result.moon_phase.sunrise.hour;
                storedWeatherData.sunriseMinute = result.moon_phase.sunrise.minute;
                storedWeatherData.sunsetHour = result.moon_phase.sunset.hour;
                storedWeatherData.sunsetMinute = result.moon_phase.sunset.minute;
              });
              break;
            default:
              break;
          }
        }
      }
    }
  }
  // Populate the script dictionaries
  for (kvp in activeScriptDictionary)
  {
    // console.log(kvp);
    var type = activeScriptDictionary[kvp]["type"];
    var script = scriptDictionary[type];
    var scriptParams = script.params;
    // console.log(script);
    var activeScriptParams = activeScriptDictionary[kvp]["params"];
    // console.log(activeScriptParams);
    if(script)
    {
      // Check the Script Type and change the functionality depending on the type of script
      // and parse the params as required
      switch(type) {
        case "SparkButtonToSparkRGB":
          // 3 params
          runningScriptDictionary[kvp] = new SparkButtonToSparkRGB(
            ParseParamForScript(scriptParams[0], activeScriptParams[0]),
            ParseParamForScript(scriptParams[1], activeScriptParams[1]),
            ParseParamForScript(scriptParams[2], activeScriptParams[2]));
          break;
        case "SparkButtonToWemoSwitch":
          // 4 params
          runningScriptDictionary[kvp] = new SparkButtonToWemoSwitch(
            ParseParamForScript(scriptParams[0], activeScriptParams[0]),
            ParseParamForScript(scriptParams[1], activeScriptParams[1]),
            ParseParamForScript(scriptParams[2], activeScriptParams[2]),
            ParseParamForScript(scriptParams[3], activeScriptParams[3]));
          break;
        case "SparkMotionToWemoSwitch":
          // 4 params
          runningScriptDictionary[kvp] = new SparkMotionToWemoSwitch(
            ParseParamForScript(scriptParams[0], activeScriptParams[0]),
            ParseParamForScript(scriptParams[1], activeScriptParams[1]),
            ParseParamForScript(scriptParams[2], activeScriptParams[2]),
            ParseParamForScript(scriptParams[3], activeScriptParams[3]));
          break;
        case "TimedWemoSwitch":
          // 3 params
          runningScriptDictionary[kvp] = new TimedWemoSwitch(
            ParseParamForScript(scriptParams[0], activeScriptParams[0]),
            ParseParamForScript(scriptParams[1], activeScriptParams[1]),
            ParseParamForScript(scriptParams[2], activeScriptParams[2]));
          break;
        case "GetWeatherUndergroundDataOnInterval":
          // 3 params
          runningScriptDictionary[kvp] = new GetWeatherUndergroundDataOnInterval(
            ParseParamForScript(scriptParams[0], activeScriptParams[0]),
            ParseParamForScript(scriptParams[1], activeScriptParams[1]));
          break;
        default:
          break;
      }
    }
  }

  // Print out for visual check of all of the stored values
  // console.log("runningDeviceDictionary----------------------");
  // console.log(runningDeviceDictionary);
  // console.log("runningScriptDictionary----------------------");
  // console.log(runningScriptDictionary);
}

// // Initializations
// var spark = sparkInit.init(config.SPARK_USERNAME, config.SPARK_PASSWORD);


// var weatherUnderground = new WeatherUnderground(config.WEATHER_UNDERGROUND_KEY);
// weatherUnderground.on("result", function(result){ // on the 'result' event, it will store the result
//   storedWeatherData.data = result;
//   storedWeatherData.currentOutsideTemp = result.current_observation.temp_f;
//   storedWeatherData.sunriseHour = result.moon_phase.sunrise.hour;
//   storedWeatherData.sunriseMinute = result.moon_phase.sunrise.minute;
//   storedWeatherData.sunsetHour = result.moon_phase.sunset.hour;
//   storedWeatherData.sunsetMinute = result.moon_phase.sunset.minute;
//   // console.log(storedWeatherData);
// });

// // Scripts
// weatherUnderground.getWeatherUndergroundData(); // Polls for the Weather from WeatherUnderground at the time of start
// setInterval(function() { // Polls for the Weather from WeatherUnderground every 15 minutes
//   weatherUnderground.getWeatherUndergroundData();
// }, 900000);
// var getWeatherUndergroundDataOnInterval1 = new GetWeatherUndergroundDataOnInterval(weatherUnderground, 900000);
// var sparkMotionToWemoSwitch1 = new SparkMotionToWemoSwitch(WemoControlPoint, spark, 1, config.WEMO_SWITCH_NAME1);
// var sparkButtonToSparkRGB1 = new SparkButtonToSparkRGB(spark, 1, 0);
// var sparkButtonToWemoSwitch1 = new SparkButtonToWemoSwitch(WemoControlPoint, spark, 1, config.WEMO_SWITCH_NAME1);
// var timedWemoSwitch1 = new TimedWemoSwitch(WemoControlPoint, config.WEMO_SWITCH_NAME1, 1000);
// var timedWemoSwitch2 = new TimedWemoSwitch(WemoControlPoint, config.WEMO_SWITCH_NAME2, 1000);

