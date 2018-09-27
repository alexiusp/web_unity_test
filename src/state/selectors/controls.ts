import { IAppState } from '../models/state';

export const getControls = (state: IAppState) => state.controls;

export const getAutoValue = (state: IAppState) => getControls(state).auto;
