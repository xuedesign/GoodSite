//タッチデバイスか判別
function is_touch(){
  const touch_event = window.ontouchstart;
  const touch_points = navigator.maxTouchPoints;
  if( touch_event !== undefined && 0 < touch_points ) {
    // console.log("タッチ対応端末です");
    return true;
  } else {
    // console.log("タッチ非対応です");
    return false;
  }
}


//function - ドラッグスクロール
function mousedragscrollable(element) {
  let target; // 動かす対象
  $(element).each(function (i, e) {
    $(e).mousedown(function (event) {
      event.preventDefault();
      target = $(e); // 動かす対象
      $(e).data({
        "down": true,
        "move": false,
        "x": event.clientX,
        "y": event.clientY,
        "scrollleft": $(e).scrollLeft(),
        "scrolltop": $(e).scrollTop(),
      });
      return false
    });
    // move後のlink無効
    $(e).click(function (event) {
      if ($(e).data("move")) {
        return false
      }
    });
  });
  // list要素内/外でのevent
  $(document).mousemove(function (event) {
    if ($(target).data("down")) {
      event.preventDefault();
      let move_x = $(target).data("x") - event.clientX;
      let move_y = $(target).data("y") - event.clientY;
      if (move_x !== 0 || move_y !== 0) {
        $(target).data("move", true);
      } else { return; };
      $(target).scrollLeft($(target).data("scrollleft") + move_x);
      $(target).scrollTop($(target).data("scrolltop") + move_y);
      return false
    }
  }).mouseup(function (event) {
    $(target).data("down", false);
    return false;
  });
}

//function - inview
function inview(className, root_margin, callback) {
  var nodelist = document.querySelectorAll(className);
  var node = Array.prototype.slice.call(nodelist, 0).reverse();
  var options = {
    root: null,
    rootMargin: root_margin,
    threshold: 0
  }
  var observer = new IntersectionObserver(callback, options);
  node.forEach(function (obj) {
    observer.observe(obj);
  })
}




var base_w;
var cover_w;

function cover_drag() {
  cover_w = document.querySelector('.content--wrap').clientWidth;
  document.documentElement.style.setProperty('--cover_w', cover_w);

  //初期位置を中心にセット ← メインタイトル「ACTION!」が画面中心に表示されるように見た目で調整する
  var adj_x;
  if(is_touch()){
    adj_x = 0.2;
  }else{
    adj_x = 0.275;
  }
  var init_x = Math.floor($('.content--wrap').outerWidth() * 0.5 - $(window).width() * adj_x);
  var init_y = Math.floor($('.content--wrap').outerHeight() * 0.5 - $(window).height() * 0.45);
  $('.js--cover').scrollLeft(init_x);
  $('.js--cover').scrollTop(init_y);

  //ドラッグでスクロール
  mousedragscrollable('.js--cover');

  //スクロール時処理
  var timeoutId;
  $('.js--cover').on('scroll', function () {
    // $('body').data('tl_color').pause();
    clearTimeout(timeoutId);
    //カラー変更TLをpause
    // timeoutId = setTimeout(function () {
    //   $('body').data('tl_color').play();
    // }, 300);

    //要素TLをすべてpuase
    // for (var tl of ary_tl) { tl.pause(); }
    // timeoutId = setTimeout(function () {
    //   for (var tl of ary_tl) { tl.play(); }
    // }, 500);
  })

  //リサイズ時処理
  $(window).on('resize orientationchange', function () {
    base_w = $('.js--cover .content--wrap').width();
    $('.js--cover .content--wrap').data('base_w', base_w);
    cover_w = document.querySelector('.content--wrap').clientWidth;
    document.documentElement.style.setProperty('--cover_w', cover_w);
  })

  //モーダル時処理
  var observer = new MutationObserver(function (records) {
    var body_class = document.body.className;
    if (body_class.indexOf('menu--open') != -1 || body_class.indexOf('modal--open') != -1) { //menu, modal open時
      for (var tl of ary_tl) { tl.pause(); }
    }else{
      for (var tl of ary_tl) { tl.play(); }
    }
  })
  observer.observe(document.body, {
    attributes: true
  })

  

  /* ズームイン・アウト */
  //ズーム表現なしシームレス
  function cover_scale_seamless(){
    // var threshold = 428 / 683; //2568:4098の整数比
    // var threshold = 1284 / 2849; //2568:5698の整数比
    var threshold = 1284 / 2449; //2568:4898の整数比
    function get_min(){
      if ($(window).height() / $(window).width() > threshold) {
        var min = $(window).height() / $('.js--cover .content--wrap').height();
      } else {
        var min = $(window).width() / $('.js--cover .content--wrap').width();
      }
      return min;
    }

    function set_blank_adj(){
      var blank = {
        w: $('.js--cover .content--wrap').width(),
        h: $('.js--cover .content--wrap').height()
      }
      gsap.set('.js--cover .content--wrap', {
        marginRight: blank.w * -1,
        marginBottom: blank.h * -1,
      })
    }


    //最小倍率はwindow幅/高さにフィット
    var scale_ary = [get_min(), get_min()*1.5, 1, 1.5, 2];
    //ズームアウトした時の余白づめ
    set_blank_adj();

    $(window).on('resize', function(){
      scale_ary[0] = get_min();
      set_blank_adj();
    })

    var n = 2; //デフォルト倍率が上記のaryのn番目
    $('body').data('scale', scale_ary[n]); //現在の拡大率を保持
    
    var blank = {
      w: $('.js--cover .content--wrap').width(),
      h: $('.js--cover .content--wrap').height()
    }
    gsap.set('.js--cover .content--wrap', {
      marginRight: blank.w * -1,
      marginBottom: blank.h * -1,
    })

    var scale_ratio;
    var speed = 0.4;

    $('.js--scale .btn').on('click', function () {
      if ($(this).hasClass('zoom')) {
        n++;
        scale_ratio = scale_ary[n];
        direction = 'zoom';
      } else if ($(this).hasClass('pan')) {
        n--;
        scale_ratio = scale_ary[n];
        direction = 'pan';
      }
      if (n == 0) {
        $('.js--scale .pan').addClass('disable');
      } else if (n == scale_ary.length - 1) {
        $('.js--scale .zoom').addClass('disable');
      } else {
        $('.js--scale .disable').removeClass('disable');
      }

      $('.js--cover .content--wrap').css('will-change', 'transform');

      gsap.to('.js--cover .content--wrap', speed, {
        scale: scale_ratio,
        transformOrigin: '0% 0%',
        ease: 'none',
        // ease: 'power1.out',
        onStart: function () {
          //要素TLをすべてpuase
          for (var tl of ary_tl) {
            tl.pause();
          }
        },
        onComplete: function () {
          //要素TLをすべて再開
          for (var tl of ary_tl) {
            tl.play();
          }
          $('.js--cover .content--wrap').css('will-change', 'auto');
        }
      })

      //画面中央のscroll position
      var original = {
        w: $('.js--cover .content--wrap').width(),
        h: $('.js--cover .content--wrap').height()
      }
      var base = {
        w: $('.js--cover .content--wrap')[0].getBoundingClientRect().width,
        h: $('.js--cover .content--wrap')[0].getBoundingClientRect().height
      }
      var base_scroll = {
        x: $('.js--cover').scrollLeft() + $(window).width() / 2,
        y: $('.js--cover').scrollTop() + $(window).height() / 2
      }
      //画面中央位置のpos割合
      var pos_ratio = {
        x: base_scroll.x / base.w,
        y: base_scroll.y / base.h
      }

      //画面中央位置のpos割合（倍率変更後）
      if(direction == 'zoom'){
        var target_x = original.w * scale_ratio * pos_ratio.x - $(window).width() / 2;
        var target_y = original.h * scale_ratio * pos_ratio.y - $(window).height() / 2;
      }else{
        var target_x = original.w * scale_ratio * pos_ratio.x - $(window).width() / 2;
        var target_y = original.h * scale_ratio * pos_ratio.y - $(window).height() / 2;
      }
      // console.log(pos_ratio.x + ' / ' + pos_ratio.y);
      gsap.to('.js--cover', speed, {
        scrollTo: {
          x: target_x,
          y: target_y,
        },
        ease: 'none',
        // ease: 'power1.out',
        onComplete: function(){
          $('body').data('scale', scale_ary[n]);
        }
      })

    })
  }

  //ズーム表現あり
  function cover_scale(){
  
    base_w = $('.js--cover .content--wrap').width();
    $('.js--cover .content--wrap').data('base_w', base_w);
  
    var scale_ary = [0.6, 1, 1.5, 2];
    var n = 1; //デフォルト倍率が上記のaryのn番目
  
    var scale_ratio;
  
    function frame_zoom(scale, direction, callback){
      var frames = $('.js--scaledisplay').find('i');
      if (direction == 'zoom'){
        gsap.set('.js--scaledisplay i:first-child', { opacity: 1 });
      }else if (direction == 'pan'){
        gsap.set('.js--scaledisplay i:last-child', { opacity: 1 });
        frames = frames.get().reverse();
      }
      // console.log(frames);
      gsap.to(frames, 0.2, {
        opacity: 1,
        stagger: 0.05,
        delay: 0.1
      })
      gsap.to(frames, 0.2, {
        opacity: 0,
        stagger: 0.075,
        delay: 0.2,
        onComplete: function () {
          callback();
        }
      })
      gsap.to('.js--scaledisplay .frame', 0.4, {
        scale: scale
      })
    } 
  
    var direction;
    $('.js--scale .btn').on('click', function(){
  
      if ($(this).hasClass('zoom')) {
        n++;
        scale_ratio = scale_ary[n];
        direction = 'zoom';
      } else if ($(this).hasClass('pan')) {
        n--;
        scale_ratio = scale_ary[n];
        direction = 'pan';
      }
      if (n == 0) {
        $('.js--scale .pan').addClass('disable');
      } else if (n == scale_ary.length - 1) {
        $('.js--scale .zoom').addClass('disable');
      } else {
        $('.js--scale .disable').removeClass('disable');
      }
  
      //要素TLをすべてpuase
      for (var tl of ary_tl) {
        tl.pause();
      }
  
      //ズームイン・アウト表現表示
      gsap.set('.js--scaledisplay', { display: 'flex' });
      frame_zoom(scale_ratio, direction, function(){
        $('.js--scaledisplay').hide();
        // $('.js--cover')[0].style.zoom = scale_ratio * 100 + '%';
        var current_x = $('.js--cover').scrollLeft();
        var current_y = $('.js--cover').scrollTop();
        gsap.set('.js--cover .content--wrap', {
          scale: scale_ratio,
          transformOrigin: '0% 0%'
        })
        // console.log(current_x + ' : ' + current_y);
        // $('.js--cover').scrollLeft(current_x * scale_ratio - $(window).width() * 0.5);
        // $('.js--cover').scrollTop(current_y * scale_ratio + $(window).height() * 0.5);
        // console.log($('.content')[0].getBoundingClientRect().width);
        // gsap.set('.js--cover .content--wrap', {
        //   width: $('.content')[0].getBoundingClientRect().width
        // })
        // gsap.set('.js--cover .content--wrap', {
        //   width: $('.js--cover .content--wrap').data('base_w') * scale_ratio
        // })
        for (var tl of ary_tl) {
          tl.play();
        }
        // document.documentElement.style.setProperty('--scale', scale_ratio);
        // set_flatChrWrap();
      });
      
    })
  }

  cover_scale_seamless();

}




function tv_switch(){

  var n = 0;
  var duration_noise = 0.3;
  var duration = 3 + duration_noise;


  var tl = gsap.timeline({
    repeat: -1,
    repeatDelay: duration,
  });

  $('.js--tv').data('tl', tl);
  ary_tl.push(tl);

  $('.js--tv').find('.js--tv--ph').each(function(i){
    if(i == 0){
      $('.js--tv--ph').each(function(){
        $(this).find('.ph').each(function(v){
          //noise on
          tl.add(function(){
            $('.js--tv--ph').addClass('noise');
            // rotate_dial();
          }, v * duration);
          //ph change
          var $el = $(this);
          tl.add(function(){
            $('.js--tv').attr('data-ph', v);
            $el.addClass('on');
            $el.siblings().removeClass('on');
          }, v * duration)
          //noise off
          tl.add(function () { $('.js--tv--ph').removeClass('noise'); }, v * duration + duration_noise);

          tl.addLabel('ph' + v, v * duration - duration_noise);
        })
      })
    }
  })


  function rotate_dial(){
    $('.js--tv').find('.dial').each(function(){
      if ($(this).data('rotation') == undefined){
        if($(this).hasClass('upper')){
          $(this).data('rotation', 0);
        } else if ($(this).hasClass('lower')){
          $(this).data('rotation', -60);
        }
      }
      var r = Number($(this).data('rotation')) + 30;
      console.log(r);
      gsap.set($(this), {
        rotation: r
      })
      $(this).data('rotation', r);
    })
  }
  // rotate_dial();

  
  var phMax = $('.js--tv--ph').eq(0).children('.ph').length;
  
  $('.js--tv--btn').on('click', function(){
    var n = Number($('.js--tv').attr('data-ph')) + 1;
    if (n == phMax){
      n = 0;
    }
    tl.seek('ph' + n);
  })

  //inviewでTLをplay/pause
  inview('.js--tv', '0px 0px', function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if ($(entry.target).data('tl') !== undefined) {
          $(entry.target).data('tl').play();
        }
      } else {
        if ($(entry.target).data('tl') !== undefined) {
          $(entry.target).data('tl').pause();
        }
      }
    });
  });

}
var ary_tl = [];

cover_drag();


//KV内のimgロードを監視
function loadCheck(ary, callback) {
  var targetImg_ary = ary;
  var imgAry = [];
  var loadedCounter = 0;

  for (i = 0; i < targetImg_ary.length; i++) {
    var imgObj = new Image();
    imgAry.push({
      imgObj: imgObj,
      src: $(targetImg_ary[i]).attr('src')
    })
  }

  var ratio = 1 / imgAry.length;
  for (var i = 0; i < imgAry.length; i++) {
    imgAry[i].imgObj.onload = function () {
      loadedCounter++;
      // console.log(loadedCounter);
      if (tl_progress != undefined){
        tl_progress.timeScale(ratio * loadedCounter);
      }
      if (loadedCounter == imgAry.length) {
        callback();
      }
    };
    imgAry[i].imgObj.src = imgAry[i].src;
  }
}


function unlock_splash(){
  first_scroll = true;
  setTimeout(function(){
    $('.js--cover .content--wrap').removeClass('before_inited');
    $('.js--menu--btn').removeAttr('style');
    $('.js--scale').removeAttr('style');
  }, 500);
  gsap.to('.cover__splash', 0.5, {
    autoAlpha: 0,
    onComplete: function () {
      $('.cover__splash').remove();
      $('body').removeClass('before_splash');
    }
  })
}


if (sessionStorage.getItem('first_visit')) {
  //再訪問時はsvgレンダリング後に表示
  $('.cover__splash').remove();
  $('.js--cover').find('svg')[0].addEventListener("load", function (evt) {
    $('.js--cover .content--wrap').removeClass('before_inited');
    $('body').removeClass('before_inited');
    $('body').removeClass('before_splash');
  });
} else {
  $('.js--menu--btn').css('pointer-events', 'none');
  $('.js--scale').css('pointer-events', 'none');
  //初回訪問時のみLOADING
  sessionStorage.setItem('first_visit', true);
  var first_scroll = false;
  var tl_progress = gsap.timeline().timeScale(0);
  tl_progress.to('.progress .bar', 1, {
    x: '0%',
    ease: 'none',
    // delay: 0.75,
    onComplete: function () {
      $('body').removeClass('before_inited');
      $('.cover__splash').css('pointer-events', 'none');
      gsap.to('.cover__splash .screen--wrap', 1, {
        autoAlpha: 0,
        delay: 0.75,
        onComplete: function () {
          $('.js--cover').on('scroll.first touchend.first', function () {
            if (!first_scroll) {
              unlock_splash();
            } else {
              $('.js--cover').off('scroll.first');
              $('.js--cover').off('touchend.first');
            }
          })
        }
      })
    }
  })
  loadCheck($('.js--cover').find('img'), function () {
    return;
  })
}



if ($('.js--ph-switch')[0]){
  ph_switch();
}

if ($('.js--character-switch')[0]){
  character_switch();
}

if ($('.js--random--reload')[0]){
  random_reload();
}

if ($('.js--slideshow')[0]){
  $(window).on('load', function(){
    slideshow();
  })
}
if ($('.js--slideshow--vrt')[0]){
  $(window).on('load', function(){
    slideshow_vrt();
  })
}

if ($('.js--tv')[0]){
  tv_switch();
}

// gsap.ticker.fps(30);


var touch_event = window.ontouchstart;
var touch_points = navigator.maxTouchPoints;
if (touch_event !== undefined && 0 < touch_points) {
  $('.js--scale').hide();
  // タッチ対応端末
  var elem = $('.js--cover .content--wrap')[0];
  var blank = {
    w: $('.js--cover .content--wrap').width(),
    h: $('.js--cover .content--wrap').height()
  }
  var panzoom = Panzoom(elem, {
    origin: '50% 50%',
    contain: 'outside',
    maxScale: 4,
    minScale: 0.5,
    // duration: 500,
    startX: blank.w * -0.478 + $(window).width() * 0.5,
    startY: blank.h * -0.5 + $(window).height() * 0.5,
  })
  gsap.set('.js--cover .content--wrap', {
    top: (blank.h - $(window).height()) * 0.5 - 1,
    left: (blank.w - $(window).width()) * 0.5 - 1,
    // marginBottom: screen.height - window.innerHeight
  })

  elem.addEventListener('panzoomchange', function (event){
    var currentScale = Math.floor(event.detail.scale);
    if (currentScale == 0) { //limit minScale
      $('.js--scale--touch .pan').addClass('disable');
    } else if (currentScale == 4) { //limit maxScale
      $('.js--scale--touch .zoom').addClass('disable');
    }else{
      $('.js--scale--touch .disable').removeClass('disable');
    }
  })

  $('.js--scale--touch .btn').on('click', function () {
    if ($(this).hasClass('zoom')) {
      panzoom.zoomToPoint(panzoom.getScale() + 1, {
        clientX: $(window).width() * 0.5,
        clientY: $(window).height() * 0.5
      }, { animate: false })
    } else if ($(this).hasClass('pan')) {
      panzoom.zoomToPoint(panzoom.getScale() - 1, {
        clientX: $(window).width() * 0.5,
        clientY: $(window).height() * 0.5
      }, { animate: false })
    }
  })
}else{
  // タッチ非対応端末
  $('.js--scale--touch').hide();
}


