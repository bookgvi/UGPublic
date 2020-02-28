import axios from 'axios';
import LocationDropdown from '../dropdown/location-dropdown';

class LocationDropdownHistogram {
  constructor(parent) {
    this.data = {
      items: [],
      first: 0,
      last: 24,
      min: 0,
      max: 24,
    };
    for (let i = 0; i < 24; i += 1) {
      this.data.items.push({ value: i });
    }

    this.hall = null;
    this.date = null;
    this.applied = false;
    this.loaded = false;
    this.hallSelect = parent.querySelector('#bookingSelect');
    this.dateInput = parent.querySelector('.location-booking__calendar-input');
    this.dropdownDateWrp = parent.querySelector('.location-dropdown--date');

    if (this.dropdownDateWrp) {
      this.init();
    }
  }

  init() {
    this.historgram = window.$('#histogramRange');
    this.inputFrom = this.dropdownDateWrp.querySelector('.location-dropdown__input--from input');
    this.inputTo = this.dropdownDateWrp.querySelector('.location-dropdown__input--to input');
    this.interval = this.dropdownDateWrp.querySelector('.location-dropdown__heading span');
    this.dropdownDate = new LocationDropdown(this.dropdownDateWrp, true);
    this.dropdownRangeTime = this.dropdownDate.title.querySelector('.location-dropdown__value');
    this.dropdownTime = this.dropdownDate.title.querySelector('.location-dropdown__value-sec');

    this.historgram.histogramSlider({
      data: this.data,
      sliderRange: [this.data.min, this.data.max],
      selectedRange: [this.data.first, this.data.last],
      numberOfBins: 24,
      showTooltips: false,
      showSelectedRange: false,
      height: 17,
    });
    this.tooltips = [].slice.call(this.dropdownDateWrp.querySelectorAll('.tooltip'));

    this.dropdownDate.title.addEventListener('click', (e) => {
      e.preventDefault();

      if (this.dropdownDate.title.dataset.status === 'closed') {
        if ((this.hallSelect.value !== this.hall) ||
          (this.date !== this.dateInput.dataset.date)) {
          this.update(true);
        } else {
          this.dropdownDate.openDropdown();
        }
      } else {
        this.dropdownDate.closeDropdown();
      }
    });

    this.dropdownDate.applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if ((this.data.first >= this.data.min) && (this.data.last <= this.data.max)) {
        this.dropdownDate.closeDropdown();
        this.applied = true;
      }
    });

    if (this.inputFrom) {
      this.inputFromParent = this.inputFrom.parentElement.parentElement;
      this.inputFrom.addEventListener('change', () => {
        this.data.first = +this.inputFrom.value.substring(0, 2);
        this.countInterval();
        this.updateHistogram();
        this.checkInputs();
      });
    }

    if (this.inputTo) {
      this.inputToParent = this.inputTo.parentElement.parentElement;
      this.inputTo.addEventListener('change', () => {
        this.data.last = +this.inputTo.value.substring(0, 2);
        this.countInterval();
        this.updateHistogram();
        this.checkInputs();
      });
    }

    window.$('#histogramRange').on('update', (evt, params) => {
      // eslint-disable-next-line prefer-destructuring
      this.data.first = params[0];
      // eslint-disable-next-line prefer-destructuring
      this.data.last = params[1];
      this.countInterval();
      this.updateInputs();
    });

    window.addEventListener('closeDrop', (e) => {
      const { detail } = e;
      if (this.loaded) {
        if (!detail || ((detail && detail.out) && !this.applied)) {
          this.data.first = this.data.min;
          this.data.last = this.data.max;
          this.applied = false;
          this.updateInputs();
          this.updateHistogram();
          this.countInterval();
        }
      }
    });
  }

  updateInputs() {
    const first = this.data.first <= 9 ? `0${this.data.first}` : this.data.first;
    const last = this.data.last <= 9 ? `0${this.data.last}` : this.data.last;
    this.inputFrom.value = `${first}:00`;
    this.inputTo.value = `${last}:00`;
    this.checkInputs();
  }

  checkInputs() {
    if (this.data.first < this.data.min) {
      this.inputFromParent.classList.add('form-input--check-fail');
    } else {
      this.inputFromParent.classList.remove('form-input--check-fail');
    }

    if (this.data.last > this.data.max) {
      this.inputToParent.classList.add('form-input--check-fail');
    } else {
      this.inputToParent.classList.remove('form-input--check-fail');
    }

    if ((this.data.first < this.data.min) || (this.data.last > this.data.max)) {
      this.dropdownDate.applyBtn.classList.add('location-dropdown__apply--disabled');
    } else {
      this.dropdownDate.applyBtn.classList.remove('location-dropdown__apply--disabled');
    }
  }

  update(isClicked = false) {
    let api = '/api/front/v1.0/rooms/vacant-hours';
    // eslint-disable-next-line no-undef
    if (IS_DEV) {
      api = '/api/vacantHours.json';
    }
    if (this.hallSelect) {
      this.hall = this.hallSelect.value;
      api += `?room=${this.hallSelect.value}`;
    }
    if (this.dateInput) {
      this.date = this.dateInput.dataset.date;
      api += `&date=${this.dateInput.dataset.date}`;
    }
    axios.get(api).then((response) => {
      this.loaded = true;
      if (response.status === 200) {
        const { data } = response;
        this.data.items = data.data.vacantHours;
        let first = 0;
        let last = 24;

        if (this.data.items.length !== 0) {
          [first] = this.data.items;
          last = this.data.items[this.data.items.length - 1];

          this.data.min = first;
          this.data.max = last;
          this.data.first = first;
          this.data.last = last;
          this.countInterval();
          this.updateInputs();
          this.updateHistogram();

          if (isClicked) {
            this.dropdownDate.openDropdown();
          }
        }
      }
    });
  }

  countInterval() {
    let time = this.data.last - this.data.first;
    if (this.data.first === 0) {
      time = this.data.last;
    }
    const decl = this.constructor.declOfNum(time, ['час', 'часа', 'часов']);
    this.interval.innerHTML = `${time} ${decl}`;

    this.dropdownRangeTime.innerHTML = `${time} ${decl},`;
    const first = this.data.first <= 9 ? `0${this.data.first}` : this.data.first;
    const last = this.data.last <= 9 ? `0${this.data.last}` : this.data.last;
    this.dropdownTime.innerHTML = `${first}:00 - ${last}:00`;
  }

  updateHistogram() {
    this.historgram[0].setValue([this.data.first, this.data.last]);

    if (this.tooltips.length > 0) {
      this.tooltips.forEach((el, index) => {
        if (index >= this.data.min && index <= this.data.max - 1) {
          el.classList.remove('tooltip--disabled');
        } else {
          el.classList.add('tooltip--disabled');
        }
      });
    }
  }

  static declOfNum(number, titles) {
    const num = Math.abs(number) % 100;
    const n1 = num % 10;
    if (num > 10 && num < 20) {
      return titles[2];
    }
    if (n1 > 1 && n1 < 5) {
      return titles[1];
    }
    if (n1 === 1) {
      return titles[0];
    }
    return titles[2];
  }
}


export default LocationDropdownHistogram;
