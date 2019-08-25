import BoardContainer from './board-container';
import SortList from './sort-list.js';
import TaskList from './task-list.js';
import LoadMore from './load-more-button.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import NoTasks from './no-tasks.js';
import {renderElement} from '../utils.js';

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._boardContainer = new BoardContainer();
    this._sortList = new SortList();
    this._taskList = new TaskList();
    this._loadMore = new LoadMore();
    this._noTasks = new NoTasks();
    this._sortedTasks = tasks;

    this._bindedOnLoadBtnClick = this._onLoadBtnClick.bind(this);

    this._RENDER_STEP = 8;
    this._CURRENT_CARDS = 8;
    this._taskLoadState = {
      current: this._CURRENT_CARDS,
      step: this._RENDER_STEP,
      max: this._tasks.length
    };
  }

  get RENDER_STEP() {
    return this._RENDER_STEP;
  }

  set RENDER_STEP(value) {
    this._RENDER_STEP = value;
  }

  get CURRENT_CARDS() {
    return this._CURRENT_CARDS;
  }

  set CURRENT_CARDS(value) {
    this._CURRENT_CARDS = value;
  }

  init() {
    renderElement(this._container, this._boardContainer.getElement(), `beforeend`);

    if (this._tasks.length === 0) {
      renderElement(this._boardContainer.getElement(), this._noTasks.getElement(), `beforeend`);
      return;
    }

    renderElement(this._boardContainer.getElement(), this._sortList.getElement(), `beforeend`);
    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    this._tasks.slice(0, this._CURRENT_CARDS).forEach((taskItem) => {
      this._renderTask(taskItem);
    });

    this._sortList.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    if (this._tasks.length > this._RENDER_STEP) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }
  }

  _renderTask(taskMock) {
    const task = new Task(taskMock);
    const taskEdit = new TaskEdit(taskMock);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._taskList.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.getElement().replaceChild(taskEdit.getElement(), task.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        this._taskList.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    renderElement(this._taskList.getElement(), task.getElement(), `beforeend`);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `a`) {
      return;
    }

    this._taskList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._sortedTasks = sortedByDateUpTasks;
        this._sortedTasks.slice(0, this._taskLoadState.current).forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._sortedTasks = sortedByDateDownTasks;
        this._sortedTasks.slice(0, this._taskLoadState.current).forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `default`:
        this._tasks.slice(0, this._taskLoadState.current).forEach((taskMock) => this._renderTask(taskMock));
        this._sortedTasks = this._tasks.slice();
        break;
    }
  }

  _onLoadBtnClick() {
    const current = this._taskLoadState.current;
    const step = current + this._taskLoadState.step;

    this._sortedTasks.slice(current, step).forEach((task) => {
      this._renderTask(task);
    });

    if (step >= this._taskLoadState.max) {
      this._loadMore.getElement().removeEventListener(`click`, this._bindedOnLoadBtnClick);
      this._loadMore.getElement().classList.add(`visually-hidden`);
      this._taskLoadState.current = this._taskLoadState.max;
    } else {
      this._taskLoadState.current = step;
    }
  }
}

export default BoardController;
