/**
 * Interface for the 'Tasks' data
 */
export interface TasksEntity {
  id: string; // Primary ID
  name: string;
  status?: 'todo' | 'inProgress' | 'done' | 'blocked';
}
