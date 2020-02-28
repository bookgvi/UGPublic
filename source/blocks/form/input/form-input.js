import IMask from 'imask';

class FormInput {
  constructor(parent, type) {
    const maskOptions = {
      mask: '+{7}(000) 000-00-00',
    };
    this.timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ig;

    if (parent) {
      if (type === 'tel') {
        window.phoneMask = new IMask(parent, maskOptions);
      }

      if (type === 'date') {
        new IMask(parent, {
          alias: 'datetime',
          mask: '00:00',
          regex: this.timePattern,
          numericInput: true,
        });
      }
    }
  }
}

export default FormInput;
