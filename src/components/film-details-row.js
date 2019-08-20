import {capitalizeWord} from './../utils.js';

export const renderFilmDetailRow = (key, prop) => `<tr class="film-details__row">
  <td class="film-details__term">${capitalizeWord(key)}</td>
  <td class="film-details__cell">${prop}</td>
</tr>`;
