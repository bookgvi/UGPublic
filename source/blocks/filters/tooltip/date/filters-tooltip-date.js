import BaseTooltip from '../baseTooltip';
import LocationInputNumber from '../../../location/inputNumber/inputNumber';

class FiltersTooltipDate extends BaseTooltip {
  static formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = `0${dd}`;
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = `0${mm}`;
    const yy = date.getFullYear();
    return `${yy}-${mm}-${dd}`;
  }
  constructor(parent) {
    super(parent);
    this.parent = parent;
    const select = this.parent.querySelector('.filters-tooltip-date__header');
    const rangeTime = window.$(this.parent).find('.filters-tooltip-date__range');
    this.calendar = window.$(this.parent).find('.filters-tooltip-date__calendar');
    const time = window.$(parent).find('.filters-tooltip-date__time .form-input__input');
    this.locationInputNumber = this.parent.querySelector('.location-inputNumber');
    let inputMin;
    let inputMax;
    time.mask('00:00');

    new LocationInputNumber(this.locationInputNumber);

    select.addEventListener('click', () => {
      if (select.parentNode.classList.contains('filters-tooltip-date__select--open')) {
        window.$(select.parentNode).find('input').attr('data-not-filter', '');
        select.parentNode.classList.remove('filters-tooltip-date__select--open');
      } else {
        window.$(select.parentNode).find('input').removeAttr('data-not-filter');
        select.parentNode.classList.add('filters-tooltip-date__select--open');
      }
    });

    rangeTime.ionRangeSlider({
      type: 'double',
      min: 1,
      max: 24,
      from: 8,
      to: 20,
      hide_min_max: true,
      hide_from_to: true,

      onChange: (data) => {
        if (data.from < 10) {
          inputMin.value = `0${data.from}:00`;
        } else {
          inputMin.value = `${data.from}:00`;
        }
        if (data.to < 10) {
          inputMax.value = `0${data.to}:00`;
        } else {
          inputMax.value = `${data.to}:00`;
        }
      },
    });

    const rangeTimeData = rangeTime.data('ionRangeSlider');
    inputMin = this.parent.querySelector('.filters-tooltip-date__time--min .form-input__input');
    inputMax = this.parent.querySelector('.filters-tooltip-date__time--max .form-input__input');

    inputMin.value = `0${rangeTimeData.result.from}:00`;
    inputMax.value = `${rangeTimeData.result.to}:00`;

    this.calendarInput = this.parent.querySelector(`#${this.calendar[0].dataset.rel}`);
    this.calendar.datepicker({
      showOtherMonths: false,
      minDate: new Date(),
      onSelect: (dateText, inst) => {
        this.calendarInput.value = FiltersTooltipDate.formatDate(inst);
      },
    });
    this.calendarInput.value = FiltersTooltipDate.formatDate(new Date());
    super.setData();

    const btn = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-date__btn'));
    btn.forEach((elem) => {
      elem.addEventListener('click', () => {
        const opened = document.querySelector('.filters-item.filters-item--open');
        if (elem.classList.contains('form-button--cancel')) {
          super.clearData();
          document.dispatchEvent(new window.CustomEvent('logicData', {
            detail: {
              type: 'toggleOverlay',
              isShow: false,
            },
          }));
          if (this.calendarInput.value !== '') {
            this.calendar.data('datepicker').selectDate(new Date(this.calendarInput.value));
          }
        } else {
          super.setData();
        }
        if (opened) {
          opened.classList.remove('filters-item--open');
          this.listFilters = document.querySelector('.filters-list');
          this.listFilters.style.zIndex = '';
          document.dispatchEvent(new window.CustomEvent('logicData', {
            detail: {
              type: 'toggleOverlay',
              isShow: false,
            },
          }));
        }
      });
    });
  }
}

export default FiltersTooltipDate;
