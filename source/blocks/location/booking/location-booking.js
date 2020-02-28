class LocationBookingCalendar {
  constructor(parent) {
    this.parent = parent;
    this.container = this.parent.querySelector('.location-booking__calendar-box');
    this.buttonBox = [].slice.call(this.parent.querySelectorAll('.location-booking__item'));
    this.formSelect = this.parent.querySelector('.form-select');
    this.dropdown = this.parent.querySelector('.location-booking__calendar-container');
    this.input = this.parent.querySelector('.location-booking__calendar-input');
    this.locationCalendar = window.$('.location-booking__calendar');
    this.months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    this.clickOut();
    this.curDate = new Date();

    this.locationCalendar.datepicker({
      showOtherMonths: true,
      minDate: this.curDate,
      dateSelected: this.curDate,
      range: false,
      multipleDates: false,
      toggleSelected: false,
      dateFormat: 'd.m.yyyy',
      onSelect: (date) => {
        const arr = date.split('.');
        this.input.value = `${arr[0]} ${this.months[arr[1] - 1]}`;
        let day = arr[0];
        if (day.length === 1) {
          day = `0${day}`;
        }
        let month = arr[1];
        if (month.length === 1) {
          month = `0${month}`;
        }
        this.input.setAttribute('data-date', `${day}.${month}.${arr[2]}`);
        this.closeCalendar();
      },
    });
    this.input.value = `${this.curDate.getDate()} ${this.months[this.curDate.getMonth()]}`;
    let day = this.curDate.getDate();
    if (day <= 9) {
      day = `0${day}`;
    }
    let month = (this.curDate.getMonth() + 1);
    if (month <= 9) {
      month = `0${month}`;
    }
    this.input.setAttribute('data-date', `${day}.${month}.${this.curDate.getFullYear()}`);

    this.input.addEventListener('click', () => {
      this.toggleDropdownState();
    });

    this.buttonBox.forEach((btn) => {
      btn.addEventListener('click', this.closeCalendar.bind(this));
    });
  }

  toggleDropdownState() {
    if (this.input.dataset.status === 'closed') {
      this.openCalendar();
    } else {
      this.closeCalendar();
    }
  }

  clickOut() {
    document.body.addEventListener('click', (event) => {
      if (this.formSelect.contains(event.target)) this.closeCalendar();
    });
  }

  openCalendar() {
    this.dropdown.classList.add('location-booking__calendar-container--showed');
    this.container.classList.add('location-booking__calendar-box--opened');
    this.input.setAttribute('data-status', 'opened');
  }

  closeCalendar() {
    this.dropdown.classList.remove('location-booking__calendar-container--showed');
    this.container.classList.remove('location-booking__calendar-box--opened');
    this.input.setAttribute('data-status', 'closed');
  }
}

export default LocationBookingCalendar;
