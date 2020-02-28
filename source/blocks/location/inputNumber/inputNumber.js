class LocationInputNumber {
  constructor(parent) {
    this.input = parent.querySelector('.location-inputNumber__input');
    this.min = this.input.getAttribute('min');
    this.max = this.input.getAttribute('max');
    this.decrement = parent.querySelector('button[data-operation="decrement"]');
    this.increment = parent.querySelector('button[data-operation="increment"]');
    this.inputVal();
    this.initEvents();
  }

  inputVal() {
    this.input.addEventListener('input', () => {
      const changedValue = Number(this.input.value);
      if (!Number(changedValue)) {
        this.input.value = this.min;
      } else {
        this.input.value = changedValue;
      }
      this.input.value = changedValue;
    });
  }

  operationIncrement() {
    let value = Number(this.input.value);
    if (value >= this.max) {
      this.input.value = this.max;
    } else {
      value += 1;
      this.input.value = value;
    }
  }

  operationDecrement() {
    let value = Number(this.input.value);
    if (value <= this.min) {
      this.input.value = this.min;
    } else {
      value -= 1;
      this.input.value = value;
    }
  }

  initEvents() {
    this.increment.addEventListener('click', this.operationIncrement.bind(this));
    this.decrement.addEventListener('click', this.operationDecrement.bind(this));
  }
}

export default LocationInputNumber;
