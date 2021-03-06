import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch, optimisticUpdate } from '@nrwl/angular';
import { NzMessageService } from 'ng-zorro-antd/message';

import * as TasksActions from './tasks.actions';
import { TasksFakeApiService } from '../tasks-fake-api.service';
import { EMPTY, map, switchMap, tap } from 'rxjs';

@Injectable()
export class TasksEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.init),
      fetch({
        run: () =>
          this.fakeAPI
            .loadTasks()
            .pipe(map((tasks) => TasksActions.loadTasksSuccess({ tasks }))),
        onError: (action, error) => {
          console.error('Error init$: ', error);
          this.message.error('Could not load tasks');
          return TasksActions.loadTasksFailure({ error });
        },
      })
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      fetch({
        run: (action) =>
          this.fakeAPI
            .createTask(action.name, action.status)
            .pipe(map((task) => TasksActions.createTaskSuccess({ task }))),
        onError: (action, error) => {
          console.error('Error createTask$: ', error);
          this.message.error('Could not create task');
          return TasksActions.createTaskFailure({ error });
        },
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      fetch({
        run: ({ id }) =>
          this.fakeAPI
            .deleteTask(id)
            .pipe(map((id) => TasksActions.deleteTaskSuccess({ id }))),
        onError: (action, error) => {
          console.error('Error deleteTask$: ', error);
          this.message.error('Could not delete task');
          return TasksActions.deleteTaskFailure({ error });
        },
      })
    )
  );

  createTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskOptimistic),
      optimisticUpdate({
        run: (action) =>
          this.fakeAPI.createTask(action.task.name, action.task.status).pipe(
            tap(() => this.message.success('Task created!')),
            // needs success action for replacing optimistic ID
            map((task) =>
              TasksActions.createTaskOptimisticSuccess({
                oid: action.task.id,
                task,
              })
            )
          ),
        undoAction: (action, error) => {
          this.message.error('Could not create task');
          return TasksActions.undoCreateTask({
            error,
            id: action.task.id,
          });
        },
      })
    )
  );

  deleteTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskOptimistic),
      optimisticUpdate({
        run: ({ task }) =>
          this.fakeAPI.deleteTask(task.id).pipe(switchMap(() => EMPTY)),
        undoAction: ({ task }, error) => {
          console.error('Error deleteTask$: ', error);
          this.message.error('Could not delete task');
          return TasksActions.undoDeleteTask({
            error,
            task,
          });
        },
      })
    )
  );

  updateTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTaskOptimistic),
      optimisticUpdate({
        run: ({ updated }) =>
          this.fakeAPI.updateTask(updated).pipe(switchMap(() => EMPTY)),
        undoAction: ({ old }, error) => {
          console.error('Error deleteTask$: ', error);
          this.message.error('Could not update task');
          return TasksActions.undoUpdateTask({
            error,
            old,
          });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly message: NzMessageService,
    private readonly fakeAPI: TasksFakeApiService
  ) {}
}
