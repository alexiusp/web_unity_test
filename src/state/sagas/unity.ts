import { Dispatch } from 'redux';
import { call, put, select, take } from 'redux-saga/effects';

import { consoleError, consoleLog, consoleProgressEnd, consoleProgressStart } from '../actions/console';
import { exerciseLoadingUpdate } from '../actions/exercise';
import {
  UNITY_APP_READY,
  UNITY_INIT,
  UNITY_LOADER_START,
  unityAppReady,
  unityLoaderStart,
} from '../actions/unity';
import { IUnityInstance } from '../models/base';
import { getAutoValue } from '../selectors/controls';

const BASE_PATH = (process.env.REACT_APP_UNITY_PATH || 'https://nncms.s3-eu-central-1.amazonaws.com/assets/edison/exercises/brain');
const BUILD_PATH = BASE_PATH + '/Build';
const LOADER_NAME = 'UnityLoader';
const configPath = `${BUILD_PATH}/Production.json`;
const CANVAS_ID = 'exercise';
let instance: IUnityInstance;

const tempStub = () => null;

declare var UnityLoader: any;
declare var window: {
  appReady: () => void,
  engineReady: () => void,
  exerciseReady: () => void,
  completeExercise: (result: any) => void,
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

export function unityInit(dispatch: Dispatch) {
  // app started handler
  window.appReady = () => dispatch(unityAppReady());
  // 'engine ready' handler
  window.engineReady = tempStub;
  // 'assets loaded' handler
  window.exerciseReady = tempStub;
  // exercise callbacks
  window.completeExercise = tempStub;
  window.exerciseFailed = tempStub;
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
export function* appReady() {
  yield put(consoleProgressEnd());
  yield put(consoleLog('appReady called'));
  const isAuto = yield select(getAutoValue);
  if (isAuto) {
    // this.loadApp();
  }
}

export function* sendMessage(objectName: string, methodName: string, value: any) {
  if (instance) {
    const params = typeof value === 'string' ? value : JSON.stringify(value);
    yield put(consoleLog(`calling SendMessage('${objectName}', '${methodName}', '${params}')`));
    instance.SendMessage(objectName, methodName, params);
  } else {
    yield put(consoleError('Trying to send message to not initialized instance!'));
  }
}

export function* appEngineSaga() {
  try {
    while (true) {
      yield take()
    }
  } finally {
    // what should we do?
  }
}


export function* unityWatcher(dispatch: Dispatch) {
  // wait for init action
  yield take(UNITY_INIT);
  // inject UnityLoader
  yield call(unityInit, dispatch);
  // wait for onLoad callback
  yield take(UNITY_LOADER_START);
  // instantiate app
  yield call(unityLoaderStartSaga, dispatch);
  // wait for onLoad callback
  while (yield take(UNITY_APP_READY)) {
    //
  }
}
