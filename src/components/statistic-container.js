import AbstractComponent from './abstract-component.js';

class StatisticContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="statistic visually-hidden"></section>`;
  }
}

export default StatisticContainer;
