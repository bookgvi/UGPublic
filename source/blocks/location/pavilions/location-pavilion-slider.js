import Swiper from 'swiper/dist/js/swiper';

class LocationPavilionSlider {
  constructor(parent) {
    this.parent = parent;
    this.initSwiper();
  }

  initSwiper() {
    const container = this.parent.querySelectorAll('.location-pavilions__slider-box');
    const config = {
      slidesPerView: 1,
      wrapperClass: 'location-pavilions__slider-wrapper',
      slideClass: 'location-pavilions__slider-item',
      touchRatio: 1,
      loop: true,
      pagination: {
        el: '.location-pavilions__slider-pagination',
        dynamicBullets: true,
      },
      breakpoints: {
        767: {
          touchRatio: 0,
        },
      },
    };
    this.sw = new Swiper(container, config);
  }
}

export default LocationPavilionSlider;
