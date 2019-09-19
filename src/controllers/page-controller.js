import {render, unrender} from '../utils.js';
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
  constructor(container, cards, Sort, LoadMoreBtn, SearchResult) {
    this._container = container;
    this._cards = cards;
    this._Sort = new Sort();
    this._totalCardsAmount = this._cards.length;
    this._LoadMoreBtnTemplate = new LoadMoreBtn().getElement();
    this._sortedArr = [...this._cards];
    this._phrase = ``;
    this._SearchResult = new SearchResult();
    this._onChangeView = this.onChangeView.bind(this);
    this._onDataChange = this.onDataChange.bind(this);
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
      const sortArr = (arr, sortAttr) => arr.sort((a, b) => a[sortAttr] - b[sortAttr]);

      // Функция сортировки отсортированного массива
      const makeNewCardOrder = (arr, sortAttr) => {
        arr = this._cards;

        if (!(sortAttr === `default`)) {
          arr = this._sortedArr;
          sortArr(arr, sortAttr);
        }

        // Удаляю из дома карточки фильмов
        const filmsMarkUp = document.querySelectorAll(`.film-card`);

        filmsMarkUp.forEach((item) => unrender(item));

        // Рендеринг карточки фильмов
        this._renderCards(arr);
        this.refreshLoadMoreBtn();
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
            let sortAttr = link.getAttribute(`data-sort`);

            makeNewCardOrder(this._sortedArr, sortAttr);
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
          let arr = this._sortedArr.filter((element) => this._sortedArr.indexOf(element) + 1 <= this._renderIndex.max && this._sortedArr.indexOf(element) + 1 > this._renderIndex.min);

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


      // Доп блоки
      const extraCardsContainer = document.querySelectorAll(`.films-list--extra`);

      // Рендеринг «Карточек фильма» для Top Rated
      this._renderCards(
          this._extraArr,
          cardsAmount.EXTRA,
          extraCardsContainer[0].querySelector(`.films-list__container`));

      // Рендеринг «Карточек фильма» для Most Commented
      this._renderCards(
          this._extraArr,
          cardsAmount.EXTRA,
          extraCardsContainer[1].querySelector(`.films-list__container`));
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

    let maxFilmAmount = this._cards.length;

    if (maxFilmAmount > amount) {
      cardsArr = cardsArr.slice(0, this._renderIndex.min);
    }

    cardsArr.forEach((item) => {
      let movieController = new MovieController(item, container, this._onDataChange, this._onChangeView);

      this._subscriptions.push(movieController._setDefaultView);
      movieController.init();
    });
  }

  // Обновляю значения кнопки «Load More»
  refreshLoadMoreBtn() {
    this._renderIndex.max = 10;
    this._renderIndex.min = 5;
    const filmsList = document.querySelector(`.films-list`);

    if (!document.contains(this._LoadMoreBtnTemplate)) {
      render(filmsList, this._LoadMoreBtnTemplate);
    }
    if (this._renderIndex.max % this._totalCardsAmount === 0 || this._totalCardsAmount <= this._renderIndex.min) {
      unrender(this._LoadMoreBtnTemplate);
    }
  }

  // Метод onDataChange, который получает на вход обновленные данные
  onDataChange(newCardData, changedElems = null, popUpRender = null, comments = null) {
    switch (true) {
      case comments !== null:
        if (comments.data) {
          newCardData.comments = [...newCardData.comments, comments.data];
        } else {
          let commentsTemplate = document.querySelectorAll(`.film-details__comment`);
          newCardData.comments = newCardData.comments.filter((item) => item.id.toString() !== comments.id);
          commentsTemplate.forEach((comment) => unrender(comment));
        }
        break;
      case changedElems !== null:
        newCardData.isInWatchList = changedElems.watchlist;
        newCardData.isWatched = changedElems.watched;
        newCardData.isFavorite = changedElems.favorite;
        break;
    }

    if (popUpRender) {
      popUpRender();
    }

    this._renderCards();
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  // Переключаем блок со статистикой
  toggleStatisticBlock() {
    const statsLink = document.querySelectorAll(`.main-navigation__item`);
    const statisticBlock = document.querySelector(`.statistic`);

    statsLink.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        switch (item.getAttribute(`href`)) {
          case `#stats`:
            statisticBlock.classList.toggle(`visually-hidden`);
            this._statisticController.init();
            break;
        }
      });
    });
  }
}
