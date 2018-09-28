import { IAppState } from '../models/state';

export const getControls = (state: IAppState) => state.controls;

export const getAutoValue = (state: IAppState) => getControls(state).auto;

export const getCurrentStage = (state: IAppState) => getControls(state).stage;

export const getAppConfig = (state: IAppState) => getControls(state).config;

export const getExerciseSettings = (state: IAppState) => getControls(state).settings;

export const getExerciseOptions = (state: IAppState) => getControls(state).options;
