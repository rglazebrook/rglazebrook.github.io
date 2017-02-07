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

	// Load the asyncronous (data-src) images.
	$('[data-src]').each(function() {
		$(this).attr('src', $(this).data('src') );
	});

	// Super-simple lightbox.
	var $lightbox = $('.lightbox');
	$('.portfolio img').on('click',function() {
		$lightbox.html('<img src="'+$(this).attr("src")+'" alt="" />');
		var imgIn = new TimelineMax(),
			img = $lightbox.find('img');
		imgIn.set($lightbox, {display: 'block', opacity: 0 });
		imgIn.set(img, { opacity: 0 });
		imgIn.to($lightbox, 0.1, { opacity: 1, ease: Power2.easeIn }); 
		imgIn.to(img, 0.5, { opacity: 1, ease: Power2.easeIn });
	});
	$lightbox.on('click', function() {
		var imgOut = new TimelineMax();
		imgOut.to($lightbox, 0.5, { opacity: 0, ease: Power2.easeIn });
		imgOut.set($lightbox, {display: 'none'});
	});

});