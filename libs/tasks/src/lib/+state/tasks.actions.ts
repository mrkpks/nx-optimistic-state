import { createAction, props } from '@ngrx/store';
import { TasksEntity, TaskStatus } from './tasks.models';

export const setSelectedId = createAction(
  '[Tasks] Set Selected Task ID',
  props<{ id: string }>()
);

export const init = createAction('[Tasks Page] Init');

export const loadTasksSuccess = createAction(
  '[Tasks/API] Load Tasks Success',
  props<{ tasks: TasksEntity[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks/API] Load Tasks Failure',
  props<{ error: any }>()
);

/**
 * Classic approach using a loading flag on FE and waiting for BE response to show the result
 * With this approach, 3 Actions are always necessary (trigger [e.g. create, delete], success, failure)
 */
export const createTask = createAction(
  'Tasks/API Create Task',
  props<{ name: string; status?: TaskStatus }>()
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

export const deleteTaskSuccess = createAction(
  'Tasks/API Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  'Tasks/API Delete Task Failure',
  props<{ error: any }>()
);

/**
 * OPTIMISTIC UPDATES
 */

/**
 * Optimistic task creation requires special approach since we don't know the ID that will be generated on BE
 * Therefore it requires not just 2 (create, undo) but 3 Actions (create, success, undo)
 *
 * - we shall store the "optimistically" created with FE-generated ID and replace it in the Success Action after
 */
export const createTaskOptimistic = createAction(
  'Tasks/API Create Task Optimistic',
  props<{ task: TasksEntity }>()
);

export const createTaskOptimisticSuccess = createAction(
  'Tasks/API Create Task Optimistic Success',
  // OID - ID created on FE, to be replaced in store
  props<{ OID: string; task: TasksEntity }>()
);

export const undoCreateTask = createAction(
  'Tasks/API Create Task Optimistic Failure',
  props<{ error: any; id: string }>() // either whole entity or ID to revert (remove from state)
);

/**
 * Optimistic task deletion is a straightforward operation that doesn't expect different output from BE
 * Therefore it requires just 2 Actions (delete, undo)
 */
export const deleteTaskOptimistic = createAction(
  'Tasks/API Delete Task Optimistic',
  props<{ task: TasksEntity }>()
);

export const undoDeleteTask = createAction(
  'Tasks/API Delete Task Optimistic Failure',
  props<{ error: any; task: TasksEntity }>() // task to revert
);

export const updateTaskOptimistic = createAction(
  'Tasks/API Update Task Optimistic',
  props<{ old: TasksEntity; updated: TasksEntity }>()
);

export const undoUpdateTask = createAction(
  'Tasks/API Update Task Optimistic Failure',
  props<{ error: any; old: TasksEntity }>() // task to revert
);
