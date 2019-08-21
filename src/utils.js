const ESC_KEYCODE = 27;
const CALENDAR = {
  '1': `January`,
  '2': `February`,
  '3': `March`,
  '4': `April`,
  '5': `May`,
  '6': `June`,
  '7': `July`,
  '8': `August`,
  '9': `September`,
  '10': `October`,
  '11': `November`,
  '12': `December`,
};
const TEN_YEAR_IN_MS = 283996800000;

export const isEscKeycode = (keyCode) => keyCode === ESC_KEYCODE;
export const checkWordEnding = (commentsAmount) => commentsAmount !== 1 ? `s` : ``;
export const checkChecked = (elem) => elem ? `checked` : ``;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const generateRandomDate = () => new Date(Date.now() + getRandomInt(TEN_YEAR_IN_MS, -TEN_YEAR_IN_MS));
export const convertMonth = (monthNumber) => CALENDAR[monthNumber + 1];
export const generateBoolean = () => Boolean(Math.round(Math.random()));
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
export const generateCommentDayString = (day) => day === 0 ? `Today` : `${day} days ago`;
