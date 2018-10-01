import actionBuilder from './actionBuilder';

// update app config received from S3
export const EXERCISE_CONFIG_UPDATE = 'EXERCISE_CONFIG_UPDATE';
export const exerciseConfigUpdate = actionBuilder<{ config: any }>(EXERCISE_CONFIG_UPDATE, 'config');

export const EXERCISE_SELECT = 'EXERCISE_SELECT';
export const exerciseSelect = actionBuilder<{ name: string }>(EXERCISE_SELECT, 'name');

// updates options value from ajax or input
export const EXERCISE_OPTIONS_UPDATE = 'EXERCISE_OPTIONS_UPDATE';
export const exerciseOptionsUpdate = actionBuilder<{ options: string }>(EXERCISE_OPTIONS_UPDATE, 'options');

// updates settings value from ajax or input
export const EXERCISE_SETTINGS_UPDATE = 'EXERCISE_SETTINGS_UPDATE';
export const exerciseSettingsUpdate = actionBuilder<{ settings: string }>(EXERCISE_SETTINGS_UPDATE, 'settings');

// custom action when exercise was loaded and ready to be started
export const EXERCISE_READY = 'EXERCISE_READY';
export const exerciseReady = actionBuilder(EXERCISE_READY);

// 'start unity' button handling
export const EXERCISE_UNITY_START = 'EXERCISE_UNITY_START';
export const exerciseUnityStart = actionBuilder(EXERCISE_UNITY_START);

// 'stop' button handling
export const EXERCISE_STOP = 'EXERCISE_STOP';
export const exerciseStop = actionBuilder(EXERCISE_STOP);

// 'initialize app' button handling
export const EXERCISE_APP_INIT = 'EXERCISE_APP_INIT';
export const exerciseAppInit = actionBuilder(EXERCISE_APP_INIT);

// 'initialize exercise' button handling
export const EXERCISE_EXERCISE_INIT = 'EXERCISE_EXERCISE_INIT';
export const exerciseExerciseInit = actionBuilder(EXERCISE_EXERCISE_INIT);

// 'start exercise' button handling
export const EXERCISE_EXERCISE_START = 'EXERCISE_EXERCISE_START';
export const exerciseExerciseStart = actionBuilder(EXERCISE_EXERCISE_START);

// custom action when exercise was completed
export const EXERCISE_COMPLETE = 'EXERCISE_COMPLETE';
export const exerciseComplete = actionBuilder<{ result: string }>(EXERCISE_COMPLETE, 'result');
