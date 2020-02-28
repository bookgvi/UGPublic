import Swiper from 'swiper/dist/js/swiper';

class HomeBanner {
  constructor(parent) {
    this.parent = parent;
    this.bannerSlider = parent.querySelector('.home-banner__slider');
    this.motionBtn = parent.querySelector('.home-banner__btn-compilation');
    this.contentSection = parent.querySelector('.home-banner__content-section');
    this.btnSliderPrev = parent.querySelector('.home-banner__button--prev');
    this.header = document.querySelector('header');
    this.body = document.querySelector('body');
    this.headerSearch = this.header.querySelector('.dev-header__search');
    this.firstSlide = true;

    if (this.bannerSlider) {
      this.sliderInit();
    }

    if (this.motionBtn) {
      this.motionBtn.addEventListener('click', this.motionEvent.bind(this));
    }

    if (this.btnSliderPrev) {
      this.btnSliderPrev.addEventListener('click', () => {
        if (this.firstSlide) {
          this.motionEvent();
        }
      });
    }

    if (this.headerSearch) {
      this.searchDisplay();
    }
  }

  searchDisplay() {
    let displayType = 'hidden';
    let displayTypeCurrent = 'hidden';

    this.toggleSearchDisplay(displayType);

    document.addEventListener('scroll', () => {
      if (window.pageYOffset > this.header.offsetHeight) {
        displayTypeCurrent = 'display';
      } else {
        displayTypeCurrent = 'hidden';
      }

      if (displayType !== displayTypeCurrent) {
        displayType = displayTypeCurrent;
        this.toggleSearchDisplay(displayType);
      }
    });
  }

  toggleSearchDisplay(displayType) {
    if ((displayType === 'hidden')) {
      this.headerSearch.classList.add('dev-header__search--hidden');
    } else {
      this.headerSearch.classList.remove('dev-header__search--hidden');
    }
  }

  sliderInit() {
    const rootLink = 'home-banner';

    this.slider = new Swiper(this.bannerSlider, {
      wrapperClass: `${rootLink}__wrapper`,
      containerModifierClass: `${rootLink}__slider--`,
      slideClass: `${rootLink}__slide`,
      slideActiveClass: `${rootLink}__slide--active`,
      slideDuplicateClass: `${rootLink}__slide--duplicate`,
      slidePrevClass: `${rootLink}__slide--preview`,
      slideNextClass: `${rootLink}__slide--next`,
      slideDuplicateActiveClass: `${rootLink}__slide--duplicate-active`,
      slideDuplicatePrevClass: `${rootLink}__slide--duplicate-prev`,
      touchRatio: 0,
      slidesPerView: 1,
      navigation: {
        disabledClass: `${rootLink}__button--disabled`,
        prevEl: this.parent.querySelector(`.${rootLink}__button--prev`),
        nextEl: this.parent.querySelector(`.${rootLink}__button--next`),
      },
      pagination: {
        el: `.${rootLink}__pagination`,
        type: 'fraction',
        renderFraction: ((currentClass, totalClass) => {
          const elem = `<span class='${currentClass}'></span>` +
            ' из ' +
            `<span class='${totalClass}'></span>`
            + ' подборок ';
          return elem;
        }),
        modifierClass: `${rootLink}__pagination--`,
        currentClass: `${rootLink}__pagination--current`,
        totalClass: `${rootLink}__pagination--total`,
      },
      a11y: {
        enabled: false,
      },
      on: {
        slideChangeTransitionEnd: () => {
          if (this.slider.activeIndex === 0) {
            this.firstSlide = true;
          } else {
            this.firstSlide = false;
          }
        },
      },
    });
  }

  motionEvent() {
    if (this.contentSection) {
      this.contentSection.classList.toggle('home-banner__content-section--motion');
    }
  }
}

export default HomeBanner;
