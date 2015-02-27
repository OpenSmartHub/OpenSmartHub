var wemoInit = require("./devices/wemo/wemoInit.js");
var wemo = require("./devices/wemo/lib/wemo");

var wemoResponseDevices = wemoInit.devices; // the response from call to look up your network
var wemoDevice; // handle to the wemo device you specified

// Does the required setup to find the specified WeMo device on your network
var setup = function(wemo_device_name)
{
  for (var tempDevice in wemoResponseDevices)
  {
    // console.log(wemoResponseDevices[tempDevice]);
    if(wemoResponseDevices[tempDevice].friendlyName == wemo_device_name && // checks whether or not it has the correct device name
     wemoResponseDevices[tempDevice].deviceType == wemo.WemoControllee.deviceType) // This checks to see if it is a switch at all
    {
      wemoDevice = new wemo.WemoControllee(wemoResponseDevices[tempDevice]);
    }
  }    
}

// This does a timed call to your wemo device to change the value
var timedCall = function(device, value)
{
  if(device) // Checks to make sure that it was found
  {
    setTimeout(function() {
      device.setBinaryState(value);
    }, 4000);    
  }else{
    console.log("WeMo device was not found in sparkButtonToWemoSwitch");
  }
}

// this handles the setup of event logic
exports.init = function(spark, spark_button_num, wemo_device_name)
{
  spark.on('login', function() {
    //Your code here
    console.log("finished logging into spark")

    setup(wemo_device_name);

    spark.listDevices().then(function(devices) {
      devices[spark_button_num].onEvent('button', function(data) {
        console.log("Event: ");
        // console.log(devices[spark_button_num]);
        console.log(data.data); // this is the same data that you outputted from the sparkButton
        if(data.data == "triggeredOn")
        {
          timedCall(wemoDevice, true);
        }else{
          timedCall(wemoDevice, false);
        }
      });
    });
  });
}
