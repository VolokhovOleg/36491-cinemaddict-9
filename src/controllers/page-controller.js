import {render, unrender} from '../utils.js';
import {NoFilms} from '../components/no-films.js';
import {FilmsContainer} from '../components/films-container.js';
import {FooterStats} from '../components/footer-stats.js';
import {FilmsList} from '../components/films-list.js';
import {TopRated} from '../components/top-rated.js';
import {MostCommented} from '../components/most-commented.js';
import {MovieController} from './movie-controller.js';

const cardsAmount = {
  DEFAULT: 5,
  EXTRA: 2,
};

export class PageController {
  constructor(container, cards, Sort, LoadMoreBtn) {
    this._container = container;
    this._cards = cards;
    this._Sort = new Sort();
    this._onChangeView = this.onChangeView.bind(this);
    this._onDataChange = this.onDataChange.bind(this);
    // Вспомогательный массив для сортировки
    this._sortedArr = this._cards.map((item) => item);
    this._extraArr = this._cards.slice(0, 2);
    this._LoadMoreBtnTemplate = new LoadMoreBtn().getElement();
    this._renderIndex = {
      min: 5,
      max: 10
    };
    this._subscriptions = [];
  }

  init() {
    const totalCardsAmount = this._cards.length;

    if (totalCardsAmount < 1) {

      // Рендеринг надписи если нет карточек
      render(this._container, new NoFilms().getElement());
    } else {

      const main = document.querySelector(`.main`);
      const footerStats = document.querySelector(`.footer__statistics`);

      // Рендеринг сортировки
      render(main, this._Sort.getElement());

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
        this.renderCards(arr);
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
      render(footerStats, new FooterStats(totalCardsAmount).getElement());

      // Рендеринг «Котейнер для карточек»
      render(filmsContainer, new FilmsList().getElement());
      const filmsList = document.querySelector(`.films-list`);

      if (totalCardsAmount > cardsAmount.DEFAULT) {
        // Рендеринг «Show more»
        render(filmsList, this._LoadMoreBtnTemplate);

        // Рендеринг карточек
        this._LoadMoreBtnTemplate.addEventListener(`click`, () => {
          let arr = this._sortedArr .filter((element) => this._sortedArr .indexOf(element) + 1 <= this._renderIndex.max && this._sortedArr.indexOf(element) + 1 > this._renderIndex.min);

          this.renderCards(arr);

          if (this._renderIndex.max >= totalCardsAmount || this._renderIndex.max % totalCardsAmount === 0) {
            unrender(this._LoadMoreBtnTemplate);
          }

          this._renderIndex.min = this._renderIndex.max;
          this._renderIndex.max += cardsAmount.DEFAULT;

          if (this._renderIndex.max > totalCardsAmount) {
            this._renderIndex.max -= this._renderIndex.max - totalCardsAmount;
          }
        });
      }

      // Рендеринг Котейнера для Top Rated
      render(filmsContainer, new TopRated().getElement());

      // Рендеринг Котейнера для Most Commented
      render(filmsContainer, new MostCommented().getElement());

      // Рендеринг «Карточек фильма»
      this.renderCards();

      this._extraCardsContainer = document.querySelectorAll(`.films-list--extra`);

      // Рендеринг «Карточек фильма» для Top Rated
      this.renderCards(this._extraArr, cardsAmount.EXTRA, this._extraCardsContainer[0].querySelector(`.films-list__container`));

      // Рендеринг «Карточек фильма» для Most Commented
      this.renderCards(this._extraArr, cardsAmount.EXTRA, this._extraCardsContainer[1].querySelector(`.films-list__container`));
    }
  }

  // Рендеринг «Карточек фильма»
  renderCards(cardsArr = this._sortedArr, amount = cardsAmount.DEFAULT, container = document.querySelector(`.films-list__container`)) {
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

  refreshLoadMoreBtn() {
    this._renderIndex.max = 10;
    this._renderIndex.min = 5;

    if (!document.contains(this._LoadMoreBtnTemplate)) {
      const filmsList = document.querySelector(`.films-list`);
      render(filmsList, this._LoadMoreBtnTemplate);
    }
  }

  // Метод onDataChange, который получает на вход обновленные данные
  onDataChange(newCardData, changedElems, popUpRender, isPopupOpen = false) {
    const mainConteiner = document.querySelector(`.films-list__container`);
    const filmsMarkUp = mainConteiner.querySelectorAll(`.film-card`);

    // Если попап был закрыт
    if (!isPopupOpen) {

      // Проверяю какая кнопка на кароточке была нажата и обновляю данные.
      // Получился хардкод, но лучше не придумал как проверять кнопки :(.
      const btnClasses = new Set(changedElems.getAttribute(`class`).split(` `));
      if (btnClasses.has(`film-card__controls-item--active`)) {
        if (btnClasses.has(`film-card__controls-item--add-to-watchlist`)) {
          newCardData.isInWatchList = false;
        }

        if (btnClasses.has(`film-card__controls-item--mark-as-watched`)) {
          newCardData.isWatched = false;
        }

        if (btnClasses.has(`film-card__controls-item--favorite`)) {
          newCardData.isFavorite = false;
        }
      } else {
        if (btnClasses.has(`film-card__controls-item--add-to-watchlist`)) {
          newCardData.isInWatchList = true;
        }

        if (btnClasses.has(`film-card__controls-item--mark-as-watched`)) {
          newCardData.isWatched = true;
        }

        if (btnClasses.has(`film-card__controls-item--favorite`)) {
          newCardData.isFavorite = true;
        }
      }

      // Если попап был открыт
    } else {

      // Обновляю данные
      newCardData.isInWatchList = changedElems.watchlist;
      newCardData.isWatched = changedElems.watched;
      newCardData.isFavorite = changedElems.favorite;
    }

    // Далее обновляю и удаляю из дома элементы и ренедерю с новыми данными
    filmsMarkUp.forEach((item) => item.remove());

    if (isPopupOpen) {
      document.querySelector(`.film-details`).remove();
      popUpRender();
    }

    this.renderCards();
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
