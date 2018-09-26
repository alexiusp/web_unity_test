import { IBaseAction } from '../models/actions';
import { IControlsState } from '../models/state';

export const initialState: IControlsState = {
  auto: true,
  config: '',
  options: '',
  settings: '',
  start: false,
};

export function controls(state = initialState, action: IBaseAction) {
  return state;
}
