import { LOAD_PROJECTS_SUCCESS, LOGOUT } from "../constants";

const initialState = {
  projects: []
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.projects
      };
    case LOGOUT:
      return {
        users: []
      };
    default:
      return state;
  }
};
