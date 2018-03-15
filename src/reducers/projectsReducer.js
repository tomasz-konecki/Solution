import { LOAD_PROJECTS_SUCCESS, LOGOUT } from "../constants";

const initialState = {
  projects: [],
  currentPage: 1,
  totalPageCount: 1
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
    default:
      return state;
  }
};
