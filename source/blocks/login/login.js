import * as EmailValidator from 'email-validator';

export default class Login {
  constructor(parent) {
    this.parent = parent;
    this.form = this.parent.querySelector('.login__form');

    if (this.form) {
      this.emailField = this.form.querySelector('.form-input--email');
      this.passInput = {
        el: this.form.querySelector('.form-input--pass input'),
        parent: this.form.querySelector('.form-input--pass'),
      };
      this.init();
    }
  }

  init() {
    const input = this.emailField.querySelector('input');
    input.addEventListener('input', () => {
      if (this.emailField.classList.contains('form-input--email')) {
        if (EmailValidator.validate(input.value)) {
          this.emailField.classList.add('form-input--check-ok');
          this.emailField.classList.remove('form-input--check-fail');
        } else {
          this.emailField.classList.remove('form-input--check-ok');
          this.emailField.classList.add('form-input--check-fail');
        }
      }
    });
    if (this.passInput && this.passInput.el) {
      this.passInput.el.addEventListener('input', () => {
        if (this.passInput.el.value.length !== 0) {
          this.passInput.parent.classList.remove('form-input--check-fail');
        }
      });
    }

    this.form.addEventListener('submit', (e) => {
      this.validate(e);
    });
  }

  validate(e) {
    let errors = 0;
    if (!this.emailField.classList.contains('form-input--check-ok')) {
      this.emailField.classList.add('form-input--check-fail');
      errors += 1;
    }
    if (this.passInput.el.value.length === 0) {
      errors += 1;
      this.passInput.parent.classList.add('form-input--check-fail');
    } else {
      this.passInput.parent.classList.remove('form-input--check-fail');
    }
    if (errors > 0) {
      e.preventDefault();
    }
  }
}
