import axios from 'axios';
import { Dispatch } from 'redux';
import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { APP_START } from '../actions';
import { controlsConfigUpdate } from '../actions/controls';
import { exerciseConfigUpdate, exerciseSelect } from '../actions/exercise';
import { exerciseWatcher } from './exercise';
import { progressWatcher } from './progress';
import { unityWatcher } from './unity';

const baseUrl = process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain';
const configPath = '/Configs';
const startExercise = 'Memoflow';

export function* startAppSaga() {
  const appConfigResponse = yield axios.get(`${baseUrl}${configPath}/AppConfig.json`);
  if (appConfigResponse.status === 200) {
    const config = JSON.stringify(appConfigResponse.data);
    yield put(controlsConfigUpdate(config));
    yield put(exerciseConfigUpdate(config));
  }
  yield put(exerciseSelect(startExercise));
}

export function* appWatcher() {
  yield all([
    takeEvery(APP_START, startAppSaga),
  ]);
}

// should register all 'watcher'-sagas used by application
export default function* rootSaga(dispatch: Dispatch) {
  yield all([
    fork(appWatcher),
    fork(progressWatcher),
    fork(exerciseWatcher),
    fork(unityWatcher, dispatch),
  ])
}
