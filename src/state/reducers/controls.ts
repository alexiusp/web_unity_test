import {
  CONTROLS_AUTO_UPDATE,
  CONTROLS_CONFIG_UPDATE,
  CONTROLS_FORM_TOGGLE,
  CONTROLS_OPTIONS_UPDATE,
  CONTROLS_SETTINGS_UPDATE,
} from '../actions/controls';
import { IAction, IBaseAction } from '../models/actions';
import { EditForm, IControlsState } from '../models/state';

export const initialState: IControlsState = {
  auto: true,
  edit: EditForm.None,
  config: '',
  options: '',
  settings: '',
  start: false,
};

export function controls(state = initialState, action: IBaseAction) {
  switch (action.type) {
    case CONTROLS_FORM_TOGGLE: {
      const toggleForm = (action as IAction).payload.form;
      return {
        ...state,
        edit: (toggleForm === state.edit) ? EditForm.None : toggleForm,
      }
    }
    case CONTROLS_AUTO_UPDATE:
      return {
        ...state,
        auto: !state.auto,
      }
    case CONTROLS_CONFIG_UPDATE: {
      const value = (action as IAction).payload.config;
      return {
        ...state,
        config: (typeof value === 'string') ? value : JSON.stringify(value),
      }
    }
    case CONTROLS_OPTIONS_UPDATE: {
      const value = (action as IAction).payload.options;
      return {
        ...state,
        options: (typeof value === 'string') ? value : JSON.stringify(value),
      }
    }
    case CONTROLS_SETTINGS_UPDATE: {
      const value = (action as IAction).payload.settings;
      return {
        ...state,
        settings: (typeof value === 'string') ? value : JSON.stringify(value),
      }
    }
  }
  return state;
}
