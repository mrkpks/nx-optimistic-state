import { Injectable } from '@angular/core';
import { TasksEntity } from '@nx-optimistic-state/tasks';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable()
export class TasksFakeApiService {
  createTask(
    name: string,
    fakeProcessTime = 5000
  ): Observable<TasksEntity | undefined> {
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
  ): Observable<string | undefined> {
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
