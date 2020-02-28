import TweenLite from 'gsap';

require('gsap/ScrollToPlugin');

class Anchors {
  constructor(item) {
    const html = document.getElementsByTagName('html')[0];
    const block = document.querySelector(item.getAttribute('href'));
    const header = document.querySelector('header');
    const blockPos = block.offsetTop - header.offsetHeight;
    TweenLite.to([document.body, html], 1, { scrollTop: blockPos });
  }
}

export default Anchors;
