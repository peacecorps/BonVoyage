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

var allCountriesLowered = allCountryCodes.map(function (cc) {
	return countriesDictionary[cc].toLowerCase();
});

module.exports = {
	codeList: allCountryCodes,
	countries: countriesDictionary,
	countryList: allCountries,
	validateCountry: function (c) {
		if (c) {
			if (allCountryCodes.indexOf(c) > -1) {
				return c;
			} else if (allCountriesLowered.indexOf(c.toLowerCase()) > -1) {
				return allCountryCodes[allCountriesLowered.indexOf(c.toLowerCase())];
			}
		}

		return undefined;
	},
};
