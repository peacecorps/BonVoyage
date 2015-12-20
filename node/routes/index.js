var express = require('express');
var router = express.Router();

router.index = function(req, res, next) {
  res.redirect('/login');
};


module.exports = router;

