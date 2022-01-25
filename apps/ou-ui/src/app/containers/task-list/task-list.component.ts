import { Component } from '@angular/core';
import { TasksFacade } from '@nx-optimistic-state/tasks';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'nx-optimistic-state-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  private readonly selectedId$ = new BehaviorSubject<string | undefined>(
    undefined
  );
  readonly allTasks$ = this.tasksFacade.allTasks$;
  readonly tasksLoaded$ = this.tasksFacade.loaded$;

  constructor(private readonly tasksFacade: TasksFacade) {
    this.tasksFacade.init();
  }

  addTask(): void {
    // TODO
  }

  goToDetail(id: string): void {
    // TODO
  }

  deleteTask(): void {
    // TODO
  }

  deleteTaskOptimistic(): void {
    // TODO
  }

  changeSelectedId(event: Event, id: string): void {
    event.stopPropagation();
    this.selectedId$.next(id);
  }

  getStatusColor(status?: 'todo' | 'inProgress' | 'done' | 'blocked'): string {
    switch (status) {
      case 'blocked':
        return 'red';
      case 'inProgress':
        return 'blue';
      case 'done':
        return 'green';
      case 'todo':
      default:
        return 'gray';
    }
  }
}
