import {renderSearch} from './components/search.js';
import {renderRank} from './components/rank.js';
import {renderMenu} from './components/menu.js';
import {renderFilmsContainer} from './components/filmsContainer.js';
import {renderCard} from './components/сard.js';
import {renderSort} from './components/sort.js';
import {renderFilmsList} from './components/filmsList.js';
import {renderTopRated} from './components/topRated.js';
import {renderMostCommented} from './components/mostCommented.js';
import {generateCard} from './data.js';

const cardsAmount = {
  DEFAULT: 5,
  EXTRA: 2
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

const render = (template, node) => node.insertAdjacentHTML(`beforeend`, template);

// Рендеринг сгенерированных карточек
const renderData = (container, count) => {
  container.insertAdjacentHTML(`beforeend`, new Array(count)
    .fill(``)
    .map(generateCard)
    .map(renderCard)
    .join(``));
};

// Рендеринг «Поиск»
render(renderSearch(), header);

// Рендеринг «Звание пользователя»
render(renderRank(), header);

// Рендеринг «Меню»
render(renderMenu(), main);

// Рендеринг «Сортировки»
render(renderSort(), main);

// Рендеринг «Контент»
render(renderFilmsContainer(), main);

const filmsContainer = document.querySelector(`.films`);

// Рендеринг «Котейнер для карточек»
render(renderFilmsList(), filmsContainer);
const filmsListContainer = document.querySelector(`.films-list__container`);

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
