import {
 ADD_QUARTER_TALK, GET_QUESTIONS
} from "../constants";
  import WebApi from "../api";
  import { errorCatcher } from "../services/errorsHandler"; 
  import { getEmployeePromise } from './employeesActions.js';

  export const addQuarterTalk = (addQuarterTalkStatus, addQuarterTalkErrors) => {
    return {
        type: ADD_QUARTER_TALK, addQuarterTalkStatus, addQuarterTalkErrors
    };
  };
  
  export const addQuarterTalkACreator = (model, employeeId) => (dispatch) => {
      return new Promise((resolve) => {
        WebApi.quarterTalks.post.createQuarter().then(response => {
            dispatch(getEmployeePromise(employeeId)).then(secondResponse => {
                dispatch(addQuarterTalk(true, []));
                resolve(true);
            }).catch(error => {
                dispatch(addQuarterTalk(true, []));
                resolve(true);
            })
          }).catch(error => {
              dispatch(addQuarterTalk(false, errorCatcher(error)));
              resolve(true);
          })
      });
  }

export const getQuestions = (getQuestionsStatus, getQuestionsErrors, questions) => {
    return {
        type: GET_QUESTIONS,
        getQuestionsStatus,
        getQuestionsErrors,
        questions
    }
}

  export const getQuarterQuestionsACreator = () => (dispatch) => {
      return new Promise((resolve, reject) => {
          WebApi.quarterTalks.get.questions().then(response => {
            dispatch(getQuestions(true, [], response.replyBlock.data.dtoObjects));
            resolve(response);
          }).catch(error => {
              dispatch(getQuestions(false, errorCatcher(error), []));
              reject(error);
          })
      })
  }