import { LOAD_SKILLS_SUCCESS, SKILL_ADDED } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadSkillsSuccess = skills => {
  return {
    type: LOAD_SKILLS_SUCCESS,
    skills
  };
};

export const addSkillSuccess = success => {
  return {
    type: SKILL_ADDED,
    success
  };
};

export const loadSkills = () => {
  return dispatch => {
    dispatch(asyncStarted());
    DCMTWebApi.getSkills()
      .then(response => {
        dispatch(loadSkillsSuccess(response.data.dtoObject));
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(asyncEnded());
      });
  };
};

export const addSkill = (name) => {
  return dispatch => {
    dispatch(asyncStarted());
    DCMTWebApi.addSkill(name)
      .then(response => {
        const success = response.data.dtoObject === null && (!response.data.errorOccured);
        dispatch(addSkillSuccess(success));
        if(success) dispatch(loadSkills());
        dispatch(asyncEnded());
      })
      .catch(error => {
        const err = Object.entries(error.response.data.errors)[0][1];
        dispatch(addSkillSuccess(err));
        dispatch(asyncEnded());
      });
  };
};
