class LocationEquipments {
  constructor(parent) {
    this.button = parent.querySelector('.location-equipments__button');
    this.counter = parent.querySelector('.location-equipments__counter');
    this.items = [].slice.call(parent.querySelectorAll('.location-equipments__item'));

    if (this.counter && this.button && (this.items.length > 0)) {
      this.setCounterValue();
      this.hideItems();
      this.initEvent();
    }
  }

  hideItems() {
    this.items.forEach((item, index) => {
      if (index >= 3) {
        item.classList.add('location-equipments__item--hidden');
      }
    });
    if (this.items.length <= 3) {
      this.button.classList.remove('location-equipments__button--show');
    }
  }

  showAllItems() {
    this.items.forEach((elem) => {
      elem.classList.remove('location-equipments__item--hidden');
    });
  }

  setCounterValue() {
    const count = this.items.length - 3;
    this.counter.innerHTML = count;
  }

  initEvent() {
    this.button.addEventListener('click', (event) => {
      event.preventDefault();
      this.showAllItems();
      this.button.classList.remove('location-equipments__button--show');
    });
  }
}

export default LocationEquipments;
