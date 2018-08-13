import { SET_IS_STARTED, SET_PROGRESS_BAR_VALUE, CHANGE_SHOULD_SHOW_GLOBAL } from "../constants";
import { updateObject } from '../services/methods';
const initialState = {
  isStarted: false,
  operationStatus: null,
  percentage: null,
  message: "",
  shouldShowGlobal: false,
  errors: []
};
  
  export const progressBarReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_IS_STARTED:
        return updateObject(state, { isStarted: action.isStarted,
          shouldShowGlobal: action.shouldShowGlobal, errors: action.errors })
      case SET_PROGRESS_BAR_VALUE:
        return updateObject(state, { percentage: action.percentage, 
          message: action.message })
      case CHANGE_SHOULD_SHOW_GLOBAL:
        return updateObject(state, { shouldShowGlobal: action.shouldShowGlobal })
      default:
        return state;
    }
  };
  