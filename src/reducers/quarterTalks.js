import {
    ADD_QUARTER_TALK, GET_QUESTIONS, GET_RESERVED_DATES, PLAN_QUARTER
  } from "../constants";
  import { updateObject } from '../services/methods';
  const initialState = {
      addQuarterTalkStatus: null,
      addQuarterTalkErrors: [],

      getQuestionsStatus: null,
      getQuestionsErrors: [],
      questions: [],

      reservedDates: [], getDatesStatus: null, getDatesErrors: [],

      planQuarterStatus: null, planQuarterErrors: []
  };
  
  export const quarterTalks = (state = initialState, action) => {
    switch (action.type) {
        case ADD_QUARTER_TALK:
            return updateObject(state, { addQuarterTalkStatus: action.addQuarterTalkStatus, 
                addQuarterTalkErrors: action.addQuarterTalkErrors })
        case GET_QUESTIONS:
            return updateObject(state, { getQuestionsStatus: action.getQuestionsStatus, getQuestionsErrors: action.getQuestionsErrors,
                questions: action.questions})
        case PLAN_QUARTER:
            return updateObject(state, { planQuarterStatus: action.planQuarterStatus, planQuarterErrors: action.planQuarterErrors })
        case GET_RESERVED_DATES:
            return updateObject(state, { reservedDates: action.reservedDates, getDatesStatus: action.getDatesStatus, getDatesErrors: action.getDatesErrors })
      default:
        return state;
    }
  };