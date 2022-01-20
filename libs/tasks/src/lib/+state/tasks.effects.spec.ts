import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as TasksActions from './tasks.actions';
import { TasksEffects } from './tasks.effects';

describe('TasksEffects', () => {
  let actions: Observable<Action>;
  let effects: TasksEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        TasksEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(TasksEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: TasksActions.init() });

      const expected = hot('-a-|', {
        a: TasksActions.loadTasksSuccess({ tasks: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
