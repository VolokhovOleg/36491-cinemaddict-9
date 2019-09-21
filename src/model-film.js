import {generateRandomDate} from "./utils";

export class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.director = data[`film_info`][`director`];
    this.actors = data[`film_info`][`actors`];
    this.poster = data[`film_info`][`poster`];
    this.emoji = {
      grinning: `images/emoji/angry.png`,
      smile: `images/emoji/smile.png`,
      puke: `images/emoji/puke.png`,
      sleeping: `images/emoji/sleeping.png`,
    };
    this.isInWatchList = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.title = data[`film_info`][`title`];
    this.alternativeTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.customerRate = data[`user_details`][`personal_rating`];
    this.releaseDate = new Date(data[`film_info`][`release`]);
    this.country = data[`film_info`][`release`][`release_country`];
    this.ratingSystem = data[`film_info`][`age_rating`];
    this.runningTime = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];
    this.comments = [];
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}