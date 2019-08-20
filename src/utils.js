const ESC_KEYCODE = 27;

export const isEscKeycode = (keyCode) => keyCode === ESC_KEYCODE;
export const isAddWordEnding = (itemAmount) => itemAmount !== 1 ? `s` : ``;
export const isAddChecked = (elem) => elem ? `checked` : ``;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const capitalizeWord = (string) => string.split(` `).map((word) => word[0].toUpperCase() + word.substr(1)).join(` `);
