var io = require('socket.io-client'),

//socket = io.connect('http://localhost:8080'); // For local debug
socket = io.connect('http://ohh.azurewebsites.net');
console.log("connection requested");

socket.on('connect', function () { 
  console.log("socket connected"); 
  socket.emit('message', { user: 'local-hub', msg: 'hello?' });
});

socket.on('message',function(event){ 
  console.log('Received message from server!',event);
});