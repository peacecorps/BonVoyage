
var request = require('request');
var cheerio = require('cheerio');
var arr;
var warnings = new Array();

/*

1. change date to js dates
2. remove 'Travel Warning' from the country section 

*/


request('http://travel.state.gov/content/passports/en/alertswarnings.html', 
	function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	$ = cheerio.load(body);
	  	arr = $("tr");

	  	arr.each(function(row, elem) {
		  //fruits[i] = $(this).text();
		  warnings.push(new Array());

		  console.log(row);
		  //console.log($(this).html());
		  $(this).find("td").each(function(td_index, ele) {
		  	warnings[row].push($(this).text());

		  	//console.log(td_index + " " + $(this).text());
		  });
		});

	  	console.log(warnings);

	  }
});

