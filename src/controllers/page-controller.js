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
        this.renderCards(arr);
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

          this.renderCards(arr);

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
      this.renderCards();
    }
  }

  // Рендеринг «Карточек фильма»
  renderCards(cardsArr = this._cards) {
    let maxFilmAmount = this._cards.length;

    if (maxFilmAmount < cardsAmount.DEFAULT) {
      cardsArr = cardsArr.slice(0, cardsAmount.DEFAULT);
    }

    cardsArr.forEach((item) => {
      let movieController = new MovieController(item, this.renderCards);

      // this._subscriptions.push(movieController.setDefaultView);
      movieController.init();
    });
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
