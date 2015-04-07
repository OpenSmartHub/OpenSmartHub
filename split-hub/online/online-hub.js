var port = process.env.port || 8080;

// Require HTTP module (to start server) and Socket.IO
var http = require('http'), io = require('socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 
  // Send HTML headers and message
  res.writeHead(200,{ 'Content-Type': 'text/html' }); 
  res.end('socket.io server started on port: ' + port);
  //res.end('<h1>Hello Open Source Home Hub User!</h1>');
});

server.listen(port);
console.log('socket.io server started on port: ' + port + '\n');

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 
  console.log("connection established");
  // Success!  Now listen to messages to be received
  client.on('message',function(event){ 
    console.log('Received message from client!',event);
    socket.emit('message', { user: 'online-hub', msg: 'hello?' });
  });
  client.on('disconnect',function(){
    console.log('client has disconnected');
  });

});