import BaseTooltip from '../baseTooltip';
import LocationInputNumber from '../../../location/inputNumber/inputNumber';

class FiltersTooltipSize extends BaseTooltip {
  constructor(parent) {
    super(parent);
    this.parent = parent;
    const rangeSize = window.$('.filters-tooltip-size__range');
    const inputMin = this.parent.querySelector('.filters-tooltip-size__input--min .form-input__input');
    const inputMax = this.parent.querySelector('.filters-tooltip-size__input--max .form-input__input');
    this.locationInputNumber = this.parent.querySelector('.location-inputNumber');
    new LocationInputNumber(this.locationInputNumber);

    rangeSize.ionRangeSlider({
      type: 'double',
      min: inputMin.min,
      max: inputMax.max,
      from: inputMin.min,
      to: inputMax.max,
      hide_min_max: true,
      hide_from_to: true,

      onChange: (data) => {
        inputMin.value = data.from;
        inputMax.value = data.to;
      },
    });

    const rangeSizeData = rangeSize.data('ionRangeSlider');

    inputMin.value = rangeSizeData.result.from;
    inputMax.value = rangeSizeData.result.to;

    const btn = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-size__btn'));
    btn.forEach((elem) => {
      elem.addEventListener('click', () => {
        const opened = document.querySelector('.filters-item.filters-item--open');
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
        if (elem.classList.contains('form-button--cancel')) {
          super.clearData();
          document.dispatchEvent(new window.CustomEvent('logicData', {
            detail: {
              type: 'toggleOverlay',
              isShow: false,
            },
          }));
        } else {
          super.setData();
        }
      });
    });
  }
}

export default FiltersTooltipSize;
