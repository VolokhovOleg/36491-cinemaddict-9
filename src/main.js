import {renderSearch} from './components/search.js';
import {renderRank} from './components/rank.js';
import {renderMenu} from './components/menu.js';
import {renderFilmsContainer} from './components/films-container.js';
import {renderCard} from './components/сard.js';
import {renderSort} from './components/sort.js';
import {renderFilmsList} from './components/films-list.js';
import {renderTopRated} from './components/top-rated.js';
import {renderMostCommented} from './components/most-commented.js';
import {renderLoadMoreBtn} from './components/load-more-btn.js';
import {renderFooterStats} from './components/footer-stats.js';
import {generateFilters} from './data.js';
import {totalCards} from './data.js';
import {generateCard} from './data.js';
import {renderFilmDetail} from './components/film-detail.js';
import {renderFilmDetailRow} from './components/film-details-row.js';

const filters = generateFilters();
const cards = new Array(totalCards()).fill({}).map(generateCard);
const filmsAmount = cards.length;

const cardsAmount = {
  TOTAL: filmsAmount,
  DEFAULT: 5,
  EXTRA: 2,
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);
const footerStats = document.querySelector(`.footer__statistics`);

const render = (template, node) => node.insertAdjacentHTML(`beforeend`, template);

const renderData = (container, maxAmount = 1) => {
  let arr = cards;

  if (maxAmount <= filmsAmount) {
    arr = cards.filter((elem) => cards.indexOf(elem) < maxAmount);
  }

  arr.forEach((item) => {
    render(renderCard(item), container);
  });
};

// Рендеринг «Поиск»
render(renderSearch(), header);

// Рендеринг «Попапа»
render(renderFilmDetail(cards[0]), body);
const filmDetail = document.querySelector(`.film-details__table`);

for (const key in cards[0].filmDetails) {
  if ({}.hasOwnProperty.call(cards[0].filmDetails, key)) {
    // Рендеринг строки в таблицу с дополнительной информацией
    render(renderFilmDetailRow(key, cards[0].filmDetails[key]), filmDetail);
  }
}

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
  // Рендеринг «Show more»
  render(renderLoadMoreBtn(), filmsList);
  const loadMoreBtn = document.querySelector(`.films-list__show-more`);

  // Рендеринг Оставшиеся карточки
  loadMoreBtn.addEventListener(`click`, () => {
    let arr = cards.filter((element) => cards.indexOf(element) >= cardsAmount.DEFAULT);

    arr.forEach((item) => {
      render(renderCard(item), filmsListContainer);
    });

    loadMoreBtn.remove();
  });
}

// Рендеринг контейнера для Top Rated
render(renderTopRated(), filmsContainer);

// Рендеринг контейнера для Most Commented
render(renderMostCommented(), filmsContainer);
const filmsListExtra = document.querySelectorAll(`.films-list--extra`);

// Рендеринг «Карточек фильма»
renderData(filmsListContainer, cardsAmount.DEFAULT);

// Рендеринг «Карточек фильма» для Top Rated
renderData(filmsListExtra[0].querySelector(`.films-list__container`), cardsAmount.EXTRA);

// Рендеринг «Карточек фильма» для Most Commented
renderData(filmsListExtra[1].querySelector(`.films-list__container`), cardsAmount.EXTRA);
