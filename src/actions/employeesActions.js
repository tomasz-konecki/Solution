import {
  LOAD_EMPLOYEES_SUCCESS,
  ASYNC_STARTED,
  ASYNC_ENDED,
  LOAD_EMPLOYEES_FAILURE, GET_EMPLOYEE,
  CHANGE_EMPLOYEE_OPERATION_STATUS
} from "../constants";
import axios from "axios";
import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { errorCatcher } from '../services/errorsHandler';

export const loadEmployeesSuccess = employees => {
  return {
    type: LOAD_EMPLOYEES_SUCCESS,
    employees
  };
};

export const loadEmployeesFailure = resultBlock => {
  return {
    type: LOAD_EMPLOYEES_FAILURE,
    resultBlock
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
    WebApi.employees.post
      .list(settings)
      .then(response => {
        if (!response.errorOccurred()) {
          dispatch(loadEmployeesSuccess(response.extractData()));
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(loadEmployeesFailure(error));
        dispatch(asyncEnded());
      });
  };
};



export const changeEmployeeOperationStatus = (employeeStatus, employeeErrors) => {
  return { type: CHANGE_EMPLOYEE_OPERATION_STATUS, employeeStatus, employeeErrors }
}
export const getEmployee = employee => {
  return { type: GET_EMPLOYEE, employee }
}
export const getEmployeePromise = (employeeId) => (dispatch) => {
  return new Promise(resolve => {
    WebApi.employees.get.byEmployee(employeeId).then(response => {
      const { dtoObject } = response.replyBlock.data;
      dispatch(getEmployee(dtoObject));
      dispatch(changeEmployeeOperationStatus(true, []));
      resolve(dtoObject);
    }).catch(error => {
      dispatch(changeEmployeeOperationStatus(false, errorCatcher(error)));
      dispatch(clearAfterTime(5000));
    })
  })
}

const clearAfterTime = delay => {
  return dispatch => {
      setTimeout(() => {
        dispatch(changeEmployeeOperationStatus(null, []))
      }, delay);
  }
  
}