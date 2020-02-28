class LocationDropdownText {
  constructor(parent) {
    this.wrapper = parent.querySelector('.location-dropdownText__wrapper');
    this.button = parent.querySelector('.location-dropdownText__button');
    this.hiddenText = parent.querySelector('.location-dropdownText__hidden');

    if (this.wrapper && this.button && this.hiddenText) {
      this.initEvents();
    }
  }

  toggleText() {
    this.toggleWrapperStatus();
    this.hiddenText.classList.toggle('location-dropdownText__hidden--showed');
    this.button.classList.toggle('location-dropdownText__button--opened');
  }

  toggleWrapperStatus() {
    if (this.wrapper.dataset.status === 'hidden') {
      this.wrapper.dataset.status = 'showed';
    } else {
      this.wrapper.dataset.status = 'hidden';
    }
  }

  initEvents() {
    if (this.button) {
      this.button.addEventListener('click', this.toggleText.bind(this));
    }
  }
}

export default LocationDropdownText;
