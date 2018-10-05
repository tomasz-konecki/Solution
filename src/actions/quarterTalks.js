import {
 ADD_QUARTER_TALK, GET_QUESTIONS, GET_RESERVED_DATES, PLAN_QUARTER, GET_QUARTERS_FOR_EMPLOYEE
} from "../constants";
  import WebApi from "../api";
  import { errorCatcher } from "../services/errorsHandler"; 
  import { getEmployeePromise } from './employeesActions.js';
import moment from 'moment';
import _ from 'lodash';
import { createLastWatchedPersonsArray } from './persistHelpActions';
import { changeOperationStatus } from './asyncActions';
import storeCreator from '../store/index';


const { store } = storeCreator;

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
        const model = {employeeId, year: moment(quarterTalkQuestionItems[10].value).year(), quarter: quarterTalkQuestionItems[11].value, quarterTalkQuestionItems: []}

        quarterTalkQuestionItems.splice(11, 1);
        quarterTalkQuestionItems.splice(10, 1);

        model.quarterTalkQuestionItems = quarterTalkQuestionItems.map(item => {
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

  export const getReservedDatesACreator = (employeeId, token) => dispatch => {
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
                const momentedDate = moment(copiedResponse[key].dateTime).locale("pl");
                const time = momentedDate.format("HH:mm");
                const date = momentedDate.format("YYYY-MM-DD");
                const monthName = momentedDate.format("MMMM");
                const dayName = momentedDate.format("dddd");
                const willLastTo = momentedDate.add(cutedResponse[key].length, "minute").format("HH:mm");
                extractedData.push({time, date, monthName, dayName, willLastTo, length: cutedResponse[key].length, dateAndTime: date + " " + time});

            }
            dispatch(getReservedDates(extractedData, true, []));
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
            "plannedTalkDate": formItems[0].value.format("YYYY-MM-DD HH:mm"),
            "year": formItems[0].value.format("YYYY"),
            "quarter": formItems[1].value,
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

  const selectLastWatchedPersonsArray = state => state.persistHelpReducer.lastWatchedPersons;

  export const getQuartersForEmployeeACreator = employeeId => dispatch => {
      return new Promise((resolve, reject) => {
        const currentLastWatchedPersonsArray = selectLastWatchedPersonsArray(store.getState());
        const copiedLastWatchedPersonsArray = [...currentLastWatchedPersonsArray];
        const personInWatchedPersonsArrayIndex = copiedLastWatchedPersonsArray.indexOf(employeeId);
        
        WebApi.quarterTalks.get.getQuarterForEmployee(employeeId).then(response => {
            const { dtoObjects: items } = response.replyBlock.data;
            
            items.forEach(function(part, index){
                if(part.plannedTalkDate)
                items[index].plannedTalkDate = part.plannedTalkDate.slice(0, 10);
            })
            dispatch(getQuartersForEmployee(items, true, []));
            if(personInWatchedPersonsArrayIndex === -1){
                copiedLastWatchedPersonsArray.push(employeeId);
                dispatch(createLastWatchedPersonsArray(copiedLastWatchedPersonsArray));
            }
            resolve();
        }).catch(error => {
            dispatch(getQuartersForEmployee(null, false, errorCatcher(error)));

            if(personInWatchedPersonsArrayIndex !== -1){
                copiedLastWatchedPersonsArray.splice(personInWatchedPersonsArrayIndex, 1);
            }
            
            dispatch(createLastWatchedPersonsArray(copiedLastWatchedPersonsArray))
            reject();
        })
      })
  }