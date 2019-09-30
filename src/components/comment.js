import {AbstractComponent} from './abstract-component.js';
import {calcPostTime} from './../utils.js';

export class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._id = comment.id;
    this._emoji = comment.emoji;
    this._content = comment.content;
    this._author = comment.author;
    this._date = comment.date;
  }

  getTemplate() {
    return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${this._emoji}.png" width="55" height="55" alt="emoji">
  </span>
  <div>
    <p class="film-details__comment-text">${this._content}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${this._author}</span>
      <span class="film-details__comment-day">${calcPostTime(this._date)}</span>
      <button class="film-details__comment-delete" data-id="${this._id}">Delete</button>
    </p>
  </div>
</li>`;
  }
}
