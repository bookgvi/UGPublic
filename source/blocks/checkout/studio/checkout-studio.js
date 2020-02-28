import Swiper from 'swiper/dist/js/swiper';

class CheckoutStudio {
  constructor(parent) {
    this.parent = parent;
    this.initEvents();
  }

  initSwiper() {
    const container = this.parent;
    const config = {
      slidesPerView: 1,
      containerModifierClass: 'checkout-studio__slider-box--',
      wrapperClass: 'checkout-studio__wrapper',
      slideClass: 'checkout-studio__slider-item',
      slideActiveClass: 'checkout-studio__slider-item--active',
      slideDuplicateClass: 'checkout-studio__slider-item--duplicate',
      slidePrevClass: 'checkout-studio__slider-item--preview',
      slideNextClass: 'checkout-studio__slider-item--next',
      slideDuplicateActiveClass: 'checkout-studio__slider-item--duplicate-active',
      slideDuplicatePrevClass: 'checkout-studio__slider-item--duplicate-prev',
      loop: false,
      navigation: {
        nextEl: '.checkout-studio__slider-btn--next',
        prevEl: '.checkout-studio__slider-btn--prev',
      },
      pagination: {
        el: '.checkout-studio__slider-pagination',
        dynamicBullets: true,
      },
    };
    this.sw = new Swiper(container.querySelector('.checkout-studio__slider'), config);
    this.sw.update();
    window.addEventListener('resize', () => {
      this.sw.update();
    });
  }

  initEvents() {
    this.initSwiper();
  }
}

export default CheckoutStudio;
