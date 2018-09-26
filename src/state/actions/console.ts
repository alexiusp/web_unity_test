import actionBuilder from './actionBuilder';

// console log a message action
export const CONSOLE_LOG = 'CONSOLE_LOG';
export const consoleLog = actionBuilder<{ message: string }>(CONSOLE_LOG, 'message');

// console input value update
export const CONSOLE_INPUT_UPDATE = 'CONSOLE_INPUT_UPDATE';
export const consoleInputUpdate = actionBuilder<{ value: string }>(CONSOLE_INPUT_UPDATE, 'value');

// console log a message action
export const CONSOLE_COMMAND = 'CONSOLE_COMMAND';
export const consoleCommand = actionBuilder(CONSOLE_COMMAND);
