import AbstractComponent from './abstract-component.js';

class TopRate extends AbstractComponent {
  getTemplate() {
    return `<section class="films-list--extra">
  <h2 class="films-list__title">Top rated</h2>

  <div class="films-list__container"></div>
</section>`;
  }
}

export default TopRate;
