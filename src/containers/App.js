import React from "react";

import { Route, Switch, BrowserRouter } from 'react-router';
import { PrivateRoute, Login, Home } from '../creators';

import "../scss/App.scss";

const App = () => (
  <Switch>
    <Route exact path="/" component={Login} />
    <PrivateRoute path="/main" component={Home} />
  </Switch>
);

export default App;
