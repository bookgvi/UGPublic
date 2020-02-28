import PerfectScrollbar from 'perfect-scrollbar';

class CheckoutSelectInput {
  constructor(parent) {
    this.parent = parent;
    this.itemList = this.parent.querySelector('.checkout-selectInput__wrapper');
    this.input = this.parent.querySelector('.checkout-selectInput__input');
    this.items = [].slice.call(this.parent.querySelectorAll('.checkout-selectInput__item'));
    new PerfectScrollbar(this.itemList);
    this.events();
  }

  events() {
    this.clickOut();
    this.input.addEventListener('click', this.openDropdown.bind(this));

    this.input.addEventListener('change', () => {
      // При ручном вводе в инпут добавить класс
      // к i-ому элементу выпадающего списка
      if (this.input.value > 20) {
        this.input.value = 20;
        this.removeItemClass();
        this.items[19].classList.add('checkout-selectInput__item--active');
      } else if (this.input.value === '' || this.input.value < 1) {
        this.input.value = 1;
        this.removeItemClass();
        this.items[Number(this.input.value - 1)].classList.add('checkout-selectInput__item--active');
      } else {
        this.input.value = this.input.value;
        this.removeItemClass();
        this.items[Number(this.input.value - 1)].classList.add('checkout-selectInput__item--active');
      }
      this.closeDropdown();
    });

    this.items.forEach((item) => {
      item.addEventListener('click', () => {
        this.removeItemClass();
        this.input.value = item.dataset.value;
        this.input.dispatchEvent(new window.Event('change'));
        item.classList.add('checkout-selectInput__item--active');
        this.closeDropdown();
      });
    });
  }

  removeItemClass() {
    this.items.forEach((elem) => {
      elem.classList.remove('checkout-selectInput__item--active');
    });
  }

  openDropdown() {
    this.parent.classList.add('checkout-selectInput--opened');
  }

  closeDropdown() {
    this.parent.classList.remove('checkout-selectInput--opened');
  }

  clickOut() {
    document.body.addEventListener('click', (evt) => {
      if (!this.parent.contains(evt.target)) {
        this.closeDropdown();
      }
    });
  }
}

export default CheckoutSelectInput;
