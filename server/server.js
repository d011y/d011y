var express = require('express');
var conf = require('./conf');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var app = express(),
    server = require('http').createServer(app);

var port = process.env.PORT || 80;
var staticDirPath = __dirname + '/public';

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log(obj);
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: conf.github.appId,
    clientSecret: conf.github.appSecret,
    callbackURL: "http://d011y.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
 );

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
    console.log(req.user);
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/login', function(req, res){
  req.send("not authenticated");
});

app.get('/', function(req, res){
  res.send(req.user);
});


server.listen(port);

console.log("Serving static files from " + staticDirPath + " @ port " + port);