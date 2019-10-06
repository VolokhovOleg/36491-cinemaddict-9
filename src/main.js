import {render} from './utils.js';
import _ from 'lodash';
import API from './api.js';
import Search from './components/search.js';
import Rank from './components/rank.js';
import Menu from './components/menu.js';
import LoadMoreBtn from './components/load-more-btn.js';
import PageController from './controllers/page-controller.js';
import Sort from './components/sort.js';
import StatisticContainer from './components/statistic-container.js';
import SearchResult from './components/search-result.js';
import Preloader from './components/preloader.js';
import {unrender} from "./utils";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const preloader = new Preloader();
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const menuFilter = {
  watchList: ``,
  history: ``,
  favorite: ``,
};
let cards = [];

const setProfileRate = () => {
  const watchedFilmsAmount = _.size(cards.filter((item) => item.isWatched));
  let profileRate = ``;

  switch (true) {
    case watchedFilmsAmount === 0:
      profileRate = ``;
      break;
    case watchedFilmsAmount >= 1 && watchedFilmsAmount <= 10:
      profileRate = `novice`;
      break;
    case watchedFilmsAmount >= 11 && watchedFilmsAmount <= 20:
      profileRate = `fan`;
      break;
    case watchedFilmsAmount >= 21:
      profileRate = `movie buff`;
      break;
  }

  rateName.textContent = profileRate;
  return profileRate;
};

const countFilters = () => {
  filter.history.textContent = _.size(cards.filter((item) => item.isWatched));
  filter.favorite.textContent = _.size(cards.filter((item) => item.isFavorite));
  filter.watchList.textContent = _.size(cards.filter((item) => item.isInWatchList));
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

const rateName = document.querySelector(`.profile__rating`);


render(main, new Menu(menuFilter).getElement());

const filter = {
  watchList: document.querySelector(`.main-navigation__item[href="#watchlist"] span`),
  history: document.querySelector(`.main-navigation__item[href="#history"] span`),
  favorite: document.querySelector(`.main-navigation__item[href="#favorites"] span`),
};

render(main, preloader.getElement());

render(main, new StatisticContainer().getElement());

api.getFilms().then((films) => {
  cards = films;
  countFilters();
  const pageController = new PageController(cards, Sort, LoadMoreBtn, SearchResult);
  unrender(preloader.getElement());
  preloader.removeElement();
  pageController.init();
});

export {onDataChange, getComments, countFilters, setProfileRate};
