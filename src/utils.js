const millisecondsInWords = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60000,
  ONE_HOUR: 3600000,
  ONE_DAY: 86400000,
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;
  return newElement.firstChild;
};
export const render = (container, element) => {
  container.append(element);
};
export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
export const checkWordEnding = (commentsAmount) => commentsAmount !== 1 ? `s` : ``;
export const checkChecked = (elem) => elem ? `checked` : ``;
export const generateRunningTime = (time) => {
  let formattedTime = ``;

  if ((time - time % 60) / 60 !== 0) {
    formattedTime = `${(time - time % 60) / 60}h `;
  }

  if (time % 60 !== 0) {
    formattedTime += `${time % 60}m`;
  }

  return formattedTime;
};
export const cutText = (text) => {
  if (text.length > 130) {
    text = `${text.slice(0, 129)}…`;
  }

  return text;
};
export const setErrorEffect = (element) => {
  element.style.border = `1px solid red`;
  element.classList.add(`shake`);
  setTimeout(() => element.classList.remove(`shake`), 600);
};
export const calcPostTime = (dataTime) => {
  const postTime = (moment(Date.now()).diff(dataTime));
  const timings = {
    FIFTY_NINE_SECONDS: millisecondsInWords.ONE_MINUTE - millisecondsInWords.ONE_SECOND,
    THREE_MINUTES: millisecondsInWords.ONE_MINUTE * 3,
    FOUR_MINUTES: millisecondsInWords.ONE_MINUTE * 4,
    FIFTY_NINE_MINUTES: millisecondsInWords.ONE_MINUTE * 59,
    TWO_HOURS: millisecondsInWords.ONE_HOUR * 2,
    TWENTY_THREE_HOURS: millisecondsInWords.ONE_HOUR * 23,
  };
  let phrase = ``;
  switch (true) {
    case postTime <= timings.FIFTY_NINE_SECONDS:
      phrase = `now`;
      break;
    case postTime > millisecondsInWords.ONE_MINUTE && postTime <= timings.THREE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a minute ago`;
      break;
    case postTime > timings.FOUR_MINUTES && postTime <= timings.FIFTY_NINE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a few minutes ago`;
      break;
    case postTime > millisecondsInWords.ONE_HOUR && postTime <= millisecondsInWords.ONE_HOUR + timings.FIFTY_NINE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a hour ago`;
      break;
    case postTime > timings.TWO_HOURS && postTime <= timings.TWENTY_THREE_HOURS + timings.FIFTY_NINE_MINUTES + timings.FIFTY_NINE_SECONDS:
      phrase = `a few hours ago`;
      break;
    case postTime > millisecondsInWords.ONE_DAY:
      phrase = moment(dataTime).startOf(`second`).fromNow();
      break;
  }
  return phrase;
};
export const _ = require(`lodash`);
export const moment = require(`moment`);


// const sortArr = (arr, sortAttr) => arr.sort((a, b) => sortAttr === `releaseDate` ? moment(b[sortAttr]).format(`x`) - moment(a[sortAttr]).format(`x`) : b[sortAttr] - a[sortAttr]);
