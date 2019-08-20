import {renderSearch} from './components/search.js';
import {renderRank} from './components/rank.js';
import {renderMenu} from './components/menu.js';
import {renderFilmsContainer} from './components/films-container.js';
import {renderCard} from './components/сard.js';
import {renderSort} from './components/sort.js';
import {renderFilmsList} from './components/films-list.js';
import {renderTopRated} from './components/top-rated.js';
import {renderMostCommented} from './components/most-commented.js';
import {renderFilmDetail} from './components/film-detail.js';
import {renderLoadMoreBtn} from './components/load-more-btn.js';
import {renderFooterStats} from './components/footer-stats.js';
import {renderComment} from './components/comment.js';
import {generateFilm, generateFilters} from './data.js';
import {getRandomInt} from './utils.js';

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

const render = (template, node) => node.insertAdjacentHTML(`beforeend`, template);

const renderData = (container, maxAmount = 1) => {
  let arr = cards;

  if (maxAmount <= cardsAmount.TOTAL) {
    arr = cards.filter((elem) => cards.indexOf(elem) < maxAmount);
  }

  arr.forEach((item) => {
    render(renderCard(item), container);
  });
};

// Рендеринг «Поиск»
render(renderSearch(), header);

// Рендеринг «Звание пользователя»
render(renderRank(), header);

// Рендеринг «Меню»
render(renderMenu(filters), main);

// Рендеринг «Сортировки»
render(renderSort(), main);

// Рендеринг «Контент»
render(renderFilmsContainer(), main);
const filmsContainer = document.querySelector(`.films`);

// Рендеринг количества фильмов в сервисе
render(renderFooterStats(cardsAmount.TOTAL), footerStats);

// Рендеринг «Котейнер для карточек»
render(renderFilmsList(), filmsContainer);
const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsList = document.querySelector(`.films-list`);

if (cardsAmount.TOTAL > cardsAmount.DEFAULT) {
  let renderIndex = {
    min: cardsAmount.DEFAULT - 1,
    max: cardsAmount.DEFAULT - 1 + cardsAmount.DEFAULT
  };

  // Рендеринг «Show more»
  render(renderLoadMoreBtn(), filmsList);
  const loadMoreBtn = document.querySelector(`.films-list__show-more`);

  // Рендеринг карточиек
  loadMoreBtn.addEventListener(`click`, () => {

    let arr = cards.filter((element) => cards.indexOf(element) <= renderIndex.max && cards.indexOf(element) > renderIndex.min);

    arr.forEach((item) => {
      render(renderCard(item), filmsListContainer);
    });

    renderIndex.min = renderIndex.max;
    renderIndex.max += cardsAmount.DEFAULT;

    if (renderIndex.max > cardsAmount.TOTAL) {
      renderIndex.max -= renderIndex.max - cardsAmount.TOTAL;
    }
  });
}

// Рендеринг Котейнера для Top Rated
render(renderTopRated(), filmsContainer);

// Рендеринг Котейнера для Most Commented
render(renderMostCommented(), filmsContainer);
const filmsListExtra = document.querySelectorAll(`.films-list--extra`);

// Рендеринг «Карточек фильма»
renderData(filmsListContainer, cardsAmount.DEFAULT);

// Рендеринг «Карточек фильма» для Top Rated
renderData(filmsListExtra[0].querySelector(`.films-list__container`), cardsAmount.EXTRA);

// Рендеринг «Карточек фильма» для Most Commented
renderData(filmsListExtra[1].querySelector(`.films-list__container`), cardsAmount.EXTRA);

// Рендеринг Popup
render(renderFilmDetail(cards[0]), body);

const commentList = document.querySelector(`.film-details__comments-list`);

// Рендеринг комментариев
cards[0].comments.map((comment) => render(renderComment(comment), commentList));
