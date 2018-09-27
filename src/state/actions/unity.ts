import actionBuilder from './actionBuilder';

// inject unity loader into document
export const UNITY_INIT = 'UNITY_INIT';
export const unityInit = actionBuilder(UNITY_INIT);

// unity loader starts to load
export const UNITY_LOADER_START = 'UNITY_LOADER_START';
export const unityLoaderStart = actionBuilder(UNITY_LOADER_START);

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
export const unityExerciseComplete = actionBuilder(UNITY_EXERCISE_COMPLETE);

// exerciseFailed callback
export const UNITY_EXERCISE_FAILED = 'UNITY_EXERCISE_FAILED';
export const unityExerciseFailed = actionBuilder(UNITY_EXERCISE_FAILED);

/**
 * User invoked or automatically started actions
 */
/*
// exerciseFailed callback
export const UNITY_EXERCISE_FAILED = 'UNITY_EXERCISE_FAILED';
export const unityExerciseFailed = actionBuilder(UNITY_EXERCISE_FAILED);
*/
