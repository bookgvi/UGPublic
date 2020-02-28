import Axios from 'axios';

class LocationInfoFavorite {
  constructor(parent) {
    this.mainBlock = parent.querySelector('.location-info__favorite-wrapper');
    this.textItem = parent.querySelector('.location-info__favorite-text');
    this.svgContainer = [].slice.call(parent.querySelectorAll('.location-info__svg'));

    this.mainBlock.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.svgContainer[0].classList.contains('location-info__svg--hidden')) {
        this.addLike();
      } else {
        this.removeLike();
      }
    });
  }

  addLike() {
    let api = '/front/v1.0/locations/favorites';
    // eslint-disable-next-line no-undef
    if (IS_DEV) {
      api = '/api/comments.json';
    }
    Axios.post(api, {
      studio: window.comments.studioID,
    }).then((response) => {
      if (response.status === 200) {
        this.svgContainer[0].classList.remove('location-info__svg--hidden');
        this.svgContainer[1].classList.add('location-info__svg--hidden');
        this.textItem.innerHTML = 'В избранном';
      }
    });
  }

  removeLike() {
    let api = '/front/v1.0/locations/favorites';
    // eslint-disable-next-line no-undef
    if (IS_DEV) {
      api = '/api/comments.json';
    }
    Axios.delete(api, {
      data: {
        studio: window.comments.studioID,
      },
    }).then((response) => {
      if (response.status === 200) {
        this.svgContainer[1].classList.remove('location-info__svg--hidden');
        this.svgContainer[0].classList.add('location-info__svg--hidden');
        this.textItem.innerHTML = 'В избранное';
      }
    });
  }
}

export default LocationInfoFavorite;
