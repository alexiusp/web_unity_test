import { IAppState } from '../models/state';

export const getExerciseState = (state: IAppState) => state.exercise;

export const getCurrentExercise = (state: IAppState) => getExerciseState(state).current;
