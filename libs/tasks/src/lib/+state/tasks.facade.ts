import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as TasksActions from './tasks.actions';
import * as TasksFeature from './tasks.reducer';
import * as TasksSelectors from './tasks.selectors';
import { TaskStatus } from './tasks.models';
import { take } from 'rxjs';

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

  createTask(name: string, status?: TaskStatus): void {
    this.store.dispatch(TasksActions.createTask({ name, status }));
  }

  createTaskOptimistic(name: string, status?: TaskStatus): void {
    const optimisticId = `OPTIMISITC_${name}-${Math.floor(
      Math.random() * 1000
    )}`;
    this.store.dispatch(
      TasksActions.createTaskOptimistic({
        task: { id: optimisticId, name, status },
      })
    );
  }

  deleteTask(id: string): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }

  deleteTaskOptimistic(id: string): void {
    this.store
      .pipe(select(TasksSelectors.getTaskById(id)), take(1))
      .subscribe((task) => {
        if (task) {
          this.store.dispatch(TasksActions.deleteTaskOptimistic({ task }));
        }
      });
  }
}
