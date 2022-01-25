import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TASKS_FEATURE_KEY, State, tasksAdapter } from './tasks.reducer';

// Lookup the 'Tasks' feature state managed by NgRx
export const getTasksState = createFeatureSelector<State>(TASKS_FEATURE_KEY);

const { selectAll, selectEntities } = tasksAdapter.getSelectors();

export const getTasksLoaded = createSelector(
  getTasksState,
  (state: State) => state.loaded
);

export const getTasksError = createSelector(
  getTasksState,
  (state: State) => state.error
);

export const getAllTasks = createSelector(getTasksState, (state: State) =>
  selectAll(state)
);

export const getTasksEntities = createSelector(getTasksState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getTasksState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getTasksEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);

export const getTaskById = (id: string) => createSelector(
  getTasksEntities,
  (entities) => entities[id]
)
