import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {_} from '../utils.js';

export class StatisticController {
  constructor(cards) {
    this._cards = cards;
  }

  init() {
    const ctx = document.querySelector(`.statistic__chart`);
    const sortedGenresData = this.sortingGenresData();
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: this.setData(sortedGenresData.amount, sortedGenresData.genres),
      options: this.setOptions(),
    });
  }

  setData(data, labels) {
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: `#FBE44D`,
        borderWidth: 0,
      }],
    };
  }

  setOptions() {
    return {
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 110
        }
      },
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

  sortingGenresData() {
    const arr = _.countBy(_.flatten(this._cards.map((item) => item.genres)));
    const sortedData = {
      amount: [],
      genres: [],
    };
    let sortedArr = [];

    for (let key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        sortedArr.push({
          genre: key,
          amount: arr[key]
        });
      }
    }

    sortedArr.sort((a, b) => b.amount - a.amount);

    sortedArr.forEach((item) => {
      sortedData.amount.push(item[`amount`]);
      sortedData.genres.push(item[`genre`]);
    });

    return sortedData;
  }
}
