import {
  EXERCISE_CONFIG_UPDATE,
  EXERCISE_LOADING_UPDATE,
  EXERCISE_OPTIONS_UPDATE,
  EXERCISE_SELECT,
  EXERCISE_SETTINGS_UPDATE,
} from '../actions/exercise';
import { IAction, IBaseAction } from '../models/actions';
import { CurrentExercise } from '../models/exercise';
import { IExerciseState } from '../models/state';

export const initialCurrentState: CurrentExercise = {
  name: '',
  options: '',
  progress: 0,
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
    case EXERCISE_LOADING_UPDATE: {
      const progress = (action as IAction).payload.progress;
      return {
        ...state,
        current: {
          ...state.current,
          progress,
        },
      }
    }
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
    case EXERCISE_SETTINGS_UPDATE: {
      const settings = (action as IAction).payload.settings;
      return {
        ...state,
        current: {
          ...state.current,
          settings,
        },
      }
    }
    case EXERCISE_OPTIONS_UPDATE: {
      const options = (action as IAction).payload.options;
      return {
        ...state,
        current: {
          ...state.current,
          options,
        },
      }
    }
  }
  return state;
}
