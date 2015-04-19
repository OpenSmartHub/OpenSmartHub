var wemo = require("./devices/wemo/lib/wemo");

var TimedWemoSwitch = function(cp, wemo_device_name, timeout_duration)
{
  var wemoDevice;
  //console.log(wemo_device_name);

  var wemoEventCallback = function(value){
    console.log("wemo switch state change: " + JSON.stringify(value));
    if (value["BinaryState"] == "1") // this will signal when the value has been set to one (aka turned on)
    { 
      console.log("BinaryState is 1");
      // value has been set to true
      // device was turned on, so turn off in 5 minutes
      setTimeout(function(){
        console.log("setting it to 0");
        wemoDevice.setBinaryState(0);
      }, timeout_duration); // timeout for however long you inputted
    }
    else if (value["BinaryState"] == "0")
    {
      console.log("BinaryState is 0");
    }
    else if (value["UserAction"]) 
    {
      self.emit("UserAction", value.BinaryState);
    }
  };
  var callback = function(device) {
    if(!wemoDevice) // to prevent repetitive device registrations
    {
      //console.log(wemoResponseDevices);
      for (var tempDevice in cp.devices) // finds all the devices on your network
      {
        if(cp.devices[tempDevice].friendlyName == wemo_device_name && // checks whether or not it has the correct device name
        cp.devices[tempDevice].deviceType == wemo.WemoControllee.deviceType) // This checks to see if it is a switch
        {
          wemoDevice = new wemo.WemoControllee(cp.devices[tempDevice]); // handle to the wemo device you specified
          console.log("device found");
          if (wemoDevice.eventService) {
            wemoDevice.eventService.on("stateChange", wemoEventCallback);
            wemoDevice.eventService.subscribe(function(err, data) {
              //
            });
          }
        }
      }
      // check if wemoDevice was not found (if not, log it)
      if(!wemoDevice)
      {
        console.log("WeMo Device " + wemo_device_name + "not found.");        
      }
    }
  };

  TimedWemoSwitch.prototype.begin = function(){
    // console.log("begin");
    cp.on("device", callback); // needs to be the name of a generic function
    cp.search();
  };
  TimedWemoSwitch.prototype.close = function(){
    // console.log("close");
    if(typeof wemoDevice != "undefined")
    {
      wemoDevice.eventService.removeListener('stateChange', wemoEventCallback);
    }
    cp.removeListener('device', callback);
  };
}

exports.TimedWemoSwitch = TimedWemoSwitch;