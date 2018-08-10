import { SET_PROGRESS_BAR_DATA } from "../constants";
import { updateObject } from '../services/methods';
const initialState = {
  isOperationStarted: null,
  percentage: null,
  message: ""
};
  
  export const progressBarReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_PROGRESS_BAR_DATA:
        return updateObject(state, { isOperationStarted: action.isOperationStarted,
            percentage: action.percentage, message: action.message })
      default:
        return state;
    }
  };
  