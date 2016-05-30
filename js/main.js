$(function () {

    "use strict";

    /* VARIABLES
     * -------------------------- */
    var swipers = [], winW, winH, _isresponsive, smPoint = 768, mdPoint = 992, lgPoint = 1200, addPoint = 1600,
        _ismobile = navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i);


    /* PAGE CALCULATIONS
     * -------------------------- */
    function pageCalculations() {
        winW = $(window).width();
        winH = $(window).height();
        $('.menu-btn').is(':visible') ? _isresponsive = true : _isresponsive = false;
    }

    /* FUNCTIONS ON WINDOW LOAD
     * -------------------------- */
    $(window).on('load', function () {
        $('#loader-wrapper').fadeOut();
        pageCalculations();
        initSwiper();
    });

    /* FUNCTIONS ON WINDOW RESIZE
     * -------------------------- */
    function resizeCall() {
        pageCalculations();

        $('.swiper-container.initialized[data-slides-per-view="responsive"]').each(function () {
            var thisSwiper = swipers['swiper-' + $(this).attr('id')], $t = $(this), slidesPerViewVar = updateSlidesPerView($t), centerVar = thisSwiper.params.centeredSlides;
            thisSwiper.params.slidesPerView = slidesPerViewVar;
            thisSwiper.reInit();
            if (!centerVar) {
                var paginationSpan = $t.find('.pagination span');
                var paginationSlice = paginationSpan.hide().slice(0, (paginationSpan.length + 1 - slidesPerViewVar));
                if (paginationSlice.length <= 1 || slidesPerViewVar >= $t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
                else $t.removeClass('pagination-hidden');
                paginationSlice.show();
            }
        });
    }

    if (!_ismobile) {
        $(window).on('resize', function () {
            resizeCall();
        });
    } else {
        window.addEventListener("orientationchange", function () {
            resizeCall();
        }, false);
    }

    /* SWIPER SLIDER
     * -------------------------- */
    function initSwiper() {
        var initIterator = 0;
        $('.swiper-container').each(function () {
            var $t = $(this);

            var index = 'swiper-unique-id-' + initIterator;

            $t.addClass('swiper-' + index + ' initialized').attr('id', index);
            $t.find('.pagination').addClass('pagination-' + index);

            var autoPlayVar = parseInt($t.attr('data-autoplay'));
            var centerVar = parseInt($t.attr('data-center'));
            var simVar = ($t.closest('.circle-description-slide-box').length) ? false : true;

            var slidesPerViewVar = $t.attr('data-slides-per-view');
            if (slidesPerViewVar == 'responsive') {
                slidesPerViewVar = updateSlidesPerView($t);
            }
            else slidesPerViewVar = parseInt(slidesPerViewVar);

            var loopVar = parseInt($t.attr('data-loop'));
            var speedVar = parseInt($t.attr('data-speed'));

            swipers['swiper-' + index] = new Swiper('.swiper-' + index, {
                speed: speedVar,
                pagination: '.pagination-' + index,
                loop: loopVar,
                paginationClickable: true,
                autoplay: autoPlayVar,
                slidesPerView: slidesPerViewVar,
                keyboardControl: true,
                calculateHeight: true,
                simulateTouch: simVar,
                centeredSlides: centerVar,
                roundLengths: true,
                onSlideChangeEnd: function (swiper) {
                    var activeIndex = (loopVar === 1) ? swiper.activeLoopIndex : swiper.activeIndex;
                    var qVal = $t.find('.swiper-slide-active').attr('data-val');
                    $t.find('.swiper-slide[data-val="' + qVal + '"]').addClass('active');
                },
                onSlideChangeStart: function (swiper) {
                    $t.find('.swiper-slide.active').removeClass('active');
                },
                onSlideClick: function (swiper) {

                }
            });
            swipers['swiper-' + index].reInit();
            if (!centerVar) {
                if ($t.attr('data-slides-per-view') == 'responsive') {
                    var paginationSpan = $t.find('.pagination span');
                    var paginationSlice = paginationSpan.hide().slice(0, (paginationSpan.length + 1 - slidesPerViewVar));
                    if (paginationSlice.length <= 1 || slidesPerViewVar >= $t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
                    else $t.removeClass('pagination-hidden');
                    paginationSlice.show();
                }
            }
            initIterator++;
        });

    }

    function updateSlidesPerView(swiperContainer) {
        if (winW >= addPoint) return parseInt(swiperContainer.attr('data-add-slides'));
        else if (winW >= lgPoint) return parseInt(swiperContainer.attr('data-lg-slides'));
        else if (winW >= mdPoint) return parseInt(swiperContainer.attr('data-md-slides'));
        else if (winW >= smPoint) return parseInt(swiperContainer.attr('data-sm-slides'));
        else return parseInt(swiperContainer.attr('data-xs-slides'));
    }

    /* SWIPER ARROWS
     * -------------------------- */
    $('.swiper-arrow-left').on('click', function () {
        swipers['swiper-' + $(this).parent().attr('id')].swipePrev();
    });

    $('.swiper-arrow-right').on('click', function () {
        swipers['swiper-' + $(this).parent().attr('id')].swipeNext();
    });

    /* MENU BUTTON
     * -------------------------- */
    $('.menu-btn').on('click', function () {
        $(this).toggleClass('active');
    });

    /* GOOGLE MAP
     * -------------------------- */
    function initialize(obj) {
        var lat = $('#' + obj).attr("data-lat");
        var lng = $('#' + obj).attr("data-lng");
        var contentString = $('#' + obj).attr("data-string");
        var myLatlng = new google.maps.LatLng(lat, lng);
        var map, marker, infowindow;
        var image = '';
        var zoomLevel = parseInt($('#' + obj).attr("data-zoom"));
        var styles = [];
        var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

        var mapOptions = {
            zoom: zoomLevel,
            disableDefaultUI: true,
            scrollwheel: false,
            center: myLatlng
        };

        map = new google.maps.Map(document.getElementById(obj), mapOptions);

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: image
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        google.maps.event.addDomListener(window, 'resize', function () {
            var center = map.getCenter();

            google.maps.event.trigger(map, 'resize');

            map.setCenter(center);
        });
    }

    if ($('#contact-map').length) {
        initialize('contact-map');
    }

});