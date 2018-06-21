import {
  LOAD_PROJECTS_SUCCESS,
  LOGOUT,
  CHANGE_EDITED_PROJECT
} from "../constants";

const initialState = {
  projects: [],
  currentPage: 1,
  totalPageCount: 1,
  editedProjectId: null,
  clients: []
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
    default:
      return state;
  }
};
