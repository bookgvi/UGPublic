import Stickyfill from 'stickyfilljs';

class CoreSticky {
  constructor(parent) {
    this.elements = parent;
    Stickyfill.add(this.elements);
  }
}

export default CoreSticky;
