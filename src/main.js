import {Search} from './components/search.js';
import {Rank} from './components/rank.js';
import {Menu} from './components/menu.js';
import {render, _} from './utils.js';
import {LoadMoreBtn} from './components/load-more-btn.js';
import {PageController} from './controllers/page-controller.js';
import {Sort} from './components/sort.js';
import {Statistic} from './components/statistic.js';
import {SearchResult} from './components/search-result.js';
import API from './api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=5`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const filters = {
  watchList: [],
  history: [],
  favorite: [],
};
let cards = [];

const countingFilters = () => {
  const filter = {
    watchList: document.querySelector(`.main-navigation__item[href="#watchlist"] span`),
    history: document.querySelector(`.main-navigation__item[href="#history"] span`),
    favorite: document.querySelector(`.main-navigation__item[href="#favorites"] span`),
  };

  filter.watchList.textContent = _.size(cards.filter((item) => item.isInWatchList));
  filter.history.textContent = _.size(cards.filter((item) => item.isWatched));
  filter.favorite.textContent = _.size(cards.filter((item) => item.isFavorite));
};

const loadFilms = () => api.getFilms().then((films) => {
  cards = films;
  return cards;
});

const onDataChange = (data, apiMethod) => {
  let promise = null;

  switch (apiMethod) {
    case `update`: promise = api.update(data);
      break;
    case `post`: promise = api.postComment(data).then(() => loadFilms());
      break;
    case `delete`: promise = api.deleteComment(data).then(() => loadFilms());
      break;
  }

  return promise;
};

const getComments = (id) => api.getComments(id);

render(header, new Search().getElement());

render(header, new Rank().getElement());

render(main, new Menu(filters).getElement());

render(main, new Statistic().getElement());

api.getFilms().then((films) => {
  cards = films;
  countingFilters();

  const pageController = new PageController(cards, Sort, LoadMoreBtn, SearchResult);
  pageController.init();
});

export {onDataChange, getComments, countingFilters};
