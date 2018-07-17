import { LOAD_SKILLS_SUCCESS, SKILL_ADDED, GET_ALL_SKILLS } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  skills: [],

  loadedSkills: [],
  loadSkillsStatus: null,
  loadSkillsErrors: []
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
    case GET_ALL_SKILLS:
      return updateObject(state, { loadedSkills: action.loadedSkills, 
        loadSkillsStatus: action.loadSkillsStatus, loadSkillsErrors: action.loadSkillsErrors})
    default:
      return state;
  }
};
