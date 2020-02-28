class FAQ {
  constructor(parent) {
    this.parent = parent;
    this.questionsItem = [].slice.call(this.parent.querySelectorAll('.dev-faq__item'));
    this.questions = [].slice.call(this.parent.querySelectorAll('.dev-faq__question'));

    this.questions.forEach((element) => {
      const el = element;
      el.addEventListener('click', () => {
        if (el.parentNode.classList.contains('dev-faq__item--open')) {
          el.parentNode.classList.remove('dev-faq__item--open');
        } else {
          for (let i = 0; i < this.questions.length; i += 1) {
            if (this.questionsItem[i].classList.contains('dev-faq__item--open')) {
              this.questionsItem[i].classList.remove('dev-faq__item--open');
            }
          }

          el.parentNode.classList.add('dev-faq__item--open');
        }
      });
    });
  }
}

export default FAQ;
