import axios from 'axios';
import { all, put, takeEvery } from 'redux-saga/effects';

import { controlsOptionsUpdate, controlsSettingsUpdate } from '../actions/controls';
import { EXERCISE_SELECT } from '../actions/exercise';
import { IAction } from '../models/actions';

const baseUrl = process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain';
const configPath = '/Configs';

export function* selectExerciseSaga(action: IAction<{ name: string }>) {
  const exerciseName = action.payload.name;
  const appSettingsResponse = yield axios.get(`${baseUrl}${configPath}/${exerciseName}/Settings.json`);
  if (appSettingsResponse.status === 200) {
    yield put(controlsSettingsUpdate(JSON.stringify(appSettingsResponse.data)));
  }
  const appOptionsResponse = yield axios.get(`${baseUrl}${configPath}/${exerciseName}/Options.json`);
  if (appOptionsResponse.status === 200) {
    yield put(controlsOptionsUpdate(JSON.stringify(appOptionsResponse.data)));
  }
}

export function* exerciseWatcher() {
  yield all([
    takeEvery(EXERCISE_SELECT, selectExerciseSaga),
  ]);
}
