import { Dispatch } from 'redux';
import { all, call, fork, put, take, takeLatest } from 'redux-saga/effects';

import { IAction } from '../../state/models/actions';
import {
  UNITY_APP_INIT,
  UNITY_APP_READY,
  UNITY_ENGINE_READY,
  UNITY_EXERCISE_FAILED,
  UNITY_EXERCISE_INIT,
  UNITY_EXERCISE_READY,
  UNITY_EXERCISE_START,
  UNITY_INIT,
  UNITY_LOADER_START,
  UNITY_STOP,
  UnityAppInitPayload,
  unityAppReady,
  unityEngineReady,
  unityError,
  unityExerciseComplete,
  unityExerciseFailed,
  UnityExerciseInitPayload,
  unityExerciseReady,
  unityExerciseRunning,
  UnityExerciseStartPayload,
  UnityInitPayload,
  unityLoaderStart,
  unityLoadingEnd,
  unityLoadingStart,
  unityLog,
  unityProgressUpdate,
  unityStop,
} from './actions';

export interface IUnityInstance {
  SendMessage: (objectName: string, methodName: string, value: string) => void,
};
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
let endTime: number;
const timerName = 'timer';
function getTimestamp() {
  return Math.trunc(Date.now() / 1000);
}

export function unityInitSaga(dispatch: Dispatch, action: IAction<UnityInitPayload>) {
  const { basePath, loaderName } = action.payload;
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
  const BUILD_PATH = `${basePath}/Build`;
  const loaderPath = BUILD_PATH + '/' + loaderName + '.js?rnd=' + getCacheBuster();
  script.src = loaderPath;
  script.onload = () => dispatch(unityLoaderStart());
  script.async = true;
  document.body.appendChild(script);
  dispatch(unityLog(`${timerName} started at ${startTime}`));
}

export function* unityLoaderStartSaga(dispatch: Dispatch, action: IAction<UnityInitPayload>) {
  const { basePath, canvasId, options = {} } = action.payload;
  yield put(unityLog('UnityLoader onLoad called'));
  // unity loader script loaded - ready to load engine
  // const path = appConfigPath + '?rnd=' + getCacheBuster();
  const onProgress = (inst: IUnityInstance, progress: number) => dispatch(unityProgressUpdate(progress));
  const BUILD_PATH = `${basePath}/Build`;
  const appConfigPath = `${BUILD_PATH}/Production.json`;
  options.onProgress = onProgress;
  instance = UnityLoader.instantiate(canvasId, appConfigPath, options);
  yield put(unityLog(`UnityLoader.instantiate called with following params: ${canvasId}, ${appConfigPath}, ${JSON.stringify(options)}`));
  yield put(unityLoadingStart());
}

export function* unityInitTransitionSaga(dispatch: Dispatch, action: IAction<UnityInitPayload>) {
  // inject UnityLoader
  yield fork(unityInitSaga, dispatch, action);
  // wait for onLoad callback
  yield take(UNITY_LOADER_START);
  // instantiate app
  yield fork(unityLoaderStartSaga, dispatch, action);
}

// 'app ready' handler called when core app loaded
export function* appReadySaga() {
  yield put(unityLog('appReady called'));
  yield put(unityLoadingEnd());
}

export function* appInitSaga(configStr: string) {
  const config = JSON.parse(configStr);
  if (!endTime) {
    config.startedAt = startTime;
    endTime = getTimestamp();
    yield put(unityLog(`${timerName} finished at ${endTime} (=${endTime - startTime}s)`));
    console.timeEnd(timerName);
  }
  yield call(sendMessage, 'Main', 'InitializeApp', JSON.stringify(config));
  yield put(unityLoadingStart());
}

export function* unityEngineStartupSaga(action: IAction<UnityAppInitPayload>) {
  if (action.type !== UNITY_APP_INIT) {
    return;
  }
  const { config } = action.payload;
  yield fork(appInitSaga, config);
  // wait for engineReady
  yield take(UNITY_ENGINE_READY);
  yield put(unityLog('engineReady called'));
  yield put(unityLoadingEnd());
}

export function* exerciseStartupSaga(action: IAction<UnityExerciseInitPayload>) {
  if (action.type !== UNITY_EXERCISE_INIT) {
    return;
  }
  const settings = action.payload.settings;
  yield call(sendMessage, 'Main', 'InitializeExercise', settings);
  yield put(unityLoadingStart());
  yield take(UNITY_EXERCISE_READY);
  yield put(unityLog('exerciseReady called'));
  yield put(unityLoadingEnd());
}

export function* exerciseStartSaga(action: IAction<UnityExerciseStartPayload>) {
  if (action.type !== UNITY_EXERCISE_START) {
    return;
  }
  yield put(unityExerciseRunning());
  const options = action.payload.options;
  yield call(sendMessage, 'Main', 'StartExercise', options);
}

export function* sendMessage(objectName: string, methodName: string, value: any) {
  if (instance) {
    const params = typeof value === 'string' ? value : JSON.stringify(value);
    yield put(unityLog(`calling SendMessage('${objectName}', '${methodName}', '${params}')`));
    instance.SendMessage(objectName, methodName, params);
  } else {
    yield put(unityError('Trying to send message to not initialized instance!'));
    yield put(unityStop());
  }
}

export function* unityFlowStartSaga(dispatch: Dispatch, action: IAction<UnityInitPayload>) {
  yield fork(unityInitTransitionSaga, dispatch, action);
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
  ]);
}
