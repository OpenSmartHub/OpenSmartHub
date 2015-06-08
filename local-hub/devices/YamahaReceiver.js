/* 
// Device Type - this is used for reference
"YamahaReceiver":{ 
    "params":["ipAddress"],
    "data":{
      "power":"on/off",
      "volume":"int",
      "currentInput":"string"
    },
    "triggers":{
    },
    "actions":{
      "powerOff":["null"],
      "powerOn":["null"],
      "powerToggle":["on/off/both"],
      "setVolumeTo":["number"],
      "volumeUp":["number"],
      "volumeDown":["number"],
      "setInputTo":["inputName"],
      "setInputToPandora":["null"],
      "setInputToV-AUX":["null"],
      "setInputToHDMI1":["null"],
      "setInputToAUDIO1":["null"]
    }
  }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var YamahaAPI = require("yamaha-nodejs");

function YamahaReceiver(params) {
  EventEmitter.call(this); // This allows for events to be emitted

  var self = this;
  this.ipAddress = params["ipAddress"];

  this.yamahaInstance = new YamahaAPI(this.ipAddress);

  this.data = {};
  this.yamahaInstance.getBasicInfo().done(function(basicInfo){
    self.data.volume = basicInfo.getVolume();
    // this.data.muted = basicInfo.isMuted();
    if(basicInfo.isOn())
    {
      self.data.power = "on";
    }else{
      self.data.power = "off";
    }
    self.data.currentInput = basicInfo.getCurrentInput();
    console.log(self);
  });

  this.dispose = function(){
  };
};

util.inherits(YamahaReceiver, EventEmitter);

YamahaReceiver.prototype.powerOff = function(params){
  var self = this;
  self.yamahaInstance.powerOff();
  self.data.power = "off";
};

YamahaReceiver.prototype.powerOn = function(params){
  var self = this;
  self.yamahaInstance.powerOn();
  self.data.power = "on";
};

YamahaReceiver.prototype.powerToggle = function(params){
  var powerOption = params["on/off/both"];
  var self = this;
  // if power is on and option is off or both, turn it off
  if(self.yamahaInstance.isOn())
  {
    if(powerOption == "off" || powerOption == "both")
    {
      self.yamahaInstance.turnOff();
      self.data.power = "off";
    }
  }else{
    if(powerOption == "on" || powerOption == "both")
    {
      // if power is off and options is on or both, turn it off
      self.yamahaInstance.turnOn();
      self.data.power = "on";
    }
  }
};

YamahaReceiver.prototype.setVolumeTo = function(params){
  var value = params["number"];
  var self = this;
  self.yamahaInstance.setVolumeTo(value);
  self.data.volume = value;
};

YamahaReceiver.prototype.volumeUp = function(params){
  var value = params["number"];
  var self = this;
  self.yamahaInstance.volumeUp(value);
  self.data.volume = (self.data.volume + value);
};

YamahaReceiver.prototype.volumeDown = function(params){
  var value = params["number"];
  var self = this;
  self.yamahaInstance.volumeDown(value);
  self.data.volume = (self.data.volume - value);
};
YamahaReceiver.prototype.setInputTo = function(params){
  var inputName = params["inputName"];
  var self = this;
  self.yamahaInstance.setMainInputTo(inputName);
  self.data.currentInput = inputName;
};
YamahaReceiver.prototype.setInputToPandora = function(params){
  var self = this;
  self.yamahaInstance.setMainInputTo("Pandora");
  self.data.currentInput = "Pandora";
};
YamahaReceiver.prototype.setInputToVAUX = function(params){
  var self = this;
  self.yamahaInstance.setMainInputTo("V-AUX");
  self.data.currentInput = "V-AUX";
};
YamahaReceiver.prototype.setInputToHDMI1 = function(params){
  var self = this;
  self.yamahaInstance.setMainInputTo("HDMI1");
  self.data.currentInput = "HDMI1";
};
YamahaReceiver.prototype.setInputToAUDIO1 = function(params){
  var self = this;
  self.yamahaInstance.setMainInputTo("AUDIO1");
  self.data.currentInput = "AUDIO1";
};
module.exports = YamahaReceiver;