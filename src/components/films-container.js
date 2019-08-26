import {createElement} from './../utils.js';

export class FilmsContainer {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<section class="films"></section>`;
  }
}
