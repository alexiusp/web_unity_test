import {
  CONSOLE_COMMAND,
  CONSOLE_ERROR,
  CONSOLE_INPUT_UPDATE,
  CONSOLE_LOG,
  CONSOLE_PROGRESS_END,
  CONSOLE_PROGRESS_UPDATE,
} from '../actions/console';
import { IAction, IBaseAction } from '../models/actions';
import { ILoggerMessage, LogType } from '../models/console';
import { IConsoleState } from '../models/state';

export const initialState: IConsoleState = {
  input: '>',
  lines: [],
  progress: 0,
};

export function console(state = initialState, action: IBaseAction) {
  switch (action.type) {
    case CONSOLE_PROGRESS_UPDATE: {
      return {
        ...state,
        progress: state.progress + 1,
      }
    }
    case CONSOLE_PROGRESS_END: {
      return {
        ...state,
        progress: 0,
      }
    }
    case CONSOLE_ERROR: {
      const content = (action as IAction).payload.message;
      window.console.warn('ERROR: ', content);
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
      window.console.log('LOG: ', content);
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
