var fs = require('fs');

var deviceTypeMap = {};
deviceTypeMap["Test"] = require('./devices/Test.js');
deviceTypeMap["Clock"] = require('./devices/Clock.js');

// populated by config file
var deviceTypeDictionary = {};
var yourDevicesDictionary = {};
var yourScenariosDictionary = {};

// populated using the config file and our parsing mechanism
var runningDevicesDictionary = {};
var runningScenarios = [];

// Loads the scripts/devices from the json file
var ReadData = function(){
  var fileData;
  fs.readFile('./config.json', 'utf8', function (err, data) {
    if (err) throw err;
    fileData = JSON.parse(data);
    console.log(fileData);

    deviceTypeDictionary = fileData.deviceTypes;
    yourDevicesDictionary = fileData.yourDevices;
    yourScenariosDictionary = fileData.yourScenarios;
    console.log("deviceTypeDictionary-----------------");
    console.log(deviceTypeDictionary);
    console.log("yourDevicesDictionary-----------------");
    console.log(yourDevicesDictionary);
    console.log("yourScenariosDictionary-----------------");
    console.log(yourScenariosDictionary);

    PopulateRunningDictionaries();
    //RunRunningDictionaries();
  });
};
ReadData();

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
  var device = runningDevicesDictionary[value];
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

var ClearRunningDictionaries = function(){
  deviceTypeDictionary = {};
  yourDevicesDictionary = {};
  yourScenariosDictionary = {};
  
  runningDevicesDictionary = {};
  runningScenarios = {};
};

// Populate the Running Dictionaries and make sure it works
// Populate the Running Device Dictionary
var PopulateRunningDictionaries = function()
{
  for (nameOfYourDevice in yourDevicesDictionary)
  {
    // Must be found in the default dictionary, if not, it is not added
    // console.log("--------------------------------");
    // console.log("nameOfYourDevice");
    // console.log(nameOfYourDevice);
    
    var type = yourDevicesDictionary[nameOfYourDevice]["type"];
    var params = yourDevicesDictionary[nameOfYourDevice]["params"];
    var defaultDevice = deviceTypeDictionary[type];
    // console.log("Default Device");
    // console.log(defaultDevice);
    console.log("type");
    console.log(type);
    // console.log("params");
    // console.log(params);

    // checks if the deviceType has been defined in config file and has a valid deviceTypeMap entry
    if(defaultDevice && deviceTypeMap[type])
    {
      runningDevicesDictionary[nameOfYourDevice] = new deviceTypeMap[type](params);
    }
  }
  // Populate the script dictionaries
  for (scenarioId in yourScenariosDictionary)
  {
    var scenario = yourScenariosDictionary[scenarioId];
    console.log("--------------------------------");
    console.log("scenario");
    console.log(scenario);
    console.log("trigger")
    console.log(scenario.trigger);
    console.log("actions");
    console.log(scenario.actions);

    var triggerDevice = runningDevicesDictionary[scenario.trigger.device];
    var triggerName = scenario.trigger.trigger;
    var customTriggerName = scenario.trigger.customTrigger;
    var triggerParams = scenario.trigger.params;

    // skips any scenarios that has any of the following:
    //  non-existant trigger device
    //  non-existant trigger name
    if(!triggerDevice || !triggerDevice[triggerName]) 
    {
      continue;
    }
    console.log("--------------------------------");
    console.log("triggerDevice");
    console.log(triggerDevice);
    console.log("triggerName")
    console.log(triggerName);
    console.log("customTriggerName");
    console.log(customTriggerName);
    console.log("triggerParams");
    console.log(triggerParams);

    triggerDevice[triggerName](customTriggerName, triggerParams); // this sets up the trigger event

    // This handles the actions to perform on trigger
    runningScenarios.push(triggerDevice.on(customTriggerName, function() {
      // executes the list of actions
      for (var actionId in scenario.actions)
      {
        var action = scenario.actions[actionId];
        console.log("--------------------------------");
        console.log("action");
        console.log(action);

        var actionDevice = runningDevicesDictionary[action.device];
        var actionName = action.action;
        var actionParams = action.params;

        if(!actionDevice) // skips any action that has a non-existant action device
        {
          continue;
        }
        actionDevice[actionName](actionParams);
      }
    }));
  }

  // Print out for visual check of all of the stored values
  console.log("runningDevicesDictionary----------------------");
  console.log(runningDevicesDictionary);
  console.log("runningScenarios----------------------");
  console.log(runningScenarios);
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

