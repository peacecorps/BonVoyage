
$(document).ready(function() {

	//console.log($("#inputEmail"));
	//$("#inputEmail").val("hello@umd.edu");
	//console.log($("#inputEmail").val());


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
		    url: "/postLogin",
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