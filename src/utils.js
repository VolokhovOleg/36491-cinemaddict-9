import DOMPurify from 'dompurify';
import moment from 'moment';

const millisecondsInWords = {
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
  MONTH: 2592000000,
  YEAR: 31536000000,
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;
  return newElement.firstChild;
};
const render = (container, element) => {
  container.append(element);
};
const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
const checkWordEnding = (commentsAmount) => commentsAmount !== 1 ? `s` : ``;
const checkChecked = (elem) => elem ? `checked` : ``;
const convertRunningTime = (time) => {
  let formattedTime = ``;

  if ((time - time % 60) / 60 !== 0) {
    formattedTime = `${(time - time % 60) / 60}h `;
  }

  if (time % 60 !== 0) {
    formattedTime += `${time % 60}m`;
  }

  return formattedTime;
};
const cutText = (text) => {
  if (text.length > 130) {
    text = `${text.slice(0, 129)}…`;
  }

  return text;
};
const setErrorEffect = (element) => {
  element.style.border = `1px solid red`;
  element.classList.add(`shake`);
  setTimeout(() => element.classList.remove(`shake`), 600);
};
const calcPostTime = (dataTime) => {
  const postTime = (moment(Date.now()).diff(dataTime));
  const timings = {
    FIFTY_NINE_SECONDS: millisecondsInWords.MINUTE - millisecondsInWords.SECOND,
    THREE_MINUTES: millisecondsInWords.MINUTE * 3,
    FOUR_MINUTES: millisecondsInWords.MINUTE * 4,
    FIFTY_NINE_MINUTES: millisecondsInWords.MINUTE * 59,
    TWO_HOURS: millisecondsInWords.HOUR * 2,
    TWENTY_THREE_HOURS: millisecondsInWords.HOUR * 23,
  };
  let phrase = ``;
  switch (true) {
    case postTime <= timings.FIFTY_NINE_SECONDS:
      phrase = `now`;
      break;
    case postTime > millisecondsInWords.MINUTE && postTime <= timings.THREE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a minute ago`;
      break;
    case postTime > timings.FOUR_MINUTES && postTime <= timings.FIFTY_NINE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a few minutes ago`;
      break;
    case postTime > millisecondsInWords.HOUR && postTime <= millisecondsInWords.HOUR + timings.FIFTY_NINE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a hour ago`;
      break;
    case postTime > timings.TWO_HOURS && postTime <= timings.TWENTY_THREE_HOURS + timings.FIFTY_NINE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a few hours ago`;
      break;
    case postTime > millisecondsInWords.DAY:
      phrase = moment(dataTime).startOf(`second`).fromNow();
      break;
  }
  return phrase;
};
const convertWatchingDate = (date) => {
  let convertedDate = null;

  switch (typeof date) {
    case `number`:
      convertedDate = parseInt(DOMPurify.sanitize(date), 10);
      break;
    case `string`:
      convertedDate = parseInt(moment(DOMPurify.sanitize(date)).format(`x`), 10);
      break;
    default:
      convertedDate = null;
      break;
  }

  return convertedDate;
};
const convertNaN = (data) => isNaN(data) ? 0 : data;

export {millisecondsInWords, createElement, render, unrender, checkWordEnding, checkChecked, convertRunningTime, cutText, setErrorEffect, calcPostTime, convertWatchingDate, convertNaN};
