import {createElement} from './../utils.js';

export class Menu {
  constructor({watchList, history, favorite}) {
    this._watchList = watchList;
    this._history = history;
    this._favorite = favorite;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this._watchList}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${this._history}</span></a>
  <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this._favorite}</span></a>
  <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
</nav>`;
  }
}
