import {FilmDetail} from '../components/film-detail.js';
import {render, unrender, setErrorEffect, _} from '../utils.js';
import {Comment} from '../components/comment.js';
import {CardsTemplate} from '../components/card.js';
import {Emoji} from '../components/emoji.js';
import {ModelComment} from '../model-comment.js';
import {getComments, onDataChange, countingFilters, setProfileRate} from '../main.js';
import CommentsBlock from '../components/comments-block.js';

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
          return this._renderCards();
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

    const setStateInputsDisabled = (state) => rateInputs.forEach((elements) => {
      elements.disabled = state;
      return elements.disabled;
    });

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
            return this._renderCards();
          })
          .catch((error) => {
            setErrorEffect(form);
            setStateInputsDisabled(false);
            throw error;
          });
      });
    });

    rateInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        const formData = new FormData(form);
        setStateInputsDisabled(true);

        this._filmData.customerRate = _.toNumber(formData.get(`score`));
        this._onDataChange(this._filmData, apiMethod.UPDATE)
          .then(() => {
            this.popUpRender(true);
            return this._renderCards();
          })
          .catch((error) => {
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
            return this._renderCards();
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

  trackComments() {
    const commentsDeleteBtn = document.querySelectorAll(`.film-details__comment-delete`);
    const commentField = document.querySelector(`.film-details__comment-input`);
    const emojiBlock = document.querySelector(`.film-details__add-emoji-label`);
    const emojiItems = document.querySelectorAll(`.film-details__emoji-item`);
    let emoji = document.querySelector(`.film-details__add-emoji-label img`);
    let emojiLink = null;

    emojiItems.forEach((input) => input.addEventListener(`change`, () => {
      const emojiTemplate = new Emoji(input.value);
      emoji = document.querySelector(`.film-details__add-emoji-label img`);
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
          case commentField.value === ``:
            setErrorEffect(commentField);
            return;
          case emoji === null:
            setErrorEffect(emojiBlock);
            return;
        }

        const entry = {
          emotion: getEmoji(),
          comment: commentField.value,
          date: Date.now(),
          id: this._filmData.id
        };

        emojiItems.forEach((input) => (input.disabled = true));
        commentField.style.border = ``;
        commentField.disabled = true;
        const newComment = new ModelComment(entry);

        this._onDataChange(newComment, apiMethod.POST)
          .then(() => {
            this._filmData.comments.push(newComment);
            this.popUpRender(true);
            return this._renderCards();
          })
          .catch((error) => {
            setErrorEffect(commentField);
            commentField.disabled = false;
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
        btn.textContent = `Deleting…`;
        const commentId = btn.getAttribute(`data-id`);
        this._onDataChange(commentId, apiMethod.DELETE)
          .then(() => {
            this._filmData.comments = deleteComment(this._filmData.comments, commentId);
            this.popUpRender(true);
            return this._renderCards();
          })
          .catch((error) => {
            btn.textContent = `Deleting`;
            throw error;
          });
      });
    });

    commentField
      .addEventListener(`focus`, () => document
        .addEventListener(`keydown`, onPressCommentKeysDown));
    commentField
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
