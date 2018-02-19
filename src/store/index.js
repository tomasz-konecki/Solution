import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

const middleware = applyMiddleware(routerMiddleware(history));

/* eslint-disable no-underscore-dangle */
const store = createStore(
  combineReducers({ routerReducer, authReducer }),
  compose(middleware,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
/* eslint-enable */
