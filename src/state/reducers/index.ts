import { combineReducers } from 'redux';

import { IAppState } from '../models/state';
import { controls, initialState as controlsState } from './controls';

export const initialState: IAppState = {
  controls: controlsState,
};

export default combineReducers({
  controls,
});
