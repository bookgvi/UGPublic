require('custom-event-polyfill');

class FormSelect {
  constructor(element) {
    this.selectStatus = {
      show: 1, hide: 0,
    };
    this.parent = element;
    this.parent.classList.add('filter-input--js-select');
    const selectCollection = element.getElementsByTagName('select');
    const zero = 0;
    const first = 1;
    let fromValues = '';
    let toValues = '';
    let rangeTemplate = '';
    this.fromSelect = selectCollection[zero];
    if (this.fromSelect.hasAttribute('multiple')) {
      this.isMultiple = true;
      this.selectedValues = [];
      this.tmpTitle = '';
    }

    if (selectCollection.length === 1) {
      const optgroup = this.fromSelect.querySelector('optgroup');
      this.fromSelect.input = '';
      if (optgroup) {
        this.fromSelect.input = `<input class="form-select__col-title" name = 'from' type="number" placeholder = "${optgroup.getAttribute('label')}">`;
      }
    } else {
      this.fromSelect.input = '';
      let optgroup = this.fromSelect.querySelector('optgroup');
      if (optgroup) {
        this.fromSelect.input = `<input class="form-select__col-input"  name = 'from' type="number" placeholder = "${optgroup.getAttribute('label')}">`;
      }
      this.toSelect = selectCollection[first];
      this.toSelect.input = '';
      optgroup = this.toSelect.querySelector('optgroup');
      if (optgroup) {
        this.toSelect.input = `<input class="form-select__col-input" name = 'to' type="number" placeholder = "${optgroup.getAttribute('label')}">`;
      }
      this.isRange = true;
    }
    for (let i = 0; i < this.fromSelect.options.length; i += 1) {
      if (this.isMultiple) {
        fromValues += `<li data-type="from" data-value="${this.fromSelect.options[i].value}">
          <div class="core-checkbox core-checkbox--select">
            <input type="checkbox" ${this.fromSelect.options[i].selected ? 'checked' : ''} id="${this.fromSelect.options[i].dataset.id}" value="${this.fromSelect.options[i].value}" name="${this.fromSelect.name}">
            <label for="${this.fromSelect.options[i].dataset.id}" class="core-checkbox__label">
              <div class="core-checkbox__box"></div>
              <span>${this.fromSelect.options[i].text}</span>
            </label>
          </div>
        </li>`;
        if (this.fromSelect.options[i].selected) {
          this.selectedValues.push(this.fromSelect.options[i].text);
        }
      } else {
        fromValues += `<li data-type="from" data-value="${this.fromSelect.options[i].value}">${this.fromSelect.options[i].text}</li>`;
      }
    }
    if (this.isRange) {
      for (let i = 0; i < this.toSelect.options.length; i += 1) {
        toValues += `<li data-type="to" data-value="${this.toSelect.options[i].value}">${this.toSelect.options[i].text}</li>`;
      }
      rangeTemplate = `<div class="form-select__col">
            ${this.toSelect.input}
            <ul class="form-select__col-list">${toValues}</ul>
          </div>`;
    }
    const template = `<div class="form-select">
        <div class="form-select__title">${this.getTitle()}</div>
        <div class="form-select__popup">
          <div class="form-select__col ${!this.isRange ? 'form-select--max-width' : ''}">
            ${this.fromSelect.input}
            <div class="form-select__col-list-wrp">
              <ul class="form-select__col-list">${fromValues}</ul>
            </div>
          </div>
          ${rangeTemplate}
        </div>
      </div>`;

    element.insertAdjacentHTML('beforeend', template);

    this.popup = element.querySelector('.form-select__popup');
    this.actionsBtn = element.getElementsByTagName('li');

    for (let i = 0; i < this.actionsBtn.length; i += 1) {
      if (this.isMultiple) {
        const checkbox = this.actionsBtn[i].querySelector('input');
        checkbox.addEventListener('change', () => {
          this.multipleSet(checkbox);
        });
      } else {
        this.actionsBtn[i].addEventListener('click', (evt) => {
          this.set(evt);
        }, false);
      }
    }

    element.addEventListener('click', () => {
      if (this.status === this.selectStatus.show) {
        this.setPopupStatus(this.selectStatus.hide);
      } else {
        this.setPopupStatus(this.selectStatus.show);
      }
    }, false);

    document.body.addEventListener('click', (e) => {
      const target = e.target || e.srcElement;
      if (target !== element && !this.isChildOf(target, element)) {
        this.setPopupStatus(this.selectStatus.hide);
      }
    }, false);

    this.title = element.querySelector('.form-select__title');
    this.reDraw();
    this.setClassToElem();
  }

  isChildOf(child, parent) {
    let result;
    if (child.parentNode === parent) {
      result = true;
    } else if (child.parentNode === null) {
      result = false;
    } else {
      result = this.isChildOf(child.parentNode, parent);
    }
    return result;
  }

  multipleSet(checkbox) {
    const element = checkbox;
    let text;
    if (element.checked) {
      text = element.parentElement.querySelector('.core-checkbox__label span').innerHTML;
      this.selectedValues.push(element.value);
      if (this.selectedValues.length === 1) {
        this.title.innerText = `${text}`;
        this.tmpTitle = `${text}`;
      } else if (this.selectedValues.length > 1) {
        this.title.innerText += `,${text}`;
        this.tmpTitle += `,${text}`;
      }
      if (this.selectedValues.length >= 3) {
        this.title.innerHTML = `Выбрано <span class="form-select__title-count">+${this.selectedValues.length}</span>`;
      }
    } else {
      text = element.parentElement.querySelector('.core-checkbox__label span').innerHTML;
      this.selectedValues.splice(this.selectedValues.indexOf(element.value), 1);
      const tmpArray = this.tmpTitle.split(',');
      tmpArray.splice(tmpArray.indexOf(text), 1);
      this.tmpTitle = tmpArray.join(',');
      if (this.selectedValues.length >= 3) {
        this.title.innerHTML = `Выбрано <span class="form-select__title-count">+${this.selectedValues.length}</span>`;
      } else if (this.selectedValues.length > 0 && this.selectedValues.length < 3) {
        this.title.innerText = this.tmpTitle;
      } else {
        this.title.innerText = 'Все варианты';
      }
    }

    this.fromSelect.value = this.selectedValues;
    if ((this.selectedValues.length === this.actionsBtn.length) ||
      (this.selectedValues.length === 0)) {
      this.title.innerText = 'Все варианты';
      this.fromSelect.value = 'Все варианты';
    }
    [].slice.call(this.fromSelect.options).forEach((tmp) => {
      const option = tmp;
      [].slice.call(this.selectedValues).forEach((selected) => {
        if (option.text === selected) {
          option.selected = true;
        }
      });
    });
    this.fromSelect.dispatchEvent(new window.CustomEvent('change'));
  }

  set(evt) {
    const element = evt.target;
    let source;
    if (element.dataset.type === 'from') {
      source = this.fromSelect;
    } else if (element.dataset.type === 'to') {
      source = this.toSelect;
    }
    const oldValue = source.value;
    source.value = element.dataset.value;
    if (this.isRange) {
      if (parseFloat(this.fromSelect.value) > parseFloat(this.toSelect.value)) {
        source.value = oldValue;
      }
    }
    if (source.value !== oldValue) {
      source.dispatchEvent(new window.CustomEvent('change'));
      this.reDraw();
      if (this.isRange && source === this.toSelect) {
        this.setPopupStatus(this.selectStatus.hide);
      }
      if (!this.isRange) {
        this.setPopupStatus(this.selectStatus.hide);
      }
    }
    this.title.innerText = this.getTitle();
    evt.stopPropagation();
  }

  reDraw() {
    const options = this.parent.querySelectorAll('li:not([data-value=""])');
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      option.classList.remove('form-select--active');
      if (option.dataset.type === 'from') {
        if (this.isRange && parseFloat(option.dataset.value) > parseFloat(this.toSelect.value)) {
          option.classList.add('form-select--disabled');
        } else {
          option.classList.remove('form-select--disabled');
          if (parseFloat(option.dataset.value) === parseFloat(this.fromSelect.value)) {
            option.classList.add('form-select--active');
          }
        }
      }
      if (option.dataset.type === 'to') {
        if (parseFloat(option.dataset.value) < parseFloat(this.fromSelect.value)) {
          option.classList.add('form-select--disabled');
        } else {
          option.classList.remove('form-select--disabled');
          if (parseFloat(option.dataset.value) === parseFloat(this.toSelect.value)) {
            option.classList.add('form-select--active');
          }
        }
      }
    }
    this.activeElement = [].slice.call(this.parent.querySelectorAll('li[data-value]'));
    this.activeElement[0].classList.add('active');
  }

  getTitle() {
    let title;
    if (this.isMultiple && this.selectedValues.length === 0) {
      title = 'Все варианты';
    } else {
      const { selectedIndex } = this.fromSelect;
      if (selectedIndex >= 0) {
        title = this.fromSelect.options[selectedIndex].text;
      } else {
        title = 'Все варианты';
      }
      if (this.isRange) {
        const toSelectedIndex = this.toSelect.selectedIndex;
        if (selectedIndex >= 0) {
          title = `${this.fromSelect.options[selectedIndex].text}`;
        } else {
          title = 'от';
        }
        if (toSelectedIndex >= 0) {
          title += ` — ${this.toSelect.options[toSelectedIndex].text}`;
        } else {
          title += ' — до';
        }
      }
      if (this.parent.classList.contains('form-select__select--from')) {
        if (selectedIndex >= 0) {
          title = `${this.fromSelect.options[selectedIndex].text}`;
        } else {
          title = 'от';
        }
      }
      if (this.parent.classList.contains('form-select__select--to')) {
        if (selectedIndex >= 0) {
          title = `${this.fromSelect.options[selectedIndex].text}`;
        } else {
          title = 'до';
        }
      }
    }
    return title;
  }

  setPopupStatus(status) {
    this.status = status;
    if (status === this.selectStatus.show) {
      this.title.classList.add('form-select__title--open');
      this.popup.classList.add('form-select--popup-show');
      this.parent.classList.add('form-select--opened');
    } else {
      this.title.classList.remove('form-select__title--open');
      this.popup.classList.remove('form-select--popup-show');
      this.parent.classList.remove('form-select--opened');
    }
  }

  removeClassFromElement() {
    this.activeElement.forEach((item) => {
      item.classList.remove('active');
    });
  }

  setClassToElem() {
    this.activeElement.forEach((elem) => {
      elem.addEventListener('click', () => {
        this.removeClassFromElement();
        elem.classList.add('active');
      });
    });
  }
}

export default FormSelect;
