import Swiper from 'swiper/dist/js/swiper';

class LocationPavilions {
  constructor(parent) {
    this.pavilions = [].slice.call(parent.querySelectorAll('.location-pavilions__pavilion'));
    this.addClassToPavilions();

    this.typeWindow = LocationPavilions.checkWindowWidth();

    this.container = parent.querySelector('.location-pavilions__container');
    this.swiperOptions = {
      wrapperClass: 'location-pavilions__wrapper',
      slideClass: 'location-pavilions__pavilion',
      touchRatio: 1,
      slidesPerView: 'auto',
      slidesPerColumn: 1,
      spaceBetween: 10,
      loop: false,
      pagination: {
        el: '.location-pavilions__pagination',
        dynamicBullets: true,
      },
    };

    if (this.container) {
      this.initSlider();
    }
  }

  initSlider() {
    this.slider = new Swiper(this.container, this.swiperOptions);

    this.toggleSlider(this.typeWindow);

    window.addEventListener('resize', () => {
      const flag = LocationPavilions.checkWindowWidth();

      if (flag !== this.typeWindow) {
        this.toggleSlider(flag);

        this.typeWindow = flag;
      }
    });
  }

  addClassToPavilions() {
    if (this.pavilions.length >= 4) {
      this.pavilions.forEach((pavilion) => {
        pavilion.classList.add('location-pavilions__pavilion--many');
      });
    }
  }

  static checkWindowWidth() {
    let typeWindow = '';

    if (window.innerWidth < 768) {
      typeWindow = 'init';
    } else {
      typeWindow = 'destroy';
    }

    return typeWindow;
  }

  toggleSlider(typeWindow) {
    if (typeWindow === 'destroy') {
      this.slider.destroy(false, true);
    } else {
      this.slider.init();
    }
  }
}

export default LocationPavilions;
