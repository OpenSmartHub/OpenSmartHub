/* 
  // Device Type
  "Test": {
    "params": [
      "null"
    ],
    "data": {},
    "triggers": {},
    "actions": {
      "hello": [
        "ArrayOfStrings"
      ]
    }
  }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Test() {
  EventEmitter.call(this); // This allows for events to be emitted

  this.hello = function(inputs){
    console.log("hello was called");
    if(inputs){
      for(var input in inputs)
      {
        console.log(inputs[input]);
      }
    }
  };
  this.dispose = function(){
  };
};

util.inherits(Test, EventEmitter);

module.exports = Test;

// Example Usage

/*

var testAction = new Test();
//testAction.hello();
testAction["hello"](["hi","peace"]);

*/