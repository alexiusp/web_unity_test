import axios from 'axios';
import { Dispatch } from 'redux';
import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { CONFIG_PATH, FIRST_EXERCISE } from '../../constants';
import { unityWatcher } from '../../unity/store/saga';
import { APP_START } from '../actions';
import { controlsConfigUpdate } from '../actions/controls';
import { exerciseConfigUpdate, exerciseSelect } from '../actions/exercise';
import { exerciseWatcher } from './exercise';
import { progressWatcher } from './progress';

export function* startAppSaga() {
  const appConfigResponse = yield axios.get(`${CONFIG_PATH}/AppConfig.json`);
  if (appConfigResponse.status === 200) {
    const config = JSON.stringify(appConfigResponse.data);
    yield put(controlsConfigUpdate(config));
    yield put(exerciseConfigUpdate(config));
  }
  yield put(exerciseSelect(FIRST_EXERCISE));
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
