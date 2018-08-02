import {
  LOAD_EMPLOYEES_SUCCESS,
  LOAD_EMPLOYEES_FAILURE,
  LOGOUT, GET_EMPLOYEE,
  CHANGE_EMPLOYEE_OPERATION_STATUS,
  CHANGE_EMPLOYEE_STATE, LOAD_ASSIGNMENTS,
  DELETE_QUATER, REACTIVATE_QUATER
} from "../constants";
import { updateObject } from '../services/methods';
const initialState = {
  employees: [],
  currentPage: 1,
  totalPageCount: 1,

  employeeStatus: null,
  employeeErrors: [],
  employee: null,

  employeeOperationStatus: null,
  employeeOperationErrors: [],
  employeeResultMessage: "",

  loadAssignmentsStatus: null,
  loadAssignmentsErrors: [],
  loadedAssignments: [],

  deleteQuaterStatus: null,
  deleteQuaterErrors: [],

  reactivateQuaterStatus: null,
  reactivateQuaterErrors: []

  // Tu sknczyolem
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
    case CHANGE_EMPLOYEE_STATE:
      return updateObject(state, { employeeOperationStatus: action.employeeOperationStatus, employeeOperationErrors: action.employeeOperationErrors, 
        employeeResultMessage: action.employeeResultMessage })
    case LOAD_ASSIGNMENTS:
      return updateObject(state, { loadAssignmentsStatus: action.loadAssignmentsStatus, loadAssignmentsErrors: action.loadAssignmentsErrors, 
        loadedAssignments: action.loadedAssignments})
    case DELETE_QUATER:
      return updateObject(state, { deleteQuaterStatus: action.deleteQuaterStatus, deleteQuaterErrors: action.deleteQuaterErrors })
    
      default:
      return state;
  }
};
