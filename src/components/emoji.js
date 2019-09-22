import {AbstractComponent} from './abstract-component.js';

export class Emoji extends AbstractComponent {
  constructor(emoji) {
    super();
    this._emoji = emoji;
  }

  getTemplate() {
    return `<img src="images/emoji/${this._emoji}.png" width="55" height="55" alt="emoji">`;
  }
}
