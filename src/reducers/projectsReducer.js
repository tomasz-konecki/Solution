import {
  LOAD_PROJECTS_SUCCESS,
  LOGOUT,
  CHANGE_EDITED_PROJECT,
  GET_PROJECT,
  ADD_EMPLOYEE_TO_PROJECT ,
  ADD_FEEDBACK,
  GET_FEEDBACKS,
  EDIT_PROJECT,
  CHANGE_PROJECT_SKILLS,
  ADD_SKILLS_TO_PROJECT, 
  CHANGE_PROJECT_STATE,
  CREATE_PROJECT,
  GET_SUGGEST_EMPLOYEES,
  CHANGE_GET_SUGGEST_EMPLOYEES_STATUS,
  GET_CONTACT_PERSON_DATA
} from "../constants";
import { updateObject } from '../services/methods';
const initialState = {
  projects: [],
  currentPage: 1,
  totalPageCount: 1,
  editedProjectId: null,
  clients: [],


  project: null, 
  loadProjectStatus: null,
  loadProjectErrors: [],

  responsiblePersonKeys: [],
  overViewKeys: [],

  addEmployeeToProjectStatus: null,
  addEmployeeToProjectErrors: [],

  addFeedbackStatus: null,
  addFeedbackErrors: [],

  loadedFeedbacks: [],
  loadFeedbackStatus: null,
  loadFeedbackErrors: [],

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

  getSuggestEmployeesStatus: null,
  getSuggestEmployeesError: [],

  suggestEmployees: {},

  contactPersonData: [],
  getContactPersonDataStatus: null,
  getContactPersonDataErrors: []
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACT_PERSON_DATA:
      return updateObject(state, { contactPersonData: action.contactPersonData, getContactPersonDataStatus: action.getContactPersonDataStatus, 
        getContactPersonDataErrors: action.getContactPersonDataErrors })
    case LOAD_PROJECTS_SUCCESS:
      return {
        projects: action.projects.results,
        currentPage: action.projects.currentPage,
        totalPageCount: action.projects.totalPageCount
      };
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
      return updateObject(state, { project: action.project, 
        loadProjectStatus: action.loadProjectStatus, loadProjectErrors: action.loadProjectErrors,
        responsiblePersonKeys: action.responsiblePersonKeys, overViewKeys: action.overViewKeys })
    case ADD_EMPLOYEE_TO_PROJECT:
      return updateObject(state, { addEmployeeToProjectStatus: action.addEmployeeToProjectStatus, 
        addEmployeeToProjectErrors: action.addEmployeeToProjectErrors })
    
    case ADD_FEEDBACK:
      return updateObject(state, { addFeedbackStatus: action.addFeedbackStatus, 
        addFeedbackErrors: action.addFeedbackErrors})

    case GET_FEEDBACKS:
      return updateObject(state, { loadedFeedbacks: action.loadedFeedbacks, 
        loadFeedbackStatus: action.loadFeedbackStatus, loadFeedbackErrors: action.loadFeedbackErrors})

    case EDIT_PROJECT:
      return updateObject(state, { editProjectStatus: action.editProjectStatus, 
        editProjectErrors: action.editProjectErrors})
    
    case CHANGE_PROJECT_SKILLS:
      return updateObject(state, { changeProjectSkillsStatus: action.changeProjectSkillsStatus, 
        changeProjectSkillsErrors: action.changeProjectSkillsErrors})

    case ADD_SKILLS_TO_PROJECT:
      return updateObject(state, { addSkillsToProjectStatus: action.addSkillsToProjectStatus,   
        addSkillsToProjectErrors: action.addSkillsToProjectErrors})
    case CHANGE_PROJECT_STATE:
      return updateObject(state, { changeProjectStateStatus: action.changeProjectStateStatus, 
        changeProjectStateErrors: action.changeProjectStateErrors, currentOperation: action.currentOperation })
    case CREATE_PROJECT:
      return updateObject(state, { createProjectStatus: action.createProjectStatus, 
        createProjectErrors: action.createProjectErrors})
    case GET_SUGGEST_EMPLOYEES:
      return updateObject(state, { suggestEmployees: action.suggestEmployees})
    case CHANGE_GET_SUGGEST_EMPLOYEES_STATUS:
      return updateObject(state, { getSuggestEmployeesStatus: action.getSuggestEmployeesStatus, getSuggestEmployeesError: action.getSuggestEmployeesError})
    default:
      return state;
  }
};
