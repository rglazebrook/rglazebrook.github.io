$(document).ready(function() {

	var maintl = new TimelineMax(),
		nameBlock = $('#name-block');

	// Fade the top square in.
	maintl.fromTo(nameBlock, 1.25, {
		x: '-50%',
		y: '-30%',
		opacity: 0
	}, {
		x: '-50%',
		y: '-50%',
		opacity: 1,
		ease: Power2.easeOut
	}, 0.25);

});