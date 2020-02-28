import FiltersTooltipBooking from '../tooltip/booking/filters-tooltip-booking';
import FiltersTooltipDate from '../tooltip/date/filters-tooltip-date';
import FiltersTooltipPrice from '../tooltip/price/filters-tooltip-price';
import FiltersTooltipSelect from '../tooltip/select/filters-tooltip-select';
import FiltersTooltipSize from '../tooltip/size/filters-tooltip-size';

class FiltersItem {
  constructor(parent) {
    this.parent = parent;
    this.title = this.parent.querySelector('.filters-item__title');
    const date = this.parent.querySelector('.filters-tooltip-date');
    const select = this.parent.querySelector('.filters-tooltip-select');
    const price = this.parent.querySelector('.filters-tooltip-price');
    const booking = this.parent.querySelector('.filters-tooltip-booking');
    const size = this.parent.querySelector('.filters-tooltip-size');
    const tooltips = [].slice.call(this.parent.querySelectorAll('.filters-item__tooltip'));

    if (date) {
      this.widget = new FiltersTooltipDate(date);
    }
    if (select) {
      this.widget = new FiltersTooltipSelect(select);
    }
    if (price) {
      this.widget = new FiltersTooltipPrice(price);
    }
    if (booking) {
      this.widget = new FiltersTooltipBooking(booking);
    }
    if (size) {
      this.widget = new FiltersTooltipSize(size);
    }

    this.title.addEventListener('click', () => {
      document.dispatchEvent(new window.CustomEvent('logicData', {
        detail: {
          type: 'resetFiltersItem',
          el: this,
        },
      }));
      if (!this.parent.classList.contains('filters-item--open')) {
        if (this.widget !== undefined && this.widget.reset !== undefined) {
          this.widget.reset();
        }

        if (!this.parent.classList.contains('filters-checkbox')) {
          document.dispatchEvent(new window.CustomEvent('logicData', {
            detail: {
              type: 'toggleOverlay',
              isShow: true,
            },
          }));
        }

        document.dispatchEvent(new window.CustomEvent('logicData', {
          detail: {
            type: 'paddingContent',
            isPadding: true,
          },
        }));

        this.listFilters = document.querySelector('.filters-list');
        this.parent.classList.add('filters-item--open');
        this.listFilters.style.zIndex = '20';

        tooltips.forEach((element) => {
          const elPosition = element.getBoundingClientRect();

          if (window.innerWidth < elPosition.right) {
            element.style.left = `-${elPosition.right - window.innerWidth}px`;
          }
        });

        if (window.innerWidth < 768) {
          FiltersItem.hiddenScroll();
        }
      } else {
        document.dispatchEvent(new window.CustomEvent('logicData', {
          detail: {
            type: 'paddingContent',
            isPadding: false,
          },
        }));
        this.parent.classList.remove('filters-item--open');
        this.listFilters.style.zIndex = '';
        tooltips.forEach((element) => {
          element.style.left = '';
        });

        document.dispatchEvent(new window.CustomEvent('logicData', {
          detail: {
            type: 'toggleOverlay',
            isShow: false,
          },
        }));
      }
    });
    document.addEventListener('logicData', (event) => {
      if (event.detail.type === 'resetFiltersItem' && event.detail.el !== this) {
        this.parent.classList.remove('filters-item--open');
      }
    });
  }
  static hiddenScroll() {
    document.body.style.top = `${document.body.getBoundingClientRect().y}px`;
  }
}

export default FiltersItem;
