export class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.poster = data[`film_info`][`poster`];
    this.isInWatchList = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.watchingDate = data[`user_details`][`watching_date`];
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.title = data[`film_info`][`title`];
    this.alternativeTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.customerRate = data[`user_details`][`personal_rating`];
    this.releaseDate = new Date(data[`film_info`][`release`][`date`]);
    this.country = data[`film_info`][`release`][`release_country`];
    this.ratingSystem = data[`film_info`][`age_rating`];
    this.runningTime = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];
    this.comments = data[`comments`];
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

  toRAW() {
    return {
      "id": this.id,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ratingSystem,
        "director": this.director,
        "writers": [...this.writers],
        "actors": [...this.actors],
        "release": {
          "date": this.releaseDate,
          "release_country": this.country
        },
        "runtime": this.runningTime,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "personal_rating": this.customerRate,
        "watchlist": this.isInWatchList,
        "already_watched": this.isWatched,
        "watching_date": `2019-05-11T16:12:32.554Z`,
        "favorite": this.isFavorite,
      },
      "comments": this.comments,
    };
  }
}
