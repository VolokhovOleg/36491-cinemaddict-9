import {AbstractComponent} from './abstract-component.js';

export class LoadMoreBtn extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}
