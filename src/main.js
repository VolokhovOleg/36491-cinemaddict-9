import {Search} from './components/search.js';
import {Rank} from './components/rank.js';
import {Menu} from './components/menu.js';
import {FilmsContainer} from './components/films-container.js';
import {CardsTemplate} from './components/card.js';
import {Sort} from './components/sort.js';
import {FilmsList} from './components/films-list.js';
import {TopRated} from './components/top-rated.js';
import {MostCommented} from './components/most-commented.js';
import {FilmDetail} from './components/film-detail.js';
import {LoadMoreBtn} from './components/load-more-btn.js';
import {FooterStats} from './components/footer-stats.js';
import {Comment} from './components/comment.js';
import {generateFilm, generateFilters} from './data.js';
import {getRandomInt, render, unrender} from './utils.js';

const cards = new Array(getRandomInt(1, 18)).fill({}).map(generateFilm);
const filters = generateFilters();
const cardsAmount = {
  TOTAL: cards.length,
  DEFAULT: 5,
  EXTRA: 2,
};
const body = document.querySelector(`body`);
const header = document.querySelector(`.header`);
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

  if (maxAmount < cardsAmount.TOTAL) {
    cardsArr = cards.slice(0, maxAmount);
  }

  cardsArr.forEach((item) => {
    let card = new CardsTemplate(item);

    card.trackOpenedCard(card.getElement(), popUpRender, item);

    render(container, card.getElement());
  });
};

// Рендеринг «Поиск»
render(header, new Search().getElement());

// Рендеринг «Звание пользователя»
render(header, new Rank().getElement());

// Рендеринг «Меню»
render(main, new Menu(filters).getElement());

// Рендеринг «Сортировки»
render(main, new Sort().getElement());

// Рендеринг «Контент»
render(main, new FilmsContainer().getElement());
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
    let arr = cards.filter((element) => cards.indexOf(element) + 1 <= renderIndex.max && cards.indexOf(element) + 1 > renderIndex.min);

    arr.forEach((item) => {
      let card = new CardsTemplate(item);

      card.trackOpenedCard(card.getElement(), popUpRender, item);

      render(filmsListContainer, card.getElement());
    });

    if (renderIndex.max >= cardsAmount.TOTAL || renderIndex.max % cardsAmount.TOTAL === 0) {
      unrender(loadMoreBtn);
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
renderCards(cards, filmsListContainer, cardsAmount.DEFAULT);

// Рендеринг «Карточек фильма» для Top Rated
renderCards(cards, filmsListExtra[0].querySelector(`.films-list__container`), cardsAmount.EXTRA);

// Рендеринг «Карточек фильма» для Most Commented
renderCards(cards, filmsListExtra[1].querySelector(`.films-list__container`), cardsAmount.EXTRA);
