$(document).ready(function() {
	var $wittlist = $('.wittlist');

	$wittlist.isotope({
	  itemSelector: '.card-wrapper',
	  layoutMode: 'fitRows',
	  transitionDuration: '0.65s',
	  getSortData: {
	  	wittlWeight: function(elem) {
	  		return parseInt($(elem).children('.card').data('wittlWeight'));
	  	}
	  }
	});

	$('body').on('keypress', function(e) {
		if(e.which == 13) {
			$wittlist.isotope({sortBy: 'wittlWeight'});
		}
	});

	$('.wittl .reveal').hover( 
		function(e) {
			console.log('what is happ');
			$(this).closest('.wittl').addClass('opened');
		});

	$('.wittl').on('mouseleave', function(e) {
		console.log('enning');
		$(this).closest('.wittl').removeClass('opened');
	});
});