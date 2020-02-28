import Rating from 'rating';

class LocationRate {
  constructor(parent) {
    this.starContainer = parent.querySelector('.location-rate__rating-stars');

    new Rating([1, 2, 3, 4, 5], {
      container: this.starContainer,
    });
  }
}

export default LocationRate;
