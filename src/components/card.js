import {checkWordEnding, cutText} from './../utils.js';
import {AbstractComponent} from './abstract-component.js';

const checkControls = (isCheck) => isCheck ? `film-card__controls-item--active` : ``;

export class CardsTemplate extends AbstractComponent {
  constructor({title, rating, releaseDate, runningTime, genres, poster, description, comments, isInWatchList, isWatched, isFavorite, id}) {
    super();
    this._title = title;
    this._rating = rating;
    this._releaseDate = releaseDate;
    this._runningTime = runningTime;
    this._genres = genres;
    this._poster = poster;
    this._description = description;
    this._comments = comments;
    this._isInWatchList = isInWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
    this._id = id;
  }

  getTemplate() {
    return `<article class="film-card" id="${this._id}">
  <h3 class="film-card__title">${this._title}</h3>
  <p class="film-card__rating">${this._rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${this._releaseDate.getFullYear()}</span>
    <span class="film-card__duration">${this._runningTime}</span>
    <span class="film-card__genre">${Array.from(this._genres)[0]}</span>
  </p>
  <img src="./${this._poster}" alt="${this._title}" class="film-card__poster">
  <p class="film-card__description">${cutText(this._description)}</p>
  <a class="film-card__comments">${this._comments.length} comment${checkWordEnding(this._comments.length)}</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkControls(this._isInWatchList)}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkControls(this._isWatched)}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${checkControls(this._isFavorite)}">Mark as favorite</button>
  </form>
</article>`;
  }
}
