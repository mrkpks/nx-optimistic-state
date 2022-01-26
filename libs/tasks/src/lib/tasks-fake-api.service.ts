import { Injectable } from '@angular/core';
import { TasksEntity, TaskStatus } from '@nx-optimistic-state/tasks';
import { delay, mergeMap, Observable, of, throwError, timer } from 'rxjs';

@Injectable()
export class TasksFakeApiService {
  loadTasks(): Observable<TasksEntity[]> {
    return of([
      {
        id: '01',
        name: 'Foo',
        status: TaskStatus.Todo,
      },
      {
        id: '02',
        name: 'Bar',
        status: TaskStatus.InProgress,
      },
      {
        id: '03',
        name: 'Wololo',
        status: TaskStatus.Blocked,
      },
      {
        id: '04',
        name: 'Task 04',
        status: TaskStatus.Done,
      },
      {
        id: '05',
        name: 'Yolo',
        status: TaskStatus.InProgress,
      },
    ]).pipe(delay(2500));
  }

  createTask(
    name: string,
    status?: TaskStatus,
    fakeProcessTime = 1250
  ): Observable<TasksEntity> {
    const id = `${name}-${Math.floor(Math.random() * 1000)}`;

    const createSuccess = Math.random() > 0.5;
    if (createSuccess) {
      console.warn('API: createTask OK');
      return of({
        id,
        name,
        status: status ?? TaskStatus.Todo,
      }).pipe(delay(fakeProcessTime));
    } else {
      console.warn('Brace yourself, API will throw an error');
      const throwingObservable = throwError(
        () => 'API ERROR: Could not create task'
      );
      return timer(fakeProcessTime).pipe(mergeMap(() => throwingObservable));
    }
  }

  deleteTask(id: string, fakeProcessTime = 2500): Observable<string> {
    const deleteSuccess = Math.random() > 0.5;
    if (deleteSuccess) {
      console.warn('API: deleteTask OK');
      return of(id).pipe(delay(fakeProcessTime));
    } else {
      console.warn('Brace yourself, API will throw an error');
      const throwingObservable = throwError(
        () => 'API ERROR: Could not delete task'
      );
      return timer(fakeProcessTime).pipe(mergeMap(() => throwingObservable));
    }
  }
}
