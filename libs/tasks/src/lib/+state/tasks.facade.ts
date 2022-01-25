import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as TasksActions from './tasks.actions';
import * as TasksFeature from './tasks.reducer';
import * as TasksSelectors from './tasks.selectors';

@Injectable()
export class TasksFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(TasksSelectors.getTasksLoaded));
  allTasks$ = this.store.pipe(select(TasksSelectors.getAllTasks));
  selectedTasks$ = this.store.pipe(select(TasksSelectors.getSelected));

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(TasksActions.init());
  }

  createTask(name: string): void {
    this.store.dispatch(TasksActions.createTask({ name }));
  }

  createTaskOptimistic(name: string): void {
    this.store.dispatch(TasksActions.createTaskOptimistic({ name }));
  }

  deleteTask(id: string): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }

  deleteTaskOptimistic(id: string): void {
    this.store.dispatch(TasksActions.deleteTaskOptimistic({ id }));
  }
}
