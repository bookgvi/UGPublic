import PerfectScrollbar from 'perfect-scrollbar';
import BaseTooltip from '../baseTooltip';

class FiltersTooltipSelect extends BaseTooltip {
  constructor(parent) {
    super(parent, 'select');
    this.parent = parent;
    this.headers = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-select__header'));
    const btn = [].slice.call(this.parent.querySelectorAll('.filters-tooltip-select__btn'));
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
        this.reset();
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

    this.headers.forEach((item) => {
      const listOptions = item.parentNode.querySelector('.filters-tooltip-select__wrapper');
      const more = item.parentNode.querySelector('.filters-tooltip-select__more');
      const countLabels = [].slice.call(item.parentNode.querySelectorAll('.form-checkbox__input'));
      const countWrapper = item.parentNode.querySelector('.filters-tooltip-select__count');
      const count = item.parentNode.querySelector('.filters-tooltip-select__count-num');
      let scrollArea;
      let num = 0;

      countLabels.forEach((el) => {
        el.addEventListener('click', () => {
          setTimeout(() => {
            if (count.innerHTML === '0') {
              countWrapper.style.display = '';
            } else {
              countWrapper.style.display = 'inline-block';
            }
          }, 200);

          if (el.checked) {
            num += 1;
            count.innerHTML = num;
          } else {
            count.innerHTML = Number(count.innerHTML) - 1;
            num = Number(count.innerHTML);
          }
        });
      });

      if (more) {
        const moreTitle = more.querySelector('.filters-tooltip-select__more-text');
        const moreTitleSave = moreTitle.innerHTML;

        more.addEventListener('click', () => {
          if (!more.classList.contains('filters-tooltip-select__more--show')) {
            listOptions.style.maxHeight = `${listOptions.scrollHeight}px`;
            more.classList.add('filters-tooltip-select__more--show');
            scrollArea = new PerfectScrollbar(this.parent);
            moreTitle.innerHTML = 'Скрыть';
          } else {
            more.classList.remove('filters-tooltip-select__more--show');
            listOptions.style.maxHeight = null;
            scrollArea.destroy();
            moreTitle.innerHTML = moreTitleSave;

            if (listOptions.scrollTop > 0) {
              listOptions.scrollTop = 0;
            }
          }
        });
      }

      item.addEventListener('click', (e) => {
        this.el = e.currentTarget;

        if (!this.el.parentNode.classList.contains('filters-tooltip-select__item--open')) {
          for (let i = 0; i < this.headers.length; i += 1) {
            if (this.headers[i].parentNode.classList.contains('filters-tooltip-select__item--open')) {
              this.headers[i].parentNode.classList.remove('filters-tooltip-select__item--open');
            }
          }

          listOptions.style.maxHeight = null;
          this.parent.scrollTop = 0;
          this.el.parentNode.classList.add('filters-tooltip-select__item--open');

          if (more !== null) {
            more.classList.remove('filters-tooltip-select__more--show');
            this.moreTitle = more.querySelector('.filters-tooltip-select__more-text');
            this.moreTitle.innerHTML = `Ещё ${listOptions.childElementCount - 5}`;
          }
        } else {
          this.el.parentNode.classList.remove('filters-tooltip-select__item--open');
        }
      });
    });
  }

  reset() {
    this.headers.forEach(item => item.parentNode.classList.remove('filters-tooltip-select__item--open'));
  }
}

export default FiltersTooltipSelect;
