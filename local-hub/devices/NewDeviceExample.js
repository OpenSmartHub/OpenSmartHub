/* 
// Device Type - this is used for reference
"NewDevice":{ 
    "params":["null"],
    "data":{
      "dataValueName":"dataValueType"
    },
    "triggers":{
      "triggerFunctionName":["null"]
    },
    "actions":{
      "actionFunctionName":["null"]
    }
  }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function NewDevice(params) {
  EventEmitter.call(this); // This allows for events to be emitted
  // TODO: Add code to handle params
  this.dataValueName = 0; // This will expose values

  this.dispose = function(){
    // TODO: any disposal needed for this device
  };
};

util.inherits(NewDevice, EventEmitter);

// Trigger Example
NewDevice.prototype.triggerFunctionName = function(customName, params){
  // TODO: Add code here
};

// Action Example
NewDevice.prototype.actionFunctionName = function(params){
  // TODO: Add code here
};

module.exports = NewDevice;