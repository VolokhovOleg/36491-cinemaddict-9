import AbstractComponent from './abstract-component.js';

class FilmsContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="films"></section>`;
  }
}

export default FilmsContainer;
