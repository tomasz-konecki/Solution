import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { PersistGate } from "redux-persist/integration/react";

import storeCreator from "./store";
import App from "./containers/App";

const { store, persistor, history } = storeCreator;

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App history={history} />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("app")
);
