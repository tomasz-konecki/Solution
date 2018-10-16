import {
  LOAD_EMPLOYEES_SUCCESS,
  LOAD_EMPLOYEES_FAILURE,
  LOGOUT,
  GET_EMPLOYEE,
  CHANGE_EMPLOYEE_OPERATION_STATUS,
  CHANGE_EMPLOYEE_STATE,
  LOAD_ASSIGNMENTS,
  DELETE_QUATER,
  REACTIVATE_QUATER,
  CHANGE_EMPLOYEE_SKILLS,
  ADD_NEW_SKILLS_TO_EMPLOYEE,
  CHANGE_CERTIFICATES_GET_STATUS,
  GET_CERTYFICATES,
  ADD_CERTIFICATE_RESULT,
  GET_CERTIFICATES_FAILURE,
  GET_CERTIFICATES_SUCCESS,
  UPDATE_EMPLOYEE_SKYPE_ID,
  GET_USER_CV
} from "../constants";
import { updateObject } from "../services/methods";
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
  reactivateQuaterErrors: [],
  reactivateQuaterMesssage: "",

  changeSkillsStatus: null,
  changeSkillsErrors: [],

  addNewSkillsStatus: null,
  addNewSkillsErrors: [],

  updateSkypeIdResult: {
    resultBlock: null,
    loading: false
  },

  loadCertificatesStatus: null,
  loadAssignmentsErrors: [],
  certificates: [],

  userDownloadCVLink: "",
  getUserCVStatus: null,
  getUserCVErrors: []
};

export const employeesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_CV:
      return updateObject(state, {
        userDownloadCVLink: action.userDownloadCVLink,
        getUserCVStatus: action.getUserCVStatus,
        getUserCVErrors: action.getUserCVErrors
      });
    case UPDATE_EMPLOYEE_SKYPE_ID:
      return {
        ...state,
        updateSkypeIdResult: {
          resultBlock: action.resultBlock,
          loading: action.loading
        }
      };
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
      return updateObject(state, { employee: action.employee });
    case CHANGE_EMPLOYEE_OPERATION_STATUS:
      return updateObject(state, {
        employeeStatus: action.employeeStatus,
        employeeErrors: action.employeeErrors
      });
    case CHANGE_EMPLOYEE_STATE:
      return updateObject(state, {
        employeeOperationStatus: action.employeeOperationStatus,
        employeeOperationErrors: action.employeeOperationErrors,
        employeeResultMessage: action.employeeResultMessage
      });
    case LOAD_ASSIGNMENTS:
      return updateObject(state, {
        loadAssignmentsStatus: action.loadAssignmentsStatus,
        loadAssignmentsErrors: action.loadAssignmentsErrors,
        loadedAssignments: action.loadedAssignments
      });
    case CHANGE_CERTIFICATES_GET_STATUS:
      return updateObject(state, {
        loadCertificatesStatus: action.loadCertificatesStatus,
        loadCertificatesErrors: action.loadCertificatesErrors
      });
    case GET_CERTYFICATES:
      return updateObject(state, { certificates: action.certificates });
    case ADD_CERTIFICATE_RESULT:
      return updateObject(state, {
        resultBlockAddCertificate: action.resultBlockAddCertificate
      });
    case DELETE_QUATER:
      return updateObject(state, {
        deleteQuaterStatus: action.deleteQuaterStatus,
        deleteQuaterErrors: action.deleteQuaterErrors
      });
    case REACTIVATE_QUATER:
      return updateObject(state, {
        reactivateQuaterStatus: action.reactivateQuaterStatus,
        reactivateQuaterErrors: action.reactivateQuaterErrors,
        reactivateQuaterMesssage: action.reactivateQuaterMesssage
      });
    case CHANGE_EMPLOYEE_SKILLS:
      return updateObject(state, {
        changeSkillsStatus: action.changeSkillsStatus,
        changeSkillsErrors: action.changeSkillsErrors
      });
    case ADD_NEW_SKILLS_TO_EMPLOYEE:
      return updateObject(state, {
        addNewSkillsStatus: action.addNewSkillsStatus,
        addNewSkillsErrors: action.addNewSkillsErrors
      });
    default:
      return state;
  }
};
