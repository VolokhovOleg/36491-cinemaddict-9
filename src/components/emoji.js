import {AbstractComponent} from './abstract-component.js';

export class Emoji extends AbstractComponent {
  constructor(path) {
    super();
    this._path = path;
  }

  getTemplate() {
    return `<img src="${this._path}" width="55" height="55" alt="emoji">`;
  }
}
