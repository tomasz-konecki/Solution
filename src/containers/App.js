import React from "react";

import { Route, Switch } from 'react-router';
import { PrivateRoute, Login, Home } from '../creators';

import "../scss/App.scss";

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <PrivateRoute exact path="/" component={Home} />
  </Switch>
);

export default App;
