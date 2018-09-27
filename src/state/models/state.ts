import { ILoggerMessage } from './console';

export interface IControlsState {
  auto: boolean;
  config: string;
  options: string;
  settings: string;
  start: boolean;
}

export interface IConsoleState {
  lines: ILoggerMessage[];
  input: string;
  progress: number;
}

export interface IAppState {
  controls: IControlsState;
  console: IConsoleState;
}
