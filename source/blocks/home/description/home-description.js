class HomeDescription {
  constructor(parent) {
    this.moreBtn = parent.querySelector('.home-description__more-btn');
    this.fullContent = parent.querySelector('.home-description__content--full');

    this.initEvents();
  }

  initEvents() {
    if (this.moreBtn && this.fullContent) {
      this.moreBtn.addEventListener('click', this.toggleElems.bind(this));
    }
  }

  toggleElems() {
    if (this.fullContent.classList.contains('home-description__content--close')) {
      this.fullContent.style.height = `${this.fullContent.scrollHeight}px`;
    } else {
      this.fullContent.style.height = 0;
    }

    this.fullContent.classList.toggle('home-description__content--close');
    this.moreBtn.classList.toggle('home-description__more-btn--close');
  }
}

export default HomeDescription;
