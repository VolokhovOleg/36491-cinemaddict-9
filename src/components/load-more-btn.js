import AbstractComponent from './abstract-component.js';

class LoadMoreBtn extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export default LoadMoreBtn;
