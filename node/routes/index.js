var express = require('express');
var router = express.Router();

/* GET home page. */
router.index = function(req, res, next) {
  res.render('index', { title: 'Express' });
};

router.helloworld = function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
};

module.exports = router;

