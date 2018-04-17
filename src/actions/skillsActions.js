import { LOAD_SKILLS_SUCCESS } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadSkillsSuccess = skills => {
  return {
    type: LOAD_SKILLS_SUCCESS,
    skills
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
