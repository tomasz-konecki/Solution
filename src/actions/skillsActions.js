import { LOAD_SKILLS_SUCCESS, SKILL_ADDED, GET_ALL_SKILLS, ADD_NEW_SKILL } from "../constants";
import axios from "axios";
import WebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { errorCatcher } from '../services/errorsHandler';
import { isArrayContainsByObjectKey, checkForContains, generateSortFunction, sortStrings } from '../services/methods';
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
      dispatch(getAllSkills(dtoArray.sort(sortStrings("name")), true, []));
    }).catch(error => {
      dispatch(getAllSkills([], false, errorCatcher(error)));
    })
  }
}


export const getAllSkillsForEmployee = currentEmployeeSkills => {
  return dispatch => {
    WebApi.skills.get.all().then(response => {
      const skillsArray = [];
      const { dtoObject } = response.replyBlock.data;
      for(let key in dtoObject){
        if(!checkForContains(currentEmployeeSkills, dtoObject[key].name))
          skillsArray.push({
            key: key,
            name: dtoObject[key].name
          });
      }

      dispatch(getAllSkills(skillsArray.sort(sortStrings("name")), true, []));
    }).catch(error => {
      dispatch(getAllSkills([], false, errorCatcher(error)));
    })
  }
}

export const addNewSkill = (addNewSkillStatus, addNewSkillErrors) => {
  return { type: ADD_NEW_SKILL, addNewSkillStatus, addNewSkillErrors}
}

export const addNewSkillACreator = name => (dispatch) => {
    WebApi.skills.post(name).then(response => {
      dispatch(addNewSkill(true, []));
    }).catch(error => {
      dispatch(addNewSkill(false, errorCatcher(error)));
    })
}