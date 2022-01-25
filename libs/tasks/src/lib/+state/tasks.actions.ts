import { createAction, props } from '@ngrx/store';
import { TasksEntity } from './tasks.models';

export const init = createAction('[Tasks Page] Init');

export const loadTasksSuccess = createAction(
  '[Tasks/API] Load Tasks Success',
  props<{ tasks: TasksEntity[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks/API] Load Tasks Failure',
  props<{ error: any }>()
);

// todo: add more fields for create actions if needed
export const createTask = createAction(
  'Tasks/API Create Task',
  props<{ name: string }>()
);

export const createTaskOptimistic = createAction(
  'Tasks/API Create Task Optimistic',
  props<{ name: string }>()
);

export const createTaskSuccess = createAction(
  'Tasks/API Create Task Success',
  props<{ task: TasksEntity }>()
);

export const createTaskFailure = createAction(
  'Tasks/API Create Task Failure',
  props<{ error: any }>()
);

export const deleteTask = createAction(
  'Tasks/API Delete Task',
  props<{ id: string }>()
);

export const deleteTaskOptimistic = createAction(
  'Tasks/API Delete Task Optimistic',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  'Tasks/API Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  'Tasks/API Delete Task Failure',
  props<{ error: any }>()
);
