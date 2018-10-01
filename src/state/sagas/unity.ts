import { Dispatch } from 'redux';
import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';

import { BASE_PATH, CANVAS_ID } from '../../constants';
import { consoleError, consoleLog, consoleProgressEnd, consoleProgressStart } from '../actions/console';
import { EXERCISE_READY, exerciseLoadingUpdate, exerciseSelect } from '../actions/exercise';
import {
  UNITY_APP_INIT,
  UNITY_APP_READY,
  UNITY_ENGINE_READY,
  UNITY_EXERCISE_COMPLETE,
  UNITY_EXERCISE_FAILED,
  UNITY_EXERCISE_INIT,
  UNITY_EXERCISE_READY,
  UNITY_EXERCISE_START,
  UNITY_INIT,
  UNITY_LOADER_START,
  UNITY_STOP,
  unityAppInit,
  unityAppReady,
  unityEngineReady,
  unityExerciseComplete,
  unityExerciseFailed,
  unityExerciseInit,
  unityExerciseReady,
  unityExerciseRunning,
  unityExerciseStart,
  unityLoaderStart,
  unityStop,
} from '../actions/unity';
import { IAction } from '../models/actions';
import { IUnityInstance } from '../models/base';
import { getAutoValue } from '../selectors/controls';
import { getAppConfig, getExerciseOptions, getExerciseSettings } from '../selectors/exercise';

const BUILD_PATH = `${BASE_PATH}/Build`;
const LOADER_NAME = 'UnityLoader';
const appConfigPath = `${BUILD_PATH}/Production.json`;

let instance: IUnityInstance;

declare var UnityLoader: any;
declare var window: {
  appReady: () => void,
  engineReady: () => void,
  exerciseReady: () => void,
  completeExercise: (result: string) => void,
  exerciseFailed: (e: Error) => void,
};

const cacheBusterDict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function getCacheBuster() {
  let text = '';
  for (let index = 0; index < 3; index++) {
    text += cacheBusterDict.charAt(Math.floor(Math.random() * cacheBusterDict.length));
  }
  return text;
}

let startTime: number;
const timerName = 'timer';
function getTimestamp() {
  return Math.trunc(Date.now() / 1000);
}

export function unityInitSaga(dispatch: Dispatch) {
  startTime = getTimestamp();
  console.time(timerName);
  // app started handler
  window.appReady = () => dispatch(unityAppReady());
  // 'engine ready' handler
  window.engineReady = () => dispatch(unityEngineReady());
  // 'assets loaded' handler
  window.exerciseReady = () => dispatch(unityExerciseReady());
  // exercise completed callback
  window.completeExercise = (result: string) => dispatch(unityExerciseComplete(result));
  // error handler
  window.exerciseFailed = (e: Error) => dispatch(unityExerciseFailed(e.message));
  const script = document.createElement('script');
  const loaderPath = BUILD_PATH + '/' + LOADER_NAME + '.js?rnd=' + getCacheBuster();
  script.src = loaderPath;
  script.onload = () => dispatch(unityLoaderStart());
  script.async = true;
  document.body.appendChild(script);
  dispatch(consoleLog(`${timerName} started at ${startTime}`));
}

export function* unityLoaderStartSaga(dispatch: Dispatch) {
  yield put(consoleLog('UnityLoader onLoad called'));
  // unity loader script loaded - ready to load engine
  // const path = appConfigPath + '?rnd=' + getCacheBuster();
  const onProgress = (inst: IUnityInstance, progress: number) => dispatch(exerciseLoadingUpdate(progress));
  instance = UnityLoader.instantiate(CANVAS_ID, appConfigPath, { onProgress });
  yield put(consoleProgressStart());
}

export function* unityInitTransitionSaga(dispatch: Dispatch) {
  // inject UnityLoader
  yield fork(unityInitSaga, dispatch);
  // wait for onLoad callback
  yield take(UNITY_LOADER_START);
  // instantiate app
  yield fork(unityLoaderStartSaga, dispatch);
}

// 'app ready' handler called when core app loaded
export function* appReadySaga() {
  yield put(consoleLog('appReady called'));
  yield put(consoleProgressEnd());
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    yield put(unityAppInit());
  }
}

export function* appInitSaga() {
  const configStr = yield select(getAppConfig);
  const config = JSON.parse(configStr);
  config.startedAt = startTime;
  const finishedAt = getTimestamp();
  yield put(consoleLog(`${timerName} finished at ${finishedAt}`));
  console.timeEnd(timerName);
  yield call(sendMessage, 'Main', 'InitializeApp', JSON.stringify(config));
  yield put(consoleProgressStart());
}

export function* unityEngineStartupSaga(action: IAction) {
  if (action.type !== UNITY_APP_INIT) {
    return;
  }
  yield fork(appInitSaga);
  // wait for engineReady
  yield take(UNITY_ENGINE_READY);
  yield put(consoleLog('engineReady called'));
  yield put(consoleProgressEnd());
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    yield put(unityExerciseInit());
  }
}

export function* exerciseStartupSaga(action: IAction) {
  if (action.type !== UNITY_EXERCISE_INIT) {
    return;
  }
  const settings = yield select(getExerciseSettings);
  yield call(sendMessage, 'Main', 'InitializeExercise', settings);
  yield put(consoleProgressStart());
  yield take(UNITY_EXERCISE_READY);
  yield put(consoleLog('exerciseReady called'));
  yield put(consoleProgressEnd());
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    yield put(unityExerciseStart());
  }
}

export function* exerciseStartSaga(action: IAction) {
  if (action.type !== UNITY_EXERCISE_START) {
    return;
  }
  yield put(unityExerciseRunning());
  const options = yield select(getExerciseOptions);
  yield call(sendMessage, 'Main', 'StartExercise', options);
}

export function* exerciseCompleteSaga(action: IAction<{ result: string }>) {
  if (action.type !== UNITY_EXERCISE_COMPLETE) {
    return;
  }
  try {
    const resultStr = action.payload.result;
    yield put(consoleLog(`completeExercise: ${resultStr}`));
    const result = JSON.parse(resultStr);
    if (!result || !result.name) {
      throw new Error();
    }
    const nextExercise = result.name;
    yield put(exerciseSelect(nextExercise));
    yield take(EXERCISE_READY);
    const isAuto = yield select(getAutoValue);
    if (isAuto) {
      yield put(unityExerciseInit());
    }
  } catch (error) {
    yield put(consoleError('Wrong completeExercise format!'));
    yield put(unityStop());
  }
}

export function* sendMessage(objectName: string, methodName: string, value: any) {
  if (instance) {
    const params = typeof value === 'string' ? value : JSON.stringify(value);
    yield put(consoleLog(`calling SendMessage('${objectName}', '${methodName}', '${params}')`));
    instance.SendMessage(objectName, methodName, params);
  } else {
    yield put(consoleError('Trying to send message to not initialized instance!'));
    yield put(unityStop());
  }
}

export function* unityFlowStartSaga(dispatch: Dispatch) {
  yield fork(unityInitTransitionSaga, dispatch);
  // wait for appReady callback
  yield take(UNITY_APP_READY);
  yield fork(appReadySaga);
}

export function* unityWatcher(dispatch: Dispatch) {
  yield all([
    takeLatest(UNITY_INIT, unityFlowStartSaga, dispatch),
    takeLatest([UNITY_APP_INIT, UNITY_STOP, UNITY_EXERCISE_FAILED], unityEngineStartupSaga),
    takeLatest([UNITY_EXERCISE_INIT, UNITY_STOP, UNITY_EXERCISE_FAILED], exerciseStartupSaga),
    takeLatest([UNITY_EXERCISE_START, UNITY_STOP, UNITY_EXERCISE_FAILED], exerciseStartSaga),
    takeLatest([UNITY_EXERCISE_COMPLETE, UNITY_STOP, UNITY_EXERCISE_FAILED], exerciseCompleteSaga),
  ]);
}
