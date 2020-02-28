import Swiper from 'swiper/dist/js/swiper';

class LocationGallery {
  constructor(parent) {
    this.parent = parent;
    this.exit = parent.querySelector('.location-gallary__exit');
    this.openBtn = parent.querySelector('.location-gallary__button');
    this.popup = parent.querySelector('.location-gallary__popup');
    this.bodyEl = document.body;

    if (this.exit && this.openBtn && this.popup) {
      this.initEvents();
    }
  }

  initSwiper() {
    const container = this.parent;
    const config = {
      slidesPerView: 1,
      containerModifierClass: 'location-gallary__slider-box--',
      wrapperClass: 'location-gallary__slider-wrapper',
      slideClass: 'location-gallary__slider-item',
      slideActiveClass: 'location-gallary__slider-item--active',
      slideDuplicateClass: 'location-gallary__slider-item--duplicate',
      slidePrevClass: 'location-gallary__slider-item--preview',
      slideNextClass: 'location-gallary__slider-item--next',
      slideDuplicateActiveClass: 'location-gallary__slider-item--duplicate-active',
      slideDuplicatePrevClass: 'location-gallary__slider-item--duplicate-prev',
      loop: true,
      navigation: {
        nextEl: '.location-gallary__slider-btn--next',
        prevEl: '.location-gallary__slider-btn--prev',
      },
      pagination: {
        el: '.location-gallary__slider-pagination',
        dynamicBullets: true,
      },
    };
    this.sw = new Swiper(container.querySelector('.location-gallary__slider'), config);
  }

  openPopup() {
    this.popup.classList.add('location-gallary__popup--opened');
    this.bodyEl.classList.add('disabled');
  }

  closePopup() {
    this.popup.classList.remove('location-gallary__popup--opened');
    this.bodyEl.classList.remove('disabled');
  }

  initEvents() {
    this.initSwiper();
    if (this.openBtn) {
      this.openBtn.addEventListener('click', this.openPopup.bind(this));
    }
    this.exit.addEventListener('click', this.closePopup.bind(this));
  }
}

export default LocationGallery;
