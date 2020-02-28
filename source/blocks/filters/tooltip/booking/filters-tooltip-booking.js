import BaseTooltip from '../baseTooltip';

class FiltersTooltipBooking extends BaseTooltip {
  constructor(parent) {
    super(parent);
    this.parent = parent;
    if (this.parent !== null) {
      this.checkboxOnOff = this.parent.querySelector('.filters-tooltip-booking__checkbox-text');
      this.checkbox = this.parent.querySelector('.filters-tooltip-booking__checkbox-switch');
      this.checkbox.addEventListener('click', this.switch.bind(this));
      this.checkboxOnOff.addEventListener('click', this.switch.bind(this));
    }
  }

  switch() {
    if (!this.checkbox.classList.contains('filters-tooltip-booking__checkbox-switch--active')) {
      this.checkbox.classList.add('filters-tooltip-booking__checkbox-switch--active');
      this.checkbox.children[0].checked = true;
      this.checkboxOnOff.innerHTML = this.checkboxOnOff.dataset.enabled;
    } else {
      this.checkbox.classList.remove('filters-tooltip-booking__checkbox-switch--active');
      this.checkboxOnOff.innerHTML = this.checkboxOnOff.dataset.disabled;
      this.checkbox.children[0].checked = false;
    }
    super.setData();
  }
}

export default FiltersTooltipBooking;
