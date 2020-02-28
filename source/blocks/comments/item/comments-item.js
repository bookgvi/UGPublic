import CommentTempl from './vue-comments-item.pug';
import VueBus from '../../../base/scripts/vue-bus';

export default {
  props: ['info'],
  template: CommentTempl(),
  data() {
    return {
      voted: null,
      answerVisible: false,
      comment: '',
      reply: true,
      placeholder: 'Ваш ответ на комментарий',
      placeholderText: 'Ваш ответ на комментарий',
      isAuthorized: false,
      isCommentAuthor: false,
      edit: false,
      rating: 10,
    };
  },
  methods: {
    setVote(vote) {
      const { voted } = this;
      if (vote) {
        if (this.voted !== 'like') {
          this.$props.info.likeSelect = true;
          this.$props.info.dislikeSelect = false;
          this.$props.info.likes += 1;
          if (this.voted === 'dislike') {
            this.$props.info.dislikes -= 1;
          }
          this.voted = 'like';
        }
      } else if (vote === false) {
        if (this.voted !== 'dislike') {
          this.$props.info.dislikeSelect = true;
          this.$props.info.likeSelect = false;
          if (this.voted === 'like') {
            this.$props.info.likes -= 1;
          }
          this.$props.info.dislikes += 1;
          this.voted = 'dislike';
        }
      }
      if (voted !== this.voted) {
        this.$emit('setVote', {
          review: this.$props.info.id,
          vote,
        });
      }
    },
    showAnswer(type) {
      const self = this;
      if (type !== this.answerVisible) {
        this.answerVisible = type;
        VueBus.$emit('closeComment', {
          current: this.$props.info.id,
        });

        this.$nextTick(() => {
          const thisEl = window.$(this.$el);
          const starContainer = thisEl.find('.location-rate__rate-stars');
          this.ratingNum = this.$el.querySelector('.location-rate__rating-num');
          starContainer.rateYo({
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
              this.ratingNum.innerHTML = rating;
            },
          });
        });
      }
    },
    editComment() {
      if (this.reply) {
        this.showAnswer('comment');
        this.edit = true;
        this.placeholder = '';
        this.comment = this.$props.info.content;
        this.reply = false;
      }
    },
    answerComment() {
      this.showAnswer('answer');
      this.edit = false;
      this.placeholder = this.placeholderText;
      this.comment = '';
      this.reply = true;
    },
    addAnswer() {
      if (this.comment !== '') {
        const data = {
          comment: this.comment,
          rating: this.rating,
        };
        if (!this.edit && this.reply) {
          data.replyTo = this.$props.info.id;
        }
        if (this.edit) {
          data.review = this.$props.info.id;
          this.$emit('editComment', data);
          this.edit = false;
        } else {
          this.$emit('addAnswer', data);
        }
        this.comment = '';
        this.answerVisible = false;
      }
    },
  },
  updated() {
    if (!this.reply) {
      this.reply = true;
    }
  },
  mounted() {
    if (window.authorized) {
      this.isAuthorized = !this.info.replyTo;
      this.isCommentAuthor = window.authorized.fullName &&
        window.authorized.fullName === this.info.author.fullName;
    }
    VueBus.$on('closeComment', (data) => {
      if (data.current !== this.$props.info.id) {
        this.comment = '';
        this.answerVisible = false;
        this.reply = true;
      }
    });
  },
};
