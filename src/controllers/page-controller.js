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
    this._LoadMoreBtn = new LoadMoreBtn();
    this._subscriptions = [];
  }

  init() {
    const totalCardsAmount = this._cards.length;

    if (totalCardsAmount < 1) {

      // Рендеринг надписи если нет карточек
      render(this._container, new NoFilms().getElement());
    } else {

      // Вспомогательный массив для сортировки
      let sortedArr = this._cards.map((item) => item);

      const main = document.querySelector(`.main`);
      const footerStats = document.querySelector(`.footer__statistics`);

      // Рендеринг сортировки
      render(main, this._Sort.getElement());

      // Сортировка
      const sortArr = (arr, sortAttr) => arr.sort((a, b) => a[sortAttr] - b[sortAttr]);

      // Функция сортировки отсортированного массива
      const makeNewCardOrder = (arr, sortAttr) => {
        arr = this._cards.map((item) => item);

        if (!(sortAttr === `default`)) {
          sortArr(arr, sortAttr);
        }

        // Удаляю из дома карточки фильмов
        const filmsMarkUp = document.querySelectorAll(`.film-card`);

        filmsMarkUp.forEach((item) => unrender(item));

        // Рендеринг карточки фильмов
        this.renderCards(
            arr,
            filmsListContainer,
            cardsAmount.DEFAULT,
            this.onDataChange,
            this.onChangeView,
            totalCardsAmount,
            sortedArr);
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

            makeNewCardOrder(sortedArr, sortAttr);
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
      const filmsListContainer = document.querySelector(`.films-list__container`);
      const filmsList = document.querySelector(`.films-list`);

      if (totalCardsAmount > cardsAmount.DEFAULT) {
        const renderIndex = {
          min: 5,
          max: 10
        };

        // Рендеринг «Show more»
        render(filmsList, this._LoadMoreBtn.getElement());
        const loadMoreBtn = document.querySelector(`.films-list__show-more`);

        // Рендеринг карточек
        loadMoreBtn.addEventListener(`click`, () => {
          let arr = sortedArr.filter((element) => sortedArr.indexOf(element) + 1 <= renderIndex.max && sortedArr.indexOf(element) + 1 > renderIndex.min);

          this.renderCards(arr, filmsListContainer, arr.length - 1, this.onDataChange);

          if (renderIndex.max >= totalCardsAmount || renderIndex.max % totalCardsAmount === 0) {
            unrender(loadMoreBtn);
            this._LoadMoreBtn.removeElement();
          }

          renderIndex.min = renderIndex.max;
          renderIndex.max += cardsAmount.DEFAULT;

          if (renderIndex.max > totalCardsAmount) {
            renderIndex.max -= renderIndex.max - totalCardsAmount;
          }
        });
      }

      // Рендеринг Котейнера для Top Rated
      render(filmsContainer, new TopRated().getElement());

      // Рендеринг Котейнера для Most Commented
      render(filmsContainer, new MostCommented().getElement());
      const filmsListExtra = document.querySelectorAll(`.films-list--extra`);

      // Рендеринг «Карточек фильма»
      this.renderCards(
          sortedArr,
          filmsListContainer,
          cardsAmount.DEFAULT,
          this.onDataChange,
          this.onChangeView,
          totalCardsAmount);

      // Рендеринг «Карточек фильма» для Top Rated
      this.renderCards(
          sortedArr,
          filmsListExtra[0].querySelector(`.films-list__container`),
          cardsAmount.EXTRA,
          this.onDataChange,
          this.onChangeView,
          totalCardsAmount);

      // Рендеринг «Карточек фильма» для Most Commented
      this.renderCards(
          sortedArr,
          filmsListExtra[1].querySelector(`.films-list__container`),
          cardsAmount.EXTRA,
          this.onDataChange,
          this.onChangeView,
          totalCardsAmount,
          sortedArr);
    }
  }

  // Рендеринг «Карточек фильма»
  renderCards(cardsArr, container, maxAmount = 1, onDataChange, onChangeView, totalCardsAmount, sortedArr = cardsArr) {
    if (maxAmount < totalCardsAmount) {
      cardsArr = sortedArr.slice(0, maxAmount);
    }

    cardsArr.forEach((item) => {
      let movieController = new MovieController(item, container, onDataChange, onChangeView, this);

      this._subscriptions.push(movieController.setDefaultView);
      movieController.init();
    });
  }

  // Метод onDataChange, который получает на вход обновленные данные
  onDataChange(newCardData, changedElems, context, popUpRender, isPopupOpen = false, popupContext) {
    const filmsListContainer = document.querySelector(`.films-list__container`);
    const filmsMarkUp = document.querySelectorAll(`.film-card`);
    const filmsListExtra = document.querySelectorAll(`.films-list--extra`);

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
      popupContext.popUpRender();
    }

    context.renderCards(
        context._cards,
        filmsListContainer,
        cardsAmount.DEFAULT,
        context.onDataChange,
        context.onChangeView,
        context._cards.length);

    // Рендеринг «Карточек фильма» для Top Rated
    context.renderCards(
        context._cards,
        filmsListExtra[0].querySelector(`.films-list__container`),
        cardsAmount.EXTRA,
        context.onDataChange,
        context.onChangeView,
        context._cards.length);

    // Рендеринг «Карточек фильма» для Most Commented
    context.renderCards(
        context._cards,
        filmsListExtra[1].querySelector(`.films-list__container`),
        cardsAmount.EXTRA,
        context.onDataChange,
        context.onChangeView,
        context._cards.length);
  }

  onChangeView(pageContext, movieContext) {
    pageContext._subscriptions.forEach((subscription) => subscription(movieContext));
  }
}
