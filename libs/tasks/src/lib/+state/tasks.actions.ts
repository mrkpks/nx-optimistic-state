import { createAction, props } from '@ngrx/store';
import {TasksEntity, TaskStatus} from './tasks.models';

export const init = createAction('[Tasks Page] Init');

export const loadTasksSuccess = createAction(
  '[Tasks/API] Load Tasks Success',
  props<{ tasks: TasksEntity[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks/API] Load Tasks Failure',
  props<{ error: any }>()
);

export const createTask = createAction(
  'Tasks/API Create Task',
  props<{ name: string, status?: TaskStatus }>()
);

export const createTaskSuccess = createAction(
  'Tasks/API Create Task Success',
  props<{ task: TasksEntity }>()
);

export const createTaskFailure = createAction(
  'Tasks/API Create Task Failure',
  props<{ error: any }>()
);

export const createTaskOptimistic = createAction(
  'Tasks/API Create Task Optimistic',
  props<{ task: TasksEntity }>()
);

export const createTaskOptimisticSuccess = createAction(
  'Tasks/API Create Task Optimistic Success',
  // OID - ID created on FE, to be replaced in store
  props<{ OID: string, task: TasksEntity }>()
);

export const undoCreateTask = createAction(
  'Tasks/API Create Task Optimistic Failure',
  props<{ error: any, id: string }>() // either whole entity or ID to revert (remove from state)
);

export const deleteTask = createAction(
  'Tasks/API Delete Task',
  props<{ id: string }>()
);

export const deleteTaskOptimistic = createAction(
  'Tasks/API Delete Task Optimistic',
  props<{ task: TasksEntity }>()
);

export const deleteTaskSuccess = createAction(
  'Tasks/API Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  'Tasks/API Delete Task Failure',
  props<{ error: any }>()
);

export const undoDeleteTask = createAction(
  'Tasks/API Delete Task Optimistic Failure',
  props<{ error: any, task: TasksEntity }>() // task to revert
);

// TODO: add edit actions
// !!! editTaskOptimisticFailure should need the whole entity in action to revert edited fields
