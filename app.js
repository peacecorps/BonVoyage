var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var home = require('./routes/index');
var users = require('./routes/users');
var mongo = require('mongodb');
var app = express();
var passport = require('passport');
var session = require('express-session');
var configDB = require('./config/database.js');
var flash    = require('connect-flash');
var logout = require('express-passport-logout');
var Access = require("./config/access");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// required for passport
app.use(session({ secret: 'bonjour' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Pass the access level to our Jade templates
app.use(function(req,res,next) {
  if (req.user)
    res.locals.access = req.user.access;
  next();
});

mongoose.connect(configDB.url);
mongoose.connection.on('error', function(err){
  if (err)
    console.log(err);
})

require('./config/passport.js')(passport); // pass passport for configuration

// Get requests
app.get('/', home.index);
app.get('/login', isNotLoggedIn, users.renderLogin);
app.get('/register', users.renderRegister);
app.get('/dashboard', isLoggedIn, needsAccess(Access.VOLUNTEER), users.renderDashboard);
app.get('/dashboard/submit', isLoggedIn, needsAccess(Access.VOLUNTEER), users.renderSubform);
app.get('/requests',isLoggedIn,users.getRequests);
app.get('/requests/past',isLoggedIn,users.getPastRequests);

// Post requests
app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the dashboard
        failureRedirect : '/register', // redirect back to the register page if there is an error
        failureFlash : true // allow flash messages
}));

app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the dashboard
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
}));

app.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.post('/requests',isLoggedIn, users.postRequests);

app.post('/promote', isLoggedIn, needsAccess(Access.SUPERVISOR), users.promote);

// middleware to ensure the user is authenticated. If not, redirect to login page.
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  else
    res.redirect('/login');
}

// middleware to redirect the user to the dashboard if they already logged in
function isNotLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    res.redirect('/dashboard');
  else
    return next();
}

// middleware to check if the user is at least that access level
function needsAccess(access) {
    return function(req, res, next) {
      if (req.user && req.user.access >= access)
        next();
      else
        res.status(401).send("Unauthorized");
    };
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
