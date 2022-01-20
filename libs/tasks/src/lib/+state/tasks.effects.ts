import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as TasksActions from './tasks.actions';
import * as TasksFeature from './tasks.reducer';

@Injectable()
export class TasksEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.init),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return TasksActions.loadTasksSuccess({ tasks: [] });
        },
        onError: (action, error) => {
          console.error('Error', error);
          return TasksActions.loadTasksFailure({ error });
        },
      })
    )
  );

  constructor(private readonly actions$: Actions) {}
}
