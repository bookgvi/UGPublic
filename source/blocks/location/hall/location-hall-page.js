import MapContact from '../../map-contact/map-contact';
import Anchors from '../../../blocks/core/scroll/anhors';
import LocationGallery from '../gallery/location-gallery';
import LocationDropdownText from '../dropdownText/location-dropdownText';
import LocationPavilions from '../pavilions/location-pavilions';
import LocationPavilionSlider from '../pavilions/location-pavilion-slider';
import LocationRate from '../rate/location-rate';
import LocationEquipments from '../equipments/location-equipments';
import LocationInputNumber from '../inputNumber/inputNumber';
import AdditionalService from '../additionalService/additionalService';
import LocationDropdown from '../dropdown/location-dropdown';
import LocationDropdownHistogram from '../dropdown/location-dropdown-histogram';
import LocationBookingCalendar from '../booking/location-booking';

class LocationHallPage {
  constructor(parent) {
    this.bookUp = parent.querySelector('.location-hall-page__book-up');
    this.locationGallery = parent.querySelector('.location-gallary');
    this.locationInfo = parent.querySelector('.location-info');
    this.locationBookingCalendar = parent.querySelector('.location-booking');
    this.locationDropdown = [].slice.call(parent.querySelectorAll('.location-dropdown:not(.location-dropdown--date)'));
    this.additionalService = parent.querySelector('.location-additionalService');
    this.locationInputNumber = parent.querySelector('.location-inputNumber');
    this.locationEquipments = parent.querySelector('.location-equipments');
    this.locationPavilions = parent.querySelector('.location-pavilions');
    this.locationDropdownText = parent.querySelector('.location-dropdownText');
    this.mapContacts = [].slice.call(parent.querySelectorAll('.map-contact'));
    this.scrollBtn = parent.querySelector('.js-scroll-to');
    this.commentRateValue = parent.querySelector('.comments__rate-wrapper .location-rate__rating-num');
    const locationHallInfo = window.$('#locationHallInfo');
    const locationHallComments = window.$('#locationHallComments');
    this.header = document.querySelector('header');
    this.typeWindow = this.constructor.checkWindowWidth();
    this.allClasses();
    if (this.scrollBtn) {
      this.scrollEvent();
    }

    if (locationHallInfo) {
      locationHallInfo.rateYo({
        rating: 4.5,
        halfStar: true,
        normalFill: '#e5eef0',
        ratedFill: '#81aeb6',
        starWidth: '26px',
        spacing: '14px',
        readOnly: true,
      });
    }

    if (locationHallComments) {
      locationHallComments.rateYo({
        rating: 5,
        fullStar: true,
        normalFill: '#e5eef0',
        ratedFill: '#81aeb6',
        starWidth: '26px',
        spacing: '14px',
        onChange: (rating) => {
          this.commentRateValue.innerHTML = rating;
        },
      });
    }

    this.mapContacts.forEach((item) => {
      if (item) {
        new MapContact(item);
      }
    });

    window.$(() => {
      this.stickyBlock();
      window.addEventListener('resize', () => {
        const flag = this.constructor.checkWindowWidth();

        if (flag !== this.typeWindow) {
          this.typeWindow = flag;

          this.stickyBlock();
        }
      });
    });
  }

  static checkWindowWidth() {
    let typeWindow = '';
    if (window.innerWidth < 1920) {
      typeWindow = 'normal';
    } else {
      typeWindow = 'large';
    }

    return typeWindow;
  }

  scrollEvent() {
    this.scrollBtn.addEventListener('click', (event) => {
      event.preventDefault();
      new Anchors(this.scrollBtn);
    });
  }

  allClasses() {
    if (this.locationGallery) {
      new LocationGallery(this.locationGallery);
    }
    if (this.locationDropdownText) {
      new LocationDropdownText(this.locationDropdownText);
    }
    if (this.locationPavilions) {
      new LocationPavilions(this.locationPavilions);
    }
    if (this.locationPavilions) {
      new LocationPavilionSlider(this.locationPavilions);
    }
    if (this.locationInfo) {
      new LocationRate(this.locationInfo);
    }
    if (this.locationEquipments) {
      new LocationEquipments(this.locationEquipments);
    }
    if (this.locationInputNumber) {
      new LocationInputNumber(this.locationInputNumber);
    }
    if (this.additionalService) {
      new AdditionalService(this.additionalService);
    }
    if (this.locationDropdown.length > 0) {
      this.locationDropdown.forEach((item) => {
        new LocationDropdown(item);
      });
    }
    if (this.locationBookingCalendar) {
      new LocationDropdownHistogram(this.locationBookingCalendar);
    }
    if (this.locationBookingCalendar) {
      new LocationBookingCalendar(this.locationBookingCalendar);
    }
  }

  stickyBlock() {
    if (this.typeWindow === 'large') {
      this.bookUp.style.top = `${this.header.offsetHeight}px`;
    } else {
      const topSize = window.innerHeight - window.$(this.bookUp).height();
      this.bookUp.style.top = `${topSize}px`;
    }
  }
}

export default LocationHallPage;
