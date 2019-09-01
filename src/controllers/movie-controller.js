import {FilmDetail} from '../components/film-detail.js';
import {render, unrender} from '../utils.js';
import {Comment} from '../components/comment.js';
import {CardsTemplate} from '../components/card.js';
import {Emoji} from "../components/emoji";

export class MovieController {
  constructor(filmData, container, onDataChange, onChangeView, context) {
    this._filmData = filmData;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._context = context;
    this.popupLink = null;
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

        this._onDataChange(this._filmData, btn, this._context);
      });
    });

    // Отслеживаю открытие попапа
    this.trackOpenedCard(cardTemplate);
  }

  trackOpenedCard(card) {
    card
      .querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`)
      .forEach((selector) => selector.addEventListener(`click`, () => {
        this._onChangeView(this._context, this);
        this.popUpRender();
      }));
  }

  // Рендеринг попапа
  popUpRender() {
    const body = document.querySelector(`body`);
    const popup = new FilmDetail(this._filmData);
    this.popupLink = popup;

    render(body, popup.getElement());

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

        this._onDataChange(
            this._filmData,
            entry,
            this._context,
            this.popUpRender,
            true,
            this);
      });
    });

    // Отслеживаю закрытие попапа
    this.trackClosedPopup(popup);

    const commentList = document.querySelector(`.film-details__comments-list`);

    // Рендеринг комментариев
    this._filmData.comments.map((comment) => render(commentList, new Comment(comment).getElement()));

    // Чтобы не было двойного скрола
    body.style = `overflow: hidden;`;

    // Меняю эмодзи
    this.swapEmoji(popup);
  }

  // етод отслеживаю закрытие попапа
  trackClosedPopup(popup) {
    const commentArea = document.querySelector(`.film-details__comment-input`);
    const popupTemplate = document.querySelector(`.film-details`);
    const body = document.querySelector(`body`);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(popupTemplate);
        popup.removeElement();
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
      popup.removeElement();
      commentArea.removeEventListener(`focus`, removeOnEscListener);
      commentArea.removeEventListener(`blur`, addOnEscListener);
      body.style = ``;
    });
  }

  // Функция замены эмодзи
  swapEmoji(popup) {
    const emojiBlock = document.querySelector(`.film-details__add-emoji-label`);
    const emojiItems = document.querySelectorAll(`.film-details__emoji-item`);
    let emojiLink = null;

    // Лисенеры на инпуты эмодзи
    emojiItems.forEach((input) => input.addEventListener(`change`, () => {
      let emojiTemplate = new Emoji(popup._emoji[input.value]);
      const emoji = document.querySelector(`.film-details__add-emoji-label img`);

      if (emoji) {
        unrender(emoji);
        emojiLink.removeElement();
      }

      emojiLink = (emojiTemplate);

      render(emojiBlock, emojiTemplate.getElement());
    }));
  }

  setDefaultView(context) {
    if (context.popupLink) {
      unrender(context.popupLink.getElement());
      context.popupLink.removeElement();
    }
  }
}
