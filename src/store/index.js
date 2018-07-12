import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { persistStore, persistReducer } from "redux-persist";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import storage from "redux-persist/lib/storage";
import * as reducers from "../reducers";

const history = createHistory();

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["form", "asyncReducer", "projectsReducer", "reportsReducer", "oneDriveReducer", 
  "skillsReducer"],
  migrate: state => {
    if (state !== undefined && state.authReducer !== undefined)
      state.authReducer.loading = false;
    return Promise.resolve(state);
  }
};

const storeCreator = () => {
  const middleware = applyMiddleware(routerMiddleware(history), thunk);
  const persistedReducer = persistReducer(
    persistConfig,
    combineReducers(
      Object.assign({}, reducers, routerReducer, { form: formReducer })
    )
  );

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore(persistedReducer, composeEnhancers(middleware));

  let persistor = persistStore(store);

  return {
    store: store,
    persistor: persistor,
    history: history
  };
};

export default storeCreator();
