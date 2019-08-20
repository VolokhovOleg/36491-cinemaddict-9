import {getRandomInt, generateRandomDate, convertMonth, generateBoolean, generateRunningTime} from './utils';

const generateComments = () => ({
  emoji: [
    `images/emoji/angry.png`,
    `images/emoji/puke.png`,
    `images/emoji/sleeping.png`,
    `images/emoji/smile.png`,
  ][getRandomInt(0, 3)],
  author: [
    `Tim Macoveev`,
    `John Doe`,
    `Heinz Herald`,
    `Dan Duryea`,
  ][getRandomInt(0, 3)],
  content: [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
  ][getRandomInt(0, 3)],
  date: [
    `4 days ago`,
    `3 days ago`,
    `2 days ago`,
    `Today`,
  ][getRandomInt(0, 4)],
});

export const generateFilm = () => ({
  director: `Anthony Mann`,
  writers: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
  actors: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
  poster: [
    `images/posters/made-for-each-other.png`,
    `images/posters/popeye-meets-sinbad.png`,
    `images/posters/sagebrush-trail.jpg`,
    `images/posters/santa-claus-conquers-the-martians.jpg`,
    `images/posters/the-dance-of-life.jpg`,
    `images/posters/the-great-flamarion.jpg`,
    `images/posters/the-man-with-the-golden-arm.jpg`,
  ][getRandomInt(0, 6)],
  isInWatchList: generateBoolean(),
  isWatched: generateBoolean(),
  isFavorite: generateBoolean(),
  title: [
    `The Dance of Life`,
    `The Great Flamarion`,
    `Santa Claus Conquers the Martians`,
    `Made for Each Other`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
  ][getRandomInt(0, 6)],
  rating: Math.floor(Math.random() * 10) / 10 + getRandomInt(0, 8),
  releaseDate: {
    year: generateRandomDate().getFullYear(),
    month: convertMonth(generateRandomDate().getMonth()),
    day: generateRandomDate().getDay(),
  },
  country: `USA`,
  ratingSystem: `${getRandomInt(0, 18)}+`,
  runningTime: generateRunningTime(getRandomInt(120, 180)),
  genres: [`Drama`, `Cartoon`, `Western`, `Musical`, `Mystery`, `Comedy`].slice(getRandomInt(0, 5)),
  description: `The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.`,
  comments: new Array(getRandomInt(0, 5)).fill({}).map(generateComments),
});

export const generateFilters = () => ({
  watchList: getRandomInt(0, 5),
  history: getRandomInt(0, 5),
  favorite: getRandomInt(0, 5),
});
