class BaseTooltip {
  static generateID() {
    return Math.random().toString(36).substr(2, 9);
  }
  constructor(parent, type = null) {
    this.initData = [];
    this.type = type;
    this.parent = parent;
    this.uniqId = BaseTooltip.generateID();
    this.parent.parentElement.id = this.uniqId;
    this.setData();
    this.clearData();
  }
  removeItem(el) {
    el.parentElement.removeChild(el);
    [].slice.call(this.parent.querySelectorAll(`[name="${el.dataset.name}"][value="${el.dataset.value}"]`)).forEach((item) => {
      item.checked = false;
    });
    this.setData(false);
  }
  renderActiveFilter() {
    if (this.type === 'select') {
      let el = this.parent.parentElement.nextElementSibling;
      do {
        if (el.classList.contains('filters-item--active-option')) {
          const tmp = el.nextElementSibling;
          el.parentNode.removeChild(el);
          el = tmp;
        } else {
          el = null;
        }
      } while (el !== null);
      const next = this.parent.parentElement.nextElementSibling;
      this.initData.map((item) => {
        const div = document.createElement('div');
        div.classList.add('filters-item');
        div.classList.add('filters-item--active-option');
        div.dataset.name = item.name;
        div.dataset.value = item.value;
        div.dataset.parentId = this.uniqId;
        div.innerHTML = `<div class="filters-item__title">${item.dataset.title}</div><div class="filters-item__close"><svg width="14" height="14"><use xlink:href="/assets/front/static/assets/sprite.svg#close-usage"></use></svg></div>`;
        div.onclick = () => {
          this.removeItem(div);
        };
        return div;
      }).forEach((item) => {
        this.parent.parentElement.parentElement.insertBefore(item, next);
      });
    }
  }
  setData(isRender = true) {
    this.initData = [];
    const elements = [].slice.call(this.parent.querySelectorAll('input, select, textarea'));
    elements.forEach((item) => {
      if (item.name === '' || item.dataset.notFilter !== undefined) {
        return;
      }
      if (item.type !== undefined && (item.type === 'checkbox' || item.type === 'radio')) {
        if (item.checked) {
          const { name, value, dataset } = item;
          this.initData.push({
            name,
            value,
            dataset,
          });
        }
      } else {
        const { name, value, dataset } = item;
        this.initData.push({
          name,
          value,
          dataset,
        });
      }
    });
    window.dispatchEvent(new window.CustomEvent('setFilter', {
      detail: {
        data: this.initData,
        uids: this.uniqId,
      },
    }));
    if (isRender) {
      this.renderActiveFilter();
    }
  }
  clearData() {
    const elements = [].slice.call(this.parent.querySelectorAll('input[type="checkbox"]'));
    elements.forEach((item) => {
      if (item.type !== undefined && item.type === 'checkbox') {
        item.checked = false;
      }
    });
    this.initData.forEach((item) => {
      let element = [].slice.call(this.parent.querySelectorAll(`[name="${item.name}"]`));
      if (element.length > 1) {
        let tmp = null;
        element.forEach((mn) => {
          if (mn.value === item.value) {
            tmp = mn;
          }
        });
        element = tmp;
        element.checked = true;
      } else {
        [element] = element;
        if (element.type === 'checkbox') {
          element.checked = true;
        } else {
          element.value = item.value;
        }
      }
    });
    /* window.dispatchEvent(new window.CustomEvent('setFilter', {
      detail: {
        data: this.initData,
        uids: this.uniqId,
      },
    }));
    this.renderActiveFilter(); */
  }
}

export default BaseTooltip;
