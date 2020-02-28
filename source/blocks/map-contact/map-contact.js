class MapContact {
  constructor(parent) {
    this.parent = parent;
    this.tab = [].slice.call(this.parent.querySelectorAll('.map-contact__tab'));
    this.tab_text = [].slice.call(this.parent.querySelectorAll('.map-contact__wrp-text'));
    this.maps = [].slice.call(this.parent.querySelectorAll('#map'));

    this.tab.forEach((item) => {
      item.addEventListener('click', () => {
        if (!item.classList.contains('map-contact__tab--active')) {
          for (let i = 0; i < this.tab.length; i += 1) {
            if (this.tab[i].classList.contains('map-contact__tab--active')) {
              this.tab[i].classList.remove('map-contact__tab--active');
            }
          }

          item.classList.add('map-contact__tab--active');

          for (let i = 0; i < this.tab_text.length; i += 1) {
            this.tab_text[i].classList.remove('map-contact__wrp-text--active');

            if (this.tab_text[i].getAttribute('data-route') === item.getAttribute('data-route')) {
              this.tab_text[i].classList.add('map-contact__wrp-text--active');
            }
          }
        }
      });
    });

    this.maps.forEach((element) => {
      this.lat = Number(element.getAttribute('data-lat'));
      this.lon = Number(element.getAttribute('data-lon'));

      window.ymaps.ready(() => {
        const mapLocation = new window.ymaps.Map(element, {
          center: [this.lat, this.lon],
          zoom: 15,
          controls: [],
        });

        const locationGeoObject = new window.ymaps.GeoObject({
          geometry: {
            type: 'Point',
            coordinates: [this.lat, this.lon],
          },
        });

        mapLocation.geoObjects.add(locationGeoObject);
      });
    });
  }
}

export default MapContact;
