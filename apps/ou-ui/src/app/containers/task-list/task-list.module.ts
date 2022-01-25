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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule } from '@angular/forms';
import {NzSelectModule} from "ng-zorro-antd/select";

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
    NzSpinModule,
    NzDrawerModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSelectModule,
  ],
  declarations: [TaskListComponent],
  exports: [TaskListComponent],
  providers: [TasksFacade],
})
export class TaskListModule {}
