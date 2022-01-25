import { Injectable } from '@angular/core';
import { TasksEntity } from '@nx-optimistic-state/tasks';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable()
export class TasksFakeApiService {
  loadTasks(): Observable<TasksEntity[]> {
    return of([
      {
        id: '01',
        name: 'Foo',
        status: 'todo' as const,
      },
      {
        id: '02',
        name: 'Bar',
        status: 'inProgress' as const,
      },
      {
        id: '03',
        name: 'Wololo',
        status: 'blocked' as const,
      },
      {
        id: '04',
        name: 'Task 04',
        status: 'done' as const,
      },
      {
        id: '05',
        name: 'Yolo',
        status: 'inProgress' as const,
      },
    ]).pipe(delay(2500));
  }

  createTask(
    name: string,
    fakeProcessTime = 5000
  ): Observable<TasksEntity> {
    const id = `${name}-${Math.random() * 1000}`;

    const createSuccess = Math.random() > 0.3;
    if (createSuccess) {
      return of({
        id,
        name,
        status: 'todo' as const,
      }).pipe(delay(fakeProcessTime));
    } else {
      throw throwError(() => 'Could not create task').pipe(
        delay(fakeProcessTime)
      );
    }
  }

  deleteTask(
    id: string,
    fakeProcessTime = 5000
  ): Observable<string> {
    const deleteSuccess = Math.random() > 0.3;
    if (deleteSuccess) {
      return of(id).pipe(delay(fakeProcessTime));
    } else {
      throw throwError(() => 'Could not delete task').pipe(
        delay(fakeProcessTime)
      );
    }
  }
}
