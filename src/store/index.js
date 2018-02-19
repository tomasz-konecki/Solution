import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

const storeCreator = (reducers, history) => {
  const middleware = applyMiddleware(routerMiddleware(history));

  return createStore(
    combineReducers(Object.assign({}, reducers, routerReducer)),
    compose(middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  );
};

export default storeCreator;
