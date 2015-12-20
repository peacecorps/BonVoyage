var mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/bonvoyage');
mongoose.connection.on('error', function(err){
  if (err)
    console.log(err);
})


var Test = require("./models/request");


var d1 = new Date(2006, 11, 14, 11, 59, 59, 9);

var d2 = new Date(2018, 11, 20, 3, 5, 5, 0);


var new_request = new Test({ 

	email: "loh@umd.edu",
	start_date: d1,
	end_date: d2,
	is_pending: true,
	is_approved: false,
	description: "voyage is taking over the world",
	comments: [{
		email: "wall@gmail.com",
		content: " Go Terps!"
	}]

});


console.log(new_request); 

new_request.save(function(err) {
	if (err)
		console.log(err);
	else
		console.log("success");
});


