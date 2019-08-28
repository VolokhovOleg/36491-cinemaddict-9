import {render, unrender} from '../utils.js';
import {NoFilms} from '../components/no-films.js';
import {FilmsContainer} from '../components/films-container.js';
import {FooterStats} from '../components/footer-stats.js';
import {FilmsList} from '../components/films-list.js';
import {LoadMoreBtn} from '../components/load-more-btn.js';
import {CardsTemplate} from '../components/card.js';
import {TopRated} from '../components/top-rated.js';
import {MostCommented} from '../components/most-commented.js';
import {FilmDetail} from '../components/film-detail.js';
import {Comment} from '../components/comment.js';
import {Sort} from '../components/sort.js';

const cardsAmount = {
  DEFAULT: 5,
  EXTRA: 2,
};

export class PageController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
  }

  init() {
    const totalCardsAmount = this._cards.length;

    if (totalCardsAmount < 1) {
      render(this._container, new NoFilms().getElement());
    } else {
      let sortedArr = this._cards.map((item) => item);
      const body = document.querySelector(`body`);
      const main = document.querySelector(`.main`);
      const footerStats = document.querySelector(`.footer__statistics`);

      const popUpRender = (item) => {
        let popup = new FilmDetail(item);

        // Рендеринг Popup
        render(body, popup.getElement());

        popup.trackClosedPopup();

        let commentList = document.querySelector(`.film-details__comments-list`);

        // Рендеринг комментариев
        item.comments.map((comment) => render(commentList, new Comment(comment).getElement()));

        // Чтобы не было двойного скрола
        body.style = `overflow: hidden;`;
      };

      const renderCards = (cardsArr, container, maxAmount = 1) => {

        if (maxAmount < totalCardsAmount) {
          cardsArr = sortedArr.slice(0, maxAmount);
        }

        cardsArr.forEach((item) => {
          let card = new CardsTemplate(item);

          card.trackOpenedCard(card.getElement(), popUpRender, item);

          render(container, card.getElement());
        });
      };

      // Рендеринг «Сортировки»
      const sortPanel = new Sort();
      render(main, sortPanel.getElement());
      const sortArr = (arr, sortAttr) => arr.sort((a, b) => a[sortAttr] - b[sortAttr]);
      const makeNewCardOrder = (arr, sortAttr) => {
        if (sortAttr === `default`) {
          sortedArr = this._cards.map((item) => item);
        } else {
          sortArr(arr, sortAttr);
        }
        let filmsMarkUp = document.querySelectorAll(`.film-card`);

        filmsMarkUp.forEach((item) => {
          unrender(item);
        });

        renderCards(sortedArr, filmsListContainer, cardsAmount.DEFAULT);
      };

      let links = document.querySelectorAll(`.sort__button`);

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
        let renderIndex = {
          min: 5,
          max: 10
        };

        // Рендеринг «Show more»
        const loadMoreBtnTemplate = new LoadMoreBtn();
        render(filmsList, loadMoreBtnTemplate.getElement());
        const loadMoreBtn = document.querySelector(`.films-list__show-more`);

        // Рендеринг карточек
        loadMoreBtn.addEventListener(`click`, () => {
          let arr = sortedArr.filter((element) => sortedArr.indexOf(element) + 1 <= renderIndex.max && sortedArr.indexOf(element) + 1 > renderIndex.min);

          arr.forEach((item) => {
            let card = new CardsTemplate(item);

            card.trackOpenedCard(card.getElement(), popUpRender, item);

            render(filmsListContainer, card.getElement());
          });

          if (renderIndex.max >= totalCardsAmount || renderIndex.max % totalCardsAmount === 0) {
            unrender(loadMoreBtn);
            loadMoreBtnTemplate.removeElement();
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
      renderCards(sortedArr, filmsListContainer, cardsAmount.DEFAULT);

      // Рендеринг «Карточек фильма» для Top Rated
      renderCards(sortedArr, filmsListExtra[0].querySelector(`.films-list__container`), cardsAmount.EXTRA);

      // Рендеринг «Карточек фильма» для Most Commented
      renderCards(sortedArr, filmsListExtra[1].querySelector(`.films-list__container`), cardsAmount.EXTRA);
    }
  }
}
