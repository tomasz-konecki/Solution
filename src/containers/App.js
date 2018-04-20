import React from "react";
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.css";

import { Route, Switch, BrowserRouter } from "react-router";
import { PrivateRoute, Login, Home } from "../creators";

import "../scss/App.scss";

const App = props => (
  <Switch>
    <Route exact path="/" component={Login} />
    <PrivateRoute path="/main" component={Home} history={props.history} />
  </Switch>
);

App.propTypes = {
  history: PropTypes.object.isRequired
};

export default App;
