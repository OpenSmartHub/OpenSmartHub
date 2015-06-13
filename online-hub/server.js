var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , port = process.env.PORT || 3000
  , fs = require('fs')
  , passport = require('passport')
  , session = require('express-session')
  , util = require('util')
  , GitHubStrategy = require('passport-github2').Strategy
  , securityCredentials = require('./securityCredentials.js');

// Variables for the connected socket (from local-hub)
var connectionEstablished = false;
var connectedSocket;
var configModifiedTime;

// This is the list of allowed users
var AllowedUsers = securityCredentials.allowedUsers;

// Creates the website server on the port #
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Setting up Passportjs
app.use(session({
  key: 'express.sid',
  secret: securityCredentials.SESSION_SECRET,
  resave: false,
  saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GitHubStrategy({
    clientID: securityCredentials.GITHUB_CLIENT_ID,
    clientSecret: securityCredentials.GITHUB_CLIENT_SECRET,
    callbackURL: securityCredentials.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      if(FindIndexOfAuthenticatedUser(profile.username) != -1)
      {
        console.log("username found");
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      }else{
        console.log("username not found");
        return done(null, null);
      }
    });
  }
));

// Helper function to find the index of the username (if there is one)
function FindIndexOfAuthenticatedUser(username){
  var i = 0;
  while (i < AllowedUsers.length) {
    if(AllowedUsers[i].username == username){
      return i;
    }
    i += 1;
  }
  return -1;
}

// Config File Handling
var fileData;
// Initial parse of config file
fs.readFile('./config.json', 'utf8', function (err, data) {
  if (err) throw err;
  fileData = JSON.parse(data);
  console.log(fileData);
});
fs.stat('./config.json', function(err, stats){
  console.log("Config Last Updated At: ");
  console.log(stats.mtime);
  configModifiedTime = stats.mtime.getTime();
});

// Express Routing
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

// Handles Retrieval of the json file
app.get('/config', ensureAuthenticated, function(req, res) {
  //console.log(req);
  res.send(fileData);
});

// Handles updates to the json file
app.post('/config', ensureAuthenticated, function(req, res) {
  var requestBody = "";
  req.on('data', function(data) {
    requestBody += data;
    fileData = JSON.parse(data);
    console.log(requestBody);
    fs.writeFile('./config.json', requestBody, function (err) {
      if (err) throw err;

      // Send update to local-hub
      configModifiedTime = new Date().getTime();
      // if there is a connectedSocket, it will emit the config event
      if (typeof connectedSocket != 'undefined')
      {
        console.log("Sending the stored data to local-hub");
        connectedSocket.emit('config', { lastModifiedTime: configModifiedTime, data: data});
      }
      console.log('It\'s saved!');
    });
  });
});

app.post('/api/actions', ensureAuthenticated, function(req, res){
  // console.log("received request");
  var requestBody = "";
  req.on('data', function(data){
    // requestBody+=data;
    var jsonData = JSON.parse(data);
    if (typeof connectedSocket != 'undefined')
    {
      // console.log("Sending the actions data to local-hub");
      connectedSocket.emit('actionsCalled', { actions: jsonData.actions});
    }
  });
});

app.get('/connection_status', ensureAuthenticated, function(req, res){
  var connectionData = {
      "connection": connectionEstablished
  };
  res.send(connectionData);
});

// Handles the website's authorization paths
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

app.get('/', ensureAuthenticated, function(req, res){
  res.render('index', { user: req.user });
});

app.get('/dashboard', ensureAuthenticated, function(req, res){
  res.render('dashboard', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   console.log("authenticated"); return next();
  }
  console.log("not authenticated");
  res.redirect('/login')
}

// Handles websocket connection authentication to the local brain
require('socketio-auth')(io, {
  authenticate: authenticate, 
  postAuthenticate: postAuthenticate,
  timeout: 1000
});

function authenticate(data, callback) {
  console.log("authenticate called");
  var username = data.username;
  var secret = data.secret;
  var userIndex = FindAuthenticateUserInAllowedUsers(username, secret);
  if(userIndex == -1){
    return callback(new Error("User not found"));
  }else{
    return callback(null, AllowedUsers[userIndex]);//user.secret == secret);    
  }
}

function postAuthenticate(socket, data) {
  console.log("postAuthenticate called");
  var username = data.username;
  var secret = data.secret;
  var userIndex = FindAuthenticateUserInAllowedUsers(username, secret);
  if(userIndex != -1){
    socket.client.user = username;
  }

  console.log('authenticated connection established');
  connectionEstablished = true;
  connectedSocket = socket;

  // emit the message containing the data
  if (typeof fileData != 'undefined' && typeof configModifiedTime != 'undefined')
  {
    socket.emit('config', { lastModifiedTime: configModifiedTime, data: JSON.stringify(fileData)});
  }

  socket.on('config', function(data){
    console.log('data');
    console.log(data);
    console.log('configModifiedTime');
    console.log(configModifiedTime);
    console.log('data.lastModifiedTime');
    console.log(data.lastModifiedTime);

    if(data.lastModifiedTime > configModifiedTime)
    {
      console.log("local config is more up to date");
      fs.writeFile('./config.json', data.data, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    }
  });
}

function FindAuthenticateUserInAllowedUsers(username, secret){
  var i = 0;
  while (i < AllowedUsers.length) {
    if(
      (AllowedUsers[i].username == username)&&
      (AllowedUsers[i].secret == secret)){
      console.log("username found with the correct secret");
      return i;
    }
    i += 1;
  }
  console.log("authenticated user not found");
  return -1;
}

io.on('connection', function (socket) {
  console.log("connection established");

  socket.on('disconnect',function(){
    console.log('client has disconnected');
    connectionEstablished = false;
  });
});