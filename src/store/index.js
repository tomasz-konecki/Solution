import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { routerReducer, routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";

const storeCreator = (reducers, history) => {
  const middleware = applyMiddleware(routerMiddleware(history), thunk);
  // const thunk = applyMiddleware(thunk);

  return createStore(
    combineReducers(Object.assign({}, reducers, routerReducer)),
    compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
};

export default storeCreator;
