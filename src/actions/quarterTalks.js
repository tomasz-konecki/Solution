import {
 ADD_QUARTER_TALK, GET_QUESTIONS, GET_RESERVED_DATES, PLAN_QUARTER
} from "../constants";
  import WebApi from "../api";
  import { errorCatcher } from "../services/errorsHandler"; 
  import { getEmployeePromise } from './employeesActions.js';
import moment from 'moment';
import _ from 'lodash';

  

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

  export const getReservedDatesACreator = employeeId => dispatch => {
      return new Promise((resolve, reject) => {

        WebApi.quarterTalks.get.reservedDates(employeeId).then(response => {
            const { dtoObjects: cutedResponse } = response.replyBlock.data;
            const datesAndTimes = cutedResponse.map(item => {
                return {date: item.dateTime.slice(0, 10), time: item.dateTime.slice(11,16)}
            });
            const sortedDates = _.orderBy(datesAndTimes, "time", 'asc');
            dispatch(getReservedDates(createPosibleTimeSpaces(sortedDates), true, []));
            resolve(sortedDates);
        }).catch(error => {
            dispatch(getReservedDates([], false, errorCatcher(error)));
            reject();
        })
      })
  }

  export const planQuarter = (planQuarterStatus, planQuarterErrors) => {
      return { type: PLAN_QUARTER, planQuarterStatus, planQuarterErrors}
  }
  export const planQuarterACreator = (employeeId, formItems, time) => dispatch => {
      return new Promise((resolve, reject) => {
        const onlyDate = formItems[0].value.format("YYYY-MM-DD");
        const dateWithTime = onlyDate + time;
        const momentedDateWithTime = moment(dateWithTime, "YYYY-MM-DD HH:mm");

        const model = {
            employeeId, 
            "plannedTalkDate": momentedDateWithTime.format(),
            "year": moment(formItems[0].value).year(),
            "quarter": formItems[1].value
        };
        WebApi.quarterTalks.post.planQuarter(model).then(response => {
            dispatch(planQuarter(true, []));
            resolve();
        }).catch(error => {
            dispatch(planQuarter(false, errorCatcher(error)));
            resolve();
        })
      })
  }

  export const createPosibleTimeSpaces = (listOfTimes) => {
    if(listOfTimes.length === 0){
        return [];
    }
    
    const startTime = { date: listOfTimes[0].date, time: "06:00", isHelpOnly: true};
    const endTime = {date: listOfTimes[0].date, time: "20:00", isHelpOnly: true};
    
    const listOfTimesWithStartAndEndTimes = [startTime, ...listOfTimes, endTime];
    for(let i = 0; i < listOfTimesWithStartAndEndTimes.length-1; i++){
        const startFullDate = listOfTimesWithStartAndEndTimes[i].date + " " + listOfTimesWithStartAndEndTimes[i].time;

        const endFullDate = listOfTimesWithStartAndEndTimes[i+1].date + " " + listOfTimesWithStartAndEndTimes[i+1].time;
        
        const startMomentedDate = listOfTimesWithStartAndEndTimes[i].isHelpOnly ? moment(startFullDate,"DD-MM-YYYY HH:mm") : moment(startFullDate,"DD-MM-YYYY HH:mm").add(1, 'hours');

        const difference = startMomentedDate.diff(moment(endFullDate,"DD-MM-YYYY HH:mm"));
        const hours = Math.abs(moment.duration(difference).hours());
        listOfTimesWithStartAndEndTimes[i].hours = hours;
        
        if(!listOfTimesWithStartAndEndTimes[i].isHelpOnly)
            listOfTimesWithStartAndEndTimes[i].willLastTo = startMomentedDate.subtract(1, 'days').format("HH:mm");
        
    }
    return listOfTimesWithStartAndEndTimes;
  }