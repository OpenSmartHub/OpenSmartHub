/* 
// Device Type - this is used for reference
"SparkMotion":{ 
    "params":["Device ID"],
    "data":{
    },
    "triggers":{
      "motionTrigger":["triggeredOn/triggeredOff/both"]
    },
    "actions":{
    }
  }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var securityCredentials = require('../securityCredentials.js');
var spark = require('spark');

function SparkMotion(params) {
  // console.log("params------------------------------");
  // console.log(params);
  this.deviceId = params["Device ID"];
  // console.log(this.deviceId);

  var self = this;
  this.data = {};

  this.dispose = function(){
    if(spark)
    {
      spark.removeAllListeners();
    }
  };

  spark.login({username: securityCredentials.SparkUsername, password:  securityCredentials.SparkPassword});

  EventEmitter.call(this); // This allows for events to be emitted
};

util.inherits(SparkMotion, EventEmitter);

var motionTriggerParse = function(self, data, dataValueTrigger, customName){
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

SparkMotion.prototype.motionTrigger = function(customName, params){
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
          self.sparkDevice.onEvent('motion', function(data) {
            // console.log("motion event triggered");
            motionTriggerParse(self, data, dataValueTrigger, customName);
          });
        });
      });
    });
  }else{
    self.sparkDevice.onEvent('motion', function(data) {
      // console.log("motion event triggered");
      motionTriggerParse(self, data, dataValueTrigger, customName);
    });
  }
};

module.exports = SparkMotion;