export default class CheckPassword {
  constructor(fieldPass, fieldCheck) {
    this.passInput = fieldPass;
    this.passInputCheck = fieldCheck;

    this.test = {
      upperCaseLetters: /[A-Z]/g,
      digits: /[0-9]/g,
    };
  }

  validatePass() {
    if (this.passInput.value === '') {
      this.passInputCheck.value = '';
      this.valid = false;
    } else {
      this.valid = this.passInput.value.length >= 6
        && this.passInput.value.match(this.test.upperCaseLetters)
        && this.passInput.value.match(this.test.digits);
    }
    return this.valid;
  }

  checkPass() {
    const check = this.passInputCheck.value.match(this.passInput.value);
    return check && check.length !== 0;
  }
}
