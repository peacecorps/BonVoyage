
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var fs = require('fs');
var countries_dictionary = JSON.parse(fs.readFileSync("../public/data/countryList.json", 'utf8'));
var all_country_codes = Object.keys(countries_dictionary);
var COLUMNS = Object.freeze({TYPE: 0, DATE: 1, COUNTRY: 2});
var OUTPUT_FILE = '../public/data/warnings.json';

function strip_time(date) {
	// Convert the date to a Moment object, and remove the time component by adjusting to the local time zone
	return moment(date, 'MMMM DD, YYYY').startOf('day');
}

function matchCountryCodes(country_text) {
	// Array to track all the matched country codes
	var country_codes = [];
	if (country_text) {
		// Some country matches are hardcoded, since they don't match the countryList.json
		var matches = {
			"burma": ["MM"],
			"worldwide": all_country_codes,
			"israel, the west bank and gaza": ["IL"],
			"democratic republic of the congo": ["CG"],
			"republic of south sudan": ["SD"]
		};
		// Check if the text to match is one of the hardcoded countries
		if (matches[country_text]) 
			country_codes = matches[country_text];
		else {
			// Otherwise search the countries dictionary for the text to match
			for (country_code in countries_dictionary) {
				// NOTE: this only pushes exact matches, thus the need for the hardcoded values
				if (countries_dictionary[country_code].toLowerCase() == country_text)
					country_codes.push(country_code);
			}
		}
	}
	return country_codes;
}

function parseText(text, index) {
	text_l = text.toLowerCase();
	switch (index) {
		case COLUMNS.TYPE: 
			return text_l; // 'alert' or 'warning'
		case COLUMNS.DATE: 
			// The date that the alert/warning was released, converted to a JS Date
			return strip_time(text_l).toDate();
		case COLUMNS.COUNTRY:
			// Crop out the country from the text ('Honduras Travel Warning' -> 'Honduras')
			var index = text_l.indexOf('travel');
			if (index != -1)
				return text_l.substring(0,index-1);
			else 
				// Some special cases occur (ex. 'South Pacific Tropical Cyclone Season - 2015 - 2016')
				// We should handle these eventually
				return undefined;
		default:
			throw "Table index out of range";
	}
}

function storeWarnings(warnings) {
	var fs = require('fs');
	var json = JSON.stringify(warnings, null, 2);
	fs.writeFile(OUTPUT_FILE, json, function(err) {
	  if(err) return console.log(err);
	});
}

request('http://travel.state.gov/content/passports/en/alertswarnings.html', 
	function (error, response, body) {
		// This hash table holds the data that we will store in JSON later
		warnings = {};

		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);

			$("tr").each(function(row, elem) {
				raw_data = [];
				link = undefined; // Link to the full detail on the warning
				$(this).find("td").each(function(td_index, ele) {
					raw_data.push(parseText($(this).text(), td_index)); // Parse the raw text
					// Get the link that is in the country column
					if (td_index == COLUMNS.COUNTRY) {
						link = $(this).find('a').attr('href');	
						// If further info exists, add the domain to make it a full link
						if (link)
							link = "http://travel.state.gov" + link;
					}
				});
				var country_codes = matchCountryCodes(raw_data[COLUMNS.COUNTRY]);
				var warning = {
					type: raw_data[COLUMNS.TYPE],
					start_date: raw_data[COLUMNS.DATE],
					link: link
				};
				// Insert this warning at each of the match countries
				for (var i = 0; i < country_codes.length; i++) {
					if (warnings[country_codes[i]] == undefined) 
						warnings[country_codes[i]] = [];
					warnings[country_codes[i]].push(warning)
				}
		});

		storeWarnings(warnings);
	}
});

