import actionBuilder from './actionBuilder';

// console log a message action
export const CONSOLE_LOG = 'CONSOLE_LOG';
export const consoleLog = actionBuilder<{ message: string }>(CONSOLE_LOG, 'message');

// console log an error action
export const CONSOLE_ERROR = 'CONSOLE_ERROR';
export const consoleError = actionBuilder<{ message: string }>(CONSOLE_ERROR, 'message');

// console input value update
export const CONSOLE_INPUT_UPDATE = 'CONSOLE_INPUT_UPDATE';
export const consoleInputUpdate = actionBuilder<{ value: string }>(CONSOLE_INPUT_UPDATE, 'value');

// console log a message action
export const CONSOLE_COMMAND = 'CONSOLE_COMMAND';
export const consoleCommand = actionBuilder(CONSOLE_COMMAND);

export const CONSOLE_PROGRESS_START = 'CONSOLE_PROGRESS_START';
export const consoleProgressStart = actionBuilder(CONSOLE_PROGRESS_START);

export const CONSOLE_PROGRESS_UPDATE = 'CONSOLE_PROGRESS_UPDATE';
export const consoleProgressUpdate = actionBuilder(CONSOLE_PROGRESS_UPDATE);

export const CONSOLE_PROGRESS_END = 'CONSOLE_PROGRESS_END';
export const consoleProgressEnd = actionBuilder(CONSOLE_PROGRESS_END);
