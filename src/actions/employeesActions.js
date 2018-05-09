import {
  LOAD_EMPLOYEES_SUCCESS,
  ASYNC_STARTED,
  ASYNC_ENDED
} from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadEmployeesSuccess = employees => {
  return {
    type: LOAD_EMPLOYEES_SUCCESS,
    employees
  };
};

export const loadEmployees = (page = 1, limit = 25, other = {}) => {
  return dispatch => {
    const settings = Object.assign(
      {},
      { Limit: limit, PageNumber: page, IsDeleted: false },
      other
    );

    dispatch(asyncStarted());
    DCMTWebApi.getEmployees(settings)
      .then(response => {
        dispatch(loadEmployeesSuccess(response.data.dtoObject));
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(asyncEnded());
        alert("Wystąpił błąd: " + error.toString());
      });
  };
};
