import { Action, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { IAppState } from './models/state';
import reducer from './reducers';

export type AppStore = Store<IAppState, Action>;

export default function getStore(): AppStore {
  const store = createStore(
    reducer,
    composeWithDevTools()
  );
  return store;
}
