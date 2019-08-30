import {Search} from './components/search.js';
import {Rank} from './components/rank.js';
import {Menu} from './components/menu.js';
import {Sort} from './components/sort.js';
import {generateFilters, generateFilm} from './data.js';
import {render, getRandomInt} from './utils.js';
import {PageController} from './controllers/page-controller.js';

const cards = new Array(getRandomInt(0, 18)).fill({}).map(generateFilm);
const filters = generateFilters();
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Рендеринг «Поиск»
render(header, new Search().getElement());

// Рендеринг «Звание пользователя»
render(header, new Rank().getElement());

// Рендеринг «Меню»
render(main, new Menu(filters).getElement());

// Рендеринг «Сортировки»
render(main, new Sort().getElement());

const pageController = new PageController(main, cards);

pageController.init();
