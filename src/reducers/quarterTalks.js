import { ADD_QUESTION, DELETE_QUESTION,
    ADD_QUARTER_TALK, GET_QUESTIONS, GET_RESERVED_DATES, PLAN_QUARTER, GET_QUARTERS_FOR_EMPLOYEE, DELETE_QUARTER_TALK, REACTIVATE_QUARTER_TALK
  } from "../constants";
  import { updateObject } from '../services/methods';
  const initialState = {
      addQuarterTalkStatus: null,
      addQuarterTalkErrors: [],

      getQuestionsStatus: null,
      getQuestionsErrors: [],
      questions: [],

      reservedDates: [], getDatesStatus: null, getDatesErrors: [],

      planQuarterStatus: null, planQuarterErrors: [],

      quartersForEmployee: [], quartersForEmployeeStatus: null, quartersForEmployeeErrors: [],

      deleteQuarterStatus: null, deleteQuarterErrors: [],

      reactiveQuarterStatus: null, reactiveQuarterErrors: [],

      addQuestionStatus: null, addQuestionErrors: [],

      deleteQuestionStatus: null, deleteQuestionErrors: []
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
        case GET_QUARTERS_FOR_EMPLOYEE:
            return updateObject(state, { quartersForEmployee: action.quartersForEmployee, 
                quartersForEmployeeStatus: action.quartersForEmployeeStatus, quartersForEmployeeErrors: action.quartersForEmployeeErrors })
        case DELETE_QUARTER_TALK:
            return updateObject(state, { deleteQuarterStatus: action.deleteQuarterStatus, deleteQuarterErrors: action.deleteQuarterErrors })
        case REACTIVATE_QUARTER_TALK:
            return updateObject(state, { reactiveQuarterStatus: action.reactiveQuarterStatus, reactiveQuarterErrors: action.reactiveQuarterErrors })
        case ADD_QUESTION:
            return updateObject(state, { addQuestionStatus: action.addQuestionStatus, addQuestionErrors: action.addQuarterTalkErrors })
        case DELETE_QUESTION:
            return updateObject(state, { deleteQuestionStatus: action.status, 
                deleteQuestionErrors: action.errors});
            default:
        return state;
    }
  };