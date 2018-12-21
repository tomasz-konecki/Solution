import { LOAD_SKILLS_SUCCESS, SKILL_ADDED, GET_ALL_SKILLS, ADD_NEW_SKILL } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  skills: [],

  loadedSkills: [],
  loadSkillsStatus: null,
  loadSkillsErrors: [],

  addNewSkillStatus: null,
  addNewSkillErrors: []
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
    case ADD_NEW_SKILL:
      return updateObject(state, { addNewSkillStatus: action.addNewSkillStatus, addNewSkillErrors: action.addNewSkillErrors })
    default:
      return state;
  }
};
