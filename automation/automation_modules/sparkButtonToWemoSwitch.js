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

// this handles the setup of event logic
exports.SparkButtonToWemoSwitch = function(cp, spark, spark_button_num, wemo_device_name)
{
  var wemoResponseDevices = cp.devices; // the response from call to look up your network
  var wemoDevice; // handle to the wemo device you specified

  cp.on("device", function(device){
    if(!wemoDevice) // to prevent repetitive device registrations
    {
      for (var tempDevice in cp.devices) // finds all the devices on your network
      {
        if(cp.devices[tempDevice].friendlyName == wemo_device_name && // checks whether or not it has the correct device name
        cp.devices[tempDevice].deviceType == wemo.WemoControllee.deviceType) // This checks to see if it is a switch
        {
          wemoDevice = new wemo.WemoControllee(cp.devices[tempDevice]); // handle to the wemo device you specified
          spark.on('login', function() {
            spark.listDevices().then(function(devices)
            {
              devices[spark_button_num].onEvent('button', function(data) {
                if(data != null)
                {
                  if(data.data == "triggeredOn")
                  {
                    triggerWeMo(wemoDevice, true);
                  }else{
                    triggerWeMo(wemoDevice, false);
                  }
                }
              });
            });
          });
        }
      }
    }
  });
}
