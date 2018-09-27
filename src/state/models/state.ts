import { ILoggerMessage } from './console';
import { CurrentExercise, ExerciseError, ExerciseView } from './exercise';

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

export interface IExerciseState {
  appConfig: string;
  current: CurrentExercise;
  error: ExerciseError;
  view: ExerciseView;
}

export interface IAppState {
  controls: IControlsState;
  console: IConsoleState;
  exercise: IExerciseState;
}
