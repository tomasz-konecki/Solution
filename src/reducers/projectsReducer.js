import { LOAD_PROJECTS_SUCCESS } from "../constants";

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
    default:
      return state;
  }
};
