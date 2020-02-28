class LocationDropdown {
  constructor(parent, noInit = false) {
    this.parent = parent;
    this.title = this.parent.querySelector('.location-dropdown__title');
    this.dropdown = this.parent.querySelector('.location-dropdown__content');
    this.cancelBtn = this.parent.querySelector('.location-dropdown__cancel');
    this.applyBtn = this.parent.querySelector('.location-dropdown__apply');
    this.noInit = noInit;

    if (this.title && this.dropdown && this.cancelBtn && this.applyBtn) {
      if (this.noInit) {
        this.initEvents(this.noInit);
        this.clickOut();
      } else {
        this.initEvents();
        this.clickOut();
      }
    }
  }

  openDropdown() {
    this.title.classList.add('location-dropdown__title--open');
    this.title.setAttribute('data-status', 'opened');
    this.dropdown.classList.add('location-dropdown__content--open');
  }

  closeDropdown() {
    this.title.classList.remove('location-dropdown__title--open');
    this.title.setAttribute('data-status', 'closed');
    this.dropdown.classList.remove('location-dropdown__content--open');
  }

  clickOut() {
    document.body.addEventListener('click', (evt) => {
      this.targetElement = evt.target;
      if (!this.parent.contains(this.targetElement)) {
        this.closeDropdown();
        if (this.noInit) {
          window.dispatchEvent(new window.CustomEvent('closeDrop', {
            detail: {
              out: true,
            },
          }));
        }
      }
    });
  }

  initEvents(noInit = false) {
    if (!noInit) {
      this.title.addEventListener('click', () => {
        if (this.title.dataset.status === 'closed') {
          this.openDropdown();
        } else {
          this.closeDropdown();
        }
      });
      this.applyBtn.addEventListener('click', this.closeDropdown.bind(this));
    }

    this.cancelBtn.addEventListener('click', () => {
      this.closeDropdown();
      if (this.noInit) {
        window.dispatchEvent(new window.CustomEvent('closeDrop'));
      }
    });
  }
}

export default LocationDropdown;
