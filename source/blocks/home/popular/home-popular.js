import Swiper from 'swiper/dist/js/swiper';

class HomePopular {
  constructor(parent) {
    this.parent = parent;

    const rootLink = 'home-popular';

    new Swiper(this.parent, {
      slidesPerView: 2,
      wrapperClass: `${rootLink}__wrapper`,
      containerModifierClass: `${rootLink}__slider--`,
      slideClass: `${rootLink}__slide`,
      slideActiveClass: `${rootLink}__slide--active`,
      slideDuplicateClass: `${rootLink}__slide--duplicate`,
      slidePrevClass: `${rootLink}__slide--preview`,
      slideNextClass: `${rootLink}__slide--next`,
      slideDuplicateActiveClass: `${rootLink}__slide--duplicate-active`,
      slideDuplicatePrevClass: `${rootLink}__slide--duplicate-prev`,
      loop: true,
      touchRatio: 1,
      spaceBetween: 20,
      navigation: {
        disabledClass: `${rootLink}__button--disabled`,
        prevEl: parent.querySelector(`.${rootLink}__button--prev`),
        nextEl: parent.querySelector(`.${rootLink}__button--next`),
      },
      breakpoints: {
        1023: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        767: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
      a11y: {
        enabled: false,
      },
    });
  }
}

export default HomePopular;
