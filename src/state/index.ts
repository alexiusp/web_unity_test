import { Action, applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { CONSOLE_PROGRESS_UPDATE } from './actions/console';
import { IAppState } from './models/state';
import reducer from './reducers';
import rootSaga from './sagas';

export type AppStore = Store<IAppState, Action>;

export default function getStore(): AppStore {
  const rootSagaMiddleware = createSagaMiddleware();
  const composeEnhancers = composeWithDevTools({
    maxAge: 1000,
    actionsBlacklist: [CONSOLE_PROGRESS_UPDATE],
  });
  const store: AppStore = createStore(
    reducer,
    composeEnhancers(applyMiddleware(rootSagaMiddleware))
  );
  rootSagaMiddleware.run(rootSaga, store.dispatch);
  return store;
}
