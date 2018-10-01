import actionBuilder from './actionBuilder';

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
export const unityInit = actionBuilder(UNITY_INIT);

// unity loader starts to load
export const UNITY_LOADER_START = 'UNITY_LOADER_START';
export const unityLoaderStart = actionBuilder(UNITY_LOADER_START);

// initialize app
export const UNITY_APP_INIT = 'UNITY_APP_INIT';
export const unityAppInit = actionBuilder(UNITY_APP_INIT);

// initialize exercise
export const UNITY_EXERCISE_INIT = 'UNITY_EXERCISE_INIT';
export const unityExerciseInit = actionBuilder(UNITY_EXERCISE_INIT);

// start exercise
export const UNITY_EXERCISE_START = 'UNITY_EXERCISE_START';
export const unityExerciseStart = actionBuilder(UNITY_EXERCISE_START);

// exercise is running
export const UNITY_EXERCISE_RUNNING = 'UNITY_EXERCISE_RUNNING';
export const unityExerciseRunning = actionBuilder(UNITY_EXERCISE_RUNNING);

// stop everything
export const UNITY_STOP = 'UNITY_STOP';
export const unityStop = actionBuilder(UNITY_STOP);
