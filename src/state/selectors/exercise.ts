import { IAppState } from '../models/state';

export const getExerciseState = (state: IAppState) => state.exercise;

export const getCurrentExercise = (state: IAppState) => getExerciseState(state).current;

export const getAppConfig = (state: IAppState) => getExerciseState(state).appConfig;

export const getExerciseSettings = (state: IAppState) => getCurrentExercise(state).settings;

export const getExerciseOptions = (state: IAppState) => getCurrentExercise(state).options;
