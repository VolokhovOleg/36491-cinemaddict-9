import {render, unrender, _} from '../utils.js';
import {NoFilms} from '../components/no-films.js';
import {FilmsContainer} from '../components/films-container.js';
import {FooterStats} from '../components/footer-stats.js';
import {FilmsList} from '../components/films-list.js';
import {TopRated} from '../components/top-rated.js';
import {MostCommented} from '../components/most-commented.js';
import {MovieController} from './movie-controller.js';
import {SearchController} from './search-controller.js';
import {StatisticController} from "./statistic-controller";

const cardsAmount = {
  DEFAULT: 5,
  EXTRA: 2,
};
const MIN_PHRASE_LENGTH = 3;

export class PageController {
  constructor(cards, Sort, LoadMoreBtn, SearchResult) {
    this._container = document.querySelector(`.main`);
    this._cards = cards;
    this._Sort = new Sort();
    this._totalCardsAmount = this._cards.length;
    this._LoadMoreBtnTemplate = new LoadMoreBtn().getElement();
    this._sortedArr = [...this._cards];
    this._filtredArr = [...this._cards];
    this._phrase = ``;
    this._SearchResult = new SearchResult();
    this._onChangeView = this.onChangeView.bind(this);
    this._renderCards = this.renderCards.bind(this);
    this._statisticController = new StatisticController(this._sortedArr);
    this._extraArr = this._cards.slice(0, 2);
    this._renderIndex = {
      min: 5,
      max: 10
    };
    this._subscriptions = [];
  }

  init() {
    if (this._totalCardsAmount < 1) {
      // Рендеринг надписи если нет карточек
      render(this._container, new NoFilms().getElement());
    } else {

      const footerStats = document.querySelector(`.footer__statistics`);

      // Рендеринг сортировки
      render(this._container, this._Sort.getElement());

      // Рендеринг результат поиска
      render(this._container, this._SearchResult.getElement());

      // Сортировка
      const sortArr = (arr, sortAttr) => arr.sort((a, b) => b[sortAttr] - a[sortAttr]);

      // Функция сортировки отсортированного массива
      const makeNewCardOrder = (sortAttr) => {
        let arr = [...this._filtredArr];

        if (!(sortAttr === `default`)) {
          arr = [...this._sortedArr];
          sortArr(arr, sortAttr);
        }

        // Удаляю из дома карточки фильмов
        const filmsMarkUp = document.querySelectorAll(`.film-card`);

        filmsMarkUp.forEach((item) => unrender(item));

        // Рендеринг карточки фильмов
        this.refreshLoadMoreBtn(arr);
        this._renderCards(arr);
      };

      // Навешиваю лисенеры на кнопки сортировки
      const links = document.querySelectorAll(`.sort__button`);

      links.forEach((link) => {
        link.addEventListener(`click`, (evt) => {
          evt.preventDefault();

          if (!link.classList.contains(`sort__button--active`)) {
            links.forEach((elem) => {
              elem.classList.remove(`sort__button--active`);
            });

            link.classList.add(`sort__button--active`);
            const sortAttr = link.getAttribute(`data-sort`);

            makeNewCardOrder(sortAttr);
          }
        });
      });

      // Рендеринг «Контент»
      render(this._container, new FilmsContainer().getElement());
      const filmsContainer = document.querySelector(`.films`);

      // Рендеринг количества фильмов в сервисе
      render(footerStats, new FooterStats(this._totalCardsAmount).getElement());

      // Рендеринг «Котейнер для карточек»
      render(filmsContainer, new FilmsList().getElement());
      const filmsList = document.querySelector(`.films-list`);

      if (this._totalCardsAmount > cardsAmount.DEFAULT) {

        // Рендеринг «Show more»
        render(filmsList, this._LoadMoreBtnTemplate);

        // Рендеринг карточек
        this._LoadMoreBtnTemplate.addEventListener(`click`, () => {
          const arr = this._sortedArr.filter((element) => this._sortedArr.indexOf(element) + 1 <= this._renderIndex.max && this._sortedArr.indexOf(element) + 1 > this._renderIndex.min);

          this._renderCards(arr, cardsAmount.DEFAULT, document.querySelector(`.films-list__container`), false);

          if (this._renderIndex.max >= this._totalCardsAmount || this._renderIndex.max % this._totalCardsAmount === 0) {
            unrender(this._LoadMoreBtnTemplate);
          }

          this._renderIndex.min = this._renderIndex.max;
          this._renderIndex.max += cardsAmount.DEFAULT;

          if (this._renderIndex.max > this._totalCardsAmount) {
            this._renderIndex.max -= this._renderIndex.max - this._totalCardsAmount;
          }
        });
      }

      // Рендеринг Котейнера для Top Rated
      render(filmsContainer, new TopRated().getElement());

      // Рендеринг Котейнера для Most Commented
      render(filmsContainer, new MostCommented().getElement());

      // Рендеринг «Карточек фильма»
      this._renderCards();
    }

    this.toggleStatisticBlock();

    const searchInput = document.querySelector(`.search__field`);
    const searchInputResetBtn = document.querySelector(`.search__reset`);

    searchInputResetBtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      searchInput.value = ``;
      const searchController = new SearchController();
      searchController.cancelSearch();
      this._sortedArr = [...this._cards];
      this._totalCardsAmount = this._cards.length;
      this._renderCards(this._cards);
      this.refreshLoadMoreBtn();
    });

    searchInput.addEventListener(`input`, () => {
      this._phrase = searchInput.value;
      const searchController = new SearchController(this._phrase, this._cards);

      if (this._phrase.length >= MIN_PHRASE_LENGTH) {
        this._sortedArr = searchController.searchFilm();
        this._totalCardsAmount = this._sortedArr.length;
        this._renderCards();
        this.refreshLoadMoreBtn();
      } else if (!this._phrase.length) {
        searchController.cancelSearch();
        this._sortedArr = [...this._cards];
        this._totalCardsAmount = this._cards.length;
        this._renderCards(this._cards);
        this.refreshLoadMoreBtn();
      }
    });
  }

  // Рендеринг «Карточек фильма»
  renderCards(
      cardsArr = this._sortedArr,
      amount = cardsAmount.DEFAULT,
      container = document.querySelector(`.films-list__container`),
      isDeleteCards = true) {

    const filmsMarkUp = container.querySelectorAll(`.film-card`);

    if (isDeleteCards) {
      filmsMarkUp.forEach((item) => item.remove());
    }

    const maxFilmAmount = this._cards.length;

    if (maxFilmAmount > amount) {
      cardsArr = cardsArr.slice(0, this._renderIndex.min);
    }

    cardsArr.forEach((item) => {
      const movieController = new MovieController(item, this._onChangeView, this._renderCards);

      this._subscriptions.push(movieController._setDefaultView);
      movieController.init();
    });
  }

  // Обновляю значения кнопки «Load More»
  refreshLoadMoreBtn() {
    this._renderIndex.min = 5;
    this._renderIndex.max = 10;
    const filmsList = document.querySelector(`.films-list`);

    if (!document.contains(this._LoadMoreBtnTemplate)) {
      render(filmsList, this._LoadMoreBtnTemplate);
    }

    if (this._renderIndex.max % this._totalCardsAmount === 0 || this._totalCardsAmount <= this._renderIndex.min) {
      unrender(this._LoadMoreBtnTemplate);
    }
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  // Переключаем блок со статистикой
  toggleStatisticBlock() {
    const statsLink = document.querySelectorAll(`.main-navigation__item`);
    const sortBlock = document.querySelector(`.sort`);
    const statisticBlock = document.querySelector(`.statistic`);
    const filmBlock = document.querySelector(`.films`);

    statsLink.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const hashTag = item.getAttribute(`href`);

        // Навешиваю лисенеры на кнопки сортировки
        const links2 = document.querySelectorAll(`.sort__button`);
        const linksDefault = document.querySelector(`.sort__button[data-sort="default"]`);

        // Порефакторить
        links2.forEach((link) => {
          link.classList.remove(`sort__button--active`);
          linksDefault.classList.add(`sort__button--active`);
        });

        statsLink.forEach((link) => link.classList.remove(`main-navigation__item--active`));
        item.classList.add(`main-navigation__item--active`);

        switch (hashTag) {
          case `#stats`:
            statisticBlock.classList.toggle(`visually-hidden`);
            sortBlock.classList.toggle(`visually-hidden`);
            filmBlock.classList.toggle(`visually-hidden`);
            this._statisticController.init();
            break;
          case `#watchlist`:
            this._sortedArr = this._cards.filter((element) => element.isInWatchList);
            break;
          case `#history`:
            this._sortedArr = this._cards.filter((element) => element.isWatched);
            break;
          case `#favorites`:
            this._sortedArr = this._cards.filter((element) => element.isFavorite);
            break;
          case `#all`:
            this._sortedArr = [...this._cards];
            break;
        }

        this._filtredArr = [...this._sortedArr];
        this._totalCardsAmount = _.size(this._filtredArr);
        this.refreshLoadMoreBtn(this._sortedArr);
        this._renderCards();
      });
    });
  }
}
