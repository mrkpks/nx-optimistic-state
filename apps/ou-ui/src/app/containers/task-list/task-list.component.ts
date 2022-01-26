import { Component } from '@angular/core';
import { TasksFacade, TaskStatus } from '@nx-optimistic-state/tasks';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

enum TaskFormField {
  Name = 'name',
  Status = 'status',
}

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

  readonly TaskFormField = TaskFormField;

  readonly taskStatuses = Object.values(TaskStatus);

  taskForm!: FormGroup;

  createDrawerVisible = false;

  constructor(
    private readonly tasksFacade: TasksFacade,
    private readonly fb: FormBuilder,
  ) {
    this.tasksFacade.init();

    this.taskForm = this.fb.group({
      [TaskFormField.Name]: [null, Validators.required],
      [TaskFormField.Status]: null,
    });
  }

  openCreateDrawer(): void {
    this.createDrawerVisible = true;
  }

  closeCreateDrawer(): void {
    this.createDrawerVisible = false;
    this.taskForm.patchValue({
      [TaskFormField.Name]: null,
      [TaskFormField.Status]: null,
    });
  }

  createTask(): void {
    this.tasksFacade.createTask(
      this.taskForm.controls[TaskFormField.Name].value,
      this.taskForm.controls[TaskFormField.Status].value
    );
    this.closeCreateDrawer();
  }

  createTaskOptimistic(): void {
    this.tasksFacade.createTaskOptimistic(
      this.taskForm.controls[TaskFormField.Name].value,
      this.taskForm.controls[TaskFormField.Status].value
    );
    this.closeCreateDrawer();
  }

  goToDetail(id: string): void {
    // TODO
  }

  deleteTask(): void {
    const id = this.selectedId$.value;
    if (id) {
      this.tasksFacade.deleteTask(id);
    }
  }

  deleteTaskOptimistic(): void {
    const id = this.selectedId$.value;
    if (id) {
      this.tasksFacade.deleteTaskOptimistic(id);
    }
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
