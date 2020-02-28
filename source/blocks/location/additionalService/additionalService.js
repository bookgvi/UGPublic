class AdditionalService {
  constructor(parent) {
    this.openContent = [].slice.call(parent.querySelectorAll('.location-additionalService__header'));
    this.dropdown = [].slice.call(parent.querySelectorAll('.location-additionalService__content'));
    this.clickDisabled = [].slice.call(parent.querySelectorAll('.location-additionalService__number-box'));
    this.openDropdown();
    this.initEvent();
  }

  openDropdown() {
    this.openContent.forEach((row, index) => {
      row.addEventListener('click', () => {
        this.closeAllContent(row);
        if (!row.classList.contains('location-additionalService__header--opened')) {
          this.dropdown[index].style.height = `${this.dropdown[index].scrollHeight}px`;
          row.classList.add('location-additionalService__header--opened');
        } else {
          this.dropdown[index].style.height = 0;
          row.classList.remove('location-additionalService__header--opened');
        }
      });
    });
  }

  closeAllContent(row) {
    this.openContent.forEach((btn, index) => {
      if (btn !== row) {
        btn.classList.remove('location-additionalService__header--opened');
        this.dropdown[index].style.height = 0;
      }
    });
  }

  initEvent() {
    window.addEventListener('resize', this.closeAllContent.bind(this));
    this.clickDisabled.forEach(item => item.addEventListener('click', (evt) => {
      evt.stopPropagation();
    }));
  }
}

export default AdditionalService;
