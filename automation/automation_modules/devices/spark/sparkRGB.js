// This is based off of the http://www.hackster.io/anthony-ngu/spark-rgb ino code

exports.toggleLight = function (device, input){
  if(device.connected == true)
  {
    device.callFunction('switchColor', input, function(err, data) {
      if (err) {
        console.log('An error occurred:', err);
      } else {
        console.log('Function called succesfully:', data);
      }
    });
  }
}