import AbstractComponent from './abstract-component.js';

class SearchResult extends AbstractComponent {
  getTemplate() {
    return `<div class="result visually-hidden">
      <p class="result__text">Result <span class="result__count"></span></p>
    </div>`;
  }
}

export default SearchResult;
