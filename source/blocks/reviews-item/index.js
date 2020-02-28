import Rating from 'rating';

class ReviewsItem {
  constructor(parent) {
    this.parent = parent;

    const starContainer = this.parent.querySelector('.reviews-item__rating');
    const star = this.parent.querySelector('.reviews-item__rating-star');

    const itemMoods = [].slice.call(this.parent.querySelectorAll('.reviews-item__item'));

    itemMoods.forEach((el) => {
      el.addEventListener('click', () => {
        const coutn = el.querySelector('.reviews-item__count');

        if (el.classList.contains('reviews-item__item--click')) {
          el.classList.remove('reviews-item__item--click');
          coutn.innerHTML = Number(coutn.innerHTML) - 1;
        } else {
          for (let i = 0; i < itemMoods.length; i += 1) {
            const coutnActive = itemMoods[i].querySelector('.reviews-item__count');

            if (itemMoods[i].classList.contains('reviews-item__item--click')) {
              itemMoods[i].classList.remove('reviews-item__item--click');
              coutnActive.innerHTML = Number(coutnActive.innerHTML) - 1;
            }
          }

          el.classList.add('reviews-item__item--click');
          coutn.innerHTML = Number(coutn.innerHTML) + 1;
        }
      });
    });

    new Rating([1, 2, 3, 4, 5], {
      container: starContainer,
      star,
    });
  }
}

export default ReviewsItem;
