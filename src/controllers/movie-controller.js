import {FilmDetail} from '../components/film-detail.js';
import {render, unrender, getRandomInt} from '../utils.js';
import {Comment} from '../components/comment.js';
import {CardsTemplate} from '../components/card.js';
import {Emoji} from '../components/emoji.js';
import {API} from '../api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

export class MovieController {
  constructor(filmData, container, onDataChange, onChangeView) {
    this._filmData = filmData;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._popUpRender = this.popUpRender.bind(this);
    this._setDefaultView = this.setDefaultView.bind(this);
    this._container = container;
    this._popup = new FilmDetail(this._filmData);
  }

  init() {
    const card = new CardsTemplate(this._filmData);
    const cardTemplate = card.getElement();

    // Рендеринг карточек
    render(this._container, cardTemplate);
    const controlsBtns = cardTemplate.querySelectorAll(`.film-card__controls-item`);

    // Лисенеры на кнопки контролов
    controlsBtns.forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        let entry = {
          watchlist: this._filmData.isInWatchList,
          watched: this._filmData.isWatched,
          favorite: this._filmData.isFavorite,
        };
        let btnClasses = new Set(btn.getAttribute(`class`).split(` `));
        btn.classList.toggle(`film-card__controls-item--active`);

        if (btnClasses.has(`film-card__controls-item--add-to-watchlist`)) {
          entry.watchlist = !btnClasses.has(`film-card__controls-item--active`);
        }

        if (btnClasses.has(`film-card__controls-item--mark-as-watched`)) {
          entry.watched = !btnClasses.has(`film-card__controls-item--active`);
        }

        if (btnClasses.has(`film-card__controls-item--favorite`)) {
          entry.favorite = !btnClasses.has(`film-card__controls-item--active`);
        }

        this._onDataChange(this._filmData, entry);
      });
    });

    // Отслеживаю открытие попапа
    this.trackOpenedCard(cardTemplate);
  }

  trackOpenedCard(card) {
    card
      .querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`)
      .forEach((selector) => selector.addEventListener(`click`, () => {
        api.getComments(this._filmData.id).then((comments) => {
          this._filmData.comments = comments;
          this._popUpRender();
        });
      }));
  }

  // Рендеринг попапа
  popUpRender() {
    this._onChangeView();

    const body = document.querySelector(`body`);

    this._popup = new FilmDetail(this._filmData);

    render(body, this._popup.getElement());

    const controlsInputs = document.querySelectorAll(`.film-details__control-input`);

    // Лисенеры на инпуты контролов в попапе
    controlsInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        const formData = new FormData(document.querySelector(`.film-details__inner`));

        let entry = {
          watchlist: formData.get(`watchlist`) !== null,
          watched: formData.get(`watched`) !== null,
          favorite: formData.get(`favorite`) !== null,
        };

        this._onDataChange(this._filmData, entry, this._popUpRender);
      });
    });

    // Отслеживаю закрытие попапа
    this.trackClosedPopup();

    const commentList = document.querySelector(`.film-details__comments-list`);

    // Рендеринг комментариев
    this._filmData.comments.map((comment) => render(commentList, new Comment(comment).getElement()));

    // Чтобы не было двойного скрола
    body.style = `overflow: hidden;`;

    // Отслеживаю удаление комментария
    this.trackComments();
  }

  // Метод отслеживаю закрытие попапа
  trackClosedPopup() {
    const commentArea = document.querySelector(`.film-details__comment-input`);
    const popupTemplate = document.querySelector(`.film-details`);
    const body = document.querySelector(`body`);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(popupTemplate);
        this._popup.removeElement();
        body.style = ``;
        document.removeEventListener(`keydown`, onEscKeyDown);
        document.removeEventListener(`focus`, removeOnEscListener);
        document.removeEventListener(`blur`, addOnEscListener);
      }
    };

    const removeOnEscListener = () => document.removeEventListener(`keydown`, onEscKeyDown);
    const addOnEscListener = () => document.addEventListener(`keydown`, onEscKeyDown);

    addOnEscListener();

    commentArea.addEventListener(`focus`, removeOnEscListener);
    commentArea.addEventListener(`blur`, addOnEscListener);

    document.querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      unrender(popupTemplate);
      removeOnEscListener();
      this._popup.removeElement();
      commentArea.removeEventListener(`focus`, removeOnEscListener);
      commentArea.removeEventListener(`blur`, addOnEscListener);
      body.style = ``;
    });
  }

  // Метод отслеживаю изменения комментариев
  trackComments() {
    const commentsDeleteBtn = document.querySelectorAll(`.film-details__comment-delete`);
    const commentField = document.querySelector(`.film-details__comment-input`);
    const emojiBlock = document.querySelector(`.film-details__add-emoji-label`);
    const emojiItems = document.querySelectorAll(`.film-details__emoji-item`);
    let emojiLink = null;
    let entry = {};

    // Лисенеры на инпуты эмодзи
    emojiItems.forEach((input) => input.addEventListener(`change`, () => {
      const emojiTemplate = new Emoji(input.value);
      const emoji = document.querySelector(`.film-details__add-emoji-label img`);

      if (emoji) {
        unrender(emoji);
        emojiLink.removeElement();
      }

      emojiLink = emojiTemplate;

      render(emojiBlock, emojiTemplate.getElement());
    }));

    const checkEmojiSrc = () => {
      const emoji = document.querySelector(`.film-details__add-emoji-label img`);
      return emoji ? emoji.getAttribute(`src`) : ``;
    };

    const sendCommentKeysDown = (evt) => {
      if (evt.key === `Control`) {
        entry = {
          data: {
            id: getRandomInt(0, 9999999999999),
            emoji: checkEmojiSrc(),
            author: [
              `Tim Macoveev`,
              `John Doe`,
              `Heinz Herald`,
              `Dan Duryea`,
            ][getRandomInt(0, 3)],
            content: commentField.value,
            date: new Date(),
          },
        };
        this._onDataChange(this._filmData, null, this._popUpRender, entry);
        document.removeEventListener(`keydown`, sendCommentKeysDown);
      }
    };

    commentsDeleteBtn.forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        entry = {
          data: null,
          id: btn.getAttribute(`data-id`),
        };

        this._onDataChange(this._filmData, null, this._popUpRender, entry);
      });
    });

    commentField.addEventListener(`focus`, () => document.addEventListener(`keydown`, sendCommentKeysDown));
    commentField.addEventListener(`blur`, () => document.removeEventListener(`keydown`, sendCommentKeysDown));
  }

  setDefaultView() {
    if (document.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }
}
