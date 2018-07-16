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
  ADD_SKILLS_TO_PROJECT
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
  addSkillsToProjectErrors: []
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
    default:
      return state;
  }
};
