
var request = require('request');
var cheerio = require('cheerio');
var arr;

request('http://travel.state.gov/content/passports/en/alertswarnings.html', 
	function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	$ = cheerio.load(body);
	  	arr = $("tr");

	  	arr.each(function(i, elem) {
		  //fruits[i] = $(this).text();

		  console.log(i + "\n");
		  //console.log($(this).html());
		  $(this).find("td").each(function(x, ele) {
		  	
		  });
		  //console.log("Date: " + $(this).get(1));


		});

	  	



	  }
});












