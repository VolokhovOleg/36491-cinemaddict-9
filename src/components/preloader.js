import AbstractComponent from './abstract-component.js';

export class FooterStats extends AbstractComponent {
  constructor(allMovies) {
    super();
    this._allMovies = allMovies;
  }

  getTemplate() {
    return `<p>${this._allMovies} movies inside</p>`;
  }
}

export default FooterStats;
