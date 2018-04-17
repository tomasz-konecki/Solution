import { LOAD_SKILLS_SUCCESS } from "../constants";

const initialState = {
  skills: []
};

export const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SKILLS_SUCCESS:
      return {
        skills: action.skills
      };
    default:
      return state;
  }
};
