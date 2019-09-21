import {Search} from './components/search.js';
import {Rank} from './components/rank.js';
import {Menu} from './components/menu.js';
import {generateFilters, generateFilm} from './data.js';
import {render, getRandomInt, _} from './utils.js';
import {LoadMoreBtn} from './components/load-more-btn.js';
import {PageController} from './controllers/page-controller.js';
import {Sort} from './components/sort.js';
import {Statistic} from './components/statistic.js';
import {SearchResult} from './components/search-result.js';
import {API} from './api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filters = generateFilters();
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Рендеринг «Поиск»
render(header, new Search().getElement());

// Рендеринг «Звание пользователя»
render(header, new Rank().getElement());

// Рендеринг «Меню»
render(main, new Menu(filters).getElement());

// Рендеринг Статистики
render(main, new Statistic().getElement());

api.getData().then((cards) => {
  const pageController = new PageController(main, cards, Sort, LoadMoreBtn, SearchResult);
  pageController.init();
});
