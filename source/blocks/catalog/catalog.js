import Vue from 'vue';
import qs from 'qs';
import axios from 'axios';

import BannerLocation from '../banner-location/banner-location';
import Map from './map/map';
import locationCmp from '../location/vue/vue-location';
import catalogVue from './vue-catalog.pug';

class Catalog {
  constructor(parent) {
    const self = this;
    this.parent = parent;
    this.app = new Vue({
      el: '.catalog .catalog__wrapper div[render]',
      template: catalogVue({
        data: {
          locationsBanner: [],
        },
      }),
      components: {
        location: locationCmp,
      },
      data() {
        return {
          filterData: {},
          itemInRow: window.innerWidth >= 1440 ? 4 : 3,
          locations: [],
          banners: [],
          loading: true,
          pagination: {
            count: 0,
            limit: 12,
            page: 1,
          },
        };
      },
      computed: {
        pages() {
          return Math.ceil(this.pagination.count / this.pagination.limit);
        },
        showPages() {
          const result = [];
          if (this.pages > 1) {
            const current = this.pagination.page;
            if (this.pages > 9) {
              if (current >= 5 && current <= this.pages - 4) {
                result.push(1);
                result.push('...');
                result.push(current - 1);
                result.push(current);
                result.push(current + 1);
                result.push('...');
                result.push(this.pages);
              } else if (current < 5) {
                for (let i = 1; i <= 5; i += 1) {
                  result.push(i);
                }
                result.push('...');
                result.push(this.pages);
              } else {
                result.push(1);
                result.push('...');
                for (let i = this.pages - 4; i <= this.pages; i += 1) {
                  result.push(i);
                }
              }
            } else {
              for (let i = 1; i <= this.pages; i += 1) {
                result.push(i);
              }
            }
          }
          return result;
        },
        showPagination() {
          return this.pages > 1;
        },
        convertFilterToParams() {
          const res = Object.keys(this.filterData).reduce((summ, item) => {
            const subFilter = this.filterData[item].reduce((propS, prop) => {
              const isArray = (prop.name.indexOf('[]') !== -1);
              prop.name = prop.name.replace('[]', '');
              if (propS[prop.name] === undefined) {
                if (isArray) {
                  propS[prop.name] = [prop.value];
                } else {
                  propS[prop.name] = prop.value;
                }
              } else if (Array.isArray(propS[prop.name])) {
                propS[prop.name].push(prop.value);
              } else {
                const tmp = propS[prop.name];
                propS[prop.name] = [tmp, prop.value];
              }
              return propS;
            }, {});
            summ = Object.assign(summ, subFilter);
            return summ;
          }, {});
          const tmp = {};
          Object.keys(res).forEach((item) => {
            if (res[item] === '' || res[item] === 0 || res[item] === '0' || item === 'date') {
              return;
            }
            const tmpItem = item;
            if (item.indexOf('min') !== -1) {
              item = item.replace('min', '');
              if (!tmp[item]) {
                tmp[item] = {};
              }
              if (item === 'dateTime') {
                tmp[item].min = `${res.date} ${res[tmpItem]}`;
              } else {
                tmp[item].min = res[tmpItem];
              }
            } else if (item.indexOf('max') !== -1) {
              item = item.replace('max', '');
              if (!tmp[item]) {
                tmp[item] = {};
              }
              if (item === 'dateTime') {
                tmp[item].max = `${res.date} ${res[tmpItem]}`;
              } else {
                tmp[item].max = res[tmpItem];
              }
            } else {
              tmp[tmpItem] = res[tmpItem];
            }
          });
          return tmp;
        },
      },
      methods: {
        getPagesClass(page) {
          return {
            'pagination--active': page === this.pagination.page,
          };
        },
        setPage(page) {
          if (Number.isInteger(page)) {
            this.load(page).then(() => {
              this.pagination.page = page;
            });
          }
        },
        getPrevNextClass(direction) {
          return {
            'pagination--disabled': !((direction === -1 && this.pagination.page > 1) ||
              (direction === 1 && this.pagination.page < this.pages)),
          };
        },
        setPageDir(direction) {
          if (this.getPrevNextClass(direction)['pagination--disabled'] === false) {
            this.setPage(this.pagination.page + direction);
          }
        },
        debounce(f, ms) {
          let timer = null;
          return (...args) => {
            const onComplete = () => {
              f.apply(this, args);
              timer = null;
            };
            if (timer) {
              clearTimeout(timer);
            }
            timer = setTimeout(onComplete, ms);
          };
        },
        load(page = 1) {
          this.loading = true;
          let api = '/api/front/v1.0/locations';
          // eslint-disable-next-line no-undef
          if (IS_DEV) {
            api = '/markers/map_locations.json';
          }
          api += `?${qs.stringify(Object.assign({
            page: { number: page, size: 12 },
          }, this.convertFilterToParams))}`;
          return axios.get(api).then((responce) => {
            window.$('body,html').animate({
              scrollTop: 0,
            }, 'slow', () => {
              const { data } = responce;
              if (data.data.promos) {
                this.banners = data.data.promos;
              }
              if (data.data.roomsPrices) {
                Object.keys(data.data.roomsPrices).forEach((key) => {
                  if (data.data.roomsPrices[key].min !== undefined) {
                    window.$(window).trigger('updateRange', {
                      name: key,
                      options: data.data.roomsPrices[key],
                    });
                  }
                });
              }
              let dataKeys = 'studios';
              if (data.data.rooms.length > 0) {
                dataKeys = 'rooms';
              }
              if (data) {
                this.locations = data.data[dataKeys].map((location) => {
                  if (!location.coords) {
                    location.coords = {
                      lat: +location.coordinates.lat,
                      lon: +location.coordinates.lng,
                    };
                  }
                  if (!location.label) {
                    location.label = {};
                  }
                  const newEl = {};
                  newEl.images = location.images.map(item => item.url);
                  newEl.studio_link = location.detailPageUri;
                  newEl.hours = location.minHours;
                  newEl.price = location.minPrice;
                  newEl.name = (dataKeys === 'rooms') ? location.location.name : location.name;
                  if (dataKeys === 'rooms') {
                    newEl.hall_name = location.name;
                    newEl.hall_link = newEl.studio_link;
                  }
                  newEl.id = location.id;
                  newEl.status = location.label.name;
                  newEl.status_color = location.label.color;
                  newEl.rating = location.rating ? location.rating : 0;
                  newEl.commentsCount = location.commentsCount ? location.commentsCount : 0;
                  newEl.lat = location.coords.lat;
                  newEl.lng = location.coords.lon;
                  newEl.feature = {
                    type: 'Feature',
                    id: location.id,
                    geometry: {
                      type: 'Point',
                      coordinates: [location.coords.lat, location.coords.lon],
                    },
                    options: {
                      preset: 'islands#grayStretchyIcon',
                      balloonOffset: [-23, 0],
                    },
                    properties: {
                      iconContent: `${location.minPrice}`,
                      balloonContentHeader: location.name,
                      balloonContent: (location.images[0]) ?
                        `<img class='map__img' src='${location.images[0].url}'><div class='map__subtitle'>${location.name}</div><div class='map__price'>${location.minPrice}₽ в час</div>` :
                        `<div class='map__subtitle'>${location.name}</div><div class='map__price'>${location.minPrice}₽ в час</div>`,
                    },
                  };
                  return newEl;
                });
              }
              if (this.map) {
                this.map.setNewMarkers(this.locations);
              }
              this.$nextTick(() => {
                this.pagination.page = page;
                this.pagination.count = data.data.total;
                this.loading = false;
                window.dispatchEvent(new window.CustomEvent('contentLoad'));
              });
            });
          });
        },
      },
      mounted() {
        this.slider = new BannerLocation(parent.querySelector('.catalog__slider'));
        this.map = new Map(parent.querySelector('.map'));
        const dLoad = this.debounce(this.load, 200);
        window.addEventListener('setFilter', (evt) => {
          this.$set(this.filterData, evt.detail.uids, evt.detail.data);
          dLoad();
        });
        window.addEventListener('resize', () => {
          this.itemInRow = window.innerWidth >= 1440 ? 4 : 3;
        });
        self.ieSticky();
      },
    });
  }

  move() {
    if (!this.parent.classList.contains('catalog__wrapper--move-over')) {
      this.parent.classList.add('catalog__wrapper--move-over');
    } else {
      this.parent.classList.remove('catalog__wrapper--move-over');
    }
  }

  ieSticky() {
    if (Catalog.detectIE()) {
      const { $ } = window;
      const el = $(this.parent).find('#map');
      el.addClass('ieSticky');
      const position = el[0].getBoundingClientRect();
      $(document).scroll(() => {
        const height = $('.dev-header').height();
        const scrollDistance = $(document).scrollTop();
        const stickyMenu = el;
        if (scrollDistance >= position.top - height - 20) {
          stickyMenu.css({
            position: 'fixed',
            top: height,
          });
        }
        if (scrollDistance === 0) {
          stickyMenu.css({
            position: '',
            top: '',
          });
        }
      });
    }
  }

  static detectIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    return false;
  }
}

export default Catalog;
