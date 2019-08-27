import {AbstractComponent} from './abstract-component.js';

export class FilmsContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="films"></section>`;
  }
}
