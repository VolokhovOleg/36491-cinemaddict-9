import {DOMPurify, convertWatchingDate} from './utils.js';

export class ModelFilm {
  constructor(data) {
    this.id = DOMPurify.sanitize(data[`id`]);
    this.director = DOMPurify.sanitize(data[`film_info`][`director`]);
    this.writers = data[`film_info`][`writers`].map((item) => DOMPurify.sanitize(item));
    this.actors = data[`film_info`][`actors`].map((item) => DOMPurify.sanitize(item));
    this.poster = DOMPurify.sanitize(data[`film_info`][`poster`]);
    this.isInWatchList = Boolean(DOMPurify.sanitize(data[`user_details`][`watchlist`]));
    this.isWatched = Boolean(DOMPurify.sanitize(data[`user_details`][`already_watched`]));
    this.watchingDate = convertWatchingDate(data[`user_details`][`watching_date`]);
    this.isFavorite = Boolean(DOMPurify.sanitize(data[`user_details`][`favorite`]));
    this.title = DOMPurify.sanitize(data[`film_info`][`title`]);
    this.alternativeTitle = DOMPurify.sanitize(data[`film_info`][`alternative_title`]);
    this.rating = parseFloat(DOMPurify.sanitize(data[`film_info`][`total_rating`]));
    this.customerRate = parseInt(DOMPurify.sanitize(data[`user_details`][`personal_rating`]), 10);
    this.releaseDate = DOMPurify.sanitize(data[`film_info`][`release`][`date`]);
    this.country = DOMPurify.sanitize(data[`film_info`][`release`][`release_country`]);
    this.ratingSystem = parseInt(DOMPurify.sanitize(data[`film_info`][`age_rating`]), 10);
    this.runningTime = parseInt(DOMPurify.sanitize(data[`film_info`][`runtime`]), 10);
    this.genres = data[`film_info`][`genre`].map((item) => DOMPurify.sanitize(item));
    this.description = DOMPurify.sanitize(data[`film_info`][`description`]);
    this.comments = data[`comments`].map((item) => DOMPurify.sanitize(item));
  }

  static parseFilm(data) {
    let i = new ModelFilm(data);
    console.log(i.watchingDate, data[`user_details`][`watching_date`]);
    return i;

  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

  toRAW() {
    return {
      'id': this.id,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.ratingSystem,
        'director': this.director,
        'writers': [...this.writers],
        'actors': [...this.actors],
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime': this.runningTime,
        'genre': this.genres,
        'description': this.description,
      },
      'user_details': {
        'personal_rating': this.customerRate,
        'watchlist': this.isInWatchList,
        'already_watched': this.isWatched,
        'watching_date': this.releaseDate,
        'favorite': this.isFavorite,
      },
      'comments': this.comments,
    };
  }
}
