import {render, unrender} from "../utils";
import {NoSearchResult} from "../components/no-search-message";

export class SearchController {
  constructor(searchPhrase, totalCardsAmount, cards, renderCards) {
    this._cards = cards;
    this._totalCardsAmount = totalCardsAmount;
    this._searchPhrase = searchPhrase;
    this._renderCards = renderCards;
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
    let searchedCards = this._cards.filter((element) => pattern.exec(element.title) !== null);
    this._totalCardsAmount = searchedCards.length;
    this._renderCards(searchedCards);

    mainNavigation.classList.add(`visually-hidden`);
    sort.classList.add(`visually-hidden`);
    searchResult.classList.remove(`visually-hidden`);
    unrender(noSearchResultMessage);

    if (this._totalCardsAmount === 0) {
      render(filmsList, new NoSearchResult().getElement());
      filmsListContainer.classList.add(`visually-hidden`);
    }

    extraCardsContainer.forEach((item) => item.classList.add(`visually-hidden`));

    const searchResultCount = searchResult.querySelector(`.result__count`);
    searchResultCount.textContent = this._totalCardsAmount;
  }

  // Метод отмены поиска
  cancelSearch() {
    const mainNavigation = document.querySelector(`.main-navigation`);
    const sort = document.querySelector(`.sort`);
    const searchResult = document.querySelector(`.result`);
    const filmsListContainer = document.querySelector(`.films-list__container`);
    const extraCardsContainer = document.querySelectorAll(`.films-list--extra`);
    const noSearchResultMessage = document.querySelector(`.no-result`);

    let searchedCards = this._cards;
    this._totalCardsAmount = searchedCards.length;
    this._renderCards(searchedCards);

    mainNavigation.classList.remove(`visually-hidden`);
    sort.classList.remove(`visually-hidden`);
    searchResult.classList.add(`visually-hidden`);
    filmsListContainer.classList.remove(`visually-hidden`);
    extraCardsContainer.forEach((item) => item.classList.remove(`visually-hidden`));
    unrender(noSearchResultMessage);
  }
}
