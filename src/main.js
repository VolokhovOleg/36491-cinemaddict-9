import {Search} from './components/search.js';
import {Rank} from './components/rank.js';
import {Menu} from './components/menu.js';
import {generateFilters} from './data.js';
import {render, setErrorEffect} from './utils.js';
import {LoadMoreBtn} from './components/load-more-btn.js';
import {PageController} from './controllers/page-controller.js';
import {Sort} from './components/sort.js';
import {Statistic} from './components/statistic.js';
import {SearchResult} from './components/search-result.js';
import {API} from './api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=7`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filters = generateFilters();
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
let cards = [];

const onDataChange = (data, apiMethod, renderCards, popUpRender = null) => {
  switch (apiMethod) {
    case `update`:
      const form = document.querySelector(`.film-details__inner`);
      const rateInputs = document.querySelectorAll(`.film-details__user-rating-input`);
      rateInputs.forEach((input) => (input.disabled = true));
      form.style.border = ``;
      api.update(data)
        .then(() => {
          if (popUpRender) {
            popUpRender();
          }
          return renderCards();
        })
        .catch((error) => {
          setErrorEffect(form);
          form.style.border = `1px solid red`;
          rateInputs.forEach((input) => (input.disabled = false));
          throw error;
        });
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
        });
      break;
  }
};

// Рендеринг «Поиск»
render(header, new Search().getElement());

// Рендеринг «Звание пользователя»
render(header, new Rank().getElement());

// Рендеринг «Меню»
render(main, new Menu(filters).getElement());

// Рендеринг Статистики
render(main, new Statistic().getElement());

api.getFilms().then((films) => {
  cards = films;

  const pageController = new PageController(main, cards, Sort, LoadMoreBtn, SearchResult, onDataChange);
  pageController.init();
});

export default api;
