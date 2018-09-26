import { combineReducers } from 'redux';

import { IAppState } from '../models/state';
import { console, initialState as consoleState } from './console';
import { controls, initialState as controlsState } from './controls';

export const initialState: IAppState = {
  console: consoleState,
  controls: controlsState,
};

export default combineReducers({
  console,
  controls,
});
