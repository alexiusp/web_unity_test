import axios from 'axios';
import { all, put, select, take, takeEvery } from 'redux-saga/effects';

import { BASE_PATH, CANVAS_ID, CONFIG_PATH, LOADER_NAME } from '../../constants';
import {
  UNITY_APP_READY,
  UNITY_ENGINE_READY,
  UNITY_EXERCISE_COMPLETE,
  UNITY_EXERCISE_READY,
  unityAppInit,
  UnityCompletePayload,
  unityExerciseInit,
  unityExerciseStart,
  unityInit,
  unityStop,
} from '../../unity/store/actions';
import { consoleError, consoleLog } from '../actions/console';
import { controlsOptionsUpdate, controlsSettingsUpdate } from '../actions/controls';
import {
  EXERCISE_APP_INIT,
  EXERCISE_EXERCISE_INIT,
  EXERCISE_EXERCISE_START,
  EXERCISE_READY,
  EXERCISE_SELECT,
  EXERCISE_STOP,
  EXERCISE_UNITY_START,
  exerciseAppInit,
  exerciseConfigUpdate,
  exerciseExerciseInit,
  exerciseExerciseStart,
  exerciseOptionsUpdate,
  exerciseReady,
  exerciseSelect,
  exerciseSettingsUpdate,
} from '../actions/exercise';
import { IAction } from '../models/actions';
import {
  getAppConfig,
  getAutoValue,
  getExerciseOptions,
  getExerciseSettings,
} from '../selectors/controls';

const DEFAULT_TIMEOUT = process.env.REACT_APP_DEFAULT_TIMEOUT || 120;

export function* selectExerciseSaga(action: IAction<{ name: string }>) {
  const exerciseName = action.payload.name;
  const appSettingsResponse = yield axios.get(`${CONFIG_PATH}/${exerciseName}/Settings.json`);
  if (appSettingsResponse.status !== 200) {
    return;
  }
  const settings = JSON.stringify(appSettingsResponse.data);
  yield put(controlsSettingsUpdate(settings));
  yield put(exerciseSettingsUpdate(settings));
  const appOptionsResponse = yield axios.get(`${CONFIG_PATH}/${exerciseName}/Options.json`);
  if (appOptionsResponse.status !== 200) {
    return;
  }
  const options = appOptionsResponse.data;
  options.timeout = +DEFAULT_TIMEOUT;
  const optionsStr = JSON.stringify(options);
  yield put(controlsOptionsUpdate(optionsStr));
  yield put(exerciseOptionsUpdate(optionsStr));
  yield put(exerciseReady());
}

export function* startUnitySaga() {
  yield put(consoleLog('Start!'));
  const customOptions = {
    Module: {
      CachedXMLHttpRequestSilent: true,
      CachedXMLHttpRequestLoader: true,
    },
  };
  yield put(unityInit(BASE_PATH, CANVAS_ID, LOADER_NAME, customOptions));
  yield take(UNITY_APP_READY);
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    yield put(exerciseAppInit());
  }
}

export function* stopExerciseSaga() {
  yield put(consoleLog('Stop!'));
  yield put(unityStop());
}

export function* appInitSaga() {
  // get config from edit form
  const config = yield select(getAppConfig);
  // update working copy
  yield put(exerciseConfigUpdate(config));
  // send event to unity
  yield put(unityAppInit(config));
  yield take(UNITY_ENGINE_READY);
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    yield put(exerciseExerciseInit());
  }
}

export function* exerciseInitSaga() {
  // get settings from edit form
  const settings = yield select(getExerciseSettings);
  // update working copy
  yield put(exerciseSettingsUpdate(settings));
  // send event to unity
  yield put(unityExerciseInit(settings));
  yield take(UNITY_EXERCISE_READY);
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    yield put(exerciseExerciseStart());
  }
}

export function* exerciseStartSaga() {
  // get options from edit form
  const options = yield select(getExerciseOptions);
  // update working copy
  yield put(exerciseOptionsUpdate(options));
  // send event to unity
  yield put(unityExerciseStart(options));
}

export function* exerciseCompleteSaga(action: IAction<UnityCompletePayload>) {
  try {
    const resultStr = action.payload.result;
    yield put(consoleLog(`completeExercise: ${resultStr}`));
    const isAuto = yield select(getAutoValue);
    if (!isAuto) {
      return;
    }
    const result = JSON.parse(resultStr);
    if (!result || !result.name) {
      throw new Error();
    }
    const nextExercise = result.name;
    yield put(exerciseSelect(nextExercise));
    yield take(EXERCISE_READY);
    yield put(exerciseExerciseInit());
  } catch (error) {
    yield put(consoleError('Wrong completeExercise format!'));
    yield put(unityStop());
  }
}

export function* exerciseWatcher() {
  yield all([
    takeEvery(EXERCISE_SELECT, selectExerciseSaga),
    takeEvery(EXERCISE_UNITY_START, startUnitySaga),
    takeEvery(EXERCISE_STOP, stopExerciseSaga),
    takeEvery(EXERCISE_APP_INIT, appInitSaga),
    takeEvery(EXERCISE_EXERCISE_INIT, exerciseInitSaga),
    takeEvery(EXERCISE_EXERCISE_START, exerciseStartSaga),
    takeEvery(UNITY_EXERCISE_COMPLETE, exerciseCompleteSaga),
  ]);
}
