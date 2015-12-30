var LocalStrategy = require('passport-local').Strategy;

// load user model
var User = require('../models/user');

var Access = require("./access");

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        email = email.toLowerCase()
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else if(password != req.body.password2) {
                    return done(null, false, req.flash('signupMessage', 'Those passwords do not match.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials

                    newUser.email    = email;
                    newUser.hash = password; // This password will be hashed, and in the process overwrite the plain text password we just stored into .hash
                    newUser.name = req.body.name;
                    newUser.phone = req.body.phone;
                    newUser.access = Access.VOLUNTEER;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, newUser);
                    });
                }

            });    

        });

    }));

    // =========================================================================
    // LOCAL LOGIN  ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            email = email.toLowerCase();

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user) {
                    // req.flash is the way to set flashdata using connect-flash
                    return done(null, false, req.flash('loginMessage', 'That email/password combination is invalid.')); 
                } 
                // if the user is found but the password is wrong
                user.comparePassword(password, function(err, valid) {
                    // check if
                    if (err) {
                        console.log("Compare password error-ed: ");
                        console.log(err);
                    }
                    if(!valid)
                        return done(null,false,req.flash('loginMessage', 'That email/password combination is invalid.'));
                    return done(null,user);
                });
                
                
            });

        }));

}

