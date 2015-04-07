var port = process.env.port || 81;

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
  socket.emit('message', { user: 'online-hub', msg: 'you there?' });

  // Success!  Now listen to messages to be received
  client.on('message',function(event){ 
    console.log('Received message from client!',event);
    socket.emit('message', { user: 'online-hub', msg: 'hello?' });
  });

  client.on('disconnect',function(){
    console.log('client has disconnected');
  });

});

// ----------------------------

// var port = process.env.port || 81;

// var app = require('http').createServer(handler)
//   , io = require('socket.io').listen(app)

// app.listen(port);
// console.log('socket.io server started on port: ' + port + '\n');

// function handler (req, res) {
//   res.writeHead(200);
//   res.end('socket.io server started on port: ' + port + '\n');
// }

// io.sockets.on('connection', function (socket) {
//   console.log('user connected');

//   socket.on('sendMessage', function(data){
//     console.log('user sent the message: ' + data.message + '\n');
//     socket.emit('helloBack', { message: 'Hello back!' });
//   });
// });

// -----------------------------------

// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
// // var io = require('../..')(server);
// // New:
// var io = require('socket.io')(server);
// var port = process.env.PORT || 3000;

// server.listen(port, function () {
//   console.log('Server listening at port %d', port);
// });

// // Routing
// app.use(express.static(__dirname + '/public'));

// // Chatroom

// // usernames which are currently connected to the chat
// var usernames = {};
// var numUsers = 0;

// io.on('connection', function (socket) {
//   var addedUser = false;

//   // when the client emits 'new message', this listens and executes
//   socket.on('new message', function (data) {
//     // we tell the client to execute 'new message'
//     socket.broadcast.emit('new message', {
//       username: socket.username,
//       message: data
//     });
//   });

//   // when the client emits 'add user', this listens and executes
//   socket.on('add user', function (username) {
//     // we store the username in the socket session for this client
//     socket.username = username;
//     // add the client's username to the global list
//     usernames[username] = username;
//     ++numUsers;
//     addedUser = true;
//     socket.emit('login', {
//       numUsers: numUsers
//     });
//     // echo globally (all clients) that a person has connected
//     socket.broadcast.emit('user joined', {
//       username: socket.username,
//       numUsers: numUsers
//     });
//   });

//   // when the client emits 'typing', we broadcast it to others
//   socket.on('typing', function () {
//     socket.broadcast.emit('typing', {
//       username: socket.username
//     });
//   });

//   // when the client emits 'stop typing', we broadcast it to others
//   socket.on('stop typing', function () {
//     socket.broadcast.emit('stop typing', {
//       username: socket.username
//     });
//   });

//   // when the user disconnects.. perform this
//   socket.on('disconnect', function () {
//     // remove the username from global usernames list
//     if (addedUser) {
//       delete usernames[socket.username];
//       --numUsers;

//       // echo globally that this client has left
//       socket.broadcast.emit('user left', {
//         username: socket.username,
//         numUsers: numUsers
//       });
//     }
//   });
// });