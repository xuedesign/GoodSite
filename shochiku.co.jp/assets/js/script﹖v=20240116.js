$(function(){
  $('#recruit_header').load('/company/recruit/newgrad/header.txt?v=2', function(){

  });
  $('#recruit_footer').load('/company/recruit/newgrad/footer.txt', function(){

    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 300) {
        $('#pagetop').fadeIn();
        $('body').addClass('scroll-in');
      } else {
        $('#pagetop').fadeOut();
        $('body').removeClass('scroll-in');
      }
    }).trigger('scroll');

  });
  
  $(document).on('click', 'a[href^="#"]', function () {
    if($(this).hasClass('no-scroll')) return;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - $('#recruit_header').outerHeight();
　　 var speed = 300;
    $("html, body").animate({
      scrollTop: position
    }, speed, "swing");
    return false;
  });    

  $(window).on('resize', function(){
    if($(window).width() > 768){
      $('#slide-menu').hide();
      $('body').removeClass('type-sp');
    }else{
      $('body').addClass('type-sp');
    }
  });

  if($(window).width() > 768){
    $('#slide-menu').hide();
    $('body').removeClass('type-sp');
  }else{
    $('body').addClass('type-sp');
  }

  if(location.hash){
    var target = $(location.hash);
    if(target.length){
      let offset = $('body').hasClass('type-sp') ? 100 : 140;
      var position = target.offset().top - offset;
      $("html, body").animate({
        scrollTop: position
      }, 0, "swing");
    }
  }
  $(document).on("click", ".smenu .block .titles", function(){
    if($(window).width() < 768){
     $(this).next("ul").slideToggle();
     $(this).toggleClass("active");
   };
  });
  

  $(document).on('mouseover', '#recruit_header .header-nav .parent-menu', function(){
    $(this).children('ul').stop().slideDown(200);
  }).on('mouseleave', '#recruit_header .header-nav .parent-menu', function(){
    $(this).children('ul').stop().slideUp(0);
  });

  $(document).on('click', '#sp-mm .sp-mm-btn', function(){
    $('#slide-menu').stop().slideDown(200);
  });
  $(document).on('click', '#sp-mm-close .sp-mm-btn', function(){
    $('#slide-menu').stop().slideUp(200);
  });

  $(document).on('click', '.parent-title', function(){
    if($('body').hasClass('type-sp')){
      $(this).parent().toggleClass('open').find('.child-menu').stop().slideToggle(200);
    }
  });

  $(document).ready(function() {
    function checkInView() {
        var offset = 80;
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
  
        $('.inview').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
  
            if ((elementBottom >= scrollTop + offset) && (elementTop <= scrollTop + windowHeight - offset)) {
                $(this).addClass('active');
            }
        });
    }
  
    $(window).on('scroll', checkInView);
  
    checkInView();
  });
  
});





/*
* jquery-match-height 0.7.2 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,n=function(t){return parseFloat(t)||0},a=function(e){var o=1,a=t(e),i=null,r=[];return a.each(function(){var e=t(this),a=e.offset().top-n(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(i-a))<=o?r[r.length-1]=s.add(e):r.push(e),i=a}),r},i=function(e){var o={
  byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=i(e);if(o.remove){var n=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(n)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="0.7.2",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,
  r._afterUpdate=null,r._rows=a,r._parse=n,r._parseOptions=i,r._apply=function(e,o){var s=i(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),u=h.parents().filter(":hidden");return u.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),u.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0",
  "padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=a(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var a=t(o),i=0;if(s.target)i=s.target.outerHeight(!1);else{if(s.byRow&&a.length<=1)return void a.css(s.property,"");a.each(function(){var e=t(this),o=e.attr("style"),n=e.css("display");"inline-block"!==n&&"flex"!==n&&"inline-flex"!==n&&(n="block");var a={
  display:n};a[s.property]="",e.css(a),e.outerHeight(!1)>i&&(i=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}a.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=n(e.css("border-top-width"))+n(e.css("border-bottom-width")),o+=n(e.css("padding-top"))+n(e.css("padding-bottom"))),e.css(s.property,i-o+"px"))})}),u.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),
  this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),n=o.attr("data-mh")||o.attr("data-match-height");n in e?e[n]=e[n].add(o):e[n]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(n,a){if(a&&"resize"===a.type){var i=t(window).width();if(i===e)return;e=i;
  }n?o===-1&&(o=setTimeout(function(){s(a),o=-1},r._throttle)):s(a)},t(r._applyDataApi);var h=t.fn.on?"on":"bind";t(window)[h]("load",function(t){r._update(!1,t)}),t(window)[h]("resize orientationchange",function(t){r._update(!0,t)})});