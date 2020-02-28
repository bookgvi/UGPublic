import JSShare from 'js-share';

class SocialShare {
  constructor(parent) {
    const shareItems = parent.querySelectorAll('.social__network');

    for (let i = 0; i < shareItems.length; i += 1) {
      shareItems[i].addEventListener('click', function share(e) {
        e.preventDefault();
        return JSShare.go(this);
      });
    }
  }
}

export default SocialShare;
