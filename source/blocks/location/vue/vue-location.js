import Swiper from 'swiper/dist/js/swiper';
import LocationTemplate from './vue-location.pug';

export default {
  props: ['objectdata'],
  template: LocationTemplate(),
  data() {
    return {
      info: null,
    };
  },
  methods: {
    declOfNum(number, titles) {
      const cases = [2, 0, 1, 1, 1, 2];
      return [number, titles[((number % 100) > 4 && (number % 100) < 20) ?
        2 : cases[((number % 10) < 5) ? (number % 10) : 5]]].join(' ');
    },
  },
  computed: {
    ratingCount() {
      return (this.$props.objectdata.rating * 10) / 2;
    },
  },
  mounted() {
    this.info = Object.assign({}, this.$props.objectdata);
    const thisEl = window.$(this.$el);
    const starContainer = thisEl.find('.location__rating-stars');
    const like = this.$el.querySelector('.location__like');
    const rating = this.info.rating * 10;

    like.addEventListener('click', () => {
      like.classList.toggle('location__like--active');
    });

    new Swiper(this.$el.querySelector('.location__slider'), {
      slidesPerView: 1,
      preloadImages: false,
      lazy: true,
      pagination: {
        el: this.$el.querySelector('.location__slider-pagination'),
        dynamicBullets: true,
      },
      navigation: {
        nextEl: this.$el.querySelector('.location__slider-btn--next'),
        prevEl: this.$el.querySelector('.location__slider-btn--prev'),
      },
    });

    starContainer.rateYo({
      rating,
      numStars: 5,
      maxValue: 10,
      halfStar: true,
      normalFill: '#e5eef0',
      ratedFill: '#81aeb6',
      starWidth: '12px',
      spacing: '5px',
      readOnly: true,
    });
  },
};
