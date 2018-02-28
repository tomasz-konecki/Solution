import { SubmissionError } from "redux-form";
import { connect } from "react-redux";
import { authSuccess, authStart, authStop } from "../actions/authActions";
import { push } from "react-router-redux";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";
import DCMTWebApi from "../api";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const errorHandler = error => {
  if (error.response === undefined) {
    throw new SubmissionError({
      _error: error.toString()
    });
  }
  switch (error.response.status) {
    case 401:
      throw new SubmissionError({
        _error: "Nieprawidłowe dane"
      });
    default:
      throw new SubmissionError({
        _error: "Nieoczekiwany błąd"
      });
  }
};

const submit = ({ username, password }, dispatch) => {
  return Promise.resolve()
    .then(() => dispatch(authStart()))
    .then(() => sleep(2000))
    .then(() => DCMTWebApi.auth(username, password))
    .then(token => {
      dispatch(authSuccess(token));
      dispatch(push("/main"));
    })
    .catch(errorHandler);
};

export default submit;
