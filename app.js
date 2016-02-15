var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var views = require('./routes/views');
var api = require('./routes/api');
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
  res.locals.user = req.user;
  next();
});

mongoose.connect(configDB.url);
mongoose.connection.on('error', function(err){
  if (err)
    console.log(err);
});

require('./config/passport.js')(passport); // pass passport for configuration

// Route Parameters
app.param('request_id', api.handleRequestId);

// Render Views
app.get('/', views.index);
app.get('/login', isNotLoggedIn, views.renderLogin);
app.get('/register', views.renderRegister);
app.get('/reset', isNotLoggedIn, views.renderReset);
app.get('/reset/:token', views.renderValidReset);
app.get('/dashboard', isLoggedIn, needsAccess(Access.VOLUNTEER), views.renderDashboard);
app.get('/dashboard/submit', isLoggedIn, needsAccess(Access.VOLUNTEER), views.renderSubform);
app.get('/requests/:request_id', isLoggedIn, needsAccess(Access.VOLUNTEER), views.renderApproval);
app.get('/users', isLoggedIn, views.renderUsers);

// API
app.get('/api/requests', isLoggedIn, needsAccess(Access.VOLUNTEER), api.getRequests);
app.get('/api/requests/past', isLoggedIn, needsAccess(Access.VOLUNTEER), api.getPastRequests);
app.get('/api/requests/pending', isLoggedIn, needsAccess(Access.VOLUNTEER), api.getPendingRequests);

app.get('/api/users', isLoggedIn, needsAccess(Access.SUPERVISOR), api.getUsers);

app.post('/api/requests/:request_id/approve', isLoggedIn, needsAccess(Access.SUPERVISOR), api.postApprove);
app.post('/api/requests/:request_id/deny', isLoggedIn, needsAccess(Access.SUPERVISOR), api.postDeny);
app.post('/api/requests/:request_id/delete', isLoggedIn, needsAccess(Access.VOLUNTEER), api.postDelete);
app.post('/api/requests/:request_id/comments', isLoggedIn, needsAccess(Access.VOLUNTEER), api.postComments);

app.post('/api/register', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the dashboard
        failureRedirect : '/register', // redirect back to the register page if there is an error
        failureFlash : true // allow flash messages
}));
app.post('/api/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the dashboard
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
}));
app.post('/api/logout', api.logout);
app.post('/api/reset', api.reset);
app.post('/api/reset/:token', api.resetValidator);
app.post('/api/requests',isLoggedIn, needsAccess(Access.VOLUNTEER), api.postRequests);
app.post('/api/access', isLoggedIn, needsAccess(Access.SUPERVISOR), api.modifyAccess);

app.delete('/api/users', isLoggedIn, needsAccess(Access.SUPERVISOR), api.deleteUser);

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
