import AbstractComponent from './abstract-component.js';

const ONE_HOUR_IN_MINUTES = 60;

class StatisticTextList extends AbstractComponent {
  constructor(watchedFilms, totalTime, topGenre) {
    super();
    this._watchedFilms = watchedFilms;
    this._totalTime = totalTime;
    this._topGenre = topGenre;
  }

  getTemplate() {
    return `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._watchedFilms}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${parseInt(this._totalTime / ONE_HOUR_IN_MINUTES, 10)} <span class="statistic__item-description">h</span> ${this._totalTime % ONE_HOUR_IN_MINUTES} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._topGenre}</p>
      </li>
    </ul>`;
  }
}


export default StatisticTextList;
