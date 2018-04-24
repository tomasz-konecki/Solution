import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.css";
import * as languageActions from "../actions/languageActions";

import { Route, Switch, BrowserRouter } from "react-router";
import { PrivateRoute, Home } from "../creators";
import { TranslatorProvider } from "react-translate";

import "../scss/App.scss";

import en from '../translations/en';
import pl from '../translations/pl';

import LoginScreen from './login/LoginScreen';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LANGUAGE_CHANGE } from '../constants';
import { withRouter } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.props.language || "pl"
    };

    this.returnLanguage = this.returnLanguage.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type === LANGUAGE_CHANGE){
      this.changeLanguage(nextProps.language);
    }
  }

  changeLanguage(language) {
    this.setState({
      language
    }, () => {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
  }

  returnLanguage() {
    switch(this.state.language){
      case "pl":
        return pl;
      case "en":
        return en;
      default:
        return pl;
    }
  }

  render() {
    return (
      <TranslatorProvider translations={this.returnLanguage()}>
        <Switch>
          <Route exact path="/" component={LoginScreen} />
          <PrivateRoute path="/main" component={Home} history={this.props.history} />
        </Switch>
      </TranslatorProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.languageReducer.language,
    type: state.languageReducer.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    lang: bindActionCreators(languageActions, dispatch)
  };
}

App.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
