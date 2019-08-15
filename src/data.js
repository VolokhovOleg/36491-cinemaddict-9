import {getRandom} from './utils';

const totalCards = () => getRandom(15, 4);
const generateComments = () => ({
  emoji: [
    `images/emoji/angry.png`,
    `images/emoji/puke.png`,
    `images/emoji/sleeping.png`,
    `images/emoji/smile.png`,
  ][Math.floor(Math.random() * 4)],
  author: [
    `Tim Macoveev`,
    `John Doe`,
    `Heinz Herald`,
    `Dan Duryea`,
  ][Math.floor(Math.random() * 4)],
  content: [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
  ][Math.floor(Math.random() * 4)],
  date: [
    `4 days ago`,
    `3 days ago`,
    `2 days ago`,
    `Today`,
  ][Math.floor(Math.random() * 4)],
});

const generateCard = () => ({
  id: Math.random(),
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
  ][Math.floor(Math.random() * 7)],
  isInWishList: Boolean(Math.round(Math.random())),
  isWatched: Boolean(Math.round(Math.random())),
  isFavorite: Boolean(Math.round(Math.random())),
  title: {
    full: [
      `The Dance of Life`,
      `The Great Flamarion`,
      `Santa Claus Conquers the Martians`,
      `Made for Each Other`,
      `Popeye the Sailor Meets Sindbad the Sailor`,
      `Sagebrush Trail`,
      `The Man with the Golden Arm`,
    ][Math.floor(Math.random() * 7)],
    short: [
      `The Dance of Life`,
      `The Great Flamarion`,
      `Santa Claus Conquers the Martians`,
      `Made for Each Other`,
      `Popeye the Sailor Meets Sindbad the Sailor`,
      `Sagebrush Trail`,
      `The Man with the Golden Arm`,
    ][Math.floor(Math.random() * 7)],
  },
  rating: (Math.random() * 9).toFixed(1),
  releaseDate: {
    year: 1900 + Math.floor(Math.random() * 30),
    month: `March`,
    day: Math.floor(Math.random() * 30),
  },
  country: `USA`,
  ratingSystem: `${getRandom(0, 18)}+`,
  runningTime: `${getRandom(1, 3)}h ${getRandom(10, 59)}m`,
  genres: new Set([
    [`Drama`, `Cartoon`, `Western`, `Musical`, `Mystery`, `Comedy`][Math.floor(Math.random() * 6)],
    [`Drama`, `Cartoon`, `Western`, `Musical`, `Mystery`, `Comedy`][Math.floor(Math.random() * 6)],
    [`Drama`, `Cartoon`, `Western`, `Musical`, `Mystery`, `Comedy`][Math.floor(Math.random() * 6)],
  ]),
  description: {
    short: `Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at aBurlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a…`,
    full: `The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.`,
  },
  comments: new Array(getRandom(0, 5)).fill({}).map(generateComments),
});

const generateFilters = () => ({
  wishList: getRandom(0, 5),
  history: getRandom(0, 5),
  favorite: getRandom(0, 5),
});

export const filters = generateFilters();
export const cards = new Array(totalCards()).fill({}).map(generateCard);
export const filmsAmount = cards.length;
export const moviesWatched = totalCards() - Math.floor(Math.random() * 2);
