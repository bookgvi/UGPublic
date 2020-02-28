class Grayscale {
  constructor(parent) {
    this.parent = parent;
    const needToFix = /(MSIE 10)|(Trident.*rv:11\.0)|( Edge\/[\d\.]+$)/.test(window.navigator.userAgent);

    if (needToFix) {
      document.addEventListener('DOMContentLoaded', () => {
        this.initGrayscale();
      });
    }
  }

  initGrayscale() {
    const tmpImage = new window.Image();
    tmpImage.onload = () => {
      const imgWrapper = document.createElement('span');
      const svgTemplate =
        `<svg xmlns="http://www.w3.org/2000/svg" id="svgroot" viewBox="0 0 ${tmpImage.width} ${tmpImage.height}">` +
        '<defs>' +
        '<filter id="gray">' +
        '<feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" />' +
        '</filter>' +
        '</defs>' +
        `<image filter="url(&quot;#gray&quot;)" x="0" y="0" width="${tmpImage.width}" height="${tmpImage.height}" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${tmpImage.src}" />` +
        '</svg>';

      imgWrapper.innerHTML = svgTemplate;
      imgWrapper.className = 'grayscale__fix';
      this.parent.parentNode.insertBefore(imgWrapper, this.parent);

      this.parent.style.cssText += 'display:block';
      imgWrapper.querySelector('svg').style.position = 'absolute';
      imgWrapper.style.cssText = 'display:inline-block;position:relative;';
      imgWrapper.appendChild(this.parent);
    };
    tmpImage.src = this.parent.src;
  }
}

export default Grayscale;
