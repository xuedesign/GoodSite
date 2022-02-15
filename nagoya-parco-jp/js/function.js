var LoadEnd = false;
var WinScroll = 0;

$(window).on('load', function(){
	$('body').removeClass('loading').addClass('loaded');

	//TextTyping初期設定
	var element = $('.TextTyping');
	element.each(function () {
		var text = $(this).html();
		var textbox = "";
		text.split('').forEach(function (t) {
			if (t !== " ") {
				textbox += '<span>' + t + '</span>';
			} else {
				textbox += t;
			}
		});
		$(this).html(textbox);

	});
	TextTypingAnime();
	setInit();
	LoadEnd = true;
	ScrollView_func();
	setTimeout(function(){
		$('.opening').fadeOut();
		$('.main-contents').fadeIn();
		$('.header').addClass('loaded');
	},5000);
});
$(window).on('resize scroll', function(){
	ScrollView_func();
	TextTypingAnime();
});


function setInit() {

	/* ページ内リンク指定
	-----------------------------------------------------------------*/
	$('a[href^="#"]').not('.js-modalclose,.js-gnavi-close').on('click', function(){
		var speed = 800;
		var href= $(this).attr('href');
		var target = $(href == '#' || href == '' ? 'html' : href);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, speed, 'easeInOutExpo');
		return false;
	});


	/* 一覧ホバー設定
	-----------------------------------------------------------------*/
	$('.fade').hover(function() {
		$(this).fadeTo('fast',0.7);
	}, function() {
		$(this).fadeTo('fast',1.0);
	});


	/* blink設定
	-----------------------------------------------------------------*/
	setInterval(function(){
		$('.blink').addClass('hide');
		setTimeout(function(){
			$('.blink').removeClass('hide');
		},500);
	},1000);


	/*  headerスライダー設定
	-----------------------------------------------------------------*/
	var swiper = new Swiper('.js-header-slider', {
 		loop: true,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		speed: 3000,
		autoplay: {
			delay: 3000,
		},
		allowTouchMove: false,
	});


	/*  menuスライダー設定
	-----------------------------------------------------------------*/
	var swiper = new Swiper('.js-menu-slider', {
 		loop: true,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		speed: 1000,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

}


//スクロール表示
function ScrollView_func(){
	WinH = window.innerHeight ? window.innerHeight : $(window).height();
	WinScroll = $(window).scrollTop();

	$('.scrollview').each(function(index) {
		if(LoadEnd&&WinScroll>$(this).offset().top-WinH*0.9){
			$(this).addClass('view');
		}else{
			$(this).removeClass('view');
		}
	});

}


//TextTyping
function TextTypingAnime() {
	$('.TextTyping').each(function () {
		var elemPos = $(this).offset().top - 50;
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		var thisChild = '';
		if (scroll >= elemPos - windowHeight) {
			thisChild = $(this).children();
			thisChild.each(function (i) {
				var time = 100;
				var time2 = 200;
				$(this).delay(time2 * i).fadeIn(time);
			});
		} else {
			thisChild = $(this).children();
			thisChild.each(function () {
				$(this).stop();
				$(this).css('display', 'none');
			});
		}
	});
}



