import { Component } from '@angular/core';
import { TasksFacade, TaskStatus } from '@nx-optimistic-state/tasks';
import {BehaviorSubject, take} from 'rxjs';
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

  mode: 'create' | 'edit' = 'create';

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

  openTaskDrawer(mode = 'create'): void {
    if (mode === 'edit') {
      this.mode = 'edit';
      // todo refactor this monstrosity to use facade selector:D
      this.allTasks$.pipe(take(1)).subscribe(tasks => {
        const selectedTask = tasks.find(task => task.id === this.selectedId$.value);

        if (selectedTask) {
          this.taskForm.patchValue({
            [TaskFormField.Name]: selectedTask.name,
            [TaskFormField.Status]: selectedTask.status,
          });
        }
      })
    } else {
      this.mode = 'create';
    }
    this.createDrawerVisible = true;
  }

  closeTaskDrawer(): void {
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
    this.closeTaskDrawer();
  }

  createTaskOptimistic(): void {
    this.tasksFacade.createTaskOptimistic(
      this.taskForm.controls[TaskFormField.Name].value,
      this.taskForm.controls[TaskFormField.Status].value
    );
    this.closeTaskDrawer();
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

  updateTaskOptimistic(): void {
    const id = this.selectedId$.value;
    if (id) {
      const task = {
        id,
        name: this.taskForm.controls['name'].value,
        status: this.taskForm.controls['status'].value,
      };
      this.tasksFacade.updateTaskOptimistic(task);
    }
    this.closeTaskDrawer();
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
