import {render, unrender} from '../utils.js';
import {NoSearchResult} from '../components/no-search-message.js';

export class SearchController {
  constructor(searchPhrase, cards) {
    this._cards = cards;
    this._searchPhrase = searchPhrase;
  }

  // Метод поиска фильма
  searchFilm() {
    const mainNavigation = document.querySelector(`.main-navigation`);
    const sort = document.querySelector(`.sort`);
    const searchResult = document.querySelector(`.result`);
    const filmsList = document.querySelector(`.films-list`);
    const filmsListContainer = document.querySelector(`.films-list__container`);
    const extraCardsContainer = document.querySelectorAll(`.films-list--extra`);
    const noSearchResultMessage = document.querySelector(`.no-result`);

    let pattern = new RegExp(this._searchPhrase, `i`);

    mainNavigation.classList.add(`visually-hidden`);
    sort.classList.add(`visually-hidden`);
    searchResult.classList.remove(`visually-hidden`);
    unrender(noSearchResultMessage);

    extraCardsContainer.forEach((item) => item.classList.add(`visually-hidden`));

    const searchResultCount = searchResult.querySelector(`.result__count`);
    let arr = this._cards.filter((element) => pattern.exec(element.title) !== null);

    if (arr.length === 0) {
      render(filmsList, new NoSearchResult().getElement());
      filmsListContainer.classList.add(`visually-hidden`);
    }

    searchResultCount.textContent = arr.length;

    return arr;
  }

  // Метод отмены поиска
  cancelSearch() {
    const mainNavigation = document.querySelector(`.main-navigation`);
    const sort = document.querySelector(`.sort`);
    const searchResult = document.querySelector(`.result`);
    const filmsListContainer = document.querySelector(`.films-list__container`);
    const extraCardsContainer = document.querySelectorAll(`.films-list--extra`);
    const noSearchResultMessage = document.querySelector(`.no-result`);

    mainNavigation.classList.remove(`visually-hidden`);
    sort.classList.remove(`visually-hidden`);
    searchResult.classList.add(`visually-hidden`);
    filmsListContainer.classList.remove(`visually-hidden`);
    extraCardsContainer.forEach((item) => item.classList.remove(`visually-hidden`));
    unrender(noSearchResultMessage);
  }
}
