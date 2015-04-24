/* 
  // Device Type
  "Clock":{ 
      "params":["null"],
      "triggers":{
        "timeTrigger":["datetime"],
        },
      "actions":{
      }
    }
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Clock() {
  /*
  Possible Uses:
    Calendar Timing
      At ... date/time
    Interval Timing
      Every year at ... month/day/hour/minute
      Every month at ... day/hour/minute
      Every day at ... hour/minute
      Every ... hours/minutes/seconds/ms
  */
  EventEmitter.call(this); // This allows for events to be emitted
};

util.inherits(Clock, EventEmitter);

Clock.prototype.intervalTrigger = function(customName, time){
  var self = this;
  // emits the event when the interval occurs
  // gets the interval timing
  // var year = time.getsFullYear(); // gets the four digit year (yyyy)
  // var month = time.getMonth(); // gets the month (0-11)
  // var date = time.getDate(); // gets day as a number (1-31)
  // var day = time.getDay(); // gets weekday as a number (0-6)
  // var hour = time.getHours(); // gets the hour (0-23)
  // var minute = time.getMinutes(); // gets the minutes (0-59)
  // var second = time.getSeconds(); // gets the seconds (0-59)
  
  // gets current time for use in the "every * at *" trigger
  var currentDatetime = new Date();
  var msConversionOfCurrent = currentDatetime.getTime();
  
  var msToInterval = time * 1000;
  setInterval(function(){
    self.emit(customName);
  }, msToInterval);
};

module.exports = Clock;

// Example Usage
/*
var clockInstance = new Clock();

// Checks to make sure it inherits EventEmitter
console.log(clockinstance instanceof eventemitter); // true
console.log(clock.super_ === eventemitter); // true

clockInstance["intervalTrigger"](5,"every5seconds");
clockInstance["intervalTrigger"](5,"every5seconds2");
clockInstance.on('every5seconds', function() {
  console.log('on every5seconds was thrown');
});
clockInstance.on('every5seconds2', function() {
  console.log('on every5seconds2 was thrown');
});
*/