import { Component } from '@angular/core';
import { TasksFacade, TaskStatus } from '@nx-optimistic-state/tasks';
import { BehaviorSubject, take } from 'rxjs';
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
  readonly allTasks$ = this.tasksFacade.allTasks$;
  readonly tasksLoaded$ = this.tasksFacade.loaded$;
  readonly selectedId$ = this.tasksFacade.selectedId$;
  readonly selectedTask$ = this.tasksFacade.selectedTasks$;

  readonly TaskFormField = TaskFormField;

  readonly taskStatuses = Object.values(TaskStatus);

  mode: 'create' | 'edit' = 'create';

  taskForm!: FormGroup;

  createDrawerVisible = false;

  constructor(
    private readonly tasksFacade: TasksFacade,
    private readonly fb: FormBuilder
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
      this.selectedTask$.pipe(take(1)).subscribe(task => {
        if (task) {
          this.taskForm.patchValue({
            [TaskFormField.Name]: task.name,
            [TaskFormField.Status]: task.status,
          });
        }
      });
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
    this.tasksFacade.deleteTask();
  }

  deleteTaskOptimistic(): void {
    this.tasksFacade.deleteTaskOptimistic();
  }

  updateTaskOptimistic(): void {
    this.selectedId$.pipe(take(1)).subscribe(id => {
      if (id) {
        const task = {
          id,
          name: this.taskForm.controls['name'].value,
          status: this.taskForm.controls['status'].value,
        };
        this.tasksFacade.updateTaskOptimistic(task);
      }
    });
    this.closeTaskDrawer();
  }

  changeSelectedId(event: Event, id: string): void {
    event.stopPropagation();
    this.tasksFacade.setSelectedId(id);
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
