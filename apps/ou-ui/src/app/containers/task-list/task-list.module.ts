import { NgModule } from '@angular/core';

import { TaskListRoutingModule } from './task-list-routing.module';

import { TaskListComponent } from './task-list.component';
import { TasksFacade } from '@nx-optimistic-state/tasks';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  imports: [
    TaskListRoutingModule,
    CommonModule,
    NzTableModule,
    NzEmptyModule,
    NzButtonModule,
    NzToolTipModule,
    NzPopoverModule,
    NzIconModule,
    NzPopconfirmModule,
  ],
  declarations: [TaskListComponent],
  exports: [TaskListComponent],
  providers: [TasksFacade],
})
export class TaskListModule {}
