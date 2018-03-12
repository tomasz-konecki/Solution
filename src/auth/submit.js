import { SubmissionError } from "redux-form";
import { connect } from "react-redux";
import { authSuccess, authStart, authStop } from "../actions/authActions";
import { push } from "react-router-redux";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import * as Promise from "bluebird";
import DCMTWebApi from "../api";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const errorHandler = dispatch => error => {
  dispatch(authStop());
  if (error.response.data.errorOccured === true) {
    const { errors } = error.response.data;
    throw new SubmissionError({
      _error:
        errors[Object.keys(errors)[0]]
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
    .then(() => DCMTWebApi.auth(username, password))
    .then(userBlock => {
      dispatch(authSuccess(userBlock));
      dispatch(authStop());
      dispatch(push("/main"));
    })
    .catch(errorHandler(dispatch));
};

export default submit;
