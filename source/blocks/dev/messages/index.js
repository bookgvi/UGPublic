import PerfectScrollbar from 'perfect-scrollbar';

class Messages {
  constructor(parent) {
    this.parent = parent;
    this.textarea = this.parent.querySelector('.dev-messages__textarea');
    this.btn = this.parent.querySelector('.form-button__button');
    this.listMessages = this.parent.querySelector('.dev-messages__list');
    this.chats = this.parent.querySelectorAll('.dev-messages__wrapper-chat');
    this.chatOpen = this.parent.querySelector('.dev-messages__wrapper-chat--open');
    this.messages = [].slice.call(this.parent.querySelectorAll('.dev-message:not(.dev-messages__dialog-header)'));
    this.title = this.parent.querySelector('.dev-messages__dialog-header .dev-message__name');
    this.detailMessage = this.parent.querySelector('.dev-messages__dialog');
    this.exitMessage = this.parent.querySelector('.dev-message__arrow-back');
    this.resize = false;
    this.chatScroll = undefined;

    this.chatScroll = new PerfectScrollbar(this.chatOpen);
    new PerfectScrollbar(this.listMessages, {
      wheelSpeed: 15,
    });
    new PerfectScrollbar(this.textarea);

    this.messages.forEach((element) => {
      const el = element;

      el.addEventListener('click', (e) => {
        const elem = e.currentTarget;
        const elementClass = elem.className;
        const elementClassArr = elementClass.split(' ');

        for (let i = 0; i < elementClassArr.length; i += 1) {
          if (elementClassArr[0] !== elementClassArr[i]) {
            elem.classList.remove(elementClassArr[i]);
          }
        }

        for (let i = 0; i < this.messages.length; i += 1) {
          if (this.messages[i].classList.contains('dev-message--selected')) {
            this.messages[i].classList.remove('dev-message--selected');
            this.messages[i].classList.add('dev-message--read');
          }
        }

        for (let i = 0; i < this.chats.length; i += 1) {
          if (this.chats[i].classList.contains('dev-messages__wrapper-chat--open')) {
            this.chats[i].classList.remove('dev-messages__wrapper-chat--open');
          }

          if (this.chats[i].getAttribute('data-name') === elem.getAttribute('data-name')) {
            this.chats[i].classList.add('dev-messages__wrapper-chat--open');
            setTimeout(() => {
              this.chatScroll = new PerfectScrollbar(this.chats[i]);
            }, 500);
            this.title.innerHTML = this.chats[i].getAttribute('data-name');
          }
        }

        elem.classList.add('dev-message--selected');

        if (window.innerWidth <= 767) {
          this.detailMessage.classList.add('dev-messages__dialog--open');
          document.body.classList.add('disabled');
        }
      });
    });

    this.exitMessage.addEventListener('click', () => {
      this.detailMessage.classList.remove('dev-messages__dialog--open');
      document.body.classList.remove('disabled');
    });

    this.textarea.addEventListener('keyup', () => {
      const stringTextarea = this.textarea.value;

      if (stringTextarea !== '') {
        if (this.btn.getAttribute('disabled')) {
          this.btn.removeAttribute('disabled');
        }
      } else if (stringTextarea === '') {
        this.btn.setAttribute('disabled', 'disabled');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) {
        this.resize = true;
        if (this.detailMessage.classList.contains('dev-messages__dialog--open')) {
          this.detailMessage.classList.remove('dev-messages__dialog--open');
          document.body.classList.remove('disabled');
        }
      }
    });
  }
}

export default Messages;
