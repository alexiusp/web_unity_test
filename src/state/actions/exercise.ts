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

// updates settings value from ajax or input
export const EXERCISE_LOADING_UPDATE = 'EXERCISE_LOADING_UPDATE';
export const exerciseLoadingUpdate = actionBuilder<{ progress: number }>(EXERCISE_LOADING_UPDATE, 'progress');
