import { ILoggerMessage } from './console';
import { CurrentExercise, ExerciseError, ExerciseView } from './exercise';

export enum EditForm {
  None,
  AppConfig,
  Settings,
  Options,
}

export enum RunningStage {
  None,
  UnityInit,
  AppInit,
  ExerciseInit,
  ExerciseRunning,
}

export interface IControlsState {
  auto: boolean;
  edit: EditForm;
  config: string;
  options: string;
  settings: string;
  stage: RunningStage;
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
