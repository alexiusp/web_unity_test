import { delay } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';

import { CONSOLE_PROGRESS_END, CONSOLE_PROGRESS_START, consoleProgressUpdate  } from '../actions/console';

export function* bgProgress() {
  try {
    while (true) {
      yield put(consoleProgressUpdate());
      yield call(delay, 500);
    }
  } finally {
    // do nothing
  }
}

export function* progressWatcher() {
  while (yield take(CONSOLE_PROGRESS_START)) {
    // start progress task in background
    const bgProgressTask = yield fork(bgProgress);
    // wait for the stop action
    yield take(CONSOLE_PROGRESS_END);
    // cancel task
    yield cancel(bgProgressTask);
  }
}
