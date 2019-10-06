import {render, unrender} from '../utils.js';
import _ from 'lodash';
import NoSearchResult from '../components/no-search-message.js';

class SearchController {
  constructor() {
    this._mainNavigation = document.querySelector(`.main-navigation`);
    this._sort = document.querySelector(`.sort`);
    this._searchResult = document.querySelector(`.result`);
    this._filmsList = document.querySelector(`.films-list`);
    this._extraCardsContainer = document.querySelectorAll(`.films-list--extra`);
    this._noSearchResultMessage = document.querySelector(`.no-result`);
  }

  searchFilm(searchPhrase, cards) {
    const pattern = new RegExp(searchPhrase, `i`);

    this._mainNavigation.classList.add(`visually-hidden`);
    this._sort.classList.add(`visually-hidden`);
    this._searchResult.classList.remove(`visually-hidden`);
    unrender(this._noSearchResultMessage);

    this._extraCardsContainer.forEach((item) => item.classList.add(`visually-hidden`));

    const searchResultCount = this._searchResult.querySelector(`.result__count`);
    const findingCards = cards.filter((element) => pattern.exec(element.title) !== null);

    if (_.size(findingCards) === 0) {
      render(this._filmsList, new NoSearchResult().getElement());
    }

    searchResultCount.textContent = _.size(findingCards);

    return findingCards;
  }

  cancelSearch() {
    const navigationDefaultLink = document.querySelector(`.main-navigation__item[href="#all"]`);
    const navigationLinks = document.querySelectorAll(`.main-navigation__item`);

    navigationLinks.forEach((link) => link.classList.remove(`main-navigation__item--active`));
    navigationDefaultLink.classList.add(`main-navigation__item--active`);

    this._mainNavigation.classList.remove(`visually-hidden`);
    this._sort.classList.remove(`visually-hidden`);
    this._searchResult.classList.add(`visually-hidden`);
    this._extraCardsContainer.forEach((item) => item.classList.remove(`visually-hidden`));
    unrender(this._noSearchResultMessage);
  }
}

export default SearchController;
