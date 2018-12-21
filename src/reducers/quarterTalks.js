import {
    ADD_QUARTER_TALK, GET_QUESTIONS
  } from "../constants";
  import { updateObject } from '../services/methods';
  const initialState = {
      addQuarterTalkStatus: null,
      addQuarterTalkErrors: [],

      getQuestionsStatus: null,
      getQuestionsErrors: [],
      questions: []
  };
  
  export const quarterTalks = (state = initialState, action) => {
    switch (action.type) {
        case ADD_QUARTER_TALK:
            return updateObject(state, { addQuarterTalkStatus: action.addQuarterTalkStatus, 
                addQuarterTalkErrors: action.addQuarterTalkErrors })
        case GET_QUESTIONS:
            return updateObject(state, { getQuestionsStatus: action.getQuestionsStatus, getQuestionsErrors: action.getQuestionsErrors,
                questions: action.questions})
      default:
        return state;
    }
  };
  