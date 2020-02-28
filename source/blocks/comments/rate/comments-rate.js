import Rating from 'rating';

class CommentsRate {
  constructor(parent) {
    this.starContainer = parent.querySelector('.comments-rate__star-section');
    this.input = parent.querySelector('.comments-rate__input');
    this.spanResult = parent.querySelector('.comments-rate__value');
    this.star = undefined;

    if (this.input && this.starContainer) {
      this.ratio = new Rating([1, 2, 3, 4, 5], {
        container: this.starContainer,
        star: this.star,
      });

      this.ratio.set(Number(this.input.value));

      this.ratio.on('rate', (weight) => {
        this.spanResult.innerHTML = weight;
      });
    }
  }
}

export default CommentsRate;
