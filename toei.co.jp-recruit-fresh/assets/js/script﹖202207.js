function open_menu(speed) {
  $('body').addClass('menu--open');
  gsap.set('.js--menu', {
    // display: 'block',
    visibility: 'visible'
  })
  gsap.set('.js--menu', {
    // opacity: 1,
    onComplete: function () {
      $('.js--menu--btn').removeAttr('style');
    }
  })
}

function close_menu(speed) {
  $('body').removeClass('menu--open');
  gsap.set('.js--menu', {
    opacity: 0,
    onComplete: function () {
      $('.js--menu--btn').removeAttr('style');
      gsap.set($('.js--menu'), {
        // display: 'none',
        visibility: 'hidden'
      })
    }
  })
}


function menu_mask(speed) {

  function init_pos(el) {
    var inner = el.find('.js--mask--i');
    var outer = el.find('.js--mask--o');
  }

  function init_tl(el) {
    var inner = el.find('.js--mask--i');
    var outer = el.find('.js--mask--o');
    var tl_open = gsap.timeline();
    tl_open
      .set('.js--menu', {
        opacity: 1,
      })
      .set(inner, {
        // x: '-100%',
        y: '100%'
      })
      .set(outer, {
        // x: '100%',
        y: '-100%'
      })
      .set([outer, inner], { opacity: 1 })
      .to([inner, outer], speed, {
        x: 0,
        y: 0,
        ease: 'power2.out',
      })
    el.data('tl_mask_open', tl_open);

    var tl_close = gsap.timeline();
    tl_close
      .to(inner, speed, {
        // x: '100%',
        y: '-100%',
        ease: 'power2.out',
      }, 0)
      .to(outer, speed, {
        // x: '-100%',
        y: '100%',
        ease: 'power2.out',
        onComplete: function () {
          gsap.set([outer, inner], { opacity: 0 })
        }
      }, 0)
    el.data('tl_mask_close', tl_close);
  }


  var $inner = $('.js--mask--menu').wrapInner('<div class="js--mask--i">');
  var $outer = $inner.wrapInner('<div class="js--mask--o">');
  init_pos($('.js--mask--menu'));
  init_tl($('.js--mask--menu'));

  

  //tl - open
  var tl_open = gsap.timeline().pause();
  var time = 0;
  $('.js--mask--menu').each(function (i) {
    time = i * 0.06;
    tl_open.add($(this).data('tl_mask_open'), time);
  })
  $('.js--menu').data('tl_mask_open', tl_open);

  //tl - close
  var tl_close = gsap.timeline().pause();
  var time = 0;
  $('.js--mask--menu').each(function (i) {
    time = i * 0.06;
    tl_close.add($(this).data('tl_mask_close'), time);
  })
  tl_close.call(function () {
    close_menu(0.2);
  }, null, time + speed)
  $('.js--menu').data('tl_mask_close', tl_close);

}




function menu() {
  var speed = 0.35;

  menu_mask(0.4);

  $('.js--menu--btn').on('click', function () {
    $(this).css('pointer-events', 'none');
    if (!$('body').hasClass('menu--open')) {
      open_menu(speed);
      //mask
      if ($('.js--menu').data('tl_mask_open') !== undefined) {
        $('.js--menu').data('tl_mask_open').play(0);
      }
    } else {
      //mask
      if ($('.js--menu').data('tl_mask_close') !== undefined) {
        $('.js--menu').data('tl_mask_close').play(0);
      }
      // close_menu(speed);
    }
  })

  $('.js--menu').on('click', function (event) {
    if (!$(event.target).closest('.menu__block, .stop').length) {
      $('.js--menu').data('tl_mask_close').play(0);
      // close_menu(speed);
    }
  })


  /* リンクが同ページ内secの場合 */
  $('.js--menu .navi--menu--sub a').on('click', function(){
    var href = $(this).attr("href");
    if (href.indexOf(location.pathname) != -1){
      var anchor = href.replace(location.pathname, '');
      var position = $(anchor).offset().top - $('.pageheader').height();
      $('.js--menu').data('tl_mask_close').play(0);
      $('body,html').animate({ scrollTop: position }, 10, 'swing');

      //アンカー先が非表示タブだった場合
      if(!$(anchor).closest('.js--tab-target').hasClass('active')){
        // console.log($(anchor));
        $('.js--tab-target').removeClass('active');
        $(anchor).closest('.js--tab-target').addClass('active');
        var key = $(anchor).closest('.js--tab-target').data('tab');
        $('.js--tab').find('[data-tab="' + key + '"]').addClass('active').siblings().removeClass('active');
      }
    }
  })


}
function title_second(){

  var delay = 0.2;
  var tl_title = gsap.timeline().pause();

  $('.js--title').find('span').each(function(i){
    $(this).wrapInner('<i class="js--color--fill"></i>');
    gsap.set($(this), { opacity: 0 });

    var tl = gsap.timeline({
      delay: 0.25,
    });
    tl.to($(this), 0.025, {
      opacity: 1,
      onComplete: function(){
        var $el = $(this._targets);
        setTimeout(function(){
          $el.find('i.js--color--fill').contents().unwrap();
        }, 250);
      }
    })
    tl_title.add(tl, delay*(i+1));
  })

  
  inview('.js--title', '1px 0px', function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        tl_title.play();
      }
    });
  });

}
var keyColor = ['#1E28BE', '#FF0000', '#00B400',]; //['blue', 'red', 'green']
var keyColor_time = 30; //単位：s（各色間隔 + 色変更duration）


function pause_other(el){
  if ($(el)[0]){
    $(el).each(function(){
      if ($(this).data('tl') != undefined){ $(this).data('tl').pause(); }
    })
  }
}
function restart_other(el){
  if ($(el)[0]) {
    $(el).each(function(){
      if ($(this).data('tl') != undefined) { $(this).data('tl').play(); }
    })
  }
}


function color_change_fill(){

  var timer;
  var beforeclass;
  var n = 0;
  var speed = 0.25;

  if($('body').hasClass('red')){
    keyColor = ['#FF0000', '#00B400', '#1E28BE']; //['red', 'green', 'blue']
  }else if($('body').hasClass('green')){
    keyColor = ['#00B400', '#1E28BE', '#FF0000']; //['green', 'blue', 'red']
  }

  if($('.js--cover')[0]){
    var myEase = 'steps(3)';
  }else{
    var myEase = 'none';
  }


  function pause_cover_tl() {
    if($('.js--cover')[0]){
      pause_other('.js--slidecap');
      pause_other('.js--ph-switch--wrap');
      pause_other('.js--slideshow');
      pause_other('.js--slideshow--vrt');
    }
  }
  function restart_cover_tl() {
    if ($('.js--cover')[0]) {
      restart_other('.js--slidecap');
      restart_other('.js--ph-switch--wrap');
      restart_other('.js--slideshow');
      restart_other('.js--slideshow--vrt');
    }
  }

  function set_color_prop(color, speed){
    var tl = gsap.timeline();
    tl.to('#keycolor', speed, {
      backgroundColor: color,
      ease: myEase,
      onUpdate: function(){
        document.documentElement.style.setProperty('--color', $('#keycolor').css('background-color'));
      },
      onStart: pause_cover_tl,
      onComplete: restart_cover_tl
    })
    return tl;
  }


  var tl = gsap.timeline({
    repeat: -1,
    repeatDelay: keyColor_time,
  });
  $('body').data('tl_color', tl);
  gsap.set('#keycolor', { backgroundColor: keyColor[0] });

  keyColor.forEach(function (color, index) {
    tl.add(function () {
      set_color_prop(color, speed);
    }, keyColor_time * index)
  });

}
function slot(){

  function randomNum(min, max){
    return Math.floor(Math.random() * (max + 1 - min)) + min;;
  }

  function init(el){
    //情報を記録
    var $item = el.find('.reel__item');
    el.data('h_item', $item.height()); //1コマ分高さ
    el.data('length', $item.length); //コマ数

    //最終リールを作成
    var result = '<div class="reel__item result"></div>';
    el.find('.reel').append(result);

    //回転中表示用のリールを作成
    var between = '<div class="reel between">' + el.find('.reel').html() + '</div>';
    el.append(between);

    //data追加
    el.find('.reel:not(.between) .reel__item:not(.result)').each(function (i) {
      $(this).attr('data-item', i+1);
    })
  }

  function slot_start(el){
    var speed = 2; //リールスピード
    var speed_between = speed / 10; //リール回転中スピード
    var duraiotn_between = 1.5; //リール回転中時間
    var blur = 6; //回転中ブラー強さ
    var length = el.data('length');
    var $reel = el.find('.reel:not(.between)');
    var $between = el.find('.between');

    //最終リール決めと最終並び
    var stop = randomNum(1, length);
    var result = [];
    var n = 1;

    for (i = 0; i < length; i++){
      if (stop + 1 + i <= length){
        result.push(stop + 1 + i);
      }else{
        result.push(n);
        n++;
      }
    }

    //回転start/end TL
    var tl_move = gsap.timeline().pause();
    tl_move
      .to($reel, speed, {
        y: '100%',
        ease: 'power3.inOut',
        onComplete: function(){
          //stopした時の処理
          el.find('.result').remove();
          el.find('.between').remove();
          gsap.set($reel, { y: 0 });
          el.removeClass('lock');
          el.removeClass('playing');
          //data-hrefがある場合はページ遷移
          var $result_reel = $reel.find('[data-item]:first-child');
          if ($result_reel.data('href') != undefined){
            var href = $result_reel.data('href');
            if (el.hasClass('manual_jump')){
              //手動でページ遷移
              el.off('click');
              el.addClass('result');
              $result_reel.on('click', function(){
                if ($result_reel.data('target') != undefined) {
                  window.open(href, $result_reel.data('target'));
                }else{
                  window.location.href = href;
                }
              })
            }else{
              //自動でページ遷移
              el.addClass('lock');
              setTimeout(function(){
                if ($result_reel.data('target') != undefined) {
                  window.open(href, $result_reel.data('target'));
                } else {
                  window.location.href = href;
                }
              }, 500)
            }
          }
          
        }
      })

    //回転中ループTL
    var tl_between = gsap.timeline({ repeat: -1 }).pause();
    tl_between
      .set($between, {
        visibility: 'visible',
        webkitFilter: 'blur(' + blur + 'px)',
        scaleY: 2,
      })
      .to($between, speed_between, {
        y: '100%',
        ease: 'none',
      })

    //ブラーTL
    var tl_blur = gsap.timeline().pause();
    tl_blur
      .to($reel, speed/4, {
        webkitFilter: 'blur(' + blur + 'px)',
        scaleY: 2,
        ease: 'power3.in',
      })
      .to($reel, speed/4, {
        webkitFilter: 'blur(' + 0 + 'px)',
        scaleY: 1,
        ease: 'power3.out',
      })


    //メインTL
    var tl = gsap.timeline();
    tl
    // リール回転start
      .call(function () { tl_move.play(); }, null, 0)
      .call(function () { tl_blur.play(); }, null, speed / 4)
    // リール回転中表示に切り替え
      .call(function(){
        gsap.set($reel, { visibility: 'hidden' });
        // gsap.set($between, { visibility: 'visible' });
        tl_move.pause();
        tl_blur.pause();
        tl_between.play();
        el.removeClass('lock');
        for (i = 0; i < result.length; i++) {
          $reel.append($reel.find('[data-item="' + result[i] + '"]'));
        }
        $reel.find('.result').html($reel.find('[data-item="' + result[0] + '"]').html());
      }, null, speed / 2)


    // リール回転中表示をOFFにしてend
    if (el.hasClass('slot--autostop')){
      tl.call(function () {
        gsap.set($reel, { visibility: 'visible' });
        gsap.set($between, { visibility: 'hidden' });
        tl_between.pause();
        tl_move.play();
        tl_blur.play();
      }, null, speed / 2 + duraiotn_between)
    }else{
      var stop = '<div class="stop"></div>';
      el.append(stop);
      el.on('click', '.stop', function () {
        gsap.set($reel, { visibility: 'visible' });
        gsap.set($between, { visibility: 'hidden' });
        tl_between.pause();
        tl_move.play();
        tl_blur.play();
        el.find('.stop').remove();
      });
    }

    el.data('tl', tl);
    el.data('tl_move', tl_move);
    el.data('tl_between', tl_between);
    el.data('tl_blur', tl_blur);
  }



  //実行
  $('.js--slot').each(function(){
    $(this).on('click', function(){
      if (!$(this).hasClass('playing')){
        $(this).data('base', $(this).html());
        $(this).addClass('playing');
        $(this).addClass('lock');
        // if ($(this).hasClass('slot--autostop')){
        // }
        init($(this));
        slot_start($(this));
      }
    })
  })

  //inviewでplayingのslotはリセット
  inview('.js--slot', '0px 0px', function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        if ($(entry.target).hasClass('playing')) {
          $(entry.target).data('tl').kill();
          $(entry.target).data('tl_move').kill();
          $(entry.target).data('tl_between').kill();
          $(entry.target).data('tl_blur').kill();
          $(entry.target).html($(entry.target).data('base'));
          $(entry.target).removeClass('lock');
          $(entry.target).removeClass('playing');
        }
      }
    });
  });





}
function slide_cap(){

  var speed = 25;

  function init(el){
    el.find('.js--cap').wrap('<div class="js--inner">');
    el.find('.js--inner').css('width', el.find('.js--cap').children()[0].getBoundingClientRect().width);
    el.find('.js--cap').clone(true).insertAfter(el.find('.js--cap')).addClass('js--duplicate');
    var tl = gsap.timeline({
      repeat: -1
    }).pause();
    tl.to(el.find('.js--inner'), speed, {
      x: '-100%',
      ease: 'none'
    })
    el.data('tl', tl);
    ary_tl.push(tl);
  }

  function reset(el){
    el.data('tl').kill();
    el.find('.js--cap').unwrap();
    el.find('.js--duplicate').remove();
  }

  $('.js--slidecap').each(function(){
    init($(this));
  })

  var timer_resize;
  $(window).on('resize', function(){
    clearTimeout(timer_resize);
    timer_resize = setTimeout(function () {
      $('.js--slidecap').each(function () {
        reset($(this));
        init($(this));
        $(this).data('tl').play(0);
      })
    }, 500);
  })


  //inviewでTLをplay/pause
  inview('.js--slidecap', '0px 0px', function (entries, observer) {
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
/* マウスオーバーでキャラクター切り替え */
function character_switch(){

  $('.js--character-switch').each(function(){
    $(this).find('.character:first-child').addClass('on');
    $(this).data('n', 1); //表示順管理用data
  })

  $(document).on('mouseenter touchend', '.js--character-switch', function () {
    if ($(this).data('n') == undefined){
      $(this).data('n', 1); //表示順管理用data
    }
    var n = $(this).data('n');
    var el_ary = $(this).find('.character');
    var el = el_ary[n];
    $(el).siblings().removeClass('on');
    $(el).addClass('on');
    if (n == el_ary.length - 1){
      $(this).data('n', 0);
    }else{
      $(this).data('n', n + 1);
    }
  });


}
/* 写真切り替え */
function ph_switch() {

  var duration = 3;

  function init(el, delay){
    var tl = gsap.timeline({
      repeat: -1,
      delay: delay
    });
    el.find('.ph').each(function(i){
      var $ph = $(this);
      tl.add(function(){
        $ph.siblings().removeClass('on');
        $ph.addClass('on');
      }, (i + 1) * duration)
    })
    return tl;
  }

  $('.js--ph-switch--wrap').each(function(){
    var tl = gsap.timeline({
      repeat: -1,
    }).pause();
    $(this).find('.js--ph-switch').each(function(i){
      $(this).find('.ph:first-child').addClass('on');
      var subtl = init($(this), 0.2*i);
      tl.add(subtl, 0);
    })
    $(this).data('tl', tl);
    ary_tl.push(tl);
  })


  //inviewでTLをplay/pause
  inview('.js--ph-switch--wrap', '0px 0px', function (entries, observer) {
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
function slideshow(){

  var speed = 40;

  function init(el) {
    var $inner = el.find('.js--inner');
    var w = 0;
    $inner.children().each(function(){
      w = w + $(this).width();
    })
    gsap.set($inner, {width: w });
    var $duplicate = $($inner.children()[0]).clone(true).addClass('duplicate');
    $inner.append($duplicate);

    var tl = gsap.timeline({
      repeat: -1
    }).pause();
    tl.to($inner, speed, {
      x: '-100%',
      ease: 'none'
    })
    el.data('tl', tl);
    ary_tl.push(tl);
  }

  function reset(el) {
    el.data('tl').kill();
    el.find('.duplicate').remove();
    el.find('.js--inner').removeAttr('style');
  }

  $('.js--slideshow').each(function(){
    init($(this));
  })

  var timer_resize;
  $(window).on('resize', function () {
    clearTimeout(timer_resize);
    timer_resize = setTimeout(function () {
      $('.js--slideshow').each(function () {
        reset($(this));
        init($(this));
        $(this).data('tl').play(0);
      })
    }, 500);
  })

  //inviewでTLをplay/pause
  inview('.js--slideshow', '0px 0px', function (entries, observer) {
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



function slideshow_vrt(){

  var speed = 20;

  function init(el) {
    var $inner = el.find('.js--inner');
    var h = 0;
    $inner.children().each(function(){
      h = h + $(this).height();
    })
    gsap.set($inner, {height: h });
    var $duplicate = $($inner.children()[0]).clone(true).addClass('duplicate');
    $inner.append($duplicate);

    if(el.attr('data-speed')){
      var myspeed = Number(el.attr('data-speed'));
    }else{
      var myspeed = speed;
    }

    var tl = gsap.timeline({
      repeat: -1
    }).pause();
    tl.to($inner, myspeed, {
      y: '100%',
      ease: 'none'
    })
    el.data('tl', tl);
    ary_tl.push(tl);
  }

  $('.js--slideshow--vrt').each(function(){
    init($(this));
  })

  //inviewでTLをplay/pause
  inview('.js--slideshow--vrt', '0px 0px', function (entries, observer) {
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



//配列からランダムに値を取得
function randomPick_fromAry(ary) {
  return ary[Math.floor(Math.random() * ary.length)];
}

function slideshow_hrmsg(){
  const speed = 10000;
  const adjRatio = 1.3;

  //生成
  const init = (el) => {
    let initialSlide = 0;
    if($(el).data('initialslide')){
      initialSlide = randomPick_fromAry($(el).data('initialslide')) - 1;
    }

    const mySwiper = new Swiper(el, {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
      speed: speed,
      allowTouchMove: false,
      initialSlide: initialSlide,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      freeMode: {
        enabled: true,
        momentum: false
      },
      breakpoints: {
        451: {
          speed: speed * adjRatio * 0.5,
        },
        769: {
          speed: speed * adjRatio * 0.75,
        },
        1001: {
          speed: speed * adjRatio * 0.75,
        },
      },
    });
    $(el).data('swiper', mySwiper);

    
  }


  //生成実行
  $('.js--carousel--hrmsg').each(function(){
    init(this);
  })
  

  //inviewでのautoplay監視
  inview('.js--carousel--hrmsg', '0% 0%', (entries, observer) => {
    entries.forEach( (entry) => {
      if (entry.isIntersecting) {
        $(entry.target).data('swiper').autoplay.start();
      }else{
        $(entry.target).data('swiper').autoplay.stop();
      }
    });
  })

}
function random_reload(){
  
  $('.js--random--reload').each(function(){
    var el = $(this);
    var n = Math.floor(Math.random() * el.find('.js--random').length);
    $(el.find('.js--random')[n]).siblings().removeClass('on');
    $(el.find('.js--random')[n]).addClass('on');
  })

}
function accordion(){

  var threshold_lg = 1100;
  var threshold_md = 768;
  var threshold_sm = 450;

  function slide(btn, target){
    if (!btn.hasClass('accordion--open')) {
      //open
      btn.addClass('accordion--open');
      target.slideDown(300);
    } else {
      //close
      target.slideUp(300, function () {
        btn.removeClass('accordion--open');
      });
    }
  }

  $('.js--accordion--btn').on('click', function(){
    var $btn = $(this);
    var $warp = $(this).closest('.js--accordion--wrap');
    var $target = $warp.find('.js--accordion');
    if ($target.hasClass('accordion--lg') || $target.hasClass('accordion--md') || $target.hasClass('accordion--sm')){
      if ($target.hasClass('accordion--lg') && $(window).width() <= threshold_lg){
        slide($btn, $target);
      } else if ($target.hasClass('accordion--md') && $(window).width() <= threshold_md){
        slide($btn, $target);
      } else if ($target.hasClass('accordion--sm') && $(window).width() <= threshold_sm) {
        slide($btn, $target);
      }
    }else{
      slide($btn, $target);
    }
  })
  
}

function telop_page(){

  var speed = 20;

  function init(){
    var h = $('.js--telop').height();
    var text_h = $('.js--telop .telop__text').height();
    var text_h_total = 0;
    while (h > text_h_total){
      $('.js--telop .telop').append('<div class="telop__text">' + $('.js--telop .telop__text').html() + '</div>');
      text_h_total = text_h_total + text_h;
    }
    $('.js--telop .telop').clone(true).appendTo($('.js--telop .telop')).addClass('js--duplicate');

    var tl = gsap.timeline({
      repeat: -1
    });
    tl.to('.js--telop .telop:not(.js--duplicate)', speed, {
      y: '-100%',
      ease: 'none'
    })
    gsap.set('.js--telop .js--duplicate', { y: '100%' });
    $('.js--telop').data('tl', tl);
    $('.js--telop').addClass('inited');

    if ($('.fv--second .fv__title')[0]){
      var pos = $('.fv--second .fv__title').offset().top + $('.fv--second .fv__title').height() + 10;
      gsap.set('.js--telop', { top: pos })
    }
  }

  init();

  var timer = false;
  $(window).on('resize', function(){
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      if ($('.js--telop').data('tl') !== undefined){
        $('.js--telop').data('tl').kill();
      }
      gsap.set('.js--telop .telop:not(.js--duplicate)', { y: 0 });
      $('.js--telop .js--duplicate').remove();
      $('.js--telop .telop__text:not(:first-child)').remove();
      init();
    }, 300);
  })

  
  var observer = ScrollTrigger.create({
    trigger: '.js--telop--trigger',
    start: '100% 0%',
    end: '100% 100%',
    // invalidateOnRefresh: true,
    // markers: true,
    onEnter: function () {
      // console.log('onEnter');
      $('.js--telop').addClass('lock');
    },
    onEnterBack: function () {
      // console.log('onEnterBack');
      $('.js--telop').removeClass('lock');
    },
  });



}
function modal(speed){

  function open_modal(speed){
    $('body').addClass('modal--open');
    gsap.set('.js--modal', {
      display: 'flex',
    })
    gsap.to('.js--modal', speed, {
      opacity: 1,
    })
  }

  function close_modal(speed){
    gsap.to('.js--modal', speed, {
      opacity: 0,
      onComplete: function(){
        //cover video
        if ($('.js--modal').find('#video_cover').length > 0) {
          var player = new Vimeo.Player($('#video_cover'));
          player.setCurrentTime(0);
          player.pause();
        }
        $('.js--modal').find('[data-modal]').hide();
        gsap.set('.js--modal', { display: 'none' });
        $('body').removeClass('modal--open');
      }
    })
  }

  $('.js--modal--btn').on('click', function(){
    var key = $(this).data('modal');
    var $target = $('.js--modal').find('[data-modal="' + key + '"]');
    $target.show();
    open_modal(speed);
    //businessカルーセル
    if ($target.find('.js--carousel--business').length > 0){
      $target.find('.js--carousel--business').data('swiper').slideTo($(this).data('slide'), 0);
    }
    //facilityカルーセル
    if ($target.find('.js--carousel--facility').length > 0){
      $target.find('.js--carousel--facility').data('swiper').slideTo($(this).data('slide'), 0);
    }
    //cover video
    if ($target.find('#video_cover').length > 0){
      var player = new Vimeo.Player($('#video_cover'));
      player.play();
      player.on('ended', function (data) {
        close_modal(speed);
      });
    }
  })
  

  $('.js--modal--close').on('click', function(){
    close_modal(speed);
  })
  $('.js--modal').on('click', function (event) {
    if (!$(event.target).closest('.modal__window').length) {
      close_modal(speed);
    }
  })


}
/* about - business */
function carousel_business(){

  function init_carousel(el){
    var swiper = new Swiper(el, {
      speed: 750,
      spaceBetween: 0,
      // slidesPerView: 1,
      // autoHeight: true,
      loop: true,
      navigation: {
        nextEl: el.closest('.js--carousel--wrap').find('.swiper-button-next'),
        prevEl: el.closest('.js--carousel--wrap').find('.swiper-button-prev'),
      },
      pagination: {
        el: el.closest('.js--carousel--wrap').find('.swiper-pagination'),
        type: 'bullets',
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + '<i class="js--color--fill"></i>' + '</span>';
        },
      },
      observer: true,
      observeParents: true,
    });
    el.data('swiper', swiper);
  }

  $('.js--carousel--business').each(function(){
    init_carousel($(this));
  })

}


/* about - history */
function carousel_history(){

  function init_carousel(el){
    var swiper = new Swiper(el, {
      speed: 750,
      spaceBetween: 0,
      loop: true,
      // autoplay: {
      //   delay: 4000,
      //   disableOnInteraction: false,
      // },
      navigation: {
        nextEl: el.closest('.js--carousel--wrap').find('.swiper-button-next'),
        prevEl: el.closest('.js--carousel--wrap').find('.swiper-button-prev'),
      },
      on: {
        slideChangeTransitionStart: function () {
          var n = $(this.slides[this.activeIndex]).data('swiper-slide-index') + 1;
          var total = this.slides.length - 2;
          var counter = el.closest('.js--carousel--wrap').find('.counter .result');
          var result = ('00' + n).slice(-2) + '／' + ('00' + total).slice(-2);
          counter.html(result);
        },
      },
    });
    el.data('swiper', swiper);
    // swiper.autoplay.stop();
    
    //inviewでautoplayをplay/pause
    // inview('.js--carousel--history', '0px 0px', function (entries, observer) {
    //   entries.forEach(function (entry) {
    //     if (entry.isIntersecting) {
    //       $(entry.target).data('swiper').autoplay.start();
    //     } else {
    //       $(entry.target).data('swiper').autoplay.stop();
    //     }
    //   });
    // });
  }

  $('.js--carousel--history').each(function(){
    init_carousel($(this));
  })

}

/* benefit - facility */
function carousel_facility() {

  function init_carousel(el) {
    var swiper = new Swiper(el, {
      speed: 750,
      spaceBetween: 0,
      // slidesPerView: 1,
      // autoHeight: true,
      loop: true,
      navigation: {
        nextEl: el.closest('.js--carousel--wrap').find('.swiper-button-next'),
        prevEl: el.closest('.js--carousel--wrap').find('.swiper-button-prev'),
      },
      observer: true,
      observeParents: true,
    });
    el.data('swiper', swiper);
  }

  $('.js--carousel--facility').each(function () {
    init_carousel($(this));
  })

}



/* rookietalk - member */
function carousel_member() {
  var swiper_member = [];

  function init_carousel() {
    $('.js--carousel--member').each(function () {
      var swiper = new Swiper($(this), {
        speed: 750,
        spaceBetween: 0,
        loop: true,
        navigation: {
          nextEl: $(this).find('.swiper-button-next'),
          prevEl: $(this).find('.swiper-button-prev'),
        },
      });
      swiper_member.push(swiper);
    })
  }

  var breakpoint = window.matchMedia('(min-width:769px)');
  var breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (swiper_member.length > 0) {
        for (i = 0; i < swiper_member.length; i++) {
          if (swiper_member[i] != undefined && swiper_member[i].initialized) {
            swiper_member[i].destroy();
          }
        }
        swiper_member = [];
      }
    } else if (breakpoint.matches === false) {
      init_carousel();
    }
  }

  breakpoint.addListener(breakpointChecker);
  breakpointChecker();

}


/* works */
function carousel_works() {
  var swiper_works = [];

  function init_carousel() {
    $('.js--carousel--works').each(function () {
      var $el = $(this);
      if ($el.find('.swiper-slide').length > 1){
        var swiper = new Swiper($el, {
          speed: 750,
          spaceBetween: 0,
          loop: true,
          navigation: {
            nextEl: $el.find('.swiper-button-next'),
            prevEl: $el.find('.swiper-button-prev'),
          },
          on: {
            slideChangeTransitionStart: function () {
              var n = $(this.slides[this.activeIndex]).data('swiper-slide-index') + 1;
              var total = this.slides.length - 2;
              var counter = $el.closest('.js--carousel--wrap').find('.counter .result');
              var result = ('00' + n).slice(-2) + '／' + ('00' + total).slice(-2);
              counter.html(result);
            },
          },
        });
        swiper_works.push(swiper);
      }else{
        $el.addClass('solo');
      }
    })
  }

  var breakpoint = window.matchMedia('(min-width:769px)');
  var breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (swiper_works.length > 0) {
        for (i = 0; i < swiper_works.length; i++) {
          if (swiper_works[i] != undefined && swiper_works[i].initialized) {
            swiper_works[i].destroy();
          }
        }
        swiper_works = [];
      }
    } else if (breakpoint.matches === false) {
      init_carousel();
    }
  }

  breakpoint.addListener(breakpointChecker);
  breakpointChecker();

}
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



//init pos
function init_pos(el) {
  var inner = el.find('.js--mask--i');
  var outer = el.find('.js--mask--o');
  var x_set = 101;
  if (el.hasClass('js--mask--r') || el.hasClass('js--child--r')) {
    x_set = x_set * -1;
  }
  gsap.set(inner, {
    x: x_set + '%',
  })
  gsap.set(outer, {
    x: (x_set * -1) + '%',
  })
}

//init TL
function init_tl(el, speed) {
  var inner = el.find('.js--mask--i');
  var outer = el.find('.js--mask--o');
  var delay = 0;
  if (el.data('delay') !== undefined){
    delay = el.data('delay');
  }

  // speed = speed * outer.width()/800;

  var tl = gsap.timeline().pause();
  tl.to([inner, outer], speed, {
    x: 0,
    y: 0,
    delay: delay,
    ease: 'power2.inOut',
    onComplete: function(){
      el.addClass('js--mask--open');
    }
  })
  el.data('tl_mask', tl);
}

function init_tl_order(el, speed) {
  var delay_parent = 0;
  var delay_child = speed / 3;
  if (el.data('delay') !== undefined) {
    delay_parent = el.data('delay');
  }
  if (el.data('child') !== undefined) {
    delay_child = el.data('child');
  }

  var tl = gsap.timeline().delay(delay_parent).pause();

  var time = 0;
  el.find('.js--child--l, .js--child--r').each(function(i){
    time = i * delay_child;
    init_tl($(this), speed);
    tl.add($(this).data('tl_mask').play(), time);
  })

  el.data('tl_mask', tl);
}


/* mask init */
function init_mask(speed){
  var mask_speed = speed;
  var targetClass = '.js--mask--l, .js--mask--r';

  $(targetClass).each(function(){
    var $inner = $(this).wrapInner('<div class="js--mask--i">');
    var $outer = $inner.wrapInner('<div class="js--mask--o">');
    init_pos($(this));
    init_tl($(this), mask_speed);
  })
}

/* mask init child-order */
function init_mask_order(speed){
  var mask_speed = speed;
  var targetClass = '.js--mask--order';

  $(targetClass).find('.js--child--l, .js--child--r').each(function(){
    var $inner = $(this).wrapInner('<div class="js--mask--i">');
    var $outer = $inner.wrapInner('<div class="js--mask--o">');
    init_pos($(this));
  })

  $(targetClass).each(function(){
    init_tl_order($(this), mask_speed);
  })

}


/* mask inview */
function inview_mask(){
  var target = '.js--mask--l, .js--mask--r, .js--mask--order';

  inview(target, '-30% 0px', function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var tl = $(entry.target).data('tl_mask');
        if (tl !== undefined){
          tl.play();
        }
      }
    });
  });

}


function article_phSwitch(){

  var fade_speed = 0.25;


  function switch_ph(el, speed){
    var key = el.data('trigger');
    var $ph = $('.js--ph').find('[data-trigger="' + key + '"]');
    var $ph_other = $ph.siblings();
    
    gsap.killTweensOf($ph);
    gsap.killTweensOf($ph_other);

    gsap.set($ph, { zIndex: 1 });
    gsap.set($ph_other, { zIndex: 0 });
    gsap.to($ph, speed, {
      autoAlpha: 1,
      onComplete: function(){
        gsap.to($ph_other, speed, { autoAlpha: 0 })
      }
    })
  }

  function init(el){
    var observer = ScrollTrigger.create({
      trigger: el,
      start: '0% 50%',
      end: '100% 50%',
    //   markers: true,
      onEnter: function () {
        // console.log('onEnter');
        switch_ph(el, fade_speed);
      },
      onEnterBack: function () {
        // console.log('onEnterBack');
        switch_ph(el, fade_speed);
      },
    });
  }


  $('.js--sec').find('[data-trigger]').each(function(){
    init($(this));
  })

}




function talk_popup(){

  inview('.js--talk--popup', '-25% 0px', function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $(entry.target).addClass('on');
      }
    });
  });

}
function pinchscale(){

  function init(el){
    // var item = el.find('.js--scaleitem')[0];
    var elem = el.find('.js--scaleitem')[0];
    var panzoom = Panzoom(elem, {
      origin: '50% 50%',
      contain: 'outside',
      maxScale: 4,
      minScale: 1,
      startScale: 1,
      step: 0.75,
      // touchAction: '',
      // panOnlyWhenZoomed: true,
    })
  }

  $('.js--pinchscale').each(function(){
    init($(this));
  })

  // $('.js--scaleitem--zoom').on('click', function(){
  //   var key = $(this).data('item');
  //   var $target = $('.js--pinchscale').find('[data-item="' + key + '"]').find('.js--scaleitem');
  //   $target.data('zoom').zoomTo(0, 0, 2);
  // })

}
function tab_switching(){

  $('.js--tab [data-tab]').on('click', function(){
    var key = $(this).data('tab');
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
    var $target = $('.js--tab-target[data-tab="' + key + '"]');
    $('.js--tab-target').removeClass('active');
    $target.addClass('active');
  })

}
/* 汎用inview funciton */
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


/* ページ内アンカー */
$('a[href^="#"]').on("click", function () {
  var href = $(this).attr("href");
  var target = $(href == "#" || href == "" ? 'html' : href);
  var position = target.offset().top - $('.pageheader').height();
  $('body,html').animate({ scrollTop: position }, 400, 'swing');
  return false;
});


/* 文字変形の親要素のサイズをscaleした子要素に合わせる */
function set_flatChrWrap(){
  $('.chr--flat--145, .chr--flat--130, .chr--flat--120, .chr--flat--115').each(function(){
    if ($(this).closest('.carousel--history--wrap').length == 0){
      var $el = $(this);
      $el.parent().css({
        width: 'auto',
        maxWidth: 'none',
        display: 'inherit'
      });
      var scale = Number($el.attr('class').replace('chr--flat--', ''));
      $el.parent().css({
        width: $el[0].getBoundingClientRect().width * 1.015,
        display: 'inline-block',
        // paddingRight: scale* 0.1 + '%',
        maxWidth: 102.5 / scale * 100 + '%',
      });
    }
  })
}






//adobeフォント適用後実行function
function after_fontactive(){
  let set_timer = 0;
  const entries = performance.getEntriesByType('navigation');
  entries.forEach((entry) => {
    if (entry.type === 'back_forward') {
      set_timer = 500;
    }
  });
  setTimeout(function(){
    set_flatChrWrap();
  }, set_timer);
  /* telop */
  if ($('.js--telop')[0]) {
    telop_page();
  }
  /* アンカーページ遷移 */
  if (location.hash) {
    var href = location.hash;
    //アンカー先が非表示タブだった場合
    if(!$(href).closest('.js--tab-target').hasClass('active')){
      $('.js--tab-target').removeClass('active');
      $(href).closest('.js--tab-target').addClass('active');
      var key = $(href).closest('.js--tab-target').data('tab');
      $('.js--tab').find('[data-tab="' + key + '"]').addClass('active').siblings().removeClass('active');
    }
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - $('.pageheader').height();
    $('body,html').scrollTop(position);
  }
  /* title */
  if ($('.js--title')[0]) {
    title_second();
  }
}


/* -- adobeフォント適用後実行 -- */
var timer_init;
//3秒後にpageがinitしていなかったら強制init
timer_init = setTimeout(function () {
  $('body').addClass('force-active');
  after_fontactive();
}, 3000);
var observer = new MutationObserver(function (records) {
  var html_class = document.documentElement.className;
  if (html_class.indexOf('wf-active') != -1) {
    if (timer_init > 0) {
      clearTimeout(timer_init);
    }
    after_fontactive();
    observer.disconnect();
  }
})
observer.observe(document.documentElement, {
  attributes: true
})


/* -- resizeイベント -- */
var timer_resize;
var lastInnerWidth = window.innerWidth;
$(window).on('resize orientationchange', function(){
  /* カスタムプロパティ更新 */
  document.documentElement.style.setProperty('--cntr', (document.documentElement.clientWidth - 1066) / 2 + 'px');
  // document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
  clearTimeout(timer_resize);
  if (lastInnerWidth != window.innerWidth) {
    lastInnerWidth = window.innerWidth;
    timer_resize = setTimeout(function () {
      set_flatChrWrap();
    }, 500);
  }
})

//セカンドページFV
function adjMargin(){
  var h = $('.fv--second .fv__intro .para--lead').height();
  $('.fv--second .fv__intro .para--lead').css('margin-bottom', h * -1);
  $('.fv--second').css('margin-bottom', h);
  $('.fv--second .lower').css('margin-bottom', h * -1);
}
if ($('.fv__intro .para--lead')[0]){
  adjMargin();
  $(window).on('resize', function () {
    adjMargin();
  })
}

var ary_tl = [];

/* -- 汎用function -- */
/* スロット */
if($('.js--slot')[0]){
  slot();
}

/* アコーディオン */
if ($('.js--accordion')[0]){
  accordion();
}

/* menu */
if ($('.js--menu')[0]){
  menu();
}


/* modal */
if ($('.js--modal--btn')[0]) {
  modal(0.4);
}

/* carousel */
if ($('.js--carousel--business')[0]) {
  carousel_business();
}
if ($('.js--carousel--history')[0]) {
  carousel_history();
}
if ($('.js--carousel--facility')[0]) {
  carousel_facility();
}
if ($('.js--carousel--member')[0]) {
  carousel_member();
}
if ($('.js--carousel--works')[0]) {
  carousel_works();
}
if ($('.js--carousel--hrmsg')[0]) {
  slideshow_hrmsg();
}

/* slidecap */
if ($('.js--slidecap')[0]) {
  $(window).on('load', function () {
    slide_cap();
  })
}

/* keyColor変更 */
if ($('.js--color--fill')[0] || $('.js--color--bdr')[0]) {
  color_change_fill();
}

/* mask */
if ($('.js--mask--l, .js--mask--r')[0]) {
  init_mask(0.3); //arg: マスクスピード
  inview_mask();
}
if ($('.js--mask--order')[0]) {
  init_mask_order(0.3); //arg: マスクスピード
  inview_mask();
}

/* -- 特定セカンドページ用function -- */
/* projectstory */
if ($('.js--article--phSwitch')[0]) {
  $(window).on('load', function(){
    article_phSwitch();
  })
}

/* rookietalk */
if ($('.js--talk--popup')[0]) {
  talk_popup();
}

/* works */
if ($('.js--pinchscale')[0]) {
  pinchscale();
}

/* tab */
if ($('.js--tab')[0]) {
  tab_switching();
}