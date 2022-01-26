

# NxOptimisticState

### Quickstart:

`$ npm ci`

`$ npx nx serve ou-ui`

This simple project was created as a PoC to show comparison of two different approaches to handling API calls using NgRx Store and @nrwl/angular.

## Classic approach

Using loading progress in views triggered by loading flags on FE.

This pattern is relying on 3 types of NgRx Store Actions:
- *Trigger Action* (create, update/edit, delete) which triggers API call; e.g. `deleteTask`
- *Success Action* which processes the response from API; e.g. `deleteTaskSuccess`
- *Failure Action* which processes the error response from API;  e.g. `deleteTaskFailure`

## Optimistic approach

The Optimistic UI is ideal when the responses from API take longer than desired from UX point of view.
This approach assumes a high success rate of received API responses and (in ideal case*) expecting the response from API wouldn't differ from the actual data modified on client.

Most times* is relying on 2 types of NgRx Store Actions:
- *Trigger Action* (create, update/edit, delete) which triggers API call **AND immediately sets the new state** containing new data on client (in store); e.g. `deleteTaskOptimistic`  
- *Undo Action* which is triggered upon receiving an error from API. Its purpose is to **revert the new state to original state** before the data modification.

## Examples
check these files for more info:

- [tasks.actions.ts](https://github.com/mrkpks/nx-optimistic-state/blob/main/libs/tasks/src/lib/%2Bstate/tasks.actions.ts)
- [tasks.reducer.ts](https://github.com/mrkpks/nx-optimistic-state/blob/main/libs/tasks/src/lib/%2Bstate/tasks.reducer.ts)
- [tasks.effects.ts](https://github.com/mrkpks/nx-optimistic-state/blob/main/libs/tasks/src/lib/%2Bstate/tasks.effects.ts)

### Optimistic Delete task implementation

```ts
import { optimisticUpdate } from '@nrwl/angular';

import * as TasksActions from './tasks.actions';

...
  deleteTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskOptimistic),
      optimisticUpdate({
        run: ({ task }) =>
          // difference between classic approach - we don't need to map the incoming observable to success action
          this.api.deleteTask(task.id).pipe(switchMap(() => EMPTY)),
        undoAction: ({ task }, error) => {
          // add error handling here
          console.error('Error deleteTask$: ', error);
          // call Undo Action
          return TasksActions.undoDeleteTask({
            error,
            task, // notice the Undo Action's payload - in this case we need the whole Entity to restore it
          });
        },
      })
    )
  );
```

*in some cases there can be a requirement for optimistic approach even though the API response differs in some way from the data modified on client.
This use-case can be handled by adding a *Success Action* which re-maps or adds missing data to our entity.

### Optimistic Create task implementation

In this case we don't know what ID will be generated on BE, so we need to generate our own on client and replace it in Success Action
```ts
import { optimisticUpdate } from '@nrwl/angular';

import * as TasksActions from './tasks.actions';

...
  createTaskOptimistic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskOptimistic),
      optimisticUpdate({
        run: (action) =>
          this.api.createTask(action.task.name, action.task.status).pipe(
            tap(() => this.message.success('Task created')),
            // needs another action for replacing optimistic ID (OID)
            map((task) =>
              TasksActions.createTaskOptimisticSuccess({
                OID: action.task.id,
                task,
              })
            )
          ),
        undoAction: (action, error) => {
          // add error handling here
          console.error('Error createTask$');
          // call Undo Action
          return TasksActions.undoCreateTask({
            error,
            id: action.task.id, // notice the the Undo Action's payload - in this case ID is enough, we're just removing it from the TasksEntities
          });
        },
      })
    )
  );
```
