
$(document).ready(function() {

	//console.log($("#inputEmail"));
	//$("#inputEmail").val("hello@umd.edu");
	//console.log($("#inputEmail").val());
	var v = "ben@gmail.com";
	var p = "abc123";

	$("#submitInfo").on("click", function(e) {
		console.log("clicked");
		$.ajax({
			type: "POST",
			data: JSON.stringify(v),
			url: "http://localhost:3000/loginsub",
			success: function() {
				alert("post");
			}
		});
	});

});