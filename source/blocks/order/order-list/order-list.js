import OrderItem from '../order-item/order-item';
import MapContact from '../../map-contact/map-contact';

class OrderList {
  constructor(parent) {
    this.parent = parent;

    [].slice.call(this.parent.querySelectorAll('.order-item__header')).forEach((el) => {
      new OrderItem(el);
    });

    [].slice.call(this.parent.querySelectorAll('.map-contact')).forEach((item) => {
      new MapContact(item);
    });
  }
}

export default OrderList;
