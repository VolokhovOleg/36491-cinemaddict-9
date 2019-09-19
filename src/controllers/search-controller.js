import {render, unrender} from '../utils.js';
import {NoSearchResult} from '../components/no-search-message.js';

export class SearchController {
  constructor(searchPhrase, cards) {
    this._cards = cards;
    this._searchPhrase = searchPhrase;
    this._mainNavigation = document.querySelector(`.main-navigation`);
    this._sort = document.querySelector(`.sort`);
    this._searchResult = document.querySelector(`.result`);
    this._filmsList = document.querySelector(`.films-list`);
    this._filmsListContainer = document.querySelector(`.films-list__container`);
    this._extraCardsContainer = document.querySelectorAll(`.films-list--extra`);
    this._noSearchResultMessage = document.querySelector(`.no-result`);
  }

  // Метод поиска фильма
  searchFilm() {
    const pattern = new RegExp(this._searchPhrase, `i`);

    this._mainNavigation.classList.add(`visually-hidden`);
    this._sort.classList.add(`visually-hidden`);
    this._searchResult.classList.remove(`visually-hidden`);
    unrender(this._noSearchResultMessage);

    this._extraCardsContainer.forEach((item) => item.classList.add(`visually-hidden`));

    const searchResultCount = this._searchResult.querySelector(`.result__count`);
    let arr = this._cards.filter((element) => pattern.exec(element.title) !== null);

    if (arr.length === 0) {
      render(this._filmsList, new NoSearchResult().getElement());
      this._filmsListContainer.classList.add(`visually-hidden`);
    }

    searchResultCount.textContent = arr.length;

    return arr;
  }

  // Метод отмены поиска
  cancelSearch() {
    this._mainNavigation.classList.remove(`visually-hidden`);
    this._sort.classList.remove(`visually-hidden`);
    this._searchResult.classList.add(`visually-hidden`);
    this._filmsListContainer.classList.remove(`visually-hidden`);
    this._extraCardsContainer.forEach((item) => item.classList.remove(`visually-hidden`));
    unrender(this._noSearchResultMessage);
  }
}
