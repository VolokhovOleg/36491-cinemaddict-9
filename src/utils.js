const ESC_KEYCODE = 27;

export const isEscKeycode = (keyCode) => keyCode === ESC_KEYCODE;
export const checkWordEnding = (commentsAmount) => commentsAmount !== 1 ? `s` : ``;
export const checkChecked = (elem) => elem ? `checked` : ``;
export const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);
