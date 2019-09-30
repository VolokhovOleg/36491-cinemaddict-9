import {Search} from './components/search.js';
import {Rank} from './components/rank.js';
import {Menu} from './components/menu.js';
import {render, setErrorEffect} from './utils.js';
import {LoadMoreBtn} from './components/load-more-btn.js';
import {PageController} from './controllers/page-controller.js';
import {Sort} from './components/sort.js';
import {Statistic} from './components/statistic.js';
import {SearchResult} from './components/search-result.js';
import API from './api.js';
import {_} from "./utils";

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

const onDataChange = (data, apiMethod, renderCards, popUpRender = null) => {
  let promise = null;

  switch (apiMethod) {
    case `update`:
      promise = api.update(data);
      break;
    case `post`:
      const commentArea = document.querySelector(`.film-details__comment-input`);
      const smileInputs = document.querySelectorAll(`.film-details__emoji-item`);
      smileInputs.forEach((input) => (input.disabled = true));
      commentArea.style.border = ``;
      commentArea.disabled = true;
      api.postComment(data)
        .then(() => {
          return api.getFilms().then((films) => {
            cards = films;

            if (popUpRender) {
              popUpRender();
            }

            return renderCards(cards);
          });
        })
        .catch((error) => {
          setErrorEffect(commentArea);
          commentArea.disabled = false;
          commentArea.style.border = `1px solid red`;
          smileInputs.forEach((input) => {
            input.disabled = false;
          });
          throw error;
        });

      break;
    case `delete`:
      api.deleteComment(data)
        .then(() => {
          return api.getFilms().then((films) => {
            cards = films;

            if (popUpRender) {
              popUpRender();
            }

            return renderCards(cards);
          });
        })
        .catch((error) => {
          document
            .querySelector(`.film-details__comment-delete[data-id="${data}"]`)
            .textContent = `Delete`;
          throw error;
        });
      break;
  }
  return promise;
};

export const getComments = (id) => api.getComments(id);

render(header, new Search().getElement());

render(header, new Rank().getElement());

render(main, new Menu(filters).getElement());

render(main, new Statistic().getElement());

api.getFilms().then((films) => {
  cards = films;
  countingFilters();

  const pageController = new PageController(main, cards, Sort, LoadMoreBtn, SearchResult, onDataChange);
  pageController.init();
});
