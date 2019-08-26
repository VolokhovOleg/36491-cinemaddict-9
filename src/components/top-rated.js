import {createElement} from './../utils.js';

export class TopRated {
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
    return `<section class="films-list--extra">
  <h2 class="films-list__title">Top rated</h2>

  <div class="films-list__container"></div>
</section>`;
  }
}
