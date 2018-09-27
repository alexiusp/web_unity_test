import { EXERCISE_CONFIG_UPDATE, EXERCISE_SELECT } from '../actions/exercise';
import { IAction, IBaseAction } from '../models/actions';
import { CurrentExercise } from '../models/exercise';
import { IExerciseState } from '../models/state';

export const initialCurrentState: CurrentExercise = {
  name: '',
  options: '',
  settings: '',
};

export const initialState: IExerciseState = {
  appConfig: '',
  current: initialCurrentState,
  error: '',
  view: '',
};

export function exercise(state = initialState, action: IBaseAction) {
  switch (action.type) {
    case EXERCISE_CONFIG_UPDATE: {
      return {
        ...state,
        appConfig: (action as IAction).payload.config,
      }
    }
    case EXERCISE_SELECT: {
      const name = (action as IAction).payload.name;
      return {
        ...state,
        current: {
          ...initialCurrentState,
          name,
        },
      }
    }
  }
  return state;
}
