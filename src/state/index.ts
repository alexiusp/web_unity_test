import { Action, applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { IAppState } from './models/state';
import reducer from './reducers';
import rootSaga from './sagas';

export type AppStore = Store<IAppState, Action>;

export default function getStore(): AppStore {
  const rootSagaMiddleware = createSagaMiddleware();
  const store: AppStore = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(rootSagaMiddleware))
  );
  rootSagaMiddleware.run(rootSaga, store.dispatch);
  return store;
}
