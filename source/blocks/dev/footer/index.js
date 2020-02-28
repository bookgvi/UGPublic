class Footer {
  constructor(parent) {
    this.parent = parent;
    const footerLinks = this.parent.querySelector('.dev-footer__links');
    const toggleMenu = this.parent.querySelector('.dev-footer__more-links');
    const showLinks = this.parent.querySelector('.dev-footer__list-preview');
    const numberLinks = toggleMenu.querySelector('.dev-footer__quantity');
    const numberLinksQuantity = numberLinks.innerHTML;

    toggleMenu.addEventListener('click', () => {
      const arrow = toggleMenu.querySelector('.dev-footer__arrow');

      if (!footerLinks.classList.contains('dev-footer__links--open')) {
        footerLinks.classList.add('dev-footer__links--open');
        footerLinks.style.maxHeight = `${footerLinks.scrollHeight}px`;
        arrow.classList.add('dev-footer__arrow--close');
        showLinks.classList.add('dev-footer__list-preview--hide');
        numberLinks.innerHTML = 'Скрыть';
        setTimeout(() => {
          const positionScroll = Number(`${document.documentElement.scrollHeight}`);
          window.$('html, body').animate({ scrollTop: positionScroll }, 300);
        }, 200);
      } else {
        footerLinks.style.maxHeight = `${footerLinks.scrollHeight}px`;
        setTimeout(() => {
          footerLinks.style.maxHeight = null;
          footerLinks.classList.remove('dev-footer__links--open');
          arrow.classList.remove('dev-footer__arrow--close');
          showLinks.classList.remove('dev-footer__list-preview--hide');
          numberLinks.innerHTML = numberLinksQuantity;
        }, 200);
      }
    });
  }
}

export default Footer;
