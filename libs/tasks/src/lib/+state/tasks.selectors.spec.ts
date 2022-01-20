import { TasksEntity } from './tasks.models';
import { tasksAdapter, TasksPartialState, initialState } from './tasks.reducer';
import * as TasksSelectors from './tasks.selectors';

describe('Tasks Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getTasksId = (it: TasksEntity) => it.id;
  const createTasksEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as TasksEntity);

  let state: TasksPartialState;

  beforeEach(() => {
    state = {
      tasks: tasksAdapter.setAll(
        [
          createTasksEntity('PRODUCT-AAA'),
          createTasksEntity('PRODUCT-BBB'),
          createTasksEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Tasks Selectors', () => {
    it('getAllTasks() should return the list of Tasks', () => {
      const results = TasksSelectors.getAllTasks(state);
      const selId = getTasksId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = TasksSelectors.getSelected(state) as TasksEntity;
      const selId = getTasksId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getTasksLoaded() should return the current "loaded" status', () => {
      const result = TasksSelectors.getTasksLoaded(state);

      expect(result).toBe(true);
    });

    it('getTasksError() should return the current "error" state', () => {
      const result = TasksSelectors.getTasksError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
