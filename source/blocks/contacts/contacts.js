class Contacts {
  constructor(parent) {
    this.parent = parent;
    this.lat = Number(this.parent.getAttribute('data-lat'));
    this.lon = Number(this.parent.getAttribute('data-lon'));

    window.ymaps.ready(() => {
      const mapLocation = new window.ymaps.Map(this.parent, {
        center: [this.lon, this.lat],
        zoom: 15,
        controls: [],
      });

      const locationGeoObject = new window.ymaps.GeoObject({
        geometry: {
          type: 'Point',
          coordinates: [this.lon, this.lat],
        },
      });

      mapLocation.geoObjects.add(locationGeoObject);
    });
  }
}

export default Contacts;

