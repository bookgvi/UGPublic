class Map {
  constructor(parent) {
    this.parent = parent;
    this.closeMap();

    window.ymaps.ready(() => {
      const mapCity = new window.ymaps.Map(this.parent, {
        center: [55.750336, 37.632151],
        zoom: 13,
        controls: [],
        behaviors: ['default', 'scrollZoom'],
      });

      const zoomControl = new window.ymaps.control.ZoomControl({
        options: {
          size: 'small',
          position: {
            top: 20,
            left: 20,
          },
        },
      });

      const objectManager = new window.ymaps.ObjectManager({
        clusterize: true,
        gridSize: 30,
      });

      mapCity.geoObjects.add(objectManager);
      mapCity.controls.add(zoomControl);

      mapCity.events.add('click', () => {
        mapCity.balloon.close();
      });

      /* window.$.ajax({
        url: './markers/map_locations.json',
      }).done((data) => {
        objectManager.add(data);
      }); */
      this.objectManager = objectManager;
    });
  }

  setNewMarkers(data) {
    if (this.objectManager) {
      this.objectManager.removeAll();
      this.objectManager.add(data.map(item => item.feature));
    }
  }

  closeMap() {
    const preventScroll = (e) => {
      e.preventDefault();
    };

    const btnClose = this.parent.querySelector('.map__close');
    const btnFiltersItem = [].slice.call(document.querySelectorAll('.filters-checkbox'));

    btnClose.addEventListener('click', () => {
      if (this.parent.classList.contains('map--visible')) {
        this.parent.classList.remove('map--visible');
        document.body.removeEventListener('touchmove', preventScroll);
      }

      btnFiltersItem.forEach((element) => {
        const checkbox = element.querySelector('.filters-checkbox__switch');

        if (checkbox.classList.contains('filters-checkbox__switch--active')) {
          checkbox.classList.remove('filters-checkbox__switch--active');
        }

        if (element.classList.contains('filters-item--open')) {
          element.classList.remove('filters-item--open');
          this.listFilters = document.querySelector('.filters-list');
          this.listFilters.style.zIndex = '';
        }
      });
    });
  }
}

export default Map;
