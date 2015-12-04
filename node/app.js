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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// ??????????????
app.use(session({ secret: 'bonjour' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

mongoose.connect('mongodb://localhost:27017/bonvoyage');
mongoose.connection.on('error', function(err){
  if (err)
    console.log(err);
}) 

app.get('/', home.index);
app.get('/helloworld',home.helloworld);
app.get('/login', users.renderLogin);
app.get('/register', users.renderRegister);
app.get('/vdash', isLoggedIn, users.renderVDash);
app.post('/postRegister', users.postRegister);
app.post('/postLogin', users.postLogin);

// middleware to make sure the user is logged in
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  else
    res.redirect('/login');
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
