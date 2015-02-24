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