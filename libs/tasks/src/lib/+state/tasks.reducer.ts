import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as TasksActions from './tasks.actions';
import { TasksEntity } from './tasks.models';

export const TASKS_FEATURE_KEY = 'tasks';

export interface State extends EntityState<TasksEntity> {
  selectedId?: string | number; // which Tasks record has been selected
  loaded: boolean; // has the Tasks list been loaded
  error?: string | null; // last known error (if any)
}

export interface TasksPartialState {
  readonly [TASKS_FEATURE_KEY]: State;
}

export const tasksAdapter: EntityAdapter<TasksEntity> =
  createEntityAdapter<TasksEntity>();

export const initialState: State = tasksAdapter.getInitialState({
  // set initial required properties
  ids: [],
  entities: {},
  loaded: false,
});

const tasksReducer = createReducer(
  initialState,
  on(TasksActions.init, (state) => ({ ...state, loaded: false, error: null })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) =>
    tasksAdapter.setAll(tasks, { ...state, loaded: true })
  ),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(TasksActions.createTask, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TasksActions.createTaskOptimistic, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })), // todo: loaded: true?
  on(TasksActions.createTaskSuccess, (state, { task }) =>
    tasksAdapter.setOne(task, { ...state, loaded: true })
  ),
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })), // todo: set loaded?
  on(TasksActions.deleteTask, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TasksActions.deleteTaskOptimistic, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TasksActions.deleteTaskSuccess, (state, { id }) =>
    tasksAdapter.removeOne(id, { ...state, loaded: true })
  ),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })), // todo: set loaded?
);

export function reducer(state: State | undefined, action: Action) {
  return tasksReducer(state, action);
}
