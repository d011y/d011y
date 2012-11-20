var conf = require('./conf');
var persistence = require('./lib/persistence').user_provider;

var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var app = express(),
    server = require('http').createServer(app);

var port = process.env.PORT || 8000;
var staticDirPath = __dirname + '/public';


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
    console.log('callback called');

    persistence.get(req.user.id, 
      function(user){
        if(user === null){
        persistence.create(function(newUser){
    
          newUser.id = req.user.id; //Github identifier
          newUser.username = req.user.username; //Github username
          newUser.displayName = req.user.displayName; //Github username
          persistence.save(newUser);
        });
      }
    });
   

    res.redirect('/user');
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
  res.send();
});

app.get('/user',function(req, res){
  persistence.getAll(function(users){
      res.send(users);
  });
});


app.get('/save',function(req, res){
  persistence.create(function(newUser){
    newUser.id = 10;
    newUser.username = 'd011y';
    newUser.displayName = 'd011y the clone';
    persistence.save(newUser, function(){
      res.send("Saved");
    });

    
  });
});


server.listen(port);

console.log("Serving static files from " + staticDirPath + " @ port " + port);