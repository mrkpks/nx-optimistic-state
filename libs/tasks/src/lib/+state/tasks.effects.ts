import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch, optimisticUpdate } from '@nrwl/angular';

import * as TasksActions from './tasks.actions';
import * as TasksFeature from './tasks.reducer';
import { TasksFakeApiService } from '../tasks-fake-api.service';
import { EMPTY, map, switchMap } from 'rxjs';

@Injectable()
export class TasksEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.init),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          // return TasksActions.loadTasksSuccess({ tasks: [] });
          return this.fakeAPI
            .loadTasks()
            .pipe(map((tasks) => TasksActions.loadTasksSuccess({ tasks })));
        },
        onError: (action, error) => {
          console.error('Error init$: ', error);
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
          console.error('Error createTask$: ', error); // todo call notification service
          return TasksActions.createTaskFailure({ error });
        },
      })
    )
  );

  // This principle doesn't make sense if we don't know the ID coming from API
  // though, can be used for deletion
  createTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskOptimistic),
      optimisticUpdate({
        run: (action) =>
          this.fakeAPI
            .createTask(action.task.name, action.task.status)
            // .pipe(mapTo(TasksActions.createTaskSuccess({ task: action.task }))),
            .pipe(switchMap(() => EMPTY)),
        undoAction: (action, error) => {
          console.error('Error createTask$: ', error); // todo call notification service
          return TasksActions.undoCreateTask({
            error,
            id: action.task.id,
          });
        },
      })
    )
  );

  // createTaskOptimistic$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(TasksActions.createTaskOptimistic),
  //     optimisticUpdate({
  //       run: (action) =>
  //         this.fakeAPI.createTask(action.task.name, action.task.status).pipe(
  //           map((task) =>
  //             TasksActions.createTaskOptimisticSuccess({
  //               OID: action.task.id,
  //               task,
  //             })
  //           )
  //         ),
  //       undoAction: (action, error) => {
  //         console.error('Error createTask$: ', error); // todo call notification service
  //         return TasksActions.createTaskOptimisticFailure({
  //           error,
  //           id: action.task.id,
  //         });
  //       },
  //     })
  //   )
  // );

  deleteTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskOptimistic),
      optimisticUpdate({
        run: ({ task }) =>
          this.fakeAPI.deleteTask(task.id).pipe(switchMap(() => EMPTY)),
        undoAction: ({ task }, error) => {
          console.error('Error deleteTask$: ', error); // todo call notification service
          return TasksActions.undoDeleteTask({
            error,
            task,
          });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly fakeAPI: TasksFakeApiService
  ) {}
}
