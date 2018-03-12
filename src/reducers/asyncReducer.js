import * as types from "../constants";

const initialState = {
  loading: false
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
    default:
      return state;
  }
};

export default asyncReducer;
