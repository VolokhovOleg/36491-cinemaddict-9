import {createElement} from './../utils.js';

export class NoFilms {
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
    return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="no-result">
        There is no movies for your request.
      </div>
    </section>
  </section>`;
  }
}
