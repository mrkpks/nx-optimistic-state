import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as TasksActions from './tasks.actions';
import * as TasksFeature from './tasks.reducer';
import { TasksFakeApiService } from '../tasks-fake-api.service';
import { map } from 'rxjs';

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
            .createTask(action.name)
            .pipe(map((task) => TasksActions.createTaskSuccess({ task }))),
        onError: (action, error) => {
          console.error('Error createTask$: ', error);
          return TasksActions.createTaskFailure({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly fakeAPI: TasksFakeApiService
  ) {}
}
