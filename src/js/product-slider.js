(function () {

  $('[data-product-slider]').slick({
    dots: true,
    slidesToShow: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 10000,
    prevArrow: $('[data-product-slider--left]').removeClass('hidden'),
    nextArrow: $('[data-product-slider--right]').removeClass('hidden'),
    responsive: [
      {
        breakpoint: 1200,
        settings: "unslick"
      }
    ]
  });

})();