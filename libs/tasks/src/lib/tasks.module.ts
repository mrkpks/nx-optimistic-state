import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromTasks from './+state/tasks.reducer';
import { TasksEffects } from './+state/tasks.effects';
import { TasksFacade } from './+state/tasks.facade';
import { TasksFakeApiService } from './tasks-fake-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromTasks.TASKS_FEATURE_KEY, fromTasks.reducer),
    EffectsModule.forFeature([TasksEffects]),
  ],
  providers: [TasksFacade, TasksFakeApiService, NzMessageService],
})
export class TasksModule {}
