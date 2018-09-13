import { SubmissionError } from "redux-form";
import { connect } from "react-redux";
import { authSuccess, authStart, authStop, authAccountRequest } from "../actions/authActions";
import { push } from "react-router-redux";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird/js/browser/bluebird.core.min.js";
import WebApi from "../api";
//
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const errorHandler = dispatch => error => {
  dispatch(authStop());
  if (
    error.response !== undefined &&
    error.response.data.errorOccurred === true
  ) {
    const { errorObjects } = error.response.data;
    if(errorObjects[0].model === "Account request added")
    {
      dispatch(authAccountRequest());
    }
    throw new SubmissionError({
      _error: errorObjects[0].errors[Object.keys(errorObjects[0].errors)[0]]
    });
  } else if (error.response !== undefined) {
    switch (error.response.status) {
      case 401:
        throw new SubmissionError({
          _error: "Nieprawidłowe dane"
        });
      case 503:
        throw new SubmissionError({
          _error: "Serwis niedostępny!"
        });
      default:
        throw new SubmissionError({
          _error: "Nieoczekiwany błąd"
        });
    }
  } else {
    throw new SubmissionError({
      _error: "Nieoczekiwany błąd"
    });
  }
};

const submit = ({ username, password }, dispatch) => {
  return Promise.resolve()
    .then(() => dispatch(authStart()))
    .then(() => WebApi.users.post.login(username, password))
    .then(userBlock => {
      dispatch(authSuccess(userBlock));
      dispatch(authStop());
      dispatch(push("/main"));
    })
    .catch(e => errorHandler(dispatch)(e));
};

export default submit;
