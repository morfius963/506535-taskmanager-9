import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class BoardContainer {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    removeElem(this._element);
    this._element = null;
  }

  getTemplate() {
    return `<section class="board container"></section>`;
  }
}

export default BoardContainer;
