import { render } from '../framework/render.js';
import NewTripEventsSortView from '../view/trip-events-sort-view';
import NewTripEventsListView from '../view/trip-events-list-view';
//import NewTripEventsAddPointView from '../view/trip-events-add-point-view';
import PointPresenter from './point-presenter.js';
import { updateData } from '../utils/data.js';
import { SortType } from '../mock/const.js';
import { sortPoints } from '../tools/sort.js';
import {UpdateType,UserAction} from '../mock/const.js';


export default class MainPresenter {
  #containerListComponent = new NewTripEventsListView();
  #boardContainer = null;
  #pointModel = null;
  #pointPresenters = new Map();
  #points = [];
  #destinations = [];
  #newTripEventsSortView = null;
  #activeSortType = SortType.DAY;

  constructor({ boardContainer, pointModel }) {
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#points = this.#pointModel.points;
    this.#destinations = this.#pointModel.destinations;
    this.#renderPoints();
  }

  #renderPoints() {
    this.#newTripEventsSortView = new NewTripEventsSortView({
      onSortChanges: this.#handleSortChange,
      activeSortType: this.#activeSortType,
    });
    render(this.#newTripEventsSortView, this.#boardContainer);
    render(this.#containerListComponent, this.#boardContainer);
    //render(new NewTripEventsAddPointView(), this.#containerListComponent.element);

    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: this.#containerListComponent.element,
        destination: this.#destinations,
        pointModel: this.#pointModel,
        onModeChange: this.#handleModeChange,
        onViewAction: this.#handleViewAction,
      });

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #handleDataFavorite = (updatePoint) => {
    this.#points = updateData(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #sorType = (sortype) => {
    this.#containerListComponent.element.innerHTML = '';
    this.#points = sortPoints(this.#pointModel.points, sortype);

    this.#points.forEach((point) => {
      this.#pointPresenters.get(point.id).rerender();
    });
  };

  #handleSortChange = (nextSortType) => {
    this.#activeSortType = nextSortType;
    this.#sorType(this.#activeSortType);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        this. #handleDataFavorite(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };
}
