import AbstractComponent from './abstract-component.js';

class Preloader extends AbstractComponent {
  getTemplate() {
    return `<section class="films">Loading…</section>`;
  }
}

export default Preloader;
