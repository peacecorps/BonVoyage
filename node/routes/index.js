var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

function renderLogin(req, res) {
	res.render('login.jade', {title: 'Login'});
}

router.get('/login', renderLogin);

function renderRegister(req, res) {
    res.render('register.jade', {title: 'Register'});
}
router.get('/register', renderRegister);


function renderSuperDash(req, res) {
    res.render('supervisor_dash.jade', {title: 'Supervisor Dashboard'});
}
router.get('/supervisor_dash', renderSuperDash);

module.exports = router;

