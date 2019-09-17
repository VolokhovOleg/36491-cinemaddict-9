import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {_} from "../utils";

export class StatisticController {
  constructor(cards) {
    this._cards = cards;
  }

  init() {
    const data = _.values(_.countBy(_.flatten(this._cards.map((item) => item.genres))));
    const genres = _.keys(_.countBy(_.flatten(this._cards.map((item) => item.genres))));
    const ctx = document.querySelector(`.statistic__chart`);

    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: this.data(data, genres),
      options: this.options(),
    });
  }

  data(data, labels) {
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: `#FBE44D`,
        borderWidth: 0,
      }],
    };
  }

  options() {
    return {
      plugins: {
        datalabels: {
          color: `#ffffff`,
          font: {
            size: 20
          },
          align: `start`,
          anchor: `start`,
          offset: 40
        },
      },
      scales: {
        yAxes: [{
          barThickness: 25,
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    };
  }
}
