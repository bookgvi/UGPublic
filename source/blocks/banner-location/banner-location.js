import Swiper from 'swiper/dist/js/swiper';

class BannerLocation {
  constructor(parent) {
    this.parent = parent;
    this.slides = [].slice.call(this.parent.querySelectorAll('.swiper-slide'));
    this.swiperSetting = {
      loop: true,
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      navigation: {
        nextEl: '.catalog__slider-btn',
      },
    };
    window.addEventListener('resize', this.widthSlide.bind(this));
    this.widthSlide();
  }

  widthSlide() {
    if (this.parent.offsetWidth < 747) {
      this.swiperSetting.slidesPerView = 'auto';
      this.swiperSetting.spaceBetween = 10;
      if (this.sliderBanner !== undefined) {
        this.sliderBanner.destroy(true, true);
      }
      this.parent.classList.add('catalog__slider--half-size');
      this.sliderBanner = new Swiper(this.parent, this.swiperSetting);
    } else {
      this.swiperSetting.slidesPerView = 2;
      this.swiperSetting.spaceBetween = 20;
      if (this.sliderBanner !== undefined) {
        this.sliderBanner.destroy(true, true);
      }
      this.parent.classList.remove('catalog__slider--half-size');
      this.sliderBanner = new Swiper(this.parent, this.swiperSetting);
    }
  }
}

export default BannerLocation;
