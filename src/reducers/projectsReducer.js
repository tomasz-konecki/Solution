import {
  LOAD_PROJECTS_SUCCESS,
  LOGOUT,
  CHANGE_EDITED_PROJECT,
  GET_PROJECT,
  ADD_EMPLOYEE_TO_PROJECT,
  ADD_FEEDBACK,
  GET_MY_FEEDBACK,
  GET_FEEDBACKS,
  EDIT_FEEDBACK,
  DELETE_FEEDBACK,
  EDIT_PROJECT,
  CHANGE_PROJECT_SKILLS,
  ADD_SKILLS_TO_PROJECT,
  CHANGE_PROJECT_STATE,
  CREATE_PROJECT,
  CREATE_PROJECT_PHASE,
  GET_SUGGEST_EMPLOYEES,
  CHANGE_GET_SUGGEST_EMPLOYEES_STATUS,
  GET_CONTACT_PERSON_DATA,
  ADD_PROJECT_OWNER_TO_PROJECT,
  EDIT_EMPLOYEE_ASSIGNMENT,
  DELETE_EMPLOYEE_ASSIGNMENT
} from "../constants";
import { updateObject } from "../services/methods";
const initialState = {
  projects: [],
  currentPage: 1,
  totalPageCount: 1,
  editedProjectId: null,
  clients: [],
  resultBlock: null,

  project: null,
  loadProjectStatus: null,
  loadProjectErrors: [],

  responsiblePersonKeys: [],
  overViewKeys: [],

  addEmployeeToProjectStatus: null,
  addEmployeeToProjectErrors: [],

  addFeedbackStatus: null,
  addFeedbackErrors: [],

  loadedFeedback: [],
  getMyFeedbackStatus: null,
  getMyFeedbackErrors: [],

  loadedFeedbacks: [],
  loadFeedbackStatus: null,
  loadFeedbackErrors: [],

  deleteFeedbackStatus: null,
  deleteFeedbackErrors: [],

  editFeedbackStatus: null,
  editFeedbackErrors: [],

  editProjectStatus: null,
  editProjectErrors: [],

  changeProjectSkillsStatus: null,
  changeProjectSkillsErrors: [],

  addSkillsToProjectStatus: null,
  addSkillsToProjectErrors: [],

  changeProjectStateStatus: null,
  changeProjectStateErrors: [],
  currentOperation: "",

  createProjectStatus: null,
  createProjectErrors: [],

  createProjectPhaseStatus: null,
  createProjectPhaseError: [],

  getSuggestEmployeesStatus: null,
  getSuggestEmployeesError: [],

  suggestEmployees: {},

  contactPersonData: [],
  getContactPersonDataStatus: null,
  getContactPersonDataErrors: [],

  addProjectOwnerToProjectStatus: null,
  addProjectOwnerToProjectErrors: []
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROJECT_OWNER_TO_PROJECT:
      return updateObject(state, {
        addProjectOwnerToProjectStatus: action.addProjectOwnerToProjectStatus,
        addProjectOwnerToProjectErrors: action.addProjectOwnerToProjectErrors
      });
    case GET_CONTACT_PERSON_DATA:
      return updateObject(state, {
        contactPersonData: action.contactPersonData,
        getContactPersonDataStatus: action.getContactPersonDataStatus,
        getContactPersonDataErrors: action.getContactPersonDataErrors
      });
    case LOAD_PROJECTS_SUCCESS:
      return updateObject(state, {
        projects: action.projects.results,
        currentPage: action.projects.currentPage,
        totalPageCount: action.projects.totalPageCount,
        resultBlock: action.resultBlock
      });
    case LOGOUT:
      return {
        projects: [],
        currentPage: 1,
        totalPageCount: 1
      };
    case CHANGE_EDITED_PROJECT:
      return {
        editedProjectId: action.projectId
      };
    case GET_PROJECT:
      return updateObject(state, {
        project: action.project,
        loadProjectStatus: action.loadProjectStatus,
        loadProjectErrors: action.loadProjectErrors,
        responsiblePersonKeys: action.responsiblePersonKeys,
        overViewKeys: action.overViewKeys
      });
    case ADD_EMPLOYEE_TO_PROJECT:
      return updateObject(state, {
        addEmployeeToProjectStatus: action.addEmployeeToProjectStatus,
        addEmployeeToProjectErrors: action.addEmployeeToProjectErrors
      });

    case EDIT_EMPLOYEE_ASSIGNMENT:
      return updateObject(state, {
        addEmployeeToProjectStatus: action.addEmployeeToProjectStatus,
        addEmployeeToProjectErrors: action.addEmployeeToProjectErrors
      })

    case DELETE_EMPLOYEE_ASSIGNMENT:
      return updateObject(state, {
        addEmployeeToProjectStatus: action.addEmployeeToProjectStatus,
        addEmployeeToProjectErrors: action.addEmployeeToProjectErrors
      })

    case ADD_FEEDBACK:
      return updateObject(state, {
        addFeedbackStatus: action.addFeedbackStatus,
        addFeedbackErrors: action.addFeedbackErrors
      });

    case GET_FEEDBACKS:
      return updateObject(state, {
        loadedFeedbacks: action.loadedFeedbacks,
        loadFeedbackStatus: action.loadFeedbackStatus,
        loadFeedbackErrors: action.loadFeedbackErrors
      });

    case EDIT_FEEDBACK:
      return updateObject(state, {
        editFeedbackStatus: action.editFeedbackStatus,
        editFeedbackErrors: action.editFeedbackErrors
      });

    case DELETE_FEEDBACK:
      return updateObject(state, {
        deleteFeedbackStatus: action.deleteFeedbackStatus,
        deleteFeedbackErrors: action.deleteFeedbackErrors
      });

    case EDIT_PROJECT:
      return updateObject(state, {
        editProjectStatus: action.editProjectStatus,
        editProjectErrors: action.editProjectErrors
      });

    case CHANGE_PROJECT_SKILLS:
      return updateObject(state, {
        changeProjectSkillsStatus: action.changeProjectSkillsStatus,
        changeProjectSkillsErrors: action.changeProjectSkillsErrors
      });

    case ADD_SKILLS_TO_PROJECT:
      return updateObject(state, {
        addSkillsToProjectStatus: action.addSkillsToProjectStatus,
        addSkillsToProjectErrors: action.addSkillsToProjectErrors
      });
    case CHANGE_PROJECT_STATE:
      return updateObject(state, {
        changeProjectStateStatus: action.changeProjectStateStatus,
        changeProjectStateErrors: action.changeProjectStateErrors,
        currentOperation: action.currentOperation
      });
    case CREATE_PROJECT:
      return updateObject(state, {
        createProjectStatus: action.createProjectStatus,
        createProjectErrors: action.createProjectErrors
      });
    case CREATE_PROJECT_PHASE:
      return updateObject(state, {
        createProjectPhaseStatus: action.createProjectPhaseStatus,
        createProjectPhaseError: action.createProjectPhaseError
      });
    case GET_SUGGEST_EMPLOYEES:
      return updateObject(state, { suggestEmployees: action.suggestEmployees });
    case CHANGE_GET_SUGGEST_EMPLOYEES_STATUS:
      return updateObject(state, {
        getSuggestEmployeesStatus: action.getSuggestEmployeesStatus,
        getSuggestEmployeesError: action.getSuggestEmployeesError
      });
    default:
      return state;
  }
};
