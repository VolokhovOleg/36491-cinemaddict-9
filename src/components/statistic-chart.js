import AbstractComponent from './abstract-component.js';

class StatisticCharts extends AbstractComponent {
  getTemplate() {
    return `<div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>`;
  }
}

export default StatisticCharts;
