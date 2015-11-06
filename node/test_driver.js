var mongoose = require("mongoose");

var User = require("./models/user");



mongoose.connect('mongodb://localhost:27017/bonvoyage');
mongoose.connection.on('error', function(err){
  if (err)
    console.log(err);
})


var newUser = new User({
	name: "bonvoyage",
	email: "be@game.com",
	password: "pass1",
	hash: "yeaa"
});

newUser.save(function(err) {
	if (err)
		console.log(err);
	else
		console.log("success");
});

