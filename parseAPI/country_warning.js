
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var arr;
var warnings = new Array();

function parseText(text) {
	var lower = text.toLowerCase();
	var i = lower.indexOf('travel');
	if (i >= 0) {
		return text.substring(0,i-1);
	} else {
		var month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		var j = month.indexOf(lower.split(' ')[0]);
		if (j >= 0) {
			return moment(text).toDate();
		} else {
			return text;
		}
	}
}

request('http://travel.state.gov/content/passports/en/alertswarnings.html', 
	function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	$ = cheerio.load(body);
	  	arr = $("tr");

	  	arr.each(function(row, elem) {
		  warnings.push(new Array());

		  $(this).find("td").each(function(td_index, ele) {
		  	warnings[row].push(parseText($(this).text()));
		  });
		});

	  	warnings.shift();
	  	console.log(warnings);
	  }
});

