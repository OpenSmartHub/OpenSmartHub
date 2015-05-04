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
  // TODO: Add code to handle params
  this.dataValueName = 0; // This will expose values
  EventEmitter.call(this); // This allows for events to be emitted
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