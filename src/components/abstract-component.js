import {createElement} from './../utils';

class AbstractComponent {
  constructor() {
    this._element = null;

    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    return (this._element = null);
  }

  getTemplate() {
    throw Error(`Abstract method not implemented`);
  }
}

export default AbstractComponent;
