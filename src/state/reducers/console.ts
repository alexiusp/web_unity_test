import {
  CONSOLE_COMMAND,
  CONSOLE_ERROR,
  CONSOLE_INPUT_UPDATE,
  CONSOLE_LOG,
} from '../actions/console';
import { IAction, IBaseAction } from '../models/actions';
import { ILoggerMessage, LogType } from '../models/console';
import { IConsoleState } from '../models/state';

export const initialState: IConsoleState = {
  input: '>',
  lines: [],
};

export function console(state = initialState, action: IBaseAction) {
  switch (action.type) {
    case CONSOLE_ERROR: {
      const content = (action as IAction).payload.message;
      const message: ILoggerMessage = {
        type: LogType.Error,
        message: content,
      };
      return {
        ...state,
        lines: [...state.lines, message],
      }
    }
    case CONSOLE_LOG: {
      const content = (action as IAction).payload.message;
      const message: ILoggerMessage = {
        type: LogType.Log,
        message: content,
      };
      return {
        ...state,
        lines: [...state.lines, message],
      }
    }
    case CONSOLE_INPUT_UPDATE: {
      const value = (action as IAction).payload.value;
      return {
        ...state,
        input: value,
      }
    }
    case CONSOLE_COMMAND: {
      const cmd = state.input.slice(1);
      const message: ILoggerMessage = {
        type: LogType.Error,
        message: `Unknown command: ${cmd}`,
      };
      return {
        ...state,
        input: '>',
        lines: [...state.lines, message],
      }
    }
  }
  return state;
}
