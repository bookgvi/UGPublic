import Swiper from 'swiper/dist/js/swiper';
import Rating from 'rating';

class Location {
  constructor(parent) {
    this.parent = parent;
    this.starContainer = this.parent.querySelector('.location__rating-stars');
    this.like = this.parent.querySelector('.location__like');
    this.star = undefined;

    this.like.addEventListener('click', () => {
      this.like.classList.toggle('location__like--active');
    });

    this.slider = [].slice.call(this.parent.querySelectorAll('.location__slider')).forEach((element) => {
      new Swiper(element, {
        slidesPerView: 1,
        pagination: {
          el: '.location__slider-pagination',
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.location__slider-btn--next',
          prevEl: '.location__slider-btn--prev',
        },
      });
    });

    new Rating([1, 2, 3, 4, 5], {
      container: this.starContainer,
      star: this.star,
    });
  }
}

export default Location;
