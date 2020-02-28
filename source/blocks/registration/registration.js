import * as EmailValidator from 'email-validator';
import CheckPassword from '../../base/scripts/CheckPassword';

export default class Registration {
  constructor(parent) {
    this.parent = parent;
    this.form = this.parent.querySelector('.registration__form');

    if (this.form) {
      this.fields = [].slice.call(this.form.querySelectorAll('.form-input'));
      this.agreement = this.form.querySelector('input[name="offert"]');
      this.passInputWrp = this.form.querySelector('.form-input--pass');
      this.passInputCheckWrp = this.form.querySelector('.form-input--pass-check');
      this.init();
    }
  }

  init() {
    if (this.passInputWrp) {
      this.passInput = this.passInputWrp.querySelector('input[data-pass="pass"]');
      this.passInputCheck = this.passInputCheckWrp.querySelector('input[data-pass="check"]');
      const passwordValidator = new CheckPassword(this.passInput, this.passInputCheck);
      if (this.passInput.getAttribute('data-pass') === 'pass') {
        this.passInput.addEventListener('input', () => {
          if (passwordValidator.validatePass()) {
            this.constructor.addOk(this.passInputWrp);
          } else {
            this.constructor.addFail(this.passInputWrp);
          }
        });
      }
      if (this.passInputCheck.getAttribute('data-pass') === 'check') {
        this.passInputCheck.addEventListener('input', () => {
          if (passwordValidator.checkPass()) {
            this.constructor.addOk(this.passInputCheckWrp);
          } else {
            this.constructor.addFail(this.passInputCheckWrp);
          }
        });
      }
    }

    this.fields.forEach((field) => {
      const input = field.querySelector('input');
      input.addEventListener('input', () => {
        if (field.classList.contains('form-input--email')) {
          if (EmailValidator.validate(input.value)) {
            this.constructor.addOk(field);
          } else {
            this.constructor.addFail(field);
          }
        }
        if (field.classList.contains('form-input--phone')) {
          if (input.value.length === 17) {
            this.constructor.addOk(field);
          } else {
            this.constructor.addFail(field);
          }
        }
        if (field.classList.contains('form-input--text')) {
          if (input.value.length !== 0) {
            this.constructor.addOk(field);
          } else {
            this.constructor.addFail(field);
          }
        }
      });
    });

    this.form.addEventListener('submit', (e) => {
      this.validate(e);
    });
  }

  static addOk(field) {
    field.classList.add('form-input--check-ok');
    field.classList.remove('form-input--check-fail');
  }

  static addFail(field) {
    field.classList.remove('form-input--check-ok');
    field.classList.add('form-input--check-fail');
  }

  validate(e) {
    let errors = false;
    errors = this.fields.some(field => !field.classList.contains('form-input--check-ok'));
    if (!this.agreement.checked) {
      errors = true;
      this.agreement.parentElement.classList.add('form-checkbox--fail');
    } else {
      this.agreement.parentElement.classList.remove('form-checkbox--fail');
    }
    if (errors) {
      e.preventDefault();
      this.fields.forEach((field) => {
        if (!field.classList.contains('form-input--check-ok')) {
          this.constructor.addFail(field);
        }
      });
    }
  }
}
