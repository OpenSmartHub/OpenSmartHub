var util = require('util');
var EventEmitter = require('events').EventEmitter;
var zwave = require('./ZWaveController.js');
var zwaveController = zwave.zwaveController;
var nodes = zwave.nodes;

function ZWaveDevice(params) {
  EventEmitter.call(this); // This allows for events to be emitted
  var self = this;
  this.nodeid = params["nodeid"];
  this.zwaveDevice = null;

  this.data = {};

  // Binary Switch ZWaveDevice
  this.data["switchState"] = "off"
  // this.triggers["switchToggledTrigger"] = ["on/off/both"];
  // this.actions["switchToggle"] =  ["on/off/both"];
  // this.actions["switchTimedToggle"] = [ "on/off/both", "milliseconds" ];

  // Multi-Sensor ZWaveDevice
  this.data["temperature"] = "0";
  this.data["luminance"] = "0";
  this.data["humidity"] = "0";

  // Binary Sensor
  this.data["sensorState"] = "open"
  // this.triggers["sensorToggledTrigger"] = ["closed/open/both"];

  // Battery ZWaveDevice
  this.data["batterylevel"] = "0"

  zwaveController.on('scan complete', function() {
    console.log("scan complete");
    if(!self.zwaveDevice && self.nodeid) // to prevent repetitive device registrations
    {
      console.log("-------zwave-devices-------");
      // for (var tempDevice in nodes) // finds all the devices on your network
      // {
      //   console.log(nodes[tempDevice]);
      // }
      // check if wemoDevice was not found (if not, log it)
      if(nodes[self.nodeid])
      {
        self.zwaveDevice = nodes[self.nodeid];
        console.log("device found");
        self.emit("deviceFound");
      }
      else
      {
        console.log("ZWave Device \"" + self.name + "\" not found.");        
      }
    }
  });

  var zWaveSearchInterval= setInterval(function(){
    console.log("---------searchIntervalCalled----------");
    console.log("zwaveDevice: ");
    console.log(self.zwaveDevice);
    if(!self.zwaveDevice && self.nodeid) // to prevent repetitive device registrations
    {
      zwaveController.connect();

      // this is for the case that it is a reset ('scan complete won't get called again)
      if(nodes[self.nodeid])
      {
        self.zwaveDevice = nodes[self.nodeid];
        console.log("device found");
        self.emit("deviceFound");
      }
    }else{
      clearInterval(zWaveSearchInterval);
    }
  }, 5000);

  this.dispose = function(){
    clearInterval(zWaveSearchInterval);
    self.removeAllListeners();
    zwaveController.removeAllListeners();
  };

  // Value Handlers
  self.once("deviceFound",function(){
    zwaveController.on('value changed', function(nodeid, commandclass, value){
      if(self.nodeid == nodeid)
      {
        console.log("value changed: ");
        console.log(value);
        if(commandclass == 0x25)
        {
          if(value.value)
          {
            self.data["switchState"] = "on";
          }else{
            self.data["switchState"] = "off";
          }
        }else if(commandclass == 0x30)
        {
          if(value.value)
          {
            self.data["sensorState"] = "open";
          }else{
            self.data["sensorState"] = "closed";
          }
        }
      }
    });
  });
};

util.inherits(ZWaveDevice, EventEmitter);

// Triggers
ZWaveDevice.prototype.switchToggledTrigger = function(customName, params){
  // this.triggers["switchToggledTrigger"] = ["on/off/both"];
  var self = this;
  var stateChange = params["on/off/both"];
  console.log("customName");
  console.log(customName);

  self.once("deviceFound",function(){
    zwaveController.on('value changed', function(nodeid, commandclass, value){
      if(self.nodeid == nodeid && commandclass == 0x25)
      {
        console.log("value changed: ");
        console.log(value);
        if (value.value && 
          (stateChange == "both" || stateChange == "on")) // this will signal when the value has been set to one (aka turned on)
        {
          self.data["switchState"] = "on";
          self.emit(customName);
        }
        else if (!value.value && 
          (stateChange == "both" || stateChange == "off"))
        {
          self.data["switchState"] = "off";
          self.emit(customName);
        }
      }
    });
  });
};

ZWaveDevice.prototype.sensorToggledTrigger = function(customName, params){
  // this.triggers["sensorToggledTrigger"] = ["closed/open/both"];
  var self = this;
  var stateChange = params["closed/open/both"];
  console.log("customName");
  console.log(customName);

  self.once("deviceFound",function(){
    zwaveController.on('value changed', function(nodeid, commandclass, value){
      if(self.nodeid == nodeid && commandclass == 0x30)
      {
        console.log("value changed: ");
        console.log(value);
        if (value.value && 
          (stateChange == "both" || stateChange == "open")) // this will signal when the value has been set to one (aka turned on)
        { 
          self.data["sensorState"] = "open";
          self.emit(customName);
        }
        else if (!value.value && 
          (stateChange == "both" || stateChange == "closed"))
        {
          self.data["sensorState"] = "closed";
          self.emit(customName);
        }
      }
    });
  });
};

// Actions
ZWaveDevice.prototype.switchToggle = function(params){
  // console.log("swithToggle called");
  var self = this;
  params["milliseconds"] = 0;
  self.switchTimedToggle(params);
};

ZWaveDevice.prototype.switchTimedToggle = function(params){
  // console.log("switchTimedToggle called");
  var self = this;
  var stateChange = params["on/off/both"];
  var timeout_duration = params["milliseconds"];
  setTimeout(function(){
    // console.log(stateChange);
    // console.log(self.data.switchState);
    if ((stateChange == "both" && self.data.switchState == "off") || stateChange == "on") // this will signal when the value has been set to one (aka turned on)
    {
      // console.log("on called");
      self.data.switchState = "on";
      zwaveController.switchOn(self.nodeid);
    }
    else if ((stateChange == "both" && self.data.switchState == "on") || stateChange == "off")
    {
      // console.log("off called");
      self.data.switchState = "off";
      zwaveController.switchOff(self.nodeid);
    }
  }, timeout_duration); // timeout for however long you inputted
};

module.exports = ZWaveDevice;
