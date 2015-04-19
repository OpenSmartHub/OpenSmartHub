// This is based off of the http://www.hackster.io/anthony-ngu/spark-rgb ino code
// as well as the sparkButton.ino code provided in the root of this repo
var wemo = require("./devices/wemo/lib/wemo");

// This does a timed call to your wemo device to change the value
var triggerWeMo = function(device, value)
{
  if(device) // Checks to make sure that it was found
  {
    device.setBinaryState(value);
  }else{
    console.log("WeMo device was not found in sparkButtonToWemoSwitch");
  }
}

var SparkMotionToWemoSwitch = function(cp, spark, spark_motion_num, wemo_device_name)
{
  var wemoResponseDevices = cp.devices; // the response from call to look up your network
  var wemoDevice; // handle to the wemo device you specified
  var wemoState = 0;

  var sparkCallback = function() {
    spark.listDevices().then(function(devices) {
      devices[spark_motion_num].onEvent('motion', function(data) {
        if(data != null)
        {
          if(data.data == "1" && wemoState == 0)
          {
            triggerWeMo(wemoDevice, true);
          }else if(data.data == "0" && wemoState == 1){
            triggerWeMo(wemoDevice, false);
          }
        }
      });
    });
  };
  var callback = function(device){
    if(!wemoDevice) // to prevent repetitive device registrations
    {
      for (var tempDevice in cp.devices) // finds all the devices on your network
      {
        if(cp.devices[tempDevice].friendlyName == wemo_device_name && // checks whether or not it has the correct device name
        cp.devices[tempDevice].deviceType == wemo.WemoControllee.deviceType) // This checks to see if it is a switch
        {
          wemoDevice = new wemo.WemoControllee(cp.devices[tempDevice]); // handle to the wemo device you specified
         
          // this measures the current state of the WeMo Switch so that it does not send multiple needless messages to it
          if (wemoDevice.eventService) {
            wemoDevice.eventService.on("stateChange", function(value)
            {
              if (value["BinaryState"] == "1") // this will signal when the value has been set to one (aka turned on)
              {
                wemoState = 1;
              }
              else if (value["BinaryState"] == "0")
              {
                wemoState = 0;
              }
            });
            wemoDevice.eventService.subscribe(function(err, data) {
              //
            });
          }

          spark.on('login', sparkCallback);
        }
      }
      // check if wemoDevice was not found (if not, log it)
      if(!wemoDevice)
      {
        console.log("WeMo Device \"" + wemo_device_name + "\" not found.");        
      }
    }
  }

  SparkMotionToWemoSwitch.prototype.begin = function(){
    // console.log("begin");
    cp.on("device", callback);
  };
  SparkMotionToWemoSwitch.prototype.close = function(){
    // console.log("close");
    spark.removeListener('login', sparkCallback);
    cp.removeListener('device', callback);
  };
}

exports.SparkMotionToWemoSwitch = SparkMotionToWemoSwitch;