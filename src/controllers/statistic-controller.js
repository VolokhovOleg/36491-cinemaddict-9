import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {millisecondsInWords, render, unrender} from '../utils.js';
import _ from 'lodash';
import {setProfileRate} from './../main.js';
import StatisticRank from './../components/statistic-rank.js';
import StatisticFilters from './../components/statistic-filters.js';
import StatisticTextList from './../components/statistic-text-list.js';
import StatisticCharts from './../components/statistic-chart.js';

const statisticPeriod = {
  ALL_TIME: `all-time`,
  DAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

class StatisticController {
  constructor(cards) {
    this._cards = this.foldWatchedFilm(cards);
    this._filteredCards = [...this._cards];
    this._statisticContainer = document.querySelector(`.statistic`);
    this._checkedStatisticPeriod = statisticPeriod.ALL_TIME;
    this._rank = setProfileRate();
    this._sortedGenresData = this.sortingGenresData();
    this._totalTime = null;
    this._topGenre = null;
    this._StatisticRank = new StatisticRank(this._rank);
    this._StatisticFilters = null;
    this._StatisticTextList = null;
    this._StatisticCharts = null;
    this._Chart = null;
    this._ctx = null;
    this._cartsConfig = {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: this.setData(this._sortedGenresData.amount, this._sortedGenresData.genres),
      options: this.setOptions(),
    };
  }

  init() {
    if (_.isEmpty(this._filteredCards)) {
      this._totalTime = 0;
      this._topGenre = `-`;
    } else {
      this._totalTime = this.foldWatchedTime();
      this._sortedGenresData = this.sortingGenresData();
      this._topGenre = _.head(this._sortedGenresData.genres);
      this._cartsConfig.data = this.setData(this._sortedGenresData.amount, this._sortedGenresData.genres);
    }

    this._StatisticFilters = new StatisticFilters();
    this._StatisticTextList = new StatisticTextList(_.size(this._filteredCards), this._totalTime, this._topGenre);
    this._StatisticCharts = new StatisticCharts();

    render(this._statisticContainer, this._StatisticRank.getElement());
    render(this._statisticContainer, this._StatisticFilters.getElement());
    render(this._statisticContainer, this._StatisticTextList.getElement());
    render(this._statisticContainer, this._StatisticTextList.getElement());

    if (!_.isEmpty(this._filteredCards)) {
      render(this._statisticContainer, this._StatisticCharts.getElement());
      this._ctx = document.querySelector(`.statistic__chart`);
      this._Chart = new Chart(this._ctx, this._cartsConfig);
    }

    this.toFilterStatistic();
  }

  removeAllElements() {
    unrender(this._StatisticRank.getElement());
    this._StatisticRank.removeElement();
    unrender(this._StatisticFilters.getElement());
    this._StatisticFilters.removeElement();
    unrender(this._StatisticTextList.getElement());
    this._StatisticTextList.removeElement();
    unrender(this._StatisticTextList.getElement());
    this._StatisticTextList.removeElement();
    unrender(this._StatisticCharts.getElement());
    this._StatisticCharts.removeElement();
    this._Chart.destroy();
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
          bottom: 110,
        }
      },
      plugins: {
        datalabels: {
          color: `#ffffff`,
          font: {
            size: 20,
          },
          align: `start`,
          anchor: `start`,
          offset: 40,
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
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
    const genres = _.countBy(_.flatten(this._filteredCards.map((item) => item.genres)));
    const sortedData = {
      amount: [],
      genres: [],
    };
    let sortedGenres = [];

    for (const key in genres) {
      if (Object.prototype.hasOwnProperty.call(genres, key)) {
        sortedGenres.push({
          genre: key,
          amount: genres[key],
        });
      }
    }

    sortedGenres.sort((a, b) => b.amount - a.amount);

    sortedGenres.forEach((item) => {
      sortedData.amount.push(item[`amount`]);
      sortedData.genres.push(item[`genre`]);
    });

    return sortedData;
  }

  toFilterStatistic() {
    const statisticForm = document.querySelector(`.statistic__filters`);
    const statisticInputs = statisticForm.querySelectorAll(`.statistic__filters-input`);
    const activeInput = statisticForm.querySelector(`.statistic__filters-input[value="${this._checkedStatisticPeriod}"]`);

    const toFilter = (period) => {
      this._checkedStatisticPeriod = period;
      this.removeAllElements();
      this.init();
    };

    activeInput.checked = true;

    statisticInputs.forEach((input) => {
      input.addEventListener((`change`), () => {
        switch (input.value) {
          case statisticPeriod.ALL_TIME:
            this._filteredCards = [...this._cards];
            toFilter(statisticPeriod.ALL_TIME);
            break;
          case statisticPeriod.DAY:
            this._filteredCards = this._cards.filter((item) => item.watchingDate >= Date.now() - millisecondsInWords.DAY);
            toFilter(statisticPeriod.DAY);
            break;
          case statisticPeriod.WEEK:
            this._filteredCards = this._cards.filter((item) => item.watchingDate >= Date.now() - millisecondsInWords.WEEK);
            toFilter(statisticPeriod.WEEK);
            break;
          case statisticPeriod.MONTH:
            this._filteredCards = this._cards.filter((item) => item.watchingDate >= Date.now() - millisecondsInWords.MONTH);
            toFilter(statisticPeriod.MONTH);
            break;
          case statisticPeriod.YEAR:
            this._filteredCards = this._cards.filter((item) => item.watchingDate >= Date.now() - millisecondsInWords.YEAR);
            toFilter(statisticPeriod.YEAR);
            break;
          default:
            this.removeAllElements();
            this.init();
        }
      });
    });
  }

  foldWatchedFilm(films) {
    return films.filter((item) => item.isWatched);
  }

  foldWatchedTime() {
    const filmRunningTimes = this._filteredCards.map((item) => item.runningTime);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return filmRunningTimes.reduce(reducer);
  }
}

export default StatisticController;
