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
const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    unrender(document.querySelector(`.film-details`));
    document.querySelector(`body`).style = ``;
    removeOnEscListener();
  }
};
export const removeOnEscListener = () => document.removeEventListener(`keydown`, onEscKeyDown);
export const addOnEscListener = () => document.addEventListener(`keydown`, onEscKeyDown);
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
