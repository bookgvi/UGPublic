import Swiper from 'swiper/dist/js/swiper';

class LocationSimilar {
  constructor(parent) {
    this.parent = parent;

    this.flag = 'mobile';

    const rootLink = 'location-similar';
    this.settings = {
      slidesPerView: 'auto',
      wrapperClass: `${rootLink}__wrapper`,
      containerModifierClass: `${rootLink}__slider--`,
      slideClass: `${rootLink}__slide`,
      slideActiveClass: `${rootLink}__slide--active`,
      slideDuplicateClass: `${rootLink}__slide--duplicate`,
      slidePrevClass: `${rootLink}__slide--preview`,
      slideNextClass: `${rootLink}__slide--next`,
      slideDuplicateActiveClass: `${rootLink}__slide--duplicate-active`,
      slideDuplicatePrevClass: `${rootLink}__slide--duplicate-prev`,
      loop: false,
      touchRatio: 0,
      spaceBetween: 20,
      breakpoints: {
        1279: {
          touchRatio: 1,
          spaceBetween: 20,
        },
        767: {
          touchRatio: 1,
          spaceBetween: 10,
        },
      },
      a11y: {
        enabled: false,
      },
    };

    this.slider = new Swiper(this.parent, this.settings);

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1279) {
        this.checkFlag('desktop');
      } else {
        this.checkFlag('mobile');
      }
    });
  }

  checkFlag(width) {
    if (this.flag !== width) {
      this.slider.slideTo(0);
      this.flag = width;
    }
  }
}

export default LocationSimilar;
