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

export class PageController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
  }

  init() {
    const cardsAmount = {
      TOTAL: this._cards.length,
      DEFAULT: 5,
      EXTRA: 2,
    };
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
    const footerStats = document.querySelector(`.footer__statistics`);
    const body = document.querySelector(`body`);

    const renderCards = (cardsArr, container, maxAmount = 1) => {

      if (maxAmount < cardsAmount.TOTAL) {
        cardsArr = this._cards.slice(0, maxAmount);
      }

      cardsArr.forEach((item) => {
        let card = new CardsTemplate(item);

        card.trackOpenedCard(card.getElement(), popUpRender, item);

        render(container, card.getElement());
      });
    };
    if (cardsAmount.TOTAL < 1) {
      render(this._container, new NoFilms().getElement());
    } else {
      // Рендеринг «Контент»
      render(this._container, new FilmsContainer().getElement());
      const filmsContainer = document.querySelector(`.films`);

      // Рендеринг количества фильмов в сервисе
      render(footerStats, new FooterStats(cardsAmount.TOTAL).getElement());

      // Рендеринг «Котейнер для карточек»
      render(filmsContainer, new FilmsList().getElement());
      const filmsListContainer = document.querySelector(`.films-list__container`);
      const filmsList = document.querySelector(`.films-list`);

      if (cardsAmount.TOTAL > cardsAmount.DEFAULT) {
        let renderIndex = {
          min: 5,
          max: 10
        };

        // Рендеринг «Show more»
        render(filmsList, new LoadMoreBtn().getElement());
        const loadMoreBtn = document.querySelector(`.films-list__show-more`);

        // Рендеринг карточек
        loadMoreBtn.addEventListener(`click`, () => {
          let arr = this._cards.filter((element) => this._cards.indexOf(element) + 1 <= renderIndex.max && this._cards.indexOf(element) + 1 > renderIndex.min);

          arr.forEach((item) => {
            let card = new CardsTemplate(item);

            card.trackOpenedCard(card.getElement(), popUpRender, item);

            render(filmsListContainer, card.getElement());
          });

          if (renderIndex.max >= cardsAmount.TOTAL || renderIndex.max % cardsAmount.TOTAL === 0) {
            unrender(loadMoreBtn);
            loadMoreBtn.removeElement();
          }

          renderIndex.min = renderIndex.max;
          renderIndex.max += cardsAmount.DEFAULT;

          if (renderIndex.max > cardsAmount.TOTAL) {
            renderIndex.max -= renderIndex.max - cardsAmount.TOTAL;
          }
        });
      }

      // Рендеринг Котейнера для Top Rated
      render(filmsContainer, new TopRated().getElement());

      // Рендеринг Котейнера для Most Commented
      render(filmsContainer, new MostCommented().getElement());
      const filmsListExtra = document.querySelectorAll(`.films-list--extra`);

      // Рендеринг «Карточек фильма»
      renderCards(this._cards, filmsListContainer, cardsAmount.DEFAULT);

      // Рендеринг «Карточек фильма» для Top Rated
      renderCards(this._cards, filmsListExtra[0].querySelector(`.films-list__container`), cardsAmount.EXTRA);

      // Рендеринг «Карточек фильма» для Most Commented
      renderCards(this._cards, filmsListExtra[1].querySelector(`.films-list__container`), cardsAmount.EXTRA);
    }
  }
}
