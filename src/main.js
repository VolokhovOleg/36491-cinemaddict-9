import {renderSearch} from './components/search.js';
import {renderRank} from './components/rank.js';
import {renderMenu} from './components/menu.js';
import {renderFilmsContainer} from './components/films-container.js';
import {renderCard} from './components/сard.js';
import {renderSort} from './components/sort.js';
import {renderFilmsList} from './components/filmsList.js';
import {renderTopRated} from './components/top-rated.js';
import {renderMostCommented} from './components/most-commented.js';
import {renderFilmDetail} from './components/film-detail.js';
import {renderLoadMoreBtn} from './components/load-more-btn.js';
import {renderFooterStats} from './components/footer-stats.js';
import {cards} from './data.js';
import {filmsAmount} from './data.js';
import {filters} from './data.js';
import {isEscKeycode} from './utils.js';

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

  if (maxAmount <= filmsAmount) {
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
  // Рендеринг «Show more»
  render(renderLoadMoreBtn(), filmsList);
  const LoadMoreBtn = document.querySelector(`.films-list__show-more`);

  // Рендеринг Оставшиеся карточки
  LoadMoreBtn.addEventListener(`click`, () => {
    let arr = cards.filter((element) => cards.indexOf(element) >= cardsAmount.DEFAULT);

    arr.forEach((item) => {
      render(renderCard(item), filmsListContainer);
    });

    LoadMoreBtn.remove();

    // Навешиваем листенер на новые карточки карточки
    let newRenderedCards = Array.from(document.querySelectorAll(`.film-card`));

    let newFilmCards = newRenderedCards.filter((element) => newRenderedCards.indexOf(element) >= cardsAmount.DEFAULT);

    newFilmCards.forEach((item) => {
      addCardsListener(item);
    });
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

const filmCard = document.querySelectorAll(`.film-card`);

// Навешиваем листенер на карточки
const addCardsListener = (item) => {
  item.addEventListener(`click`, () => {
    let idCard = item.getAttribute(`data-id`);
    let pickedCard = cards.filter((element) => element.id === idCard);

    // Рендеринг Popup
    render(renderFilmDetail(...pickedCard), body);

    body.classList.add(`hide-overflow`);

    // Удаление карточки
    let closeBtn = document.querySelector(`.film-details__close-btn`);
    let popup = document.querySelector(`.film-details`);

    closeBtn.addEventListener(`click`, () => {
      popup.remove();
      body.classList.remove(`hide-overflow`);
    });

    document.addEventListener(`keydown`, (evt) => {
      if (isEscKeycode(evt.keyCode)) {
        popup.remove();
        body.classList.remove(`hide-overflow`);
      }
    });
  });
};

filmCard.forEach((item) => {
  addCardsListener(item);
});

