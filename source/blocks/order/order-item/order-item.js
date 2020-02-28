class OrderItem {
  constructor(parent) {
    this.parent = parent;
    const orderItem = this.parent.parentNode;
    const orderContent = orderItem.querySelector('.order-item__content');

    this.parent.onclick = () => {
      if (!this.parent.parentNode.classList.contains('order-item--open')) {
        this.orderItemOpen = document.querySelectorAll('.order-item--open');

        for (let i = 0; i < this.orderItemOpen.length; i += 1) {
          this.orderItemOpen[i].classList.remove('order-item--open');
          this.orderItemOpen[i].querySelector('.order-item__content').style.maxHeight = null;
        }

        this.parent.parentNode.classList.add('order-item--open');
        orderContent.style.maxHeight = `${orderContent.scrollHeight}px`;
      } else {
        this.parent.parentNode.classList.remove('order-item--open');
        orderContent.style.maxHeight = null;
      }
    };
  }
}

export default OrderItem;
