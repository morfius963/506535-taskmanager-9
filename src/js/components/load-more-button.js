import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class LoadMore {
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
    return `<button class="load-more" type="button">load more</button>`;
  }
}

export default LoadMore;
