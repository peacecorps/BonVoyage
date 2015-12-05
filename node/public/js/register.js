
$(document).ready(function() {

	$("#register-btn").on("click", function(e) {
		window.location = '/login';
	});


	$("#signupInfo").on("click", function(e) {
		console.log("clicked!");

		var fullName = $("#signupName").val();
		var email = $("#signupEmail").val();
		var pass1 = $("#signupPassword").val();
		var pass2 = $("#signupRePassword").val();

		$.ajax({
		    method: "POST",
		    data: {
		        name: fullName,
		        email: email,
		        password: pass1
		    },
		    dataType: "json",
		    url: "/register",
		    success: function(response_data, status, request) {
		        if(response_data.success)
		        	alert("hi Ben");
		            //window.location = '/dashboard';
		        else
		            console.log("Authentication Failed");
		    },
		    error: function(request, status, error) {
		        console.log(error);
		    }
		});
	});

});