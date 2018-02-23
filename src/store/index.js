import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { reducer as formReducer } from 'redux-form';
import storage from 'redux-persist/lib/storage';
import * as reducers from '../reducers';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['form']
};

const storeCreator = (history) => {
  const middleware = applyMiddleware(routerMiddleware(history));
  const persistedReducer = persistReducer(persistConfig,
    combineReducers(Object.assign({}, reducers, routerReducer, { form: formReducer })));

  let store = createStore(
    persistedReducer,
    compose(middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  );

  let persistor = persistStore(store);

  return {
    'store': store,
    'persistor': persistor
  };
};

export default storeCreator;
