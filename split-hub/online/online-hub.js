var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log("connection established");
  socket.emit('message', { user: 'online-hub', msg: 'you there?' });

  // Success!  Now listen to messages to be received
  socket.on('message',function(event){ 
    console.log('Received message from client!',event);
    socket.emit('message', { user: 'online-hub', msg: 'hello?' });
  });

  socket.on('disconnect',function(){
    console.log('client has disconnected');
  });
});