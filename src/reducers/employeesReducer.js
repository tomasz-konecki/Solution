import {
  LOAD_EMPLOYEES_SUCCESS,
  LOAD_EMPLOYEES_FAILURE,
  LOGOUT, GET_EMPLOYEE,
  CHANGE_EMPLOYEE_OPERATION_STATUS
} from "../constants";
import { updateObject } from '../services/methods';
const initialState = {
  employees: [],
  currentPage: 1,
  totalPageCount: 1,

  employeeStatus: null,
  employeeErrors: [],
  employee: null


};

export const employeesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EMPLOYEES_FAILURE:
      return {
        resultBlock: action.resultBlock
      };
    case LOAD_EMPLOYEES_SUCCESS:
      return {
        employees: action.employees.results,
        currentPage: action.employees.currentPage,
        totalPageCount: action.employees.totalPageCount
      };
    case LOGOUT:
      return {
        employees: [],
        currentPage: 1,
        totalPageCount: 1
      };
    case GET_EMPLOYEE:
      return updateObject(state, { employee: action.employee })
    case CHANGE_EMPLOYEE_OPERATION_STATUS:
      return updateObject(state, { employeeStatus: action.employeeStatus, employeeErrors: action.employeeErrors })
    default:
      return state;
  }
};
