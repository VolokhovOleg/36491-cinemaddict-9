import {FilmDetail} from '../components/film-detail.js';
import {render, unrender, setErrorEffect, _} from '../utils.js';
import {Comment} from '../components/comment.js';
import {CardsTemplate} from '../components/card.js';
import {Emoji} from '../components/emoji.js';
import {ModelComment} from '../model-comment.js';
import {getComments, onDataChange, countingFilters, setProfileRate} from '../main.js';
import CommentsBlock from '../components/comments-block.js';
import {DOMPurify} from './../utils.js';

const DELAY = 300;
const apiMethod = {
  DELETE: `delete`,
  UPDATE: `update`,
  POST: `post`,
};

export class MovieController {
  constructor(filmData, container, onChangeView, renderCards) {
    this._filmData = filmData;
    this._onDataChange = onDataChange;
    this._renderCards = renderCards;
    this._onChangeView = onChangeView;
    this._countingFilters = countingFilters;
    this._setProfileRate = setProfileRate;
    this._setDefaultView = this.setDefaultView.bind(this);
    this._container = container;
    this._popup = new FilmDetail(this._filmData);
    this._comments = [];
    this._body = document.querySelector(`body`);
    this._commentField = ``;
    this._setStateElementsDisabled = (elements, state) => elements.forEach((items) => {
      items.disabled = state;
      return items.disabled;
    });
  }

  init() {
    const card = new CardsTemplate(this._filmData);
    const cardTemplate = card.getElement();

    render(this._container, cardTemplate);
    const controlsButtons = cardTemplate.querySelectorAll(`.film-card__controls-item`);

    const changeControlsState = _.throttle((btn) => {
      const btnClasses = new Set(btn.getAttribute(`class`).split(` `));
      const className = {
        watchList: `film-card__controls-item--add-to-watchlist`,
        watched: `film-card__controls-item--mark-as-watched`,
        favorite: `film-card__controls-item--favorite`,
        active: `film-card__controls-item--active`,
      };
      const isBtnActive = btnClasses.has(className.active);

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

      this._onDataChange(this._filmData, apiMethod.UPDATE)
        .then(() => {
          this._setProfileRate();
          this._countingFilters();
          return this._renderCards(true);
        })
        .catch((error) => {
          throw error;
        });
    }, DELAY);

    controlsButtons.forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        changeControlsState(btn);
      });
    });

    this.trackOpenedCard(cardTemplate);
  }

  trackOpenedCard(card) {
    card
      .querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`)
      .forEach((selector) => selector
        .addEventListener(`click`, () => this.popUpRender(true)));
  }

  popUpRender() {
    this._onChangeView();

    this._popup = new FilmDetail(this._filmData);

    render(this._body, this._popup.getElement());

    const controlsInputs = document.querySelectorAll(`.film-details__control-input`);
    const rateInputs = document.querySelectorAll(`.film-details__user-rating-input`);
    const form = document.querySelector(`.film-details__inner`);
    const rateBlock = document.querySelector(`.film-details__user-rating-wrap`);

    controlsInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        const formData = new FormData(form);
        this._filmData.isInWatchList = formData.get(`watchlist`) !== null;
        this._filmData.isWatched = formData.get(`watched`) !== null;
        this._filmData.isFavorite = formData.get(`favorite`) !== null;

        this._onDataChange(this._filmData, apiMethod.UPDATE)
          .then(() => {
            form.style.border = ``;
            this._countingFilters();
            this.popUpRender(true);
            return this._renderCards(true);
          })
          .catch((error) => {
            input.checked = !input.checked;
            setErrorEffect(form);
            this._setStateElementsDisabled(rateInputs, false);
            throw error;
          });
      });
    });

    rateInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        const formData = new FormData(form);
        this._setStateElementsDisabled(rateInputs, true);

        this._filmData.customerRate = _.toNumber(formData.get(`score`));
        this._onDataChange(this._filmData, apiMethod.UPDATE)
          .then(() => {
            this.popUpRender(true);
            return this._renderCards(true);
          })
          .catch((error) => {
            input.checked = false;
            this._setStateElementsDisabled(rateInputs, false);
            throw error;
          });
      });
    });

    if (rateBlock) {
      const resetRateBtn = rateBlock.querySelector(`.film-details__watched-reset`);
      const checkedRate = rateBlock
        .querySelector(`.film-details__user-rating-input[value="${this._filmData.customerRate}"]`);

      checkedRate.checked = true;

      resetRateBtn.addEventListener(`click`, () => {
        this._filmData.isWatched = false;
        this._onDataChange(this._filmData, apiMethod.UPDATE)
          .then(() => {
            this.popUpRender(true);
            return this._renderCards(true);
          })
          .catch((error) => {
            throw error;
          });
      });
    }

    this._body.style = `overflow: hidden;`;

    this.renderComments();
  }

  trackClosedPopup() {
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

    this._commentField.addEventListener(`focus`, removeOnEscListener);
    this._commentField.addEventListener(`blur`, addOnEscListener);

    document.querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      unrender(popupTemplate);
      removeOnEscListener();
      this._popup.removeElement();
      this._commentField.removeEventListener(`focus`, removeOnEscListener);
      this._commentField.removeEventListener(`blur`, addOnEscListener);
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
        return this._comments.forEach((comment) => render(commentList, new Comment(comment).getElement()));
      })
      .then(() => {
        this._commentField = document.querySelector(`.film-details__comment-input`);
        this.trackClosedPopup();
        return this.trackComments();
      });
  }

  trackComments() {
    const commentsDeleteBtn = document.querySelectorAll(`.film-details__comment-delete`);
    const emojiBlock = document.querySelector(`.film-details__add-emoji-label`);
    const emojiItems = document.querySelectorAll(`.film-details__emoji-item`);
    let emoji = document.querySelector(`.film-details__add-emoji-label img`);
    let emojiLink = null;

    emojiItems.forEach((input) => input.addEventListener(`change`, () => {
      const emojiTemplate = new Emoji(input.value);
      emoji = document.querySelector(`.film-details__add-emoji-label img`);
      emojiBlock.style.border = ``;

      if (emoji) {
        unrender(emoji);
        emojiLink.removeElement();
      }

      emojiLink = emojiTemplate;

      render(emojiBlock, emojiTemplate.getElement());
    }));

    const getEmoji = () => {
      const emojiList = document.querySelectorAll(`.film-details__emoji-item`);
      const emotion = _.toArray(emojiList).filter((item) => item.checked);
      return _.isEmpty(emotion) ? `` : emotion[0].value;
    };

    const onPressCommentKeysDown = (evt) => {
      if (evt.ctrlKey && evt.key === `Enter`) {
        emoji = document.querySelector(`.film-details__add-emoji-label img`);

        switch (true) {
          case this._commentField.value === ``:
            setErrorEffect(this._commentField);
            return;
          case emoji === null:
            setErrorEffect(emojiBlock);
            return;
        }

        const entry = {
          emotion: DOMPurify.sanitize(getEmoji()),
          comment: DOMPurify.sanitize(this._commentField.value),
          date: parseInt(DOMPurify.sanitize(Date.now()), 10),
          id: this._filmData.id,
        };

        emojiItems.forEach((input) => (input.disabled = true));
        this._commentField.style.border = ``;
        this._commentField.disabled = true;
        const newCommentData = new ModelComment(entry);

        this._onDataChange(newCommentData, apiMethod.POST)
          .then((data) => {
            const newComments = data.filter((item) => item.id === newCommentData.id);
            this._filmData.comments = newComments.map((item) => DOMPurify.sanitize(item));
            this.popUpRender(true);
            return this._renderCards(true);
          })
          .catch((error) => {
            setErrorEffect(this._commentField);
            this._commentField.disabled = false;
            emojiItems.forEach((input) => {
              input.disabled = false;
            });
            throw error;
          });

        document.removeEventListener(`keydown`, onPressCommentKeysDown);
      }
    };

    const deleteComment = (arr, commentId) => arr.filter((comment) => comment !== commentId);

    commentsDeleteBtn.forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._setStateElementsDisabled(commentsDeleteBtn, true);
        btn.textContent = `Deleting…`;
        const commentId = btn.getAttribute(`data-id`);
        this._onDataChange(commentId, apiMethod.DELETE)
          .then(() => {
            this._filmData.comments = deleteComment(this._filmData.comments, commentId);
            this.popUpRender(true);
            return this._renderCards(true);
          })
          .catch((error) => {
            this._setStateElementsDisabled(commentsDeleteBtn, false);
            btn.textContent = `Delete`;
            throw error;
          });
      });
    });

    this._commentField
      .addEventListener(`focus`, () => document
        .addEventListener(`keydown`, onPressCommentKeysDown));
    this._commentField
      .addEventListener(`blur`, () => document
        .removeEventListener(`keydown`, onPressCommentKeysDown));
  }

  setDefaultView() {
    if (document.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }
}
