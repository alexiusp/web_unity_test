import { EditForm } from '../models/state';
import actionBuilder from './actionBuilder';

// auto execution flag update action
export const CONTROLS_AUTO_UPDATE = 'CONTROLS_AUTO_UPDATE';
export const controlsAutoUpdate = actionBuilder(CONTROLS_AUTO_UPDATE);

// updates config value from ajax or input
export const CONTROLS_CONFIG_UPDATE = 'CONTROLS_CONFIG_UPDATE';
export const controlsConfigUpdate = actionBuilder<{ config: string }>(CONTROLS_CONFIG_UPDATE, 'config');

// updates options value from ajax or input
export const CONTROLS_OPTIONS_UPDATE = 'CONTROLS_OPTIONS_UPDATE';
export const controlsOptionsUpdate = actionBuilder<{ options: string }>(CONTROLS_OPTIONS_UPDATE, 'options');

// updates settings value from ajax or input
export const CONTROLS_SETTINGS_UPDATE = 'CONTROLS_SETTINGS_UPDATE';
export const controlsSettingsUpdate = actionBuilder<{ settings: string }>(CONTROLS_SETTINGS_UPDATE, 'settings');

// opens textarea to edit config/settings/options
export const CONTROLS_FORM_TOGGLE = 'CONTROLS_FORM_TOGGLE';
export const controlsFormToggle = actionBuilder<{ form: EditForm }>(CONTROLS_FORM_TOGGLE, 'form');
