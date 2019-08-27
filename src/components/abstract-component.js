import {createElement} from './../utils';

export class AbstractComponent {
  constructor() {
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
