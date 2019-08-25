import {createElement} from './../utils.js';

export class FooterStats {
  constructor(allMovies) {
    this._allMovies = allMovies;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<p>${this._allMovies} movies inside</p>`;
  }
}
