import { Dispatch } from 'redux';
import { call, cancel, fork, put, select, take } from 'redux-saga/effects';

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
  unityAppReady,
  unityEngineReady,
  unityExerciseComplete,
  unityExerciseFailed,
  unityExerciseInit,
  unityExerciseReady,
  unityLoaderStart,
  unityStop,
} from '../actions/unity';
import { IAction, IBaseAction } from '../models/actions';
import { IUnityInstance } from '../models/base';
import { getAutoValue } from '../selectors/controls';
import { getAppConfig, getExerciseOptions, getExerciseSettings } from '../selectors/exercise';

const BASE_PATH = (process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain');
const BUILD_PATH = BASE_PATH + '/Build';
const LOADER_NAME = 'UnityLoader';
const configPath = `${BUILD_PATH}/Production.json`;
const CANVAS_ID = 'exercise';
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

export function unityInitSaga(dispatch: Dispatch) {
  // app started handler
  window.appReady = () => dispatch(unityAppReady());
  // 'engine ready' handler
  window.engineReady = () => dispatch(unityEngineReady());
  // 'assets loaded' handler
  window.exerciseReady = () => dispatch(unityExerciseReady());
  // exercise completed callback
  window.completeExercise = (result: string) => dispatch(unityExerciseComplete(result));
  // error handler
  window.exerciseFailed = () => dispatch(unityExerciseFailed());
  const script = document.createElement('script');
  const loaderPath = BUILD_PATH + '/' + LOADER_NAME + '.js?rnd=' + getCacheBuster();
  script.src = loaderPath;
  script.onload = () => dispatch(unityLoaderStart());
  script.async = true;
  document.body.appendChild(script);
}

export function* unityLoaderStartSaga(dispatch: Dispatch) {
  yield put(consoleLog('UnityLoader onLoad called'));
  // unity loader script loaded - ready to load engine
  const path = configPath + '?rnd=' + getCacheBuster();
  const onProgress = (inst: IUnityInstance, progress: number) => dispatch(exerciseLoadingUpdate(progress));
  instance = UnityLoader.instantiate(CANVAS_ID, path, { onProgress });
  yield put(consoleProgressStart());
}

// 'app ready' handler called when core app loaded
export function* appReadySaga() {
  yield put(consoleLog('appReady called'));
  yield put(consoleProgressEnd());
}

export function* appInitSaga() {
  const config = yield select(getAppConfig);
  yield call(sendMessage, 'Main', 'InitializeApp', config);
  yield put(consoleProgressStart());
}

export function* engineReadySaga() {
  yield put(consoleLog('engineReady called'));
  yield put(consoleProgressEnd());
}

export function* appEngineSaga() {
  try {
    while (true) {
      const settings = yield select(getExerciseSettings);
      yield call(sendMessage, 'Main', 'InitializeExercise', settings);
      yield put(consoleProgressStart());
      yield take(UNITY_EXERCISE_READY);
      yield put(consoleProgressEnd());
      yield put(consoleLog('exerciseReady called'));
      const isAuto = yield select(getAutoValue);
      if (!isAuto) {
        yield take(UNITY_EXERCISE_START);
      }
      const options = yield select(getExerciseOptions);
      yield call(sendMessage, 'Main', 'StartExercise', options);
      const exerciseCompleteAction: IAction<{ result: string }> = yield take(UNITY_EXERCISE_COMPLETE);
      const resultStr = exerciseCompleteAction.payload.result;
      yield put(consoleLog(`completeExercise: ${resultStr}`));
      const result = JSON.parse(resultStr);
      if (!result || !result.name) {
        yield put(consoleError('Wrong completeExercise argument!'));
        yield put(unityStop());
        throw new Error();
      }
      const nextExercise = result.name;
      yield put(exerciseSelect(nextExercise));
      yield take(EXERCISE_READY);
      const stillAuto = yield select(getAutoValue);
      if (stillAuto) {
        yield put(unityExerciseInit());
      }
    }
  } finally {
    yield put(consoleLog('exercise workflow cancelled'));
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

export function* unityWatcher(dispatch: Dispatch) {
  let isAuto: boolean;
  // wait for init action
  yield take(UNITY_INIT);
  // inject UnityLoader
  yield call(unityInitSaga, dispatch);
  // wait for onLoad callback
  yield take(UNITY_LOADER_START);
  // instantiate app
  yield call(unityLoaderStartSaga, dispatch);
  // wait for appReady callback
  yield take(UNITY_APP_READY);
  yield fork(appReadySaga);
  isAuto = yield select(getAutoValue);
  if (!isAuto) {
    // wait for user call for InitializeApp
    yield take(UNITY_APP_INIT);
  }
  yield fork(appInitSaga);
  // wait for engineReady
  yield take(UNITY_ENGINE_READY);
  yield call(engineReadySaga);
  isAuto = yield select(getAutoValue);
  let exerciseTask = isAuto ? yield fork(appEngineSaga) : null;
  // start cycle for running exercises
  while (true) {
    const action: IBaseAction = yield take([UNITY_EXERCISE_INIT, UNITY_STOP, UNITY_EXERCISE_FAILED]);
    yield put(consoleProgressEnd());
    if (exerciseTask) {
      // if task is already running - cancel it
      yield cancel(exerciseTask);
    }
    if (action.type === UNITY_EXERCISE_INIT) {
      exerciseTask = yield fork(appEngineSaga);
    }
  }
}
