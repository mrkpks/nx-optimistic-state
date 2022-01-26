

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
---


This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/getting-started/intro)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@nx-optimistic-state/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.






## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
