import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.css";

import { Route, Switch, BrowserRouter } from "react-router";
import { PrivateRoute, Home } from "../creators";
import { TranslatorProvider } from "react-translate";

import "../scss/App.scss";

import en from '../translations/en';
import pl from '../translations/pl';
import LoginScreen from './login/LoginScreen';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "pl"
    };

    this.returnLanguage = this.returnLanguage.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.languageReadyLogin = this.languageReadyLogin.bind(this);
  }

  changeLanguage(language) {
    this.setState({
      language
    });
  }

  returnLanguage() {
    switch(this.state.language){
      case "pl":
        return pl;
      case "en":
        return en;
      default:
        return en;
    }
  }

  languageReadyLogin() {
    return (props) => <LoginScreen {...props} languageSwitch={this.changeLanguage}/>;
  }

  render() {
    return (
      <TranslatorProvider translations={this.returnLanguage()}>
        <Switch>
          <Route exact path="/" render={this.languageReadyLogin()} />
          <PrivateRoute path="/main" component={Home} history={this.props.history} />
        </Switch>
      </TranslatorProvider>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired
};

export default App;
