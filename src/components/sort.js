import {AbstractComponent} from './abstract-component.js';

export class Sort extends AbstractComponent {
  getTemplate() {
    return `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort="default">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort="releaseDate">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort="rating">Sort by rating</a></li>
</ul>`;
  }
}
