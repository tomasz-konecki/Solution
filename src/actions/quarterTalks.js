import {ADD_QUESTION, DELETE_QUESTION,
 ADD_QUARTER_TALK, GET_QUESTIONS, GET_RESERVED_DATES, PLAN_QUARTER, GET_QUARTERS_FOR_EMPLOYEE, DELETE_QUARTER_TALK, REACTIVATE_QUARTER_TALK
} from "../constants";
  import WebApi from "../api";
  import { errorCatcher } from "../services/errorsHandler"; 
  import { getEmployeePromise } from './employeesActions.js';
import moment from 'moment';
import _ from 'lodash';
import { createLastWatchedPersonsArrayACreator } from './persistHelpActions';
import { changeOperationStatus } from './asyncActions';


export const getQuestions = (getQuestionsStatus, getQuestionsErrors, questions) => {
    return {
        type: GET_QUESTIONS,
        getQuestionsStatus,
        getQuestionsErrors,
        questions
    }
}

  export const getQuarterQuestionsACreator = () => dispatch => {
      return new Promise((resolve, reject) => {
          WebApi.quarterTalks.get.questions().then(response => {
            dispatch(getQuestions(true, [], response.replyBlock.data.dtoObjects));
            resolve(response.replyBlock.data.dtoObjects);
          }).catch(error => {
              dispatch(getQuestions(false, errorCatcher(error), []));
              reject();
          })
      })
  }

  export const addQuarterTalk = (addQuarterTalkStatus, addQuarterTalkErrors) => {
    return {
        type: ADD_QUARTER_TALK, addQuarterTalkStatus, addQuarterTalkErrors
    };
  };

  export const addQuarterTalkACreator = (quarterTalkQuestionItems, employeeId) => dispatch => {
      return new Promise((resolve, reject) => {
        const count = quarterTalkQuestionItems.length;
        const quarterIndex = count - 1;
        const yearIndex = count - 2;

        const model = {
            employeeId, year: moment(quarterTalkQuestionItems[yearIndex].value).year(),
            quarter: quarterTalkQuestionItems[quarterIndex].value, quarterTalkQuestionItems: []
        }
        const filteredQuarters = quarterTalkQuestionItems.filter(i => i.mode === "textarea");

        model.quarterTalkQuestionItems = filteredQuarters.map(item => {
            return { quarterTalkQuestionId: item.id, answer: item.value} 
        });

        WebApi.quarterTalks.post.createQuarter(model).then(response => {
            dispatch(addQuarterTalk(true, []));
            resolve();
        }).catch(error => {
            dispatch(addQuarterTalk(false, errorCatcher(error)));
            reject();
        })
      })
  }

export const getReservedDates = (reservedDates, getDatesStatus, getDatesErrors) => {
    return { type: GET_RESERVED_DATES, reservedDates, getDatesStatus, getDatesErrors }
}

  export const getReservedDatesACreator = (employeeId, token, locale) => dispatch => {
      return new Promise((resolve, reject) => {
        const today = moment().format("YYYY-MM-DD HH:mm");
        const model = {
            "dateFrom": today,
            "employeeId": employeeId,
            "token": token
        };

        WebApi.quarterTalks.post.reservedDates(model, true).then(response => {
            const { dtoObjects: cutedResponse } = response.replyBlock.data;
            const copiedResponse = [...cutedResponse];

            const extractedData = [];
            for(let key in cutedResponse){
                const momentedDate = moment(copiedResponse[key].dateTime).locale(locale);
                const time = momentedDate.format("HH:mm");
                const date = momentedDate.format("YYYY-MM-DD");
                const monthName = momentedDate.format("MMMM");
                const dayName = momentedDate.format("dddd");
                const willLastTo = momentedDate.add(cutedResponse[key].length, "minute").format("HH:mm");
                extractedData.push({time, date, monthName, dayName, willLastTo, length: cutedResponse[key].length, dateAndTime: date + " " + time});

            }
            dispatch(getReservedDates(extractedData, true, []));
            dispatch(createLastWatchedPersonsArrayACreator(employeeId));
            
            resolve(extractedData);
        }).catch(error => {
            const catchedError = errorCatcher(error);
            dispatch(getReservedDates([], false, catchedError));
            reject(catchedError);
        })
      })
  }

  export const planQuarter = (planQuarterStatus, planQuarterErrors) => {
      return { type: PLAN_QUARTER, planQuarterStatus, planQuarterErrors}
  }
  export const planQuarterACreator = (employeeId, formItems, token) => dispatch => {
      return new Promise((resolve, reject) => {

        const model = {
            "employeeId": employeeId,
            "plannedTalkDate": formItems[0].value.format("YYYY-MM-DD") + " " + formItems[1].value,
            "year": formItems[0].value.format("YYYY"),
            "quarter": formItems[2].value,
            "token": token
        }

        WebApi.quarterTalks.post.planQuarter(model, true).then(response => {
            dispatch(planQuarter(true, []));
            resolve();
        }).catch(error => {
            dispatch(planQuarter(false, errorCatcher(error)));
            resolve();
        })
      })
  }

  export const getQuartersForEmployee = (quartersForEmployee, quartersForEmployeeStatus, quartersForEmployeeErrors) => {
      return { type: GET_QUARTERS_FOR_EMPLOYEE, quartersForEmployee, quartersForEmployeeStatus, quartersForEmployeeErrors }
  }

  export const getQuartersForEmployeeACreator = employeeId => dispatch => {
      return new Promise((resolve, reject) => {
        WebApi.quarterTalks.get.getQuarterForEmployee(employeeId).then(response => {
            const { dtoObjects: items } = response.replyBlock.data;
            
            items.forEach(function(part, index){
                if(part.plannedTalkDate)
                    items[index].plannedTalkDate = moment(part.plannedTalkDate).format("YYYY-MM-DD HH:mm");
                if(part.aswerQuestionDate)
                    items[index].aswerQuestionDate = moment(part.aswerQuestionDate).format("YYYY-MM-DD HH:mm");
            })
            dispatch(getQuartersForEmployee(items, true, []));
            dispatch(createLastWatchedPersonsArrayACreator(employeeId));
            
            resolve(items);
        }).catch(error => {
            dispatch(getQuartersForEmployee([], false, errorCatcher(error)));
            reject();
        })
      })
  }

  export const deleteQuarterTalk = (deleteQuarterStatus, deleteQuarterErrors) => {
      return { type: DELETE_QUARTER_TALK, deleteQuarterStatus, deleteQuarterErrors }
  }

  export const deleteQuarterTalkACreator = (quarterToDeleteId, quartersForEmployee) => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.quarterTalks.delete.quarter(quarterToDeleteId).then(response => {
            const quartersForEmployeeCopy = [...quartersForEmployee];
            const indexWithGivenId = quartersForEmployeeCopy.findIndex(i => i.id === quarterToDeleteId);
            quartersForEmployeeCopy[indexWithGivenId].isDeleted = true;
            dispatch(deleteQuarterTalk(true, []));
            dispatch(getQuartersForEmployee(quartersForEmployeeCopy, true, []));
            resolve();
        }).catch(error => {
            dispatch(deleteQuarterTalk(false, errorCatcher(error)));
            reject();
        });
    })
  }


  export const reactivateQuarterTalk = (reactiveQuarterStatus, reactiveQuarterErrors) => {
      return { type: REACTIVATE_QUARTER_TALK, reactiveQuarterStatus, reactiveQuarterErrors }
  }

  export const reactivateQuarterTalkACreator = (quarterId, quartersForEmployee) => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.quarterTalks.put.reactivate(quarterId).then(response => {
            const quartersForEmployeeCopy = [...quartersForEmployee];
            const indexOfQuarter = quartersForEmployeeCopy.findIndex(i => i.id === quarterId);
            quartersForEmployeeCopy[indexOfQuarter].isDeleted = false;
            dispatch(reactivateQuarterTalk(true, []));
            dispatch(getQuartersForEmployee(quartersForEmployeeCopy, true, []));
            resolve();
        }).catch(error => {
            dispatch(reactivateQuarterTalk(false, errorCatcher(error)));
            reject();
        });
    })
  }

  export const addQuestion = (addQuestionStatus, addQuestionErrors) => {
    return { type: ADD_QUESTION, addQuestionStatus, addQuestionErrors };
  }

  export const addQuestionACreator = question => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.quarterTalks.post.addQuestion({question}).then(response => {
            dispatch(addQuestion(true, []));
            resolve(response.replyBlock.data.dtoObject.id);
        }).catch(errors => {
            dispatch(addQuestion(false, errorCatcher(errors)));
            reject();
        })
    })
  }

export const deleteQuestionACreator = questionId => dispatch => {
    return new Promise((resolve, reject) => {
        WebApi.quarterTalks.delete.question(questionId).then(response => {
            dispatch(deleteQuestion(true, []));
            resolve();
        }).catch(errors => {
            dispatch(deleteQuestion(false, errorCatcher(errors)));
            reject();
        })
    })
}

  export const deleteQuestion = (status, errors) => {
      return { type: DELETE_QUESTION, status, errors };
  }

  export const populateQuarterTalkACreator = (formItems, quarterId) => dispatch => {
      return new Promise((resolve, reject) => {
        const quarterTalkQuestionItems = formItems.map(item => (
            { quarterTalkQuestionId: item.id, answer: item.value }
        ));
        WebApi.quarterTalks.put.populateQuarter({quarterTalkQuestionItems}, quarterId).then(response => {
            dispatch(addQuarterTalk(true, []));
            resolve();
        }).catch(errors => {
            dispatch(addQuarterTalk(false, errorCatcher(errors)));
            reject();
        })
      })
  }