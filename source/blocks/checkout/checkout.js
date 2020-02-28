import Vue from 'vue';
import PerfectScrollbar from 'perfect-scrollbar';
import * as EmailValidator from 'email-validator';
import Axios from 'axios';
import IMask from 'imask';
import LocationPavilions from '../location/pavilions/location-pavilions';
import LocationPavilionSlider from '../location/pavilions/location-pavilion-slider';
import AdditionalService from '../location/additionalService/additionalService';
import CheckoutStudio from './studio/checkout-studio';
import CheckoutCalendar from './calendar/checkout-calendar';
import CheckoutSelectInput from './selectInput/checkout-selectInput';
import FormSelect from '../form/select/form-select';
import VueBus from '../../base/scripts/vue-bus';

class Checkout {
  constructor(parent) {
    this.parent = parent;
    this.initVue();
  }

  initVue() {
    new Vue({
      el: `#${this.parent.id}`,
      data() {
        return {
          required: ['firstName', 'lastName', 'email', 'phone'],
          pricesFields: ['reserveFrom', 'reserveTo', 'priceType', 'extras', 'seats', 'promocode'],
          orderFields: ['reserveFrom', 'reserveTo', 'roomId', 'consumerId', 'customer', 'priceType', 'seats', 'members', 'extras', 'userComment'],
          formData: {
            members: [],
            userComment: '',
          },
          info: {
            order: [
              {
                name: 'id',
                title: 'Локация',
                value: '',
              },
              {
                name: 'seats',
                title: 'Кол-во. чел.',
                value: '',
              },
              {
                name: 'date',
                title: 'Дата',
                value: '',
              },
              {
                name: 'time',
                title: 'Время',
                value: '',
              },
              {
                name: 'priceType',
                title: 'Цель',
                value: '',
              },
            ],
            personal: [
              {
                name: 'fullName',
                title: 'Имя',
                value: '',
              },
              {
                name: 'email',
                title: 'Email',
                value: '',
              },
              {
                name: 'phone',
                title: 'Тел.',
                value: '',
              },
            ],
            price: {},
            date: '',
            time: '',
            participants: '',
          },
        };
      },
      methods: {
        debounce(f, ms) {
          let timeout;

          return (...args) => {
            const functionCall = () => f.apply(this, ...args);

            clearTimeout(timeout);
            timeout = setTimeout(functionCall, ms);
          };
        },
        initVanillaScripts() {
          const parent = this.$el;
          this.header = document.querySelector('header');
          this.locationPavilions = [].slice.call(parent.querySelectorAll('.location-pavilions'));
          this.selects = [].slice.call(parent.querySelectorAll('.form-select--vue'));
          this.selectPs = [].slice.call(parent.querySelectorAll('.form-select__col-list-wrp'));
          this.additionalServices = [].slice.call(parent.querySelectorAll('.location-additionalService'));
          this.calendarSection = parent.querySelector('.checkout__calendar-section');
          this.receit = parent.querySelector('.checkout__receipt');
          this.selectInput = parent.querySelector('.checkout-selectInput');
          this.typeWindow = this.checkWindowWidth();

          this.selects.forEach((select) => {
            new FormSelect(select);
          });

          this.locationPavilions.forEach((locationPavilion) => {
            new LocationPavilions(locationPavilion);
            new LocationPavilionSlider(locationPavilion);
          });

          this.additionalServices.forEach((additionalService) => {
            new AdditionalService(additionalService);
          });

          this.selectPs.forEach((item) => {
            new PerfectScrollbar(item);
          });

          if (this.calendarSection) {
            new CheckoutCalendar();
          }

          if (this.selectInput) {
            new CheckoutSelectInput(this.selectInput);
          }

          if (this.receit) {
            this.stickyBlock();

            window.addEventListener('resize', () => {
              const flag = this.checkWindowWidth();
              if (flag !== this.typeWindow) {
                this.typeWindow = flag;
              }

              this.stickyBlock();
            });
          }
        },
        checkWindowWidth() {
          let typeWindow = '';
          if (window.innerWidth < 1920) {
            typeWindow = 'normal';
          } else {
            typeWindow = 'large';
          }

          return typeWindow;
        },
        stickyBlock() {
          if (this.typeWindow === 'large') {
            this.receit.style.top = `${this.header.offsetHeight}px`;
          } else {
            const topSize = window.innerHeight - this.receit.scrollHeight;
            this.receit.style.top = `${topSize}px`;
          }
        },
        setValue(el, name, multiple = false, isSelect = false, triggerUpdate = true) {
          if (!this.formData[name]) {
            if (multiple) {
              this.formData[name] = [];
            } else {
              this.formData[name] = '';
            }
          }
          if (multiple) {
            if (el.checked) {
              const counter = this.$el.querySelector(`[name="${el.id}"]`);
              this.formData[name].push({
                id: +el.value,
                count: (counter && (+counter.value > 1)) ? +counter.value : 1,
              });
            } else {
              const index = this.formData[name].findIndex(tmp => tmp.id === +el.value);
              if (index !== -1) {
                this.formData[name].splice(index, 1);
              }
            }
          } else {
            if (el.type === 'number') {
              this.formData[name] = +el.value;
            } else {
              this.formData[name] = el.value;
            }
            if (isSelect) {
              const options = [].slice.call(el.options);
              this.info.priceType = options.find(opt => opt.value === el.value).innerText;
            }
          }
          this.updateInfo();
          if (triggerUpdate) {
            this.getPrices();
          }
        },
        setCount(id, type, name) {
          const service = this.formData.extras.find(el => el.id === +id);
          const counter = this.$el.querySelector(`[name="${name}"]`);

          if (service) {
            if (type === '+') {
              if (service.count < 98) {
                service.count += 1;
              }
            }
            if (type === '-') {
              if (service.count >= 2) {
                service.count -= 1;
              }
            }
            if (counter) {
              counter.value = service.count;
            }

            this.getPrices();
          }
        },
        updateInfo() {
          this.info.order = [
            {
              name: 'id',
              title: 'Локация',
              value: `Зал № ${this.formData.id}`,
            },
            {
              name: 'seats',
              title: 'Кол-во. чел.',
              value: this.formData.seats,
            },
            {
              name: 'date',
              title: 'Дата',
              value: this.info.date,
            },
            {
              name: 'time',
              title: 'Время',
              value: this.info.time,
            },
            {
              name: 'priceType',
              title: 'Цель',
              value: this.info.priceType,
            }];
          this.info.personal = [
            {
              title: 'Имя',
              value: `${this.formData.firstName} ${this.formData.lastName}`,
            },
            {
              title: 'Email',
              value: this.formData.email,
            },
            {
              title: 'Тел.',
              value: this.phoneMask.masked.isComplete ? this.formData.phone : '',
            }];
          this.initSlider();
        },
        initSlider() {
          this.$nextTick(() => {
            const checkoutStudio = this.$el.querySelector('.checkout-studio');
            if (checkoutStudio) {
              if (!checkoutStudio.slider) {
                checkoutStudio.slider = new CheckoutStudio(checkoutStudio);
              } else {
                checkoutStudio.slider.sw.destroy(true, true);
                checkoutStudio.slider = new CheckoutStudio(checkoutStudio);
              }
            }
          });
        },
        initFormData() {
          const consumer = this.$el.querySelector('[name="consumerId"]');
          if (consumer) {
            this.formData.consumerId = consumer.value ? +consumer.value : null;
          }
          this.initData = [].slice.call(this.$el.querySelectorAll('[data-form]'));
          if (this.initData.length > 0) {
            this.initData.forEach((field) => {
              if (field.type === 'checkbox') {
                this.setValue(field, field.name, true);
              } else if (field.type === 'radio') {
                if (field.checked) {
                  this.setValue(field, field.name);
                }
              } else if (field.type === 'select-one') {
                this.setValue(field, field.name, false, field.getAttribute('data-form'));
              } else {
                this.setValue(field, field.name);
              }
            });
          }
          this.initSlider();
        },
        validateInput(name) {
          if (this.formData[name]) {
            let valid = this.formData[name].length >= 1;
            if (name === 'email') {
              valid = EmailValidator.validate(this.formData[name]);
            }
            if (name === 'phone') {
              valid = this.phoneMask.masked.isComplete;
            }
            return (valid ? 'form-input--check-ok' : 'form-input--check-fail');
          }
          return '';
        },
        formatDate(data) {
          Object.assign(this.formData, data);
          const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timezone: 'UTC',
          };
          const date = new Date(data.reserveFrom).toLocaleDateString('ru', options);
          this.info.date = date.substr(0, date.length - 2);
          const timeFrom = data.reserveFrom.substr(-5);
          const timeTo = data.reserveTo.substr(-5);
          const numTo = +timeTo.substr(0, 2);
          const numFrom = +timeFrom.substr(0, 2);
          const dateRange = numTo - numFrom;
          this.info.time = `${dateRange} ч. ${timeFrom} - ${timeTo}`;
          this.updateInfo();
        },
        addParticipant() {
          if (!this.formData.members) {
            this.formData.members = [];
          }
          if (this.info.participants.length > 0) {
            this.formData.members.push(this.info.participants);
            this.info.participants = '';
          }
        },
        removeParticipant(value) {
          const index = this.formData.members.indexOf(value);
          if (index !== -1) {
            this.formData.members.splice(index, 1);
          }
        },
        submit() {
          const errors = [];
          this.required.forEach((name) => {
            let valided = this.formData[name].length >= 1;
            if (name === 'email') {
              valided = EmailValidator.validate(this.formData[name]);
            }
            if (name === 'phone') {
              valided = this.phoneMask.masked.isComplete;
            }
            if (!valided) errors.push({ name, valided });
          });
          if (errors.length === 0) {
            let api = '/api/cabinet/v1.0/bookings';
            // eslint-disable-next-line
            if (IS_DEV) {
              api = '/api/booking.json';
            }
            const data = {};
            this.orderFields.forEach((field) => {
              if (this.formData[field] || this.formData[field] === null) {
                const type = typeof this.formData[field];
                if (this.formData[field] === null ||
                  (type !== 'number' && this.formData[field].length > 0)) {
                  data[field] = this.formData[field];
                }
                if (type === 'number') {
                  data[field] = +this.formData[field];
                }
                if (field === 'extras' && this.formData.extras.length > 0) {
                  data[field] = this.formData.extras.map(el => el.id);
                }
              }
              if (field === 'seats') {
                data[field] = +this.formData.seats;
              }
              if (field === 'roomId') {
                data[field] = +this.formData.id;
              }
            });
            data.customer = {
              firstName: this.formData.firstName,
              fullName: `${this.formData.firstName} ${this.formData.lastName}`,
              phone: this.formData.phone,
              email: this.formData.email,
            };
            data.prepayment = this.info.price.sumForPay;
            Axios.post(api, data);
          } else {
            errors.forEach((error) => {
              const input = this.$el.querySelector(`[name=${error.name}]`);
              if (input) {
                const parent = input.closest('.form-input');
                parent.classList.add('form-input--check-fail');
              }
            });
          }
        },
        loadPrice() {
          let api = '/api/front/v1.0/rooms/booking-price/';
          // eslint-disable-next-line
          if (IS_DEV) {
            api = '/api/booking.json/?';
          }
          let req = '';
          this.pricesFields.forEach((key, ind) => {
            const type = typeof this.formData[key];
            const cond = type === 'object' ? this.formData[key].length > 0 : this.formData[key] !== '';
            if (cond) {
              if (key === 'extras') {
                const extras = this.formData[key];
                if (extras) {
                  req += `&${key}=[`;
                  extras.forEach((el, index) => {
                    req += `{id:${el.id},count:${el.count}}`;
                    if (extras.length > 1 && index < extras.length - 1) {
                      req += ',';
                    }
                  });
                  req += ']';
                }
              } else {
                req += `${ind > 0 ? '&' : ''}${key}=${this.formData[key]}`;
              }
            }
          });
          req = decodeURIComponent(req);
          const url = `${api}${this.formData.id}?${req}`;
          Axios.get(url).then((response) => {
            const { data } = response;
            if (data.data && data.data.items) {
              this.info.price = data.data.items; // eslint-disable-line
              if (this.info.price.peopleAdditionalPayment) {
                this.info.price.peopleAdditionalPayment = {
                  title: `${this.formData.seats} ч. х ${this.info.price.peopleAdditionalPayment}`,
                  value: (+this.formData.seats) * (this.info.price.peopleAdditionalPayment),
                };
              }
              if (this.info.price.promocode && this.info.price.promocode.length > 0) {
                this.info.price.promocode = this.info.price.promocode.map((code) => {
                  const disc = code.amount;
                  if (code.type === 'rub') {
                    code.amount = `${disc}р.`;
                  } else {
                    code.amount = `${disc}%`;
                  }
                  return code;
                });
              }
            }
          });
        },
      },
      mounted() {
        this.getPrices = this.debounce(this.loadPrice, 200);
        const phoneInput = this.$el.querySelector('input[name="phone"]');
        if (phoneInput) {
          this.phoneMask = new IMask(phoneInput, {
            mask: '+{7}(000) 000-00-00',
            numericInput: true,
          });
        }
        VueBus.$on('dateSelect', (data) => {
          this.formatDate(data);
          this.getPrices();
        });
        this.initVanillaScripts();

        this.inputs = [].slice.call(this.$el.querySelectorAll('.checkout-personal-data input'));
        this.initFormData();
      },
    });
  }
}

export default Checkout;
