import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import createHistory from 'history/createBrowserHistory';

import storeCreator from './store';
import * as reducers from './reducers';
import App from './containers/App';

const history = createHistory();

const store = storeCreator(reducers, history);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App {...this.props}/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
