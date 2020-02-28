import Vue from 'vue';
import qs from 'qs';
import axios from 'axios';
import commentsVue from './comments-vue.pug';
import CommentItem from './item/comments-item';

export default class Comments {
  constructor(parent) {
    this.parent = parent;
    if (window.comments) {
      this.app = new Vue({
        el: '.comments div[render]',
        template: commentsVue({
          info: window.comments,
        }),
        components: {
          comment: CommentItem,
        },
        data() {
          return {
            info: window.comments,
            comments: [],
            comment: '',
            pagination: {
              count: 0,
              limit: 10,
              page: 1,
            },
            rating: 10,
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
        },
        methods: {
          getPagesClass(page) {
            return {
              'pagination--active': page === this.pagination.page,
            };
          },
          setPage(page) {
            if (Number.isInteger(page)) {
              this.load(page, true).then(() => {
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
          vote(data) {
            let api = '/api/front/v1.0/locations/reviews/vote';
            // eslint-disable-next-line no-undef
            if (IS_DEV) {
              api = '/api/comments.json';
            }
            axios.post(api, data);
          },
          editComment(data) {
            let api = '/api/front/v1.0/locations/reviews';
            // eslint-disable-next-line no-undef
            if (IS_DEV) {
              api = '/api/comment.json';
            }
            if (data.comment !== '') {
              axios.put(api, data).then((response) => {
                if (response.status === 200) {
                  const newComment = response.data.data;
                  const commentIndex = this.comments.findIndex(el => el.id === newComment.id);
                  if (commentIndex !== -1) {
                    this.reformatDate(newComment);
                    this.comments.splice(commentIndex, 1, newComment);
                  }
                }
              });
            }
          },
          addComment(answer = false) {
            let api = '/api/front/v1.0/locations/reviews';
            // eslint-disable-next-line no-undef
            if (IS_DEV) {
              api = '/api/comment.json';
            }
            const data = {
              studio: this.info.studioID,
              rating: this.rating,
              comment: this.comment,
            };
            if (answer) {
              Object.assign(data, answer);
            }
            if (data.comment !== '') {
              axios.post(api, data).then((response) => {
                if (response.status === 200) {
                  this.comment = '';
                  this.rate.rateYo('rating', 10);
                  this.rating = 10;

                  const newComment = response.data.data;
                  const comments = [...this.comments];
                  comments.push(newComment);
                  this.comments = this.formatComments(comments);
                }
              });
            }
          },
          load(page = 1, pageSet = false) {
            let api = '/api/front/v1.0/locations/reviews';
            // eslint-disable-next-line no-undef
            if (IS_DEV) {
              api = '/api/comments.json';
            }
            api += `?${qs.stringify(Object.assign({
              page: { number: page, size: 10 },
            }, {
              studio: {
                id: this.info.studioID,
              },
            }))}`;
            return axios.get(api).then((response) => {
              if (response.status === 200) {
                if (pageSet) {
                  window.$('body,html').animate({
                    scrollTop: this.$el.offsetTop - 80,
                  }, 'slow');
                }

                const { data } = response;
                const { items } = data.data;
                if (items.length !== 0) {
                  this.comments = this.formatComments(items);
                }
                this.$nextTick(() => {
                  this.pagination.page = page;
                  this.pagination.count = data.data.total;
                  window.dispatchEvent(new window.CustomEvent('contentLoad'));
                });
              }
            });
          },
          reformatDate(item) {
            const options = {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timezone: 'UTC',
            };
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const date = new Date(item.createdAt);
            const itemHours = date.getHours();
            const itemMinutes = date.getMinutes();
            if (hours === itemHours &&
              ((itemMinutes - minutes === -1 || itemMinutes === minutes))) {
              item.createdAt = 'Только что';
            } else {
              item.createdAt = date.toLocaleDateString('ru', options);
            }
            item.formatted = true;
          },
          formatComments(items) {
            items.forEach((item, index) => {
              if (!item.formatted) {
                this.reformatDate(item);
              }
              if (item.replyTo && !item.moved) {
                const indexOfParent = items.findIndex(el => el.id === item.replyTo);
                if (indexOfParent !== -1) {
                  items.splice(index, 1);
                  items.splice(indexOfParent + 1, 0, item);
                  item.moved = true;
                }
              }
            });
            return items;
          },
        },
        mounted() {
          const self = this;
          this.dLoad = this.debounce(this.load, 200);
          this.$nextTick(() => {
            const thisEl = window.$(this.$el);
            const starContainer = thisEl.find('.location-rate__rate-stars');
            this.ratingNum = this.$el.querySelector('.location-rate__rating-num');
            this.rate = starContainer.rateYo({
              rating: 10,
              numStars: 5,
              maxValue: 10,
              halfStar: true,
              normalFill: '#e5eef0',
              ratedFill: '#81aeb6',
              starWidth: '26px',
              spacing: '14px',
              onChange: (rating) => {
                self.rating = rating;
              },
            });
          });
          this.dLoad();
        },
      });
    }
  }
}
