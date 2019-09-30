import {FilmDetail} from '../components/film-detail.js';
import {render, unrender, _} from '../utils.js';
import {Comment} from '../components/comment.js';
import {CardsTemplate} from '../components/card.js';
import {Emoji} from '../components/emoji.js';
import {ModelComment} from '../model-comment.js';
import {getComments} from '../main.js';
import CommentsBlock from "../components/comments-block";
import {setErrorEffect} from "../utils";

export class MovieController {
  constructor(filmData, container, onDataChange, onChangeView, renderCards, countingFilters) {
    this._filmData = filmData;
    this._onDataChange = onDataChange;
    this._renderCards = renderCards;
    this._onChangeView = onChangeView;
    this._countingFilters = countingFilters;
    this._popUpRender = this.popUpRender.bind(this);
    this._setDefaultView = this.setDefaultView.bind(this);
    this._container = container;
    this._popup = new FilmDetail(this._filmData);
    this._comments = [];
    this._body = document.querySelector(`body`);
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

        const btnClasses = new Set(btn.getAttribute(`class`).split(` `));
        const className = {
          watchList: `film-card__controls-item--add-to-watchlist`,
          watched: `film-card__controls-item--mark-as-watched`,
          favorite: `film-card__controls-item--favorite`,
        };
        const isBtnActive = btnClasses.has(`film-card__controls-item--active`);

        switch (true) {
          case btnClasses.has(className.watchList) && !isBtnActive:
            this._filmData.isInWatchList = true;
            break;
          case btnClasses.has(className.watched) && !isBtnActive:
            this._filmData.isWatched = true;
            break;
          case btnClasses.has(className.favorite) && !isBtnActive:
            this._filmData.isFavorite = true;
            break;
          case btnClasses.has(className.watchList) && isBtnActive:
            this._filmData.isInWatchList = false;
            break;
          case btnClasses.has(className.watched) && isBtnActive:
            this._filmData.isWatched = false;
            break;
          case btnClasses.has(className.favorite) && isBtnActive:
            this._filmData.isFavorite = false;
            break;
        }

        this._onDataChange(this._filmData, `update`, this._renderCards);
      });
    });

    // Отслеживаю открытие попапа
    this.trackOpenedCard(cardTemplate);
  }

  trackOpenedCard(card) {
    card
      .querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`)
      .forEach((selector) => selector
        .addEventListener(`click`, () => this._popUpRender(true)));
  }

  // Рендеринг попапа
  popUpRender() {
    this._onChangeView();

    this._popup = new FilmDetail(this._filmData);

    render(this._body, this._popup.getElement());

    const controlsInputs = document.querySelectorAll(`.film-details__control-input`);
    const rateInputs = document.querySelectorAll(`.film-details__user-rating-input`);
    const form = document.querySelector(`.film-details__inner`);
    const rateBlock = document.querySelector(`.film-details__user-rating-wrap`);

    // Лисенеры на инпуты контролов в попапе
    controlsInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        const formData = new FormData(form);
        this._filmData.isInWatchList = formData.get(`watchlist`) !== null;
        this._filmData.isWatched = formData.get(`watched`) !== null;
        this._filmData.isFavorite = formData.get(`favorite`) !== null;
        
        this._onDataChange(this._filmData, `update`, this._renderCards, this._popUpRender)
          .then(() => {
            if (this._popUpRender) {
              form.style.border = ``;
              this._popUpRender(true);
            }
            this._countingFilters();
            return this._renderCards();
          })
              .catch((error) => {
                setErrorEffect(form);
                form.style.border = `1px solid red`;
                rateInputs.forEach((elements) => (elements.disabled = false));
                throw error;
              });
      });
    });

    rateInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        const formData = new FormData(form);
        rateInputs.forEach((element) => (element.disabled = true));

        this._filmData.customerRate = _.toNumber(formData.get(`score`));
        this._onDataChange(this._filmData, `update`, this._renderCards, this._popUpRender);
      });
    });

    if (rateBlock) {
      const resetRateBtn = rateBlock.querySelector(`.film-details__watched-reset`);
      const checkedRate = rateBlock
        .querySelector(`.film-details__user-rating-input[value="${this._filmData.customerRate}"]`);

      checkedRate.checked = true;

      resetRateBtn.addEventListener(`click`, () => {
        this._filmData.isWatched = false;
        this._onDataChange(this._filmData, `update`, this._renderCards, this._popUpRender);
      });
    }

    this._body.style = `overflow: hidden;`;

    this.renderComments();
  }

  // Метод отслеживаю закрытие попапа
  trackClosedPopup() {
    const commentArea = document.querySelector(`.film-details__comment-input`);
    const popupTemplate = document.querySelector(`.film-details`);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(popupTemplate);
        this._popup.removeElement();
        this._body.style = ``;
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
      this._body.style = ``;
    });
  }

  renderComments() {
    const commentsWrap = document.querySelector(`.form-details__bottom-container`);

    getComments(this._filmData.id)
      .then((data) => {
        this._comments = data;
        const commentsBlock = new CommentsBlock(this._comments);
        render(commentsWrap, commentsBlock.getElement());
        const commentList = commentsWrap.querySelector(`.film-details__comments-list`);
        this._comments.forEach((comment) => render(commentList, new Comment(comment).getElement()));
        this.trackComments();
        this.trackClosedPopup();
      });
  }

  // Метод отслеживаю изменения комментариев
  trackComments() {
    const commentsDeleteBtn = document.querySelectorAll(`.film-details__comment-delete`);
    const commentField = document.querySelector(`.film-details__comment-input`);
    const emojiBlock = document.querySelector(`.film-details__add-emoji-label`);
    const emojiItems = document.querySelectorAll(`.film-details__emoji-item`);
    let emojiLink = null;

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
      const emojiList = document.querySelectorAll(`.film-details__emoji-item`);
      const emotion = _.toArray(emojiList).filter((item) => item.checked);
      return _.isEmpty(emotion) ? `` : emotion[0].value;
    };

    const sendCommentKeysDown = (evt) => {
      if (evt.ctrlKey && evt.key === `Enter`) {

        const entry = {
          emotion: checkEmojiSrc(),
          comment: commentField.value,
          date: Date.now(),
          id: this._filmData.id
        };

        this._onDataChange(new ModelComment(entry), `post`, this._renderCards, this._popUpRender);
        document.removeEventListener(`keydown`, sendCommentKeysDown);
      }
    };

    commentsDeleteBtn.forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        btn.textContent = `Deleting…`;
        const commentId = btn.getAttribute(`data-id`);
        this._onDataChange(commentId, `delete`, this._renderCards, this._popUpRender);
      });
    });

    commentField
      .addEventListener(`focus`, () => document.addEventListener(`keydown`, sendCommentKeysDown));
    commentField
      .addEventListener(`blur`, () => document.removeEventListener(`keydown`, sendCommentKeysDown));
  }

  setDefaultView() {
    if (document.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }
}
