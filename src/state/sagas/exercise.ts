import axios from 'axios';
import { all, put, select, takeEvery } from 'redux-saga/effects';

import { CONFIG_PATH } from '../../constants';
import { consoleLog } from '../actions/console';
import { controlsOptionsUpdate, controlsSettingsUpdate } from '../actions/controls';
import {
  EXERCISE_APP_INIT,
  EXERCISE_EXERCISE_INIT,
  EXERCISE_EXERCISE_START,
  EXERCISE_SELECT,
  EXERCISE_STOP,
  EXERCISE_UNITY_START,
  exerciseConfigUpdate,
  exerciseOptionsUpdate,
  exerciseReady,
  exerciseSettingsUpdate,
} from '../actions/exercise';
import {
  unityAppInit,
  unityExerciseInit,
  unityExerciseStart,
  unityInit,
  unityStop,
} from '../actions/unity';
import { IAction } from '../models/actions';
import {
  getAppConfig,
  getExerciseOptions,
  getExerciseSettings,
} from '../selectors/controls';

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
  const options = JSON.stringify(appOptionsResponse.data);
  yield put(controlsOptionsUpdate(options));
  yield put(exerciseOptionsUpdate(options));
  yield put(exerciseReady());
}

export function* startUnitySaga() {
  yield put(consoleLog('Start!'));
  yield put(unityInit());
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
  yield put(unityAppInit());
}

export function* exerciseInitSaga() {
  // get settings from edit form
  const settings = yield select(getExerciseSettings);
  // update working copy
  yield put(exerciseSettingsUpdate(settings));
  // send event to unity
  yield put(unityExerciseInit());
}

export function* exerciseStartSaga() {
  // get options from edit form
  const options = yield select(getExerciseOptions);
  // update working copy
  yield put(exerciseOptionsUpdate(options));
  // send event to unity
  yield put(unityExerciseStart());
}

export function* exerciseWatcher() {
  yield all([
    takeEvery(EXERCISE_SELECT, selectExerciseSaga),
    takeEvery(EXERCISE_UNITY_START, startUnitySaga),
    takeEvery(EXERCISE_STOP, stopExerciseSaga),
    takeEvery(EXERCISE_APP_INIT, appInitSaga),
    takeEvery(EXERCISE_EXERCISE_INIT, exerciseInitSaga),
    takeEvery(EXERCISE_EXERCISE_START, exerciseStartSaga),
  ]);
}
