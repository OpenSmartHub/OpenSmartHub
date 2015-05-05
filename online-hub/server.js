var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var fs = require('fs');

var connectionEstablished = false;
var connectedSocket;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Reads the storage file
var fileData;
fs.readFile('./config.json', 'utf8', function (err, data) {
  if (err) throw err;
  fileData = JSON.parse(data);
  console.log(fileData);
});

fs.watch('./config.json', function (event, filename) {
  console.log('config.json watcher "' + event + '" triggered');
  fs.readFile('./config.json', 'utf8', function (err, data) {
    if (err) throw err;
    console.log('data');
    fileData = JSON.parse(data);

    if (typeof connectedSocket != 'undefined')
    {
      console.log("Sending the stored data to local-hub");
      connectedSocket.emit('config', data);
    }
  });
});

// Routing
app.use(express.static(__dirname + '/public'));

// Handles Retrieval of the json file
app.get('/storage', function(req, res) {
  //console.log(req);
  res.send(fileData);
});

// Handles updates to the json file
app.post('/storage', function(req, res) {
  var requestBody = "";
  req.on('data', function(data) {
    requestBody += data;
    fileData = JSON.parse(data);
    console.log(requestBody);
    fs.writeFile('./config.json', requestBody, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
});

// Handles websocket connection to the local brain
io.on('connection', function (socket) {
  connectionEstablished = true;
  connectedSocket = socket;

  console.log("connection established");
  
  // emit the message containing the data
  if (typeof fileData != 'undefined')
  {
    socket.emit('config', JSON.stringify(fileData));
  }

  socket.on('disconnect',function(){
    console.log('client has disconnected');
    connectionEstablished = false;
  });
});