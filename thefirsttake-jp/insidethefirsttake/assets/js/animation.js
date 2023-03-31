//observer

    var boxes = document.querySelectorAll(".monitored");
    var boxesArray = Array.prototype.slice.call(boxes, 0);
    var options = {
        root: null,
        rootMargin: "0px 50%",
        threshold: 0,
    };
    var observer = new IntersectionObserver(doWhenIntersect, options);
    boxesArray.forEach(function (box) {
        observer.observe(box);
    });

    function doWhenIntersect(entries) {
		var entriesArray = Array.prototype.slice.call(entries, 0);
		entriesArray.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add("active");
			}
		});
    }





//scroll control

	window.onload = function() {
		// スクロールを禁止にする関数
		function disableScroll(event) {
			event.preventDefault();
		}

		// スクロール禁止
		function scrollNon() {
			// イベントと関数を紐付け
			document.addEventListener('touchmove', disableScroll, { passive: false });
			document.addEventListener('mousewheel', disableScroll, { passive: false });
		}

		scrollNon();

		// スクロール解除
		function scrollOk() {
			// イベントと関数を紐付け
			document.removeEventListener('touchmove', disableScroll, { passive: false });
			document.removeEventListener('mousewheel', disableScroll, { passive: false });
		}

		setTimeout(function(){
			anim();
		},6000);

		setTimeout(function(){
			$('.logo').css('display', 'block');
			$('.ahamo').css('display', 'block');
			$('.opening').addClass('out');
			scrollOk();
		},9000);


	}

// animation easing

let animMove = 'easeInBack';

function anim(){
	$('.line').animate({bottom: "0%"},1000,animMove).animate({opacity: 0}, 1800, animMove);
	$('.door.left').animate({left: "100%"},3000,animMove);
	$('.door.right').animate({right:"100%"},3000,animMove);
}