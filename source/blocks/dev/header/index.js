class Header {
  constructor(parent) {
    this.parent = parent;
    const openLocation = this.parent.querySelector('.dev-header__header');
    const closeNotification = this.parent.querySelector('.dev-header__close');
    const listLocation = this.parent.querySelector('.dev-header__wrapper-list');
    this.profile = this.parent.querySelector('.dev-header__profile');
    this.profileMenu = this.parent.querySelector('.dev-header__profile-menu');
    this.serch = this.parent.querySelector('.dev-header__search');
    this.fillter = this.parent.querySelector('.dev-header__search-fillters');
    this.arrow = this.profile.querySelector('.dev-header__profile-arrow');
    this.input = this.parent.querySelector('.dev-header__field');
    this.cancel = this.parent.querySelector('.dev-header__search-cancel');

    setTimeout(() => {
      this.paddingContent();
    }, 1000);

    closeNotification.addEventListener('click', () => {
      if (this.parent.classList.contains('dev-header--notification')) {
        this.parent.classList.remove('dev-header--notification');

        if (!this.parent.classList.contains('dev-header--notification')) {
          this.paddingContent();
        }
      }
    });

    window.addEventListener('resize', () => {
      this.paddingContent();
    });

    this.profile.addEventListener('click', () => {
      if (!this.profileMenu.classList.contains('dev-header__profile-menu--open')) {
        this.profileMenu.classList.add('dev-header__profile-menu--open');
        this.arrow.classList.add('dev-header__profile-arrow--close');
      } else {
        this.profileMenu.classList.remove('dev-header__profile-menu--open');
        this.arrow.classList.remove('dev-header__profile-arrow--close');
      }
    });

    this.input.addEventListener('focus', () => {
      if (window.innerWidth < 768) {
        if (!this.serch.classList.contains('dev-header__search--focus')) {
          this.serch.classList.add('dev-header__search--focus');
        }
      }
    });

    this.serch.addEventListener('click', () => {
      if (!this.fillter.classList.contains('dev-header__search-fillters--open')) {
        this.fillter.classList.add('dev-header__search-fillters--open');
        document.dispatchEvent(new window.CustomEvent('logicData', {
          detail: {
            type: 'toggleOverlay',
            isShow: true,
          },
        }));
      }
    });

    openLocation.addEventListener('click', () => {
      if (!listLocation.classList.contains('dev-header__wrapper-list--open')) {
        listLocation.classList.add('dev-header__wrapper-list--open');
        listLocation.style.maxHeight = `${listLocation.scrollHeight}px`;
      } else {
        listLocation.classList.remove('dev-header__wrapper-list--open');
        listLocation.style.maxHeight = null;
      }

      const arrow = listLocation.querySelector('.dev-header__arrow');

      if (arrow.classList.contains('dev-header__arrow--close')) {
        arrow.classList.remove('dev-header__arrow--close');
      } else {
        arrow.classList.add('dev-header__arrow--close');
      }
    });

    this.cancel.addEventListener('click', () => {
      if (this.serch.classList.contains('dev-header__search--focus')) {
        this.serch.classList.remove('dev-header__search--focus');
      }
    });

    document.addEventListener('click', (e) => {
      const { target } = e;

      this.resetSearch(target);

      if (!this.profile.contains(target)) {
        this.profileMenu.classList.remove('dev-header__profile-menu--open');

        if (this.arrow.classList.contains('dev-header__profile-arrow--close')) {
          this.arrow.classList.remove('dev-header__profile-arrow--close');
        }
      }
    });
  }

  resetSearch(e) {
    if (!this.serch.contains(e) || e === this.cancel) {
      if (this.fillter.classList.contains('dev-header__search-fillters--open')) {
        this.fillter.classList.remove('dev-header__search-fillters--open');
        document.dispatchEvent(new window.CustomEvent('logicData', {
          detail: {
            type: 'toggleOverlay',
            isShow: false,
          },
        }));
      }

      if (this.serch.classList.contains('dev-header__search--focus')) {
        this.serch.classList.remove('dev-header__search--focus');
      }
    }
  }

  paddingContent() {
    const content = this.parent.nextElementSibling;
    content.style.paddingTop = `${this.parent.offsetHeight}px`;
  }
}

export default Header;
