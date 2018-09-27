import axios from 'axios';
import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { APP_START } from '../actions';
import {
  controlsConfigUpdate,
  controlsOptionsUpdate,
  controlsSettingsUpdate,
} from '../actions/controls';
import { progressWatcher } from './progress';

const baseUrl = process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain';
const configPath = '/Configs';
const exercisePath = '/Memoflow';

export function* startAppSaga() {
  const appConfigResponse = yield axios.get(`${baseUrl}${configPath}/AppConfig.json`);
  if (appConfigResponse.status === 200) {
    yield put(controlsConfigUpdate(appConfigResponse.data));
  }
  const appSettingsResponse = yield axios.get(`${baseUrl}${configPath}${exercisePath}/Settings.json`);
  if (appSettingsResponse.status === 200) {
    yield put(controlsSettingsUpdate(appSettingsResponse.data));
  }
  const appOptionsResponse = yield axios.get(`${baseUrl}${configPath}${exercisePath}/Options.json`);
  if (appOptionsResponse.status === 200) {
    yield put(controlsOptionsUpdate(appOptionsResponse.data));
  }
}

export function* appWatcher() {
  yield all([
    takeEvery(APP_START, startAppSaga),
  ]);
}

// should register all 'watcher'-sagas used by application
export default function* rootSaga() {
  yield all([
    fork(appWatcher),
    fork(progressWatcher),
  ])
}
