

/* Projects carousel */


if($.isFunction($.fn.carousel)){
	$('.carousel').carousel();
}



/* Slider 1 - Parallax slider*/



$(function() {

	if($.isFunction($.fn.cslider)){
		$('#da-slider').cslider({
	
			autoplay	: true,
	
			interval : 9000
	
		});
	}

			

});

/* prettyPhoto Gallery */


if($.isFunction($.fn.prettyPhoto)){
	jQuery(".prettyphoto").prettyPhoto({
	
	   overlay_gallery: false, social_tools: false
	
	});
}



/* Isotope */



// cache container

var $container = $('#portfolio');

// initialize isotope
if($.isFunction($.fn.isotope)){
	$container.isotope({
	
	  // options...
	
	});
}



// filter items when filter link is clicked

$('#filters a').click(function(){
  
  var selector = $(this).attr('data-filter');

  $container.isotope({ filter: selector });

  return false;

});               



/* Flex slider */



  $(window).load(function() {
	  
	if($.isFunction($.fn.flexslider)){
		console.log("flexslider");
		$('.flexslider').flexslider({
	
		  easing: "easeInOutSine",
	
		  directionNav: false,
		  
		  controlNav: true,
	
		  animationSpeed: 1500,
	
		  slideshowSpeed: 5000
	
		});
	}

  });



/* Image block effects */



$(function() {

      $('ul.hover-block li').hover(function(){

        $(this).find('.hover-content').animate({top:'-3px'},{queue:false,duration:500});

      }, function(){

        $(this).find('.hover-content').animate({top:'155px'},{queue:false,duration:500});

      });

});



/* Slide up & Down */



$(".dis-nav a").click(function(e){

	e.preventDefault();

	var myClass=$(this).attr("id");

	$(".dis-content ."+myClass).toggle('slow');

});





/* Image slideshow */


if($.isFunction($.fn.cycle)){
	$('#s1').cycle({ 
	
		fx:    'fade', 
	
		speed:  2000,
	
		timeout: 300,
	
		pause: 1
	
	});
}


/* Support */



$("#slist a").click(function(e){

   e.preventDefault();

   $(this).next('p').toggle(200);

});


/* Footer */
$(window).ready(function(e) {
    $(".social-links").css("bottom", $("footer").outerHeight()-1);
	$("body").css("margin-bottom", $("footer").outerHeight()+$(".social-links").outerHeight());
});
$("footer img").load(function(e) {
    $(".social-links").css("bottom", $("footer").outerHeight()-1);
	$("body").css("margin-bottom", $("footer").outerHeight()+$(".social-links").outerHeight());
});
$(window).resize(function(e) {
    $(".social-links").css("bottom", $("footer").outerHeight()-1);
	$("body").css("margin-bottom", $("footer").outerHeight()+$(".social-links").outerHeight());
});
