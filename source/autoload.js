import 'svgxuse';
import objectFitImages from 'object-fit-images';
import Grayscale from './blocks/grayscale/grayscale';
import Header from './blocks/dev/header/';
import FAQ from './blocks/dev/faq';
import Messages from './blocks/dev/messages';
import ReviewsItem from './blocks/reviews-item';
import Location from './blocks/location';
import Footer from './blocks/dev/footer';
import Wysiwyg from './blocks/wysiwyg/wysiwyg';
import OrderList from './blocks/order/order-list/order-list';
import Contacts from './blocks/contacts/contacts';
import SocialShare from './blocks/social/index';
import LeftMenu from './blocks/leftMenu/leftMenu';
import Catalog from './blocks/catalog/catalog';
import FiltersList from './blocks/filters/list/filters-list';
import ProfileSettings from './blocks/profile/settings/profile-settings';
import Home from './blocks/home/home';
import FormSelect from './blocks/form/select/form-select';
import CommentsRate from './blocks/comments/rate/comments-rate';
import LocationSimilar from './blocks/location/similar/location-similar';
import LocationPage from './blocks/location/page/location-page';
import CoreSticky from './blocks/core/sticky/core-sticky';
import Checkout from './blocks/checkout/checkout';
import FormInput from './blocks/form/input/form-input';
import LocationHallPage from './blocks/location/hall/location-hall-page';
import Registration from './blocks/registration/registration';
import Login from './blocks/login/login';
import Comments from './blocks/comments/comments';

require('./autoload.scss');

/* eslint-disable */
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}
/* eslint-enable */

objectFitImages();

[].slice.call(document.querySelectorAll('.grayscale__el')).forEach((item) => {
  new Grayscale(item);
});

[].slice.call(document.querySelectorAll('.dev-header')).forEach((el) => {
  new Header(el);
});

[].slice.call(document.querySelectorAll('.dev-faq')).forEach((el) => {
  new FAQ(el);
});

[].slice.call(document.querySelectorAll('.dev-messages')).forEach((el) => {
  new Messages(el);
});

[].slice.call(document.querySelectorAll('.reviews-item')).forEach((el) => {
  new ReviewsItem(el);
});

[].slice.call(document.querySelectorAll('.location')).forEach((el) => {
  new Location(el);
});

[].slice.call(document.querySelectorAll('.dev-footer')).forEach((el) => {
  new Footer(el);
});

[].slice.call(document.querySelectorAll('.wysiwyg')).forEach((item) => {
  new Wysiwyg(item);
});

[].slice.call(document.querySelectorAll('.order-list')).forEach((item) => {
  new OrderList(item);
});

[].slice.call(document.querySelectorAll('.contacts__map-container')).forEach((item) => {
  new Contacts(item);
});

[].slice.call(document.querySelectorAll('.social')).forEach((item) => {
  new SocialShare(item);
});

[].slice.call(document.querySelectorAll('.terms')).forEach((item) => {
  new LeftMenu(item);
});

[].slice.call(document.querySelectorAll('.catalog')).forEach((item) => {
  new Catalog(item);
});

[].slice.call(document.querySelectorAll('.filters-list')).forEach((item) => {
  new FiltersList(item);
});

[].slice.call(document.querySelectorAll('.profile-settings')).forEach((item) => {
  new ProfileSettings(item);
});

[].slice.call(document.querySelectorAll('.home')).forEach((item) => {
  new Home(item);
});

[].slice.call(document.querySelectorAll('.location-page')).forEach((item) => {
  new LocationPage(item);
});

[].slice.call(document.querySelectorAll('.profile-settings')).forEach((item) => {
  new ProfileSettings(item);
});

[].slice.call(document.querySelectorAll('.form-select:not(.form-select--vue)')).forEach((item) => {
  new FormSelect(item);
});

[].slice.call(document.querySelectorAll('.comments-rate')).forEach((item) => {
  new CommentsRate(item);
});

[].slice.call(document.querySelectorAll('.location-similar__slider')).forEach((item) => {
  new LocationSimilar(item);
});

[].slice.call(document.querySelectorAll('.checkout')).forEach((item) => {
  new Checkout(item);
});

[].slice.call(document.querySelectorAll('input[type=tel]')).forEach((item) => {
  new FormInput(item, 'tel');
});

[].slice.call(document.querySelectorAll('input[data-type="date"]')).forEach((item) => {
  new FormInput(item, 'date');
});

[].slice.call(document.querySelectorAll('.location-hall-page')).forEach((item) => {
  new LocationHallPage(item);
});

[].slice.call(document.querySelectorAll('.comments')).forEach((item) => {
  new Comments(item);
});

const registr = document.querySelector('.registration');
if (registr) {
  new Registration(registr);
}

const loginBlock = document.querySelector('.login');
if (loginBlock) {
  new Login(loginBlock);
}

const preventDefault = (e) => {
  const ev = e || window.event;
  if (ev.preventDefault) {
    ev.preventDefault();
  }

  ev.returnValue = false;
};

const disableScroll = () => {
  if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  }

  window.onwheel = preventDefault;
  window.onmousewheel = preventDefault;
  document.onmousewheel = preventDefault;
  window.ontouchmove = preventDefault;
};

const enableScroll = () => {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
  }

  window.onmousewheel = null;
  document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
};

document.addEventListener('logicData', (event) => {
  if (event.detail.type === 'toggleOverlay') {
    if (event.detail.isShow === true) {
      document.body.classList.add('overlay');
      disableScroll();
    } else {
      document.body.classList.remove('overlay');
      enableScroll();
    }
  }
});
window.$(() => {
  [].slice.call(document.querySelectorAll('.sticky-polifill')).forEach((item) => {
    new CoreSticky(item);
  });
});
