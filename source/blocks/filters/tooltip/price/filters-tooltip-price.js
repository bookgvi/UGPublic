import BaseTooltip from '../baseTooltip';

class FiltersTooltipPrice extends BaseTooltip {
  static randomInteger(min, max) {
    let rand = (min - 0.5) + (Math.random() * ((max - min) + 1));
    rand = Math.round(rand);
    return rand;
  }

  static createHistogram(element) {
    element.each((index, elem) => {
      const range = window.$(elem).find('[data-id="histogramSlider"]');
      const from = window.$(elem).find(`input[name="${range[0].dataset.relMin}"]`)[0];
      const to = window.$(elem).find(`input[name="${range[0].dataset.relMax}"]`)[0];
      const renderText = window.$(elem).find('.filters-tooltip-price__price > span');
      const numberOfBins = 28;
      elem.from = from;
      elem.to = to;
      elem.range = range;
      const data = {
        items: [],
      };

      for (let i = 0; i < 500; i += 1) {
        data.items.push({ value: FiltersTooltipPrice.randomInteger(1, 5000) });
      }

      window.$(range).on('update', (evt, params) => {
        if (from) {
          [from.value] = params;
        }
        if (to) {
          [from.value, to.value] = params;
        }
        renderText.html(params.join(' - '));
      });

      window.$(range).histogramSlider({
        data,
        sliderRange: [1, 5000],
        selectedRange: [1, 5000],
        numberOfBins,
        showTooltips: false,
        showSelectedRange: false,
        height: 70,
      });
      window.$(window).on('updateRange', (evt, props = { name: '', options: { } }) => {
        if (props.name === elem.dataset.name) {
          window.$(range)[0].setOptions(props.options);
        }
      });
    });
  }

  constructor(parent) {
    super(parent);
    this.parent = parent;
    const radioTabs = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-price__tab input'));
    const radioSelect = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-price__select'));
    this.ranges = window.$(parent).find('.filters-tooltip-price__select[data-name]');

    FiltersTooltipPrice.createHistogram(this.ranges);

    const btn = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-price__btn'));
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
          this.ranges.each((key, item) => {
            item.range[0].setValue([item.from.value, item.to.value]);
          });
        } else {
          super.setData();
        }
      });
    });

    radioTabs.forEach((el) => {
      el.addEventListener('click', () => {
        let dataName;
        if (el.checked) {
          dataName = el.getAttribute('data-name');
        }

        for (let i = 0; i < radioSelect.length; i += 1) {
          if (radioSelect[i].classList.contains('filters-tooltip-price__select--active')) {
            radioSelect[i].classList.remove('filters-tooltip-price__select--active');
          }

          if (radioSelect[i].getAttribute('data-name') === dataName) {
            radioSelect[i].classList.add('filters-tooltip-price__select--active');
          }
        }
      });
    });
  }
}

export default FiltersTooltipPrice;
