import {
  LOAD_PROJECTS_SUCCESS,
  LOGOUT,
  CHANGE_EDITED_PROJECT,
  GET_PROJECT,
  ADD_EMPLOYEE_TO_PROJECT ,
  DELETE_PROJECT_OWNER,
  DELETE_PROJECT,
  CLOSE_PROJECT,
  REACTIVATE_PROJECT, 
  CHANGE_PROJECT_SKILL,
  ADD_FEEDBACK,
  GET_FEEDBACKS
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

  delProjectOwnerStatus: null,
  delProjectOwnerErrors: [],

  deleteProjectStatus: null,
  deleteProjectErrors: [],

  closeProjectStatus: null,
  closeProjectErrors: [],

  reactivateProjectStatus: null,
  reactivateProjectErrors: [],

  changeProjectSkillStatus: null,
  changeProjectSkillErrors: [],
  
  addFeedbackStatus: null,
  addFeedbackErrors: [],

  loadedFeedbacks: [],
  loadFeedbackStatus: null,
  loadFeedbackErrors: []
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case DELETE_PROJECT_OWNER:
      return updateObject(state, { delProjectOwnerStatus: action.delProjectOwnerStatus, 
        delProjectOwnerErrors: action.delProjectOwnerErrors})
    case DELETE_PROJECT:
      return updateObject(state, { deleteProjectStatus: action.deleteProjectStatus, 
        deleteProjectErrors: action.deleteProjectErrors})
    case CLOSE_PROJECT:
      return updateObject(state, { closeProjectStatus: action.closeProjectStatus, 
        closeProjectErrors: action.closeProjectErrors})
    case REACTIVATE_PROJECT:
      return updateObject(state, { reactivateProjectStatus: action.reactivateProjectStatus, 
        reactivateProjectErrors: action.reactivateProjectErrors})
    case CHANGE_PROJECT_SKILL:
      return updateObject(state, { changeProjectSkillStatus: action.changeProjectSkillStatus, 
        changeProjectSkillErrors: action.changeProjectSkillErrors})
    
    case ADD_FEEDBACK:
      return updateObject(state, { addFeedbackStatus: action.addFeedbackStatus, 
        addFeedbackErrors: action.addFeedbackErrors})

    case GET_FEEDBACKS:
      return updateObject(state, { loadedFeedbacks: action.loadedFeedbacks, 
        loadFeedbackStatus: action.loadFeedbackStatus, loadFeedbackErrors: action.loadFeedbackErrors})
    default:
      return state;
  }
};
