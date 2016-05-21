/* jshint node: true */

var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name: 'bonvoyage',
});

module.exports = log;
