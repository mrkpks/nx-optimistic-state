import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as TasksActions from './tasks.actions';
import * as TasksFeature from './tasks.reducer';
import * as TasksSelectors from './tasks.selectors';
import { TasksEntity, TaskStatus } from './tasks.models';
import { take } from 'rxjs';

@Injectable()
export class TasksFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(TasksSelectors.getTasksLoaded));
  allTasks$ = this.store.pipe(select(TasksSelectors.getAllTasks));
  selectedId$ = this.store.pipe(select(TasksSelectors.getSelectedId));
  selectedTasks$ = this.store.pipe(select(TasksSelectors.getSelected));

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init(): void {
    this.store.dispatch(TasksActions.init());
  }

  setSelectedId(id: string): void {
    this.store.dispatch(TasksActions.setSelectedId({ id }));
  }

  createTask(name: string, status?: TaskStatus): void {
    this.store.dispatch(TasksActions.createTask({ name, status }));
  }

  createTaskOptimistic(name: string, status?: TaskStatus): void {
    const optimisticId = `O-${Math.floor(Math.random() * 1000)}`;
    this.store.dispatch(
      TasksActions.createTaskOptimistic({
        task: { id: optimisticId, name, status },
      })
    );
  }

  deleteTask(): void {
    this.selectedId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.store.dispatch(TasksActions.deleteTask({ id }));
      }
    });
  }

  deleteTaskOptimistic(): void {
    this.selectedTasks$.pipe(take(1)).subscribe((task) => {
      if (task) {
        this.store.dispatch(TasksActions.deleteTaskOptimistic({ task }));
      }
    });
  }

  updateTaskOptimistic(task: TasksEntity): void {
    this.store
      .pipe(select(TasksSelectors.getTaskById(task.id)), take(1))
      .subscribe((old) => {
        if (old) {
          this.store.dispatch(
            TasksActions.updateTaskOptimistic({ old, updated: task })
          );
        }
      });
  }
}
