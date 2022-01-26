

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

Classic success            |  Classic error
:-------------------------:|:-------------------------:
![image](https://user-images.githubusercontent.com/15088626/151183748-8239e693-1d33-464a-a625-e28be8cf5284.png) |  ![image](https://user-images.githubusercontent.com/15088626/151183879-f6a30e87-0318-40bf-84cf-b274c2ebcc07.png)





## Optimistic approach

The Optimistic UI is ideal when the responses from API take longer than desired from UX point of view.
This approach assumes a high success rate of received API responses and (in ideal case*) expecting the response from API wouldn't differ from the actual data modified on client.

Most times is relying on 2 types of NgRx Store Actions:
- *Trigger Action* (create, update/edit, delete) which triggers API call **AND immediately sets the new state** containing new data on client (in store); e.g. `deleteTaskOptimistic`  
- *Undo Action* which is triggered upon receiving an error from API. Its purpose is to **revert the new state to original state** before the data modification.

Optimistic success            |  Optimistic error
:-------------------------:|:-------------------------:
![image](https://user-images.githubusercontent.com/15088626/151184041-1e977d20-bc5a-4c9d-8860-59913482408c.png) |  ![image](https://user-images.githubusercontent.com/15088626/151184114-cc0e7437-f2a9-4f6f-be78-a163ff23dea9.png)

## Edge case for optimistic approach

In some cases, **just as in optimistic create**, there can be a requirement for optimistic approach even though the API response differs in some way from the data modified on client.
This use-case can be handled by adding a *Success Action* which re-maps or adds missing data to our entity.

Optimistic success            |  Optimistic error
:-------------------------:|:-------------------------:
![image](https://user-images.githubusercontent.com/15088626/151184470-761b038c-ebcc-45df-851f-621fa0f6bff9.png) |  ![image](https://user-images.githubusercontent.com/15088626/151184553-32181893-5514-464c-930c-f531d38ecc29.png)

## Examples
check these files for more info:

- [tasks.actions.ts](https://github.com/mrkpks/nx-optimistic-state/blob/main/libs/tasks/src/lib/%2Bstate/tasks.actions.ts)
- [tasks.reducer.ts](https://github.com/mrkpks/nx-optimistic-state/blob/main/libs/tasks/src/lib/%2Bstate/tasks.reducer.ts)
- [tasks.effects.ts](https://github.com/mrkpks/nx-optimistic-state/blob/main/libs/tasks/src/lib/%2Bstate/tasks.effects.ts)

### Classic delete

```ts
import * as TasksActions from './tasks.actions';

...
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
```

Classic success            |  Classic error
:-------------------------:|:-------------------------:
![delete-classic-scss](https://user-images.githubusercontent.com/15088626/151186828-6258a100-208d-4957-9b1e-0ae89bafa1a9.gif) |  ![delete-classic-err](https://user-images.githubusercontent.com/15088626/151186851-5b58aeda-106c-40bc-8eee-465cff39bdee.gif)

### Optimistic delete

```ts
import * as TasksActions from './tasks.actions';

...
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
```

Optimistic success            |  Optimistic error
:-------------------------:|:-------------------------:
![delete-opt-scss](https://user-images.githubusercontent.com/15088626/151186939-8120d705-1375-43ac-9be6-f124b7720189.gif) |  ![delete-opt-err](https://user-images.githubusercontent.com/15088626/151186957-42401d51-96dc-4e31-ab27-e10b74b31010.gif)

### Classic Create task implementation

```ts
import * as TasksActions from './tasks.actions';

...
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
```

Classic success            |  Classic error
:-------------------------:|:-------------------------:
![clsc-scss](https://user-images.githubusercontent.com/15088626/151178163-51bf4811-8d7c-44b8-a393-e65380e77784.gif)  |  ![clsc-err](https://user-images.githubusercontent.com/15088626/151178180-747c46e7-36f9-42a8-8437-5af97919fa2f.gif)


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
            /**
            * notice the the Undo Action's payload - in this case ID is enough, 
            * we're just removing it from the TasksEntities
            **/
            id: action.task.id, 
          });
        },
      })
    )
  );
```

Optimistic success            |  Optimistic error
:-------------------------:|:-------------------------:
![optmstc-scss](https://user-images.githubusercontent.com/15088626/151178105-3b0df0e3-937f-4fe4-bd7a-98c216f81fbe.gif)  |  ![optmstc-err](https://user-images.githubusercontent.com/15088626/151178130-da73f3b0-a492-4811-8773-594f6cf3a28b.gif)
