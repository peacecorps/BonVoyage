/* jshint node: true */
'use strict';

var fs = require('fs');
var countryFilePath = __dirname + '/../public/data/countryList.json';
var countryListFile = fs.readFileSync(countryFilePath, 'utf8');
var countriesDictionary = JSON.parse(countryListFile);
var allCountryCodes = Object.keys(countriesDictionary);
var allCountries = allCountryCodes.map(function (cc) {
	return countriesDictionary[cc];
});

module.exports = {
	codeList: allCountryCodes,
	countries: countriesDictionary,
	countryList: allCountries,
};
