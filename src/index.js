import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';

import createHistory from 'history/createBrowserHistory';

import storeCreator from './store';
import App from './containers/App';

const history = createHistory();

const { store, persistor } = storeCreator(history);

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App history={history}/>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('app')
);
