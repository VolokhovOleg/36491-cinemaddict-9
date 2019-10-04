import {render, unrender, _, moment} from '../utils.js';
import {NoFilms} from '../components/no-films.js';
import {FilmsContainer} from '../components/films-container.js';
import {FooterStats} from '../components/footer-stats.js';
import {FilmsList} from '../components/films-list.js';
import {TopRated} from '../components/top-rated.js';
import {MostCommented} from '../components/most-commented.js';
import {MovieController} from './movie-controller.js';
import {SearchController} from './search-controller.js';
import {StatisticController} from './statistic-controller.js';
import {setProfileRate} from './../main.js';

const cardsAmount = {
  DEFAULT: 5,
  EXTRA: 2,
};
const sortProperty = {
  DEFAULT: `default`,
  DATE: `releaseDate`,
  RATING: `rating`,
};
const filterProperty = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};
const extraProperty = {
  TOP_RATED: `top rated`,
  MOST_COMMENTED: `top commented`,
};
const MIN_PHRASE_LENGTH = 3;

export class PageController {
  constructor(cards, Sort, LoadMoreBtn, SearchResult) {
    this._container = document.querySelector(`.main`);
    this._statisticBlock = document.querySelector(`.statistic`);
    this._sortBlock = null;
    this._filmBlock = null;
    this._cards = cards;
    this._totalCardsAmount = _.size(this._cards);
    this._renderAmount = cardsAmount.DEFAULT;
    this._Sort = new Sort();
    this._LoadMoreBtnTemplate = new LoadMoreBtn().getElement();
    this._SearchResult = new SearchResult();
    this._statisticController = new StatisticController(this._cards);
    this._onChangeView = this.onChangeView.bind(this);
    this._renderCards = this.renderCards.bind(this);
    this._setProfileRate = setProfileRate;
    this._currentSort = sortProperty.DEFAULT;
    this._currentFilter = filterProperty.ALL;
    this._phrase = ``;
    this._renderIndex = {
      min: 0,
      max: 5,
    };
    this._subscriptions = [];
    this._isStatisticsShowed = false;
  }

  init() {
    if (this._totalCardsAmount < 1) {
      render(this._container, new NoFilms().getElement());
    } else {
      const footerStats = document.querySelector(`.footer__statistics`);

      render(this._container, this._Sort.getElement());

      this._sortBlock = document.querySelector(`.sort`);
      const sortLinks = document.querySelectorAll(`.sort__button`);

      render(this._container, this._SearchResult.getElement());

      this._setProfileRate();

      sortLinks.forEach((link) => {
        link.addEventListener(`click`, (evt) => {
          evt.preventDefault();

          if (!link.classList.contains(`sort__button--active`)) {
            sortLinks.forEach((elem) => {
              elem.classList.remove(`sort__button--active`);
            });

            link.classList.add(`sort__button--active`);
            const sortAttr = link.getAttribute(`data-sort`);

            switch (sortAttr) {
              case sortProperty.DEFAULT :
                this._currentSort = sortProperty.DEFAULT;
                break;
              case sortProperty.DATE:
                this._currentSort = sortProperty.DATE;
                break;
              case sortProperty.RATING:
                this._currentSort = sortProperty.RATING;
                break;
              default:
                this._currentSort = sortProperty.DEFAULT;
            }

            this.resetLoadMoreBtn();
            this._renderCards();
          }
        });
      });

      render(this._container, new FilmsContainer().getElement());
      this._filmBlock = document.querySelector(`.films`);

      render(footerStats, new FooterStats(this._totalCardsAmount).getElement());

      render(this._filmBlock, new FilmsList().getElement());
      const filmsList = document.querySelector(`.films-list`);

      if (this._totalCardsAmount > cardsAmount.DEFAULT) {
        render(filmsList, this._LoadMoreBtnTemplate);
        this._LoadMoreBtnTemplate.addEventListener(`click`, () => this._renderCards(this._cards, true));
      }

      render(this._filmBlock, new TopRated().getElement());

      render(this._filmBlock, new MostCommented().getElement());

      this._renderCards();
    }

    this.toggleNavigationBlock();

    const searchInput = document.querySelector(`.search__field`);
    const searchInputResetBtn = document.querySelector(`.search__reset`);

    searchInputResetBtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      searchInput.value = ``;
      const searchController = new SearchController();

      searchController.cancelSearch();
      this._renderIndex = {
        min: 0,
        max: 5,
      };
      this._renderCards();
      this.resetLoadMoreBtn();
    });

    searchInput.addEventListener(`input`, (arr) => {
      this._phrase = searchInput.value;
      const searchController = new SearchController();

      if (_.size(this._phrase) >= MIN_PHRASE_LENGTH) {
        this._currentSort = sortProperty.DEFAULT;
        this._currentFilter = filterProperty.ALL;

        if (this._isStatisticsShowed) {
          this.hideStatistics();
        }

        arr = searchController.searchFilm(this._phrase, this._cards);
        this.resetLoadMoreBtn();
        this._renderCards(arr);
      } else if (!_.size(this._phrase)) {
        searchController.cancelSearch();
        this.resetLoadMoreBtn();
        this._renderCards(this._cards);
      }
    });
  }

  renderCards(arr = [...this._cards], isLoadMoreCards = false) {
    const extraFilmsContainer = document.querySelectorAll(`.films-list--extra`);
    const container = document.querySelector(`.films-list__container`);
    const mostTopRatedContainer = extraFilmsContainer[0].querySelector(`.films-list__container`);
    const mostCommentedContainer = extraFilmsContainer[1].querySelector(`.films-list__container`);
    const filmsMarkUp = document.querySelectorAll(`.film-card`);

    if (this._currentFilter !== filterProperty.ALL) {
      switch (this._currentFilter) {
        case filterProperty.FAVORITES:
          arr = [...this._cards.filter((element) => element.isFavorite)];
          break;
        case filterProperty.HISTORY:
          arr = [...this._cards.filter((element) => element.isWatched)];
          break;
        case filterProperty.WATCHLIST:
          arr = [...this._cards.filter((element) => element.isInWatchList)];
          break;
      }
    }

    if (this._currentSort !== sortProperty.DEFAULT) {
      arr = this.makeNewCardOrder(arr);
    }

    if (_.size(arr) !== this._renderIndex.max) {
      if (!isLoadMoreCards) {
        filmsMarkUp.forEach((item) => unrender(item));
      } else {
        this._renderIndex.min += this._renderAmount;
        this._renderIndex.max += this._renderAmount;
      }

      if (_.size(arr) <= this._renderIndex.max) {
        unrender(this._LoadMoreBtnTemplate);
        this._renderIndex.max = _.size(arr);
      }

      arr = arr.slice(this._renderIndex.min, this._renderIndex.max);
    } else {
      filmsMarkUp.forEach((item) => unrender(item));

      if (_.size(arr) <= this._renderIndex.max) {
        unrender(this._LoadMoreBtnTemplate);
      }
    }

    this.initMovieController(arr, container);

    this.renderExtraCards(extraProperty.TOP_RATED, mostTopRatedContainer);
    this.renderExtraCards(extraProperty.MOST_COMMENTED, mostCommentedContainer);
  }

  renderExtraCards(property, container) {
    let films = [...this._cards];

    switch (property) {
      case extraProperty.TOP_RATED:
        films = films.sort((a, b) => b.rating - a.rating);
        break;
      case extraProperty.MOST_COMMENTED:
        films = films.sort((a, b) => _.size(b.comments) - _.size(a.comments));
        break;
    }

    if (_.size(films) > cardsAmount.EXTRA && _.head(films) === _.last(films)) {
      films = _.shuffle(films).slice(0, cardsAmount.EXTRA);
    }

    films = films.slice(0, cardsAmount.EXTRA);

    this.initMovieController(films, container);
  }

  initMovieController(arr, container) {
    arr.forEach((item) => {
      const movieController = new MovieController(item, container, this._onChangeView, this._renderCards);
      this._subscriptions.push(movieController._setDefaultView);
      movieController.init();
    });
  }

  resetLoadMoreBtn() {
    const filmsList = document.querySelector(`.films-list`);
    this._renderIndex = {
      min: 0,
      max: 5,
    };

    if (!document.contains(this._LoadMoreBtnTemplate)) {
      render(filmsList, this._LoadMoreBtnTemplate);
    }
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  showStatistics() {
    this._isStatisticsShowed = true;
    this._statisticBlock.classList.remove(`visually-hidden`);
    this._sortBlock.classList.add(`visually-hidden`);
    this._filmBlock.classList.add(`visually-hidden`);
  }

  hideStatistics() {
    this._isStatisticsShowed = false;
    this._statisticBlock.classList.add(`visually-hidden`);
    this._sortBlock.classList.remove(`visually-hidden`);
    this._filmBlock.classList.remove(`visually-hidden`);
  }

  toggleNavigationBlock() {
    const statsLink = document.querySelectorAll(`.main-navigation__item`);
    const sortButtons = document.querySelectorAll(`.sort__button`);
    const defaultFortBtn = document.querySelector(`.sort__button[data-sort="default"]`);

    const setDefaultSortState = () => {
      sortButtons.forEach((btn) => {
        btn.classList.remove(`sort__button--active`);
        defaultFortBtn.classList.add(`sort__button--active`);
      });
    };

    statsLink.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const hashTag = item.getAttribute(`href`);

        statsLink.forEach((link) => link.classList.remove(`main-navigation__item--active`));
        item.classList.add(`main-navigation__item--active`);

        setDefaultSortState();

        switch (hashTag) {
          case `#stats`:
            this.showStatistics();
            this._currentSort = sortProperty.DEFAULT;
            this._statisticController.init();
            break;
          case `#watchlist`:
            this._currentFilter = filterProperty.WATCHLIST;
            this._currentSort = sortProperty.DEFAULT;
            this.hideStatistics();
            break;
          case `#history`:
            this._currentFilter = filterProperty.HISTORY;
            this._currentSort = sortProperty.DEFAULT;
            this.hideStatistics();
            break;
          case `#favorites`:
            this._currentFilter = filterProperty.FAVORITES;
            this._currentSort = sortProperty.DEFAULT;
            this.hideStatistics();
            break;
          case `#all`:
            this._currentFilter = filterProperty.ALL;
            this._currentSort = sortProperty.DEFAULT;
            this.hideStatistics();
            break;
        }

        this.resetLoadMoreBtn();
        this._renderCards();
      });
    });
  }

  makeNewCardOrder(arr) {
    switch (this._currentSort) {
      case sortProperty.DATE:
        arr = arr.sort((a, b) => moment(b[sortProperty.DATE]).format(`x`) - moment(a[sortProperty.DATE]).format(`x`));
        break;
      case sortProperty.RATING:
        arr = arr.sort((a, b) => b[sortProperty.RATING] - a[sortProperty.RATING]);
        break;
    }

    return arr;
  }
}
