import actionBuilder from '../../state/actions/actionBuilder';

/**
 * Unity exercise external callbacks
 */
// appReady callback
export const UNITY_APP_READY = 'UNITY_APP_READY';
export const unityAppReady = actionBuilder(UNITY_APP_READY);

// engineReady callback
export const UNITY_ENGINE_READY = 'UNITY_ENGINE_READY';
export const unityEngineReady = actionBuilder(UNITY_ENGINE_READY);

// exerciseReady callback
export const UNITY_EXERCISE_READY = 'UNITY_EXERCISE_READY';
export const unityExerciseReady = actionBuilder(UNITY_EXERCISE_READY);

// completeExercise callback
export const UNITY_EXERCISE_COMPLETE = 'UNITY_EXERCISE_COMPLETE';
export interface UnityCompletePayload {
  result: string;
}
export const unityExerciseComplete = actionBuilder<UnityCompletePayload>(UNITY_EXERCISE_COMPLETE, 'result');

// exerciseFailed callback
export const UNITY_EXERCISE_FAILED = 'UNITY_EXERCISE_FAILED';
export interface UnityFailPayload {
  message: string;
}
export const unityExerciseFailed = actionBuilder<UnityFailPayload>(UNITY_EXERCISE_FAILED, 'message');

// updates progress value from UnityLoader
export const UNITY_PROGRESS_UPDATE = 'UNITY_PROGRESS_UPDATE';
export interface UnityProgressPayload {
  progress: number;
}
export const unityProgressUpdate = actionBuilder<UnityProgressPayload>(UNITY_PROGRESS_UPDATE, 'progress');

/**
 * custom execution flow actions
 */

// inject unity loader into document
export const UNITY_INIT = 'UNITY_INIT';
export interface UnityInitPayload {
  basePath: string,
  canvasId: string,
  loaderName: string,
  options?: any,
}
export const unityInit = actionBuilder<UnityInitPayload>(UNITY_INIT, 'basePath', 'canvasId', 'loaderName', 'options');

// unity loader starts to load
export const UNITY_LOADER_START = 'UNITY_LOADER_START';
export const unityLoaderStart = actionBuilder(UNITY_LOADER_START);

// initialize app
export const UNITY_APP_INIT = 'UNITY_APP_INIT';
export interface UnityAppInitPayload {
  config: string;
}
export const unityAppInit = actionBuilder<UnityAppInitPayload>(UNITY_APP_INIT, 'config');

// initialize exercise
export const UNITY_EXERCISE_INIT = 'UNITY_EXERCISE_INIT';
export interface UnityExerciseInitPayload {
  settings: string;
}
export const unityExerciseInit = actionBuilder<UnityExerciseInitPayload>(UNITY_EXERCISE_INIT, 'settings');

// start exercise
export const UNITY_EXERCISE_START = 'UNITY_EXERCISE_START';
export interface UnityExerciseStartPayload {
  options: string;
}
export const unityExerciseStart = actionBuilder<UnityExerciseStartPayload>(UNITY_EXERCISE_START, 'options');

// exercise is running
export const UNITY_EXERCISE_RUNNING = 'UNITY_EXERCISE_RUNNING';
export const unityExerciseRunning = actionBuilder(UNITY_EXERCISE_RUNNING);

// stop everything
export const UNITY_STOP = 'UNITY_STOP';
export const unityStop = actionBuilder(UNITY_STOP);

/**
 * debugging features
 */

// log a message
export const UNITY_LOG = 'UNITY_LOG';
export const unityLog = actionBuilder<{ message: string }>(UNITY_LOG, 'message');

// log an error
export const UNITY_ERROR = 'UNITY_ERROR';
export const unityError = actionBuilder<{ message: string }>(UNITY_ERROR, 'message');

// set loading flag to true
export const UNITY_LOADING_START = 'UNITY_LOADING_START';
export const unityLoadingStart = actionBuilder(UNITY_LOADING_START);

// set loading flag to false
export const UNITY_LOADING_END = 'UNITY_LOADING_END';
export const unityLoadingEnd = actionBuilder(UNITY_LOADING_END);
