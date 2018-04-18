import { LOAD_SKILLS_SUCCESS } from "../constants";
import { SKILL_ADDED } from './../constants';

const initialState = {
  skills: []
};

export const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SKILLS_SUCCESS:
      return {
        ...state,
        skills: action.skills
      };
    case SKILL_ADDED:
      return {
        ...state,
        success: action.success
      };
    default:
      return state;
  }
};
