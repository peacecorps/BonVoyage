
$(document).ready(function() {

	$("#submitInfo").on("click", function(e) {
		console.log("clicked");
		console.log("clicked yessssssssssssssss");

		var v = $("#inputEmail").val();
		var p = $("#inputPassword").val();
		// ajax call is invalid?
		$.ajax({
		    method: "POST",
		    data: {
		        userEmail: v,
		        password: p
		    },
		    dataType: "json",
		    url: "/login",
		    success: function(response_data, status, request) {
		        if(response_data.success)
		            window.location.href = '/helloworld';
		        else
		            console.log("Authentication Failed");
		    },
		    error: function(request, status, error) {
		        console.log(error);
		    }
		});
	});

	$("#register-btn").on("click", function(e) {
		window.location = '/register';
	});


});