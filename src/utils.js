const ESC_KEYCODE = 27;
const CALENDAR = {
  [`1`]: `January`,
  [`2`]: `February`,
  [`3`]: `March`,
  [`4`]: `April`,
  [`5`]: `May`,
  [`6`]: `June`,
  [`7`]: `July`,
  [`8`]: `August`,
  [`9`]: `September`,
  [`10`]: `October`,
  [`11`]: `November`,
  [`12`]: `December`,
};

export const isEscKeycode = (keyCode) => keyCode === ESC_KEYCODE;
export const checkWordEnding = (commentsAmount) => commentsAmount !== 1 ? `s` : ``;
export const checkChecked = (elem) => elem ? `checked` : ``;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const generateRandomDate = () => new Date(Date.now() - getRandomInt(28500, 36500) * 24 * 60 * 60 * 1000 + 1);
export const convertMonth = (monthNumber) => CALENDAR[monthNumber];
export const generateBoolean = () => Boolean(Math.round(Math.random()));
export const generateRunningTime = (time) => `${(time - time % 60) / 60}h ${time % 60}m`;

export const cutText = (text) => {
  if (text.length > 130) {
    text = `${text.slice(0, 129)}…`;
  }

  return text;
};
