import FiltersItem from '../item/filters-item';
import FiltersCheckbox from '../checkbox/filters-checkbox';

class FiltersList {
  constructor(parent) {
    this.parent = parent;

    [].slice.call(this.parent.querySelectorAll('.filters-item')).forEach((item) => {
      new FiltersItem(item);
    });

    [].slice.call(this.parent.querySelectorAll('.filters-checkbox')).forEach((item) => {
      new FiltersCheckbox(item);
    });
  }
}

export default FiltersList;
