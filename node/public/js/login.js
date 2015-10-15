
$(document).ready(function() {

	//console.log($("#inputEmail"));
	//$("#inputEmail").val("hello@umd.edu");
	//console.log($("#inputEmail").val());
	var v = "ben@gmail.com";
	var p = "abc123";

	$("#submitInfo").on("click", function(e) {
		console.log("clicked");
		console.log("clicked yessssssssssssssss");
		// ajax call is invalid?
		$.ajax({
		    method: "POST",
		    data: {
		        "username": v,
		        "password": p
		    },
		    dataType: "json",
		    url: "/loginsub",
		    success: function(response_data, status, request) {
		        if(response_data.success)
		            window.location = '/helloworld';
		        else
		            console.log("Authentication Failed");
		    },
		    error: function(request, status, error) {
		        console.log(error);
		    }
		});
	});

});