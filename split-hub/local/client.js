var io = require('socket.io-client'),
socket = io.connect('http://localhost:8080');
console.log("connection requested");
socket.on('connect', function () { 
  console.log("socket connected"); 
  socket.emit('message', { user: 'me', msg: 'whazzzup?' });
});