// requires jQuery (have charlie rewrite if no jquery available)
function setActiveButton() {
	$('nav li').removeClass('active');
	var filename = document.location.pathname.split('/').pop();
	// filename example: main.html
	//console.log(filename, $('nav a[href="' + filename + '"]'));
	if (filename.length > 0) {
	    $('nav a[href="' + filename + '"]').parent().addClass('active');
	} else {
	    $('nav li:first-child').addClass('active');
	}
}

$(function(){
	setActiveButton();
});