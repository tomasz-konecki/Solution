import React, { Component } from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";

class PrivateRouteContainer extends Component {
  /* eslint-disable react/prop-types*/
  /* eslint-disable react/jsx-no-bind*/
  render() {
    const { isAuthenticated, component: Component, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              push
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}

export default PrivateRouteContainer;
