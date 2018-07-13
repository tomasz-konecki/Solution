import { LOAD_SKILLS_SUCCESS, SKILL_ADDED, GET_ALL_SKILLS } from "../constants";
import axios from "axios";
import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { errorCatcher } from '../services/errorsHandler';
import { isArrayContainsByObjectKey } from '../services/methods';
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
          dispatch(addSkillSuccess(response.colorBlock()));
          dispatch(loadSkills());
        }
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(addSkillSuccess(error.colorBlock()));
        dispatch(asyncEnded());
      });
  };
};


export const getAllSkills = (loadedSkills, loadSkillsStatus, loadSkillsErrors) => {
  return { type: GET_ALL_SKILLS, loadedSkills, loadSkillsStatus, loadSkillsErrors}
}

export const getAllSkillsACreator = currentAddedSkills => {
  return dispatch => {
    
    WebApi.skills.get.all().then(response => {
      const dtoArray = [];
      const { dtoObject } = response.replyBlock.data;
      const keys = Object.keys(dtoObject);
      for(let i = 0; i < keys.length; i++){
          if(dtoObject[keys[i]].name){
            if(!isArrayContainsByObjectKey(currentAddedSkills, dtoObject[keys[i]].name)){
              dtoArray.push({"id": keys[i], "name": dtoObject[keys[i]].name});
            }
        }
      }
      dispatch(getAllSkills(dtoArray, true, []));
    }).catch(error => {
      dispatch(getAllSkills([], false, errorCatcher(error)));
    })
  }
}
