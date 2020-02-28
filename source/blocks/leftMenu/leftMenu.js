import PerfectScrollbar from 'perfect-scrollbar';
import Anchors from '../core/scroll/anhors';

class LeftMenu {
  constructor(parent) {
    this.container = parent.querySelector('.leftMenu');
    this.openField = parent.querySelector('.leftMenu__select-title');
    this.dropdownContainer = parent.querySelector('.leftMenu__dropdown-box');
    this.dropdown = parent.querySelector('.leftMenu__dropdown');
    this.links = [].slice.call(parent.querySelectorAll('.js-smooth-scroll'));
    this.bodyEl = document.body;
    this.initEvents();
    const ps = new PerfectScrollbar(this.dropdownContainer);

    window.addEventListener('resize', () => {
      ps.update();
    });
  }

  toggle() {
    this.container.classList.toggle('leftMenu--opened');
    this.dropdown.classList.toggle('leftMenu__dropdown--opened');
    if (window.innerWidth < 1024) {
      this.bodyEl.style.overflow = (this.bodyEl.style.overflow === 'hidden') ? null : 'hidden';
      this.bodyEl.style.position = (this.bodyEl.style.position === 'fixed') ? null : 'fixed';
    }
  }

  removeClass() {
    this.links.forEach((item) => {
      item.classList.remove('leftMenu__link-active');
    });
  }

  initEvents() {
    if (this.openField) {
      this.openField.addEventListener('click', this.toggle.bind(this));
    }
    this.links.forEach((link) => {
      link.addEventListener('click', this.toggle.bind(this));
      link.addEventListener('click', (event) => {
        event.preventDefault();
        new Anchors(link);
        this.removeClass();
        link.classList.add('leftMenu__link-active');
      });
    });
  }
}

export default LeftMenu;
