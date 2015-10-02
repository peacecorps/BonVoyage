$(document).ready(function() {

	console.log($("#inputEmail"));
	$("#inputEmail").val("hello@umd.edu");
	console.log($("#inputEmail").val());

	$('#inputEmail').on("click", function(e) {
		var v = "";
		$.ajax({
			data: {
				"name": v,
				...
			},
			type: "POST",
			url: "localhost:3000/loginsubmit",
			success: functino() {
				
			}
		});
	});

});