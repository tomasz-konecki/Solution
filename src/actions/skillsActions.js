import { LOAD_SKILLS_SUCCESS, SKILL_ADDED } from "../constants";
import axios from "axios";
import WebApi from "../api";
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
    WebApi.skills.get.all()
      .then(response => {
        if(!response.errorOccurred()){
          dispatch(loadSkillsSuccess(response.extractData()));
        }
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
    WebApi.skills.post(name)
      .then(response => {
        if(!response.errorOccurred()){
          dispatch(addSkillSuccess(response.parse().colorBlock()));
          dispatch(loadSkills());
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(addSkillSuccess(error.parse().colorBlock()));
        dispatch(asyncEnded());
      });
  };
};
