import * as types from "../constants";

const initialState = {
  loading: false,
  confirmed: false,
  confirmationInProgress: false,
  toConfirm: {
    key: "",
    string: ""
  },
  isWorking: false,
  resultBlock: {}
};

export const asyncReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ASYNC_STARTED:
      return {
        ...state,
        loading: true
      };
    case types.ASYNC_ENDED:
      return {
        ...state,
        loading: false
      };
    case types.SET_ACTION_CONFIRMATION:
      return {
        ...state,
        ...action,
        confirmed: false
      };
    case types.SET_ACTION_CONFIRMATION_PROGRESS:
      return {
        ...state,
        ...action,
        resultBlock: initialState.resultBlock
      };
    case types.SET_ACTION_CONFIRMATION_RESULT:
      return {
        ...state,
        ...action,
        toConfirm: initialState.toConfirm
      };
    case types.ACTION_CONFIRMED:
      return {
        ...state,
        ...action,
        confirmed: true
      };
    default:
      return state;
  }
};

export default asyncReducer;
