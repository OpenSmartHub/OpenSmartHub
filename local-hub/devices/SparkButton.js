/* 
// Device Type - this is used for reference
"SparkButton":{ 
    "params":["Device ID"],
    "data":{
    },
    "triggers":{
      "sparkButtonTrigger":["triggeredOn/triggeredOff/both"]
    },
    "actions":{
    }
  }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var securityCredentials = require('../securityCredentials.js');
var spark = require('spark');

function SparkButton(params) {
  // console.log("params------------------------------");
  // console.log(params);
  this.deviceId = params["Device ID"];
  // console.log(this.deviceId);

  var self = this;
  this.dispose = function(){
    console.log("dispose function in spark button was called");
    console.log(self.sparkDevice);
    if(spark)
    {
      spark.removeAllListeners();
    }
    if(self.sparkDevice)
    {
      console.log("sparkDevice");
      self.sparkDevice.removeAllListeners();      
    }
  };

  spark.login({username: securityCredentials.SparkUsername, password:  securityCredentials.SparkPassword});

  EventEmitter.call(this); // This allows for events to be emitted
};

util.inherits(SparkButton, EventEmitter);

var buttonTriggerParse = function(self, data, dataValueTrigger, customName){
  // console.log(data);
  // console.log(dataValueTrigger);
  // console.log(customName);

  if(data != null)
  {
    if(data.data == "triggeredOn" && 
      (dataValueTrigger == "triggeredOn") || (dataValueTrigger == "both"))
    {
      self.emit(customName);
    }else if (data.data == "triggeredOff" && 
      (dataValueTrigger == "triggeredOff") || (dataValueTrigger == "both")){
      self.emit(customName);
    }
  }
}

SparkButton.prototype.sparkButtonTrigger = function(customName, params){
  var self = this;
  var dataValueTrigger = params["triggeredOn/triggeredOff/both"];
  console.log('-----------------------------TRIGGERRRRR-----------------------------');
  if(typeof sparkDevice == "undefined")
  {
    spark.once('login', function(err, body) {
      spark.listDevices(function(err, devices) {
        spark.getDevice(self.deviceId, function(err, device) {
          console.log('SparkDevice-----------------------------');
          console.log(device);
          self.sparkDevice = device;
          self.sparkDevice.onEvent('button', function(data) {
            console.log("button event triggered");
            buttonTriggerParse(self, data, dataValueTrigger, customName);
          });
        });
      });
    });
  }else{
    self.sparkDevice.onEvent('button', function(data) {
      console.log("button event triggered");
      buttonTriggerParse(self, data, dataValueTrigger, customName);
    });
  }
};

module.exports = SparkButton;