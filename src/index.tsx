import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import getStore from './state';
import { startAppAction } from './state/actions';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const store = getStore();
store.dispatch(startAppAction());

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
