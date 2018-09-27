import { IAppState } from '../models/state';

export const getConsole = (state: IAppState) => state.console;

export const getConsoleLines = (state: IAppState) => getConsole(state).lines;

export const getConsoleInput = (state: IAppState) => getConsole(state).input;

export const getConsoleProgress = (state: IAppState) => getConsole(state).progress;
