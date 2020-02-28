class FiltersCheckbox {
  constructor(parent) {
    this.parent = parent;

    this.parent.addEventListener('click', () => {
      this.parent.querySelector('.filters-checkbox__switch').classList.toggle('filters-checkbox__switch--active');
      FiltersCheckbox.visibilityMap();
    });
    this.fLoad = false;
    window.addEventListener('contentLoad', () => {
      if (!this.fLoad) {
        this.fLoad = true;
        if (window.innerWidth >= 768) {
          this.parent.querySelector('.filters-checkbox__switch').classList.toggle('filters-checkbox__switch--active');
          FiltersCheckbox.visibilityMap();
        }
      }
    });
  }

  static visibilityMap() {
    const map = [].slice.call(document.querySelectorAll('.map'));
    const catalog = [].slice.call(document.querySelectorAll('.catalog__wrapper'));

    catalog.forEach((element) => {
      if (window.innerWidth >= 768) {
        const transition = parseFloat(window.$(element).css('transitionDuration')) * 1000;
        if (!element.classList.contains('catalog__wrapper--move-over')) {
          element.classList.add('catalog__wrapper--move-over');
        } else {
          element.classList.remove('catalog__wrapper--move-over');
        }
        setTimeout(() => {
          const resizeEvent = window.document.createEvent('UIEvents');
          resizeEvent.initUIEvent('resize', true, false, window, 0);
          window.dispatchEvent(resizeEvent);
        }, transition);
      }
    });

    map.forEach((element) => {
      if (!element.classList.contains('map--visible')) {
        element.classList.add('map--visible');
      } else {
        element.classList.remove('map--visible');
      }
    });
  }
}

export default FiltersCheckbox;
