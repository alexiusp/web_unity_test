import { combineReducers } from 'redux';

import { IAppState } from '../models/state';
import { console, initialState as consoleState } from './console';
import { controls, initialState as controlsState } from './controls';
import { exercise, initialState as exerciseState } from './exercise';

export const initialState: IAppState = {
  console: consoleState,
  controls: controlsState,
  exercise: exerciseState,
};

export default combineReducers({
  console,
  controls,
  exercise,
});
