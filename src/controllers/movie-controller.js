import {FilmDetail} from '../components/film-detail.js';
import {render, unrender} from '../utils.js';
import {Comment} from '../components/comment.js';
import {CardsTemplate} from '../components/card.js';
import {Emoji} from "../components/emoji";

export class MovieController {
  constructor(filmData, onChangeView, renderCards) {
    this._filmData = filmData;
    this.popupLink = null;
    this._renderCards = renderCards;
  }

  init() {
    const card = new CardsTemplate(this._filmData);
    const cardTemplate = card.getElement();
    const filmsListContainer = document.querySelector(`.films-list__container`);

    // Рендеринг карточек
    render(filmsListContainer, cardTemplate);
    const controlsBtns = cardTemplate.querySelectorAll(`.film-card__controls-item`);

    // Лисенеры на кнопки контролов
    controlsBtns.forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.onDataChange(this._filmData, btn);
      });
    });

    // Отслеживаю открытие попапа
    this.trackOpenedCard(cardTemplate);
  }

  trackOpenedCard(card) {
    card
      .querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`)
      .forEach((selector) => selector.addEventListener(`click`, () => {
        this.popUpRender();
      }));
  }

  // Метод onDataChange, который получает на вход обновленные данные
  onDataChange(newCardData, changedElems, popUpRender, isPopupOpen = false) {
    const filmsMarkUp = document.querySelectorAll(`.film-card`);

    // Если попап был закрыт
    if (!isPopupOpen) {

      // Проверяю какая кнопка на кароточке была нажата и обновляю данные.
      // Получился хардкод, но лучше не придумал как проверять кнопки :(.
      const btnClasses = new Set(changedElems.getAttribute(`class`).split(` `));
      if (btnClasses.has(`film-card__controls-item--active`)) {
        if (btnClasses.has(`film-card__controls-item--add-to-watchlist`)) {
          newCardData.isInWatchList = false;
        }

        if (btnClasses.has(`film-card__controls-item--mark-as-watched`)) {
          newCardData.isWatched = false;
        }

        if (btnClasses.has(`film-card__controls-item--favorite`)) {
          newCardData.isFavorite = false;
        }
      } else {
        if (btnClasses.has(`film-card__controls-item--add-to-watchlist`)) {
          newCardData.isInWatchList = true;
        }

        if (btnClasses.has(`film-card__controls-item--mark-as-watched`)) {
          newCardData.isWatched = true;
        }

        if (btnClasses.has(`film-card__controls-item--favorite`)) {
          newCardData.isFavorite = true;
        }
      }

      // Если попап был открыт
    } else {

      // Обновляю данные
      newCardData.isInWatchList = changedElems.watchlist;
      newCardData.isWatched = changedElems.watched;
      newCardData.isFavorite = changedElems.favorite;
    }

    // Далее обновляю и удаляю из дома элементы и ренедерю с новыми данными
    filmsMarkUp.forEach((item) => item.remove());

    if (isPopupOpen) {
      document.querySelector(`.film-details`).remove();
      popUpRender();
    }

    this._renderCards();
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

        this.onDataChange(
            this._filmData,
            entry,
            this.popUpRender,
            true);
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

  // Метод отслеживаю закрытие попапа
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

  setDefaultView() {
    if (this.popupLink) {
      unrender(this.popupLink.getElement());
      this.popupLink.removeElement();
    }
  }
}
