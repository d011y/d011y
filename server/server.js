var conf = require('./conf');
var persistence = require('./lib/persistence').user_provider;

var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var app = express(),
    server = require('http').createServer(app);

var port = process.env.PORT || 8000;
var staticDirPath = __dirname + '/../client/d011y/app';


console.log("github app id => " + conf.github.appId);
console.log("github app secret => " + conf.github.appSecret);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: conf.github.appId,
    clientSecret: conf.github.appSecret,
    callbackURL: conf.github.callbackURL
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
  app.use('/styles/', express.static(__dirname + '/../client/d011y/temp/styles'));
  app.use(express.static(staticDirPath));

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
    
    persistence.create(function(newUser){
      newUser.ghId = req.user.id; //Github identifier
      newUser.ghUsername = req.user.username; //Github username
      newUser.ghDisplayName = req.user.displayName; //Github username
      persistence.save(newUser);
    });
   

    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/api/user.json',function(req, res){
  if(req.user){
    res.json({ id: req.user.id, username: req.user.username });
  }else{
    res.status(401).json({message:'User is not authenticated'});
  }
});

server.listen(port);

console.log("Serving static files from " + staticDirPath + " @ port " + port);