import imageCaption from '../../ajax/imageCaption.pug';

class Wysiwyg {
  constructor(parent) {
    Wysiwyg.createImages(parent);
  }
  static createImages(parent) {
    const images = [].slice.call(parent.querySelectorAll('img'));
    if (images) {
      images.forEach((img) => {
        const params = {
          title: img.title,
          src: img.src,
          align: img.align,
          attribute: {
            style: '',
          },
        };
        if (img.getAttribute('width') > 0) {
          params.attribute.style += `width:${img.width}px;`;
        }
        if (img.getAttribute('height') > 0) {
          params.attribute.style += `height:${img.height}px;`;
        }
        img.insertAdjacentHTML('beforeBegin', imageCaption({ params }));
        img.parentElement.removeChild(img);
      });
    }
  }
}

export default Wysiwyg;
