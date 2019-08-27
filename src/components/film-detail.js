import {checkWordEnding, checkChecked, convertMonth, unrender} from './../utils.js';
import {AbstractComponent} from './abstract-component.js';

export class FilmDetail extends AbstractComponent {
  constructor({poster, title, ratingSystem, rating, director, writers, actors, releaseDate, runningTime, country, genres, description, comments, isInWatchList, isWatched, isFavorite}) {
    super();
    this._poster = poster;
    this._title = title;
    this._ratingSystem = ratingSystem;
    this._rating = rating;
    this._director = director;
    this._writers = writers;
    this._actors = actors;
    this._releaseDate = releaseDate;
    this._runningTime = runningTime;
    this._country = country;
    this._genres = genres;
    this._description = description;
    this._comments = comments;
    this._isInWatchList = isInWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

          <p class="film-details__age">${this._ratingSystem}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">${this._title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${this._director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${this._writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${this._actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${this._releaseDate.getDay()} ${convertMonth(this._releaseDate.getMonth())} ${this._releaseDate.getFullYear()} </td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${this._runningTime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${checkWordEnding(this._genres.length)}</td>
              <td class="film-details__cell">
                ${Array.from(this._genres).map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${this._description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkChecked(this._isInWatchList)}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkChecked(this._isWatched)}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkChecked(this._isFavorite)}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comment${checkWordEnding(this._comments.length)} <span class="film-details__comments-count">${this._comments.length}</span></h3>

        <ul class="film-details__comments-list"></ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
            <label class="film-details__emoji-label" for="emoji-gpuke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
  }

  trackClosedPopup() {
    let commentArea = document.querySelector(`.film-details__comment-input`);
    let popup = document.querySelector(`.film-details`);
    let body = document.querySelector(`body`);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(popup);
        this.removeElement();
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
      unrender(popup);
      removeOnEscListener();
      this.removeElement();
      commentArea.removeEventListener(`focus`, removeOnEscListener);
      commentArea.removeEventListener(`blur`, addOnEscListener);
      body.style = ``;
    });
  }
}
