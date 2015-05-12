#Device Creation Guidelines

0. Make a new javascript file for the new device type by following the example below or `NewDeviceExample.js`.
  Note: All devices need to be based off the EventEmitter regardless of whether they have triggers or not (for unity sake).

  ```
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

    // Data example
    this.data = {}; //  this needs to be done to instantiate a dictionary for the data
    this.data.valueName = 0; // This will expose values

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
  ```
0. Add it's device type to the config file if you want to use this kind of device.
0. Add it to the `local-hub.js` using the following line:

  ```
  deviceTypeMap["NewDevice"] = require('./devices/NewDevice.js');
  ```

[Go Back](README.md)