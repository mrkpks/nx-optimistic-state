export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'inProgress',
  Done = 'done',
  Blocked = 'blocked',
}

/**
 * Interface for the 'Tasks' data
 */
export interface TasksEntity {
  id: string; // Primary ID
  name: string;
  status?: TaskStatus;
}
