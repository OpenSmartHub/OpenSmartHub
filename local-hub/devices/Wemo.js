/* 
  // Device Type
  "Wemo":{ 
      "params":["name"],
      "data":{
        "state":"on/off"
      },
      "triggers":{
        "toggledTrigger":["on/off/both"]
      },
      "actions":{
        "Toggle":["on/off/both"],
        "timedToggle":["on/off/both","milliseconds"]
      }
    }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var cp = require('./wemo/wemoInit.js').cp;
var wemoStructure = require('./wemo/lib/wemo.js');

function Wemo(params) {
  EventEmitter.call(this); // This allows for events to be emitted
  var self = this;
  this.name = params["name"];
  this.wemoDevice = null;

  this.data = {};
  this.data.state = "off";

  // This will wait for a response from the control point with the devices
  cp.on("device", function(device){
    if(!self.wemoDevice) // to prevent repetitive device registrations
    {
      console.log("-------cp-devices-------");
      for (var tempDevice in cp.devices) // finds all the devices on your network
      {
        console.log(cp.devices[tempDevice].friendlyName);
        if(cp.devices[tempDevice].friendlyName == self.name && // checks whether or not it has the correct device name
        cp.devices[tempDevice].deviceType == wemoStructure.WemoControllee.deviceType) // This checks to see if it is a switch
        {
          self.wemoDevice = new wemoStructure.WemoControllee(cp.devices[tempDevice]); // handle to the wemo device you specified

          self.wemoDevice.eventService.on("stateChange", function(value)
          {
            if (value["BinaryState"] == "1")
            { 
              self.data.state = "on";
            }
            else if (value["BinaryState"] == "0")
            {
              self.data.state = "off";
            }
          });

          console.log("device found");
          self.emit("deviceFound");
        }
      }
      // check if wemoDevice was not found (if not, log it)
      if(!self.wemoDevice)
      {
        console.log("WeMo Device \"" + self.name + "\" not found.");        
      }
    }
  });

  var cpSearchInterval= setInterval(function(){
    console.log("---------searchIntervalCalled----------");
    console.log("wemoDevice: ");
    console.log(self.wemoDevice);
    if(!self.wemoDevice)
    {
      cp.search();

      // this is for the case that it is a reset ('scan complete won't get called again)
      for (var tempDevice in cp.devices) // finds all the devices on your network
      {
        console.log(cp.devices[tempDevice].friendlyName);
        if(cp.devices[tempDevice].friendlyName == self.name && // checks whether or not it has the correct device name
        cp.devices[tempDevice].deviceType == wemoStructure.WemoControllee.deviceType) // This checks to see if it is a switch
        {
          self.wemoDevice = new wemoStructure.WemoControllee(cp.devices[tempDevice]); // handle to the wemo device you specified

          self.wemoDevice.eventService.on("stateChange", function(value)
          {
            if (value["BinaryState"] == "1")
            { 
              self.data.state = "on";
            }
            else if (value["BinaryState"] == "0")
            {
              self.data.state = "off";
            }
          });

          console.log("device found");
          self.emit("deviceFound");
        }
      }
    }else{
      clearInterval(cpSearchInterval);
    }
  }, 5000);

  this.dispose = function(){
    clearInterval(cpSearchInterval);
    self.removeAllListeners();
    if(self.wemoDevice && self.wemoDevice.eventService)
    {
      self.wemoDevice.eventService.removeAllListeners();
    }
  };
};

util.inherits(Wemo, EventEmitter);

Wemo.prototype.toggledTrigger = function(customName, params){
  var self = this;
  var stateChange = params["on/off/both"];
  console.log("customName");
  console.log(customName);

  self.once("deviceFound",function(){
    if (self.wemoDevice.eventService) {
      self.wemoDevice.eventService.on("stateChange", function(value)
      {
        console.log("wemo switch state change: " + JSON.stringify(value));
        if (value["BinaryState"] == "1" && 
          (stateChange == "both" || stateChange == "on")) // this will signal when the value has been set to one (aka turned on)
        { 
          console.log("BinaryState is 1");
          self.emit(customName);
        }
        else if (value["BinaryState"] == "0" && 
          (stateChange == "both" || stateChange == "off"))
        {
          console.log("BinaryState is 0");
          self.emit(customName);
        }
        else if (value["UserAction"]) 
        {
          //self.emit("UserAction", value.BinaryState);
          console.log("UserAction");
          self.emit(customName);
        }
      });
    }
  });
};

Wemo.prototype.Toggle = function(params){
  var self = this;
  params["milliseconds"] = 0;
  self.timedToggle(params);
};

Wemo.prototype.timedToggle = function(params){
  var self = this;
  var stateChange = params["on/off/both"];
  var timeout_duration = params["milliseconds"];
  setTimeout(function(){
    if (stateChange == "both")
    {
      self.wemoDevice.setBinaryState(!self.wemoDevice.lastKnownValue);
    }
    else if (stateChange == "on") // this will signal when the value has been set to one (aka turned on)
    { 
      self.wemoDevice.setBinaryState(1);
    }
    else if (stateChange == "off")
    {
      console.log("setting it to 0");
      self.wemoDevice.setBinaryState(0);
    }
  }, timeout_duration); // timeout for however long you inputted
};

module.exports = Wemo;