// This is based off of the http://www.hackster.io/anthony-ngu/spark-rgb ino code
// as well as the sparkButton.ino code provided in the root of this repo

var sparkRGB = require('./devices/spark/sparkRGB.js');

var inputOn = '048,255,255,255,100,100,100,100,100';
var inputOff = '048,000,000,000,100,100,100,100,100';

exports.SparkButtonToSparkRGB = function(spark, spark_button_num, spark_rgb_num)
{
  spark.on('login', function() {
    //Your code here
    spark.listDevices().then(function(devices) {
      devices[spark_button_num].onEvent('button', function(data) {
        console.log("Event: ");
        console.log(devices[spark_button_num]);
        if(data != null)
        {
          console.log(data.data); // this is the same data that you outputted from the sparkButton
          if(data.data == "triggeredOn")
          {
            sparkRGB.toggleLight(devices[spark_rgb_num], inputOn);
          }else{
            sparkRGB.toggleLight(devices[spark_rgb_num], inputOff);
          }
        }
      });
    });
  });
}