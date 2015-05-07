var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , port = process.env.PORT || 3000
  , fs = require('fs')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , GitHubStrategy = require('passport-github2').Strategy
  , securityCredentials = require('./securityCredentials.js');

var connectionEstablished = false;
var connectedSocket;

var AllowedUsers = ["anthony-ngu"];

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
app.use(session({ 
  secret: securityCredentials.SESSION_SECRET,
  resave: false,
  saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: securityCredentials.GITHUB_CLIENT_ID,
    clientSecret: securityCredentials.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      if(AllowedUsers.indexOf(profile.username) != -1)
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
app.engine('html', require('ejs').renderFile);

// Handles Retrieval of the json file
app.get('/storage', ensureAuthenticated, function(req, res) {
  //console.log(req);
  res.send(fileData);
});

// Handles updates to the json file
app.post('/storage', ensureAuthenticated, function(req, res) {
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

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

app.get('/', ensureAuthenticated, function(req, res){
  console.log("index.html loaded");
  res.render('index', { user: req.user });
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