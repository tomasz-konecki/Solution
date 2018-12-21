import { SET_IS_STARTED, SET_SIGNAL_R_CONNECTION_RESULT, SET_PROGRESS_BAR_VALUE, CHANGE_SHOULD_SHOW_GLOBAL,
  GENERATE_HUB_CONNECTION } from "../constants";
import { updateObject } from '../services/methods';
const initialState = {
  shouldShowGlobal: false,
  
  isStarted: false,
  operationName: "",
  hubConnection: null,

  connectingSinalRStatus: null,
  connectionSignalRErrors: [],
  
  percentage: null,
  message: ""
};
  
  export const progressBarReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_IS_STARTED:
        return updateObject(state, { isStarted: action.isStarted, operationName: action.operationName })

      case SET_SIGNAL_R_CONNECTION_RESULT:
        return updateObject(state, { connectingSinalRStatus: action.connectingSinalRStatus, 
          connectionSignalRErrors: action.connectionSignalRErrors, hubConnection: action.hubConnection })

      case SET_PROGRESS_BAR_VALUE:
        return updateObject(state, { percentage: action.percentage, 
          message: action.message })
      case CHANGE_SHOULD_SHOW_GLOBAL:
        return updateObject(state, { shouldShowGlobal: action.shouldShowGlobal })
      default:
        return state;
    }
  };
  