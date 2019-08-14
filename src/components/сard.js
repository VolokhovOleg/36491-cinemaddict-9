const checkControls = (isCheck = false) => isCheck ? `film-card__controls-item--active` : ``;
const checkWordEnding = (commentsAmount) => commentsAmount !== 1 ? `s` : ``;

export const renderCard = ({id, title, rating, releaseDate, runningTime, genres, poster, description, comments, isInWishList, isWatched, isFavorite}) =>
  `<article class="film-card" id="${id}">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${releaseDate.year}</span>
    <span class="film-card__duration">${runningTime}</span>
    <span class="film-card__genre">${Array.from(genres)[0]}</span>
  </p>
  <img src="./${poster}" alt="${title}" class="film-card__poster">
  <p class="film-card__description">${description.short}</p>
  <a class="film-card__comments">${comments.length} comment${checkWordEnding(comments.length)}</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkControls(isInWishList)}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkControls(isWatched)}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${checkControls(isFavorite)}">Mark as favorite</button>
  </form>
</article>`;
